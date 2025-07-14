// deploy/main.bicep
// Zero-error, production-ready IaC for DutchSalaryToday on ACA
// Author: <your-name>
// Last updated: 2025-06-14

// ========= 1. 参数（所有可变内容提参，方便多环境复用） =========
@description('Azure region for all resources.')
param location string = resourceGroup().location

@description('Unique postfix for naming collision avoidance.')
param postfix string = uniqueString(resourceGroup().id)

@description('Container Apps Environment name.')
param containerAppsEnvName string = 'cae-dutch-salary'

@description('Frontend container app name.')
param frontendAppName string = 'frontend-app'

@description('Backend container app name.')
param backendAppName string = 'backend-app'

@description('PostgreSQL server name.')
param postgresServerName string = 'psql-dutch-salary'

@description('PostgreSQL database name.')
param postgresDatabaseName string = 'salary_data'

@description('PostgreSQL admin login (>=3 chars, no upper case).')
@minLength(3)
@secure()
param postgresAdminLogin string

@description('PostgreSQL admin password (>=12 chars, complexity).')
@minLength(12)
@secure()
param postgresAdminPassword string

@description('Log Analytics workspace name.')
param logAnalyticsName string = 'law-${postfix}'

// ========= 2. 依赖资源（先建日志工作区，再建托管环境） =========
// 2.1 Log Analytics workspace（托管环境强制依赖）
resource logAnalytics 'Microsoft.OperationalInsights/workspaces@2023-09-01' = {
  name: logAnalyticsName
  location: location
  properties: {
    retentionInDays: 30
  }
  sku: {
    name: 'PerGB2018'
  }
}

// 2.2 Container Apps 托管环境
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

// 2.3 Azure Container Registry（Basic 层已含 10 GB 免费额度）
resource acr 'Microsoft.ContainerRegistry/registries@2023-07-01' = {
  name: 'acr${postfix}'
  location: location
  sku: {
    name: 'Basic'
  }
  properties: {
    adminUserEnabled: true
  }
}

// 2.4 PostgreSQL 灵活服务器（B1ms 免费层 32 GB）
resource postgresServer 'Microsoft.DBforPostgreSQL/flexibleServers@2023-12-01-preview' = {
  name: postgresServerName
  location: location
  sku: {
    name: 'Standard_B1ms'
    tier: 'Burstable'
  }
  properties: {
    version: '15'
    administratorLogin: postgresAdminLogin
    administratorLoginPassword: postgresAdminPassword
    storage: {
      storageSizeGB: 32
    }
    backup: {
      backupRetentionDays: 7
      geoRedundantBackup: 'Disabled'
    }
    network: {
      publicNetworkAccess: 'Enabled'   // 便于外部调试；生产可改为 VNet 集成
    }
  }
}

// 2.5 业务数据库
resource postgresDatabase 'Microsoft.DBforPostgreSQL/flexibleServers/databases@2023-12-01-preview' = {
  parent: postgresServer
  name: postgresDatabaseName
}

// ========= 3. 后端容器应用（内部 ingress，仅供前端调用） =========
resource backendApp 'Microsoft.App/containerApps@2024-03-01' = {
  name: backendAppName
  location: location
  identity: { type: 'SystemAssigned' }   // OIDC 拉镜像用
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
          identity: backendApp.identity.principalId   // 使用系统托管身份访问 ACR
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
            { name: 'DB_URL', value: 'jdbc:postgresql://${postgresServer.properties.fullyQualifiedDomainName}:5432/${postgresDatabase.name}?sslmode=require' }
            { name: 'DB_USER', value: postgresAdminLogin }
            { name: 'DB_PASSWORD', secretRef: 'postgres-password' }
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

// ========= 4. 前端容器应用（对外暴露） =========
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
            { name: 'VITE_API_BASE_URL', value: 'http://${backendApp.name}.${containerAppsEnv.name}.${location}.azurecontainerapps.io' }
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

// ========= 5. 输出 =========
output frontendUrl string = 'https://${frontendApp.properties.configuration.ingress.fqdn}'
output backendUrl  string = 'http://${backendApp.name}.${containerAppsEnv.name}.${location}.azurecontainerapps.io'