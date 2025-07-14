// deploy/main.bicep
// 完整无错的 Azure Container Apps & PostgreSQL Bicep 模板

// --- 1. 参数区 ---
@description('The location for all resources.')
param location string = resourceGroup().location

@description('Container Apps 环境名称，唯一即可。')
param containerAppsEnvName string = 'cae-dutch-salary'

@description('前端 Container App 名称。')
param frontendAppName string = 'frontend-app'

@description('后端 Container App 名称。')
param backendAppName string = 'backend-app'

@description('ACR 名称，必须全小写。')
param acrName string = toLower('acrdutchsalary${uniqueString(resourceGroup().id)}')

@description('PostgreSQL 管理员用户名。')
@secure()
param postgresAdminLogin string

@description('PostgreSQL 管理员密码。')
@secure()
param postgresAdminPassword string

// --- 2. 资源区 ---

// 2.1 Azure Container Registry
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

// 获取 ACR Admin 凭据
var acrCreds = listCredentials(acr.id, '2023-07-01')

// 2.2 PostgreSQL 灵活服务器
resource postgresServer 'Microsoft.DBforPostgreSQL/flexibleServers@2023-03-01-preview' = {
  name: 'psql-dutch-salary'
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
      geoRedundantBackup: 'Disabled'
    }
    // 删除 network 配置，使用默认公有端点
  }
}

// 在服务器上创建数据库
resource postgresDatabase 'Microsoft.DBforPostgreSQL/flexibleServers/databases@2023-03-01-preview' = {
  parent: postgresServer
  name: 'salary_data'
}

// 2.3 Container Apps 环境
resource containerAppsEnv 'Microsoft.App/managedEnvironments@2024-03-01' = {
  name: containerAppsEnvName
  location: location
  properties: {}
}

// --- 3. 后端 Container App ---
resource backendApp 'Microsoft.App/containerApps@2024-03-01' = {
  name: backendAppName
  location: location
  properties: {
    managedEnvironmentId: containerAppsEnv.id

    // 把凭据和机密放在 configuration 下
    configuration: {
      ingress: {
        internal: true
        targetPort: 8080
      }
      registries: [
        {
          server: acr.properties.loginServer
          username: acrCreds.username
          passwordSecretRef: 'acr-password'
        }
      ]
      secrets: [
        {
          name: 'postgres-password'
          value: postgresAdminPassword
        }
        {
          name: 'acr-password'
          value: acrCreds.passwords[0].value
        }
      ]
    }

    template: {
      containers: [
        {
          name: 'salary-backend'
          image: '${acr.properties.loginServer}/${backendAppName}:latest'
          resources: {
            cpu: 0.25
            memory: '0.5Gi'
          }
          env: [
            {
              name: 'DB_URL'
              value: 'jdbc:postgresql://${postgresServer.name}.postgres.database.azure.com:5432/${postgresDatabase.name}?sslmode=require'
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
        maxReplicas: 1
      }
    }
  }
}

// --- 4. 前端 Container App ---
resource frontendApp 'Microsoft.App/containerApps@2024-03-01' = {
  name: frontendAppName
  location: location
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
          username: acrCreds.username
          passwordSecretRef: 'acr-password'
        }
      ]
      secrets: [
        {
          name: 'acr-password'
          value: acrCreds.passwords[0].value
        }
      ]
    }

    template: {
      containers: [
        {
          name: 'salary-frontend'
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
        maxReplicas: 2
      }
    }
  }
}

// --- 5. 输出 ---
output frontendUrl string = frontendApp.properties.configuration.ingress.fqdn
