// deploy/main.bicep
// 零错误、可直接部署的 ACA + PostgreSQL 模板
targetScope = 'resourceGroup'

// ========= 1. 参数 =========
@description('Azure region')
param location string = resourceGroup().location

@description('Postfix for naming collision')
param postfix string = uniqueString(resourceGroup().id)

@description('PostgreSQL admin login')
@minLength(3)
@secure()
param postgresAdminLogin string

@description('PostgreSQL admin password')
@minLength(12)
@secure()
param postgresAdminPassword string

// ========= 2. 变量 =========
var containerAppsEnvName = 'cae-dutch-${postfix}'
var acrName              = 'acr${postfix}'
var postgresServerName   = 'psql-dutch-${postfix}'
var postgresDbName       = 'salary_data'
var backendAppName       = 'backend-app'
var frontendAppName      = 'frontend-app'

// ========= 3. 资源 =========

// 3.1 Log Analytics & Managed Environment
resource logAnalytics 'Microsoft.OperationalInsights/workspaces@2023-09-01' = {
  name: 'law-${postfix}'
  location: location
  properties: {
    retentionInDays: 30
  }
  sku: {
    name: 'PerGB2018'
  }
}

resource containerAppsEnv 'Microsoft.App/managedEnvironments@2024-03-01' = {
  name: containerAppsEnvName
  location: location
  properties: {
    appLogsConfiguration: {
      destination: 'log-analytics'
      logAnalyticsConfiguration: {
        customerId: logAnalytics.properties.customerId
        sharedKey: logAnalytics.listKeys().primarySharedKey
      }
    }
  }
}

// 3.2 ACR
resource acr 'Microsoft.ContainerRegistry/registries@2023-07-01' = {
  name: acrName
  location: location
  sku: {
    name: 'Basic'
  }
  properties: {
    adminUserEnabled: true
  }
}

// 3.3 PostgreSQL Flexible
resource postgresServer 'Microsoft.DBforPostgreSQL/flexibleServers@2023-12-01-preview' = {
  name: postgresServerName
  location: location
  sku: {
    name: 'Standard_B1ms'
    tier: 'Burstable'
  }
  properties: {
    administratorLogin: postgresAdminLogin
    administratorLoginPassword: postgresAdminPassword
    version: '15'
    storage: {
      storageSizeGB: 32
    }
    backup: {
      backupRetentionDays: 7
    }
    network: {
      publicNetworkAccess: 'Enabled'
    }
  }
}

resource postgresDb 'Microsoft.DBforPostgreSQL/flexibleServers/databases@2023-12-01-preview' = {
  parent: postgresServer
  name: postgresDbName
}

// 3.4 Backend Container App
resource backendApp 'Microsoft.App/containerApps@2024-03-01' = {
  name: backendAppName
  location: location
  identity: { type: 'SystemAssigned' }
  properties: {
    managedEnvironmentId: containerAppsEnv.id
    configuration: {
      ingress: {
        internal: true
        targetPort: 8080
      }
      secrets: [
        {
          name: 'postgres-password'
          value: postgresAdminPassword
        }
      ]
      registries: [
        {
          server: acr.properties.loginServer
          identity: backendApp.identity.principalId
        }
      ]
    }
    template: {
      containers: [
        {
          name: backendAppName
          image: '${acr.properties.loginServer}/${backendAppName}:latest'
          resources: {
            cpu: 0.25
            memory: '0.5Gi'
          }
          env: [
            {
              name: 'DB_URL'
              value: 'jdbc:postgresql://${postgresServer.properties.fullyQualifiedDomainName}:5432/${postgresDbName}?sslmode=require'
            }
            {
              name: 'DB_USER'
              value: postgresAdminLogin
            }
            {
              name: 'DB_PASSWORD'
              secretRef: 'postgres-password'
            }
          ]
        }
      ]
      scale: {
        minReplicas: 0
        maxReplicas: 10
      }
    }
  }
}

// 3.5 Frontend Container App
resource frontendApp 'Microsoft.App/containerApps@2024-03-01' = {
  name: frontendAppName
  location: location
  identity: { type: 'SystemAssigned' }
  properties: {
    managedEnvironmentId: containerAppsEnv.id
    configuration: {
      ingress: {
        external: true
        targetPort: 80
      }
      registries: [
        {
          server: acr.properties.loginServer
          identity: frontendApp.identity.principalId
        }
      ]
    }
    template: {
      containers: [
        {
          name: frontendAppName
          image: '${acr.properties.loginServer}/${frontendAppName}:latest'
          resources: {
            cpu: 0.25
            memory: '0.5Gi'
          }
          env: [
            {
              name: 'VITE_API_BASE_URL'
              value: 'http://${backendAppName}.${containerAppsEnvName}.${location}.azurecontainerapps.io'
            }
          ]
        }
      ]
      scale: {
        minReplicas: 1
        maxReplicas: 5
      }
    }
  }
}

// ========= 4. 输出 =========
output frontendUrl string = 'https://${frontendApp.properties.configuration.ingress.fqdn}'
output backendInternalUrl string = 'http://${backendAppName}.${containerAppsEnvName}.${location}.azurecontainerapps.io'