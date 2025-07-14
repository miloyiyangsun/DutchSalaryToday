// --- 1. 参数定义 ---
@description('The location for all resources.')
param location string = resourceGroup().location

@description('A unique name for the Container Apps Environment.')
param containerAppsEnvName string = 'cae-dutch-salary'

@description('The name of the frontend container app.')
param frontendAppName string = 'frontend-app'

@description('The name of the backend container app.')
param backendAppName string = 'backend-app'

@description('The name of the Azure Container Registry.')
param acrName string = 'acrdutchsalary${uniqueString(resourceGroup().id)}'

@description('The PostgreSQL server admin login.')
@secure()
param postgresAdminLogin string

@description('The PostgreSQL server admin password.')
@secure()
param postgresAdminPassword string

// --- 2. 核心资源定义 ---

// 2.1. Azure Container Registry
resource acr 'Microsoft.ContainerRegistry/registries@2023-07-01' = {
  name: acrName
  location: location
  sku: { name: 'Basic' }
  properties: { adminUserEnabled: true }
}

// 2.2. Azure Database for PostgreSQL – Flexible Server
resource postgresServer 'Microsoft.DBforPostgreSQL/flexibleServers@2023-03-01-preview' = {
  name: 'psql-dutch-salary'
  location: location
  sku: { name: 'Standard_B1ms', tier: 'Burstable' }
  properties: {
    administratorLogin: postgresAdminLogin
    administratorLoginPassword: postgresAdminPassword
    version: '15'
    storage: { storageSizeGB: 32 }
    backup: { backupRetentionDays: 7, geoRedundantBackup: 'Disabled' }
    network: { delegatedSubnetResourceId: null, privateDnsZoneArmResourceId: null }
  }
}

resource postgresDatabase 'Microsoft.DBforPostgreSQL/flexibleServers/databases@2023-03-01-preview' = {
  parent: postgresServer
  name: 'salary_data'
}

// 2.3. Container Apps Environment
resource containerAppsEnv 'Microsoft.App/managedEnvironments@2024-03-01' = {
  name: containerAppsEnvName
  location: location
  properties: {}
}

// --- 3. 容器应用定义 ---

// 3.1. 后端
resource backendApp 'Microsoft.App/containerApps@2024-03-01' = {
  name: backendAppName
  location: location
  properties: {
    managedEnvironmentId: containerAppsEnv.id
    template: {
      containers: [
        {
          name: 'salary-backend'
          image: '${acr.properties.loginServer}/${backendAppName}:latest'
          resources: { cpu: 0.5, memory: '0.5Gi' }
          env: [
            { name: 'DB_URL', value: 'jdbc:postgresql://${postgresServer.name}.postgres.database.azure.com:5432/${postgresDatabase.name}?sslmode=require' },
            { name: 'DB_USER', value: postgresAdminLogin }
            { name: 'DB_PASSWORD', secretRef: 'postgres-password' }
          ]
        }
      ]
      scale: { minReplicas: 0, maxReplicas: 1 }
    }
    configuration: {
      ingress: { internal: true, targetPort: 8080 }
      secrets: [
        { name: 'postgres-password', value: postgresAdminPassword }
      ]
    }
  }
}

// 3.2. 前端
resource frontendApp 'Microsoft.App/containerApps@2024-03-01' = {
  name: frontendAppName
  location: location
  properties: {
    managedEnvironmentId: containerAppsEnv.id
    template: {
      containers: [
        {
          name: 'salary-frontend'
          image: '${acr.properties.loginServer}/${frontendAppName}:latest'
          resources: { cpu: 0.5, memory: '0.5Gi' }
          env: [
            { name: 'VITE_API_BASE_URL', value: 'http://${backendApp.name}.${containerAppsEnv.name}.${location}.azurecontainerapps.io' }
          ]
        }
      ]
      scale: { minReplicas: 1, maxReplicas: 2 }
    }
    configuration: {
      ingress: { external: true, targetPort: 80 }
    }
  }
}

// --- 4. 输出 ---
output frontendUrl string = frontendApp.properties.configuration.ingress.fqdn
