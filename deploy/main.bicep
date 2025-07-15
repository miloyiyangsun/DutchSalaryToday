// =================================================================
// Azure Bicep 部署脚本：DutchSalaryToday - App Service 版
// 描述: 用于部署 DutchSalaryToday 应用的基础设施，包括后端 Web App、前端 Web App 和 PostgreSQL 数据库。
// 更新时间: 07.15, 19:00
// =================================================================

// --- 1. 参数定义 ---
@description('资源部署地理位置')
param location string = resourceGroup().location

@description('前端 Web App 名称')
param frontendAppName string = 'frontend-webapp'

@description('后端 Web App 名称')
param backendAppName string = 'backend-webapp'

@description('App Service 计划名称')
param appServicePlanName string = 'asp-dutch-salary'

@description('ACR 注册表名称')
param acrName string = 'acrdutchsalary${uniqueString(resourceGroup().id)}'

@description('Docker 镜像标签')
param imageTag string = 'latest'

@description('PostgreSQL 登录名')
@secure()
param postgresAdminLogin string

@description('PostgreSQL 密码')
@secure()
param postgresAdminPassword string

// --- 2. Azure 容器注册表 ---
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

// --- 3. Azure PostgreSQL 数据库 ---
resource postgresServer 'Microsoft.DBforPostgreSQL/flexibleServers@2023-03-01-preview' = {
  name: 'psql-dutch-salary'
  location: 'northeurope'
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
    network: {
      delegatedSubnetResourceId: null
      privateDnsZoneArmResourceId: null
    }
  }
}

resource postgresDatabase 'Microsoft.DBforPostgreSQL/flexibleServers/databases@2023-03-01-preview' = {
  parent: postgresServer
  name: 'salary_data'
}

// --- 4. App Service 计划（免费层） ---
resource appServicePlan 'Microsoft.Web/serverfarms@2023-01-01' = {
  name: appServicePlanName
  location: location
  sku: {
    name: 'F1'
    tier: 'Free'
  }
  kind: 'linux'
  properties: {
    reserved: true
  }
}

// --- 5. 后端 Web App ---
resource backendWebApp 'Microsoft.Web/sites@2023-01-01' = {
  name: backendAppName
  location: location
  kind: 'app,linux,container'
  properties: {
    serverFarmId: appServicePlan.id
    siteConfig: {
      linuxFxVersion: 'DOCKER|${acr.properties.loginServer}/${backendAppName}:${imageTag}'
      appSettings: [
        { name: 'WEBSITES_PORT', value: '8080' }
        { name: 'DB_URL', value: 'jdbc:postgresql://${postgresServer.properties.fullyQualifiedDomainName}:5432/${postgresDatabase.name}?sslmode=require' }
        { name: 'DB_USER', value: postgresAdminLogin }
        { name: 'DB_PASSWORD', value: postgresAdminPassword }
      ]
    }
  }
}

// --- 6. 前端 Web App ---
resource frontendWebApp 'Microsoft.Web/sites@2023-01-01' = {
  name: frontendAppName
  location: location
  kind: 'app,linux,container'
  properties: {
    serverFarmId: appServicePlan.id
    siteConfig: {
      linuxFxVersion: 'DOCKER|${acr.properties.loginServer}/${frontendAppName}:${imageTag}'
      appSettings: [
        { name: 'WEBSITES_PORT', value: '80' }
        { name: 'VITE_API_BASE_URL', value: 'https://${backendWebApp.name}.azurewebsites.net' }
      ]
    }
  }
}

// --- 7. 输出 ---
output frontendUrl string = 'https://${frontendWebApp.name}.azurewebsites.net'
output backendUrl string = 'https://${backendWebApp.name}.azurewebsites.net'
