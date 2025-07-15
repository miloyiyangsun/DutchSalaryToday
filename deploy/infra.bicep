// =================================================================
// Azure Bicep 部署脚本：DutchSalaryToday - 基础设施部署
// 描述: 用于部署 DutchSalaryToday 应用的基础设施，包括 Azure Container Registry (ACR), PostgreSQL 数据库和 App Service Plan。
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
  location: 'northeurope' // PostgreSQL 通常建议指定一个区域以优化性能和合规性
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

// --- 为PostgreSQL服务器添加防火墙规则，允许Azure服务访问 ---
resource postgresFirewallRule 'Microsoft.DBforPostgreSQL/flexibleServers/firewallRules@2023-03-01-preview' = {
  parent: postgresServer
  name: 'AllowAzureServices'
  properties: {
    startIpAddress: '0.0.0.0'
    endIpAddress: '0.0.0.0'
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

// --- 5. 后端 Web App - 添加系统分配的托管身份 ---
resource backendWebApp 'Microsoft.Web/sites@2023-01-01' = {
  name: backendAppName
  location: location
  kind: 'app,linux,container'
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    serverFarmId: appServicePlan.id
    // siteConfig 相关配置（如镜像和应用设置）将在 app-update.bicep 中处理
  }
}

// --- 6. 前端 Web App - 添加系统分配的托管身份 ---
resource frontendWebApp 'Microsoft.Web/sites@2023-01-01' = {
  name: frontendAppName
  location: location
  kind: 'app,linux,container'
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    serverFarmId: appServicePlan.id
    // siteConfig 相关配置（如镜像和应用设置）将在 app-update.bicep 中处理
  }
}

// --- 7. 为后端Web App的托管身份分配AcrPull角色 ---
resource backendAcrPullRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(acr.id, backendWebApp.id, 'AcrPull')
  scope: acr
  properties: {
    principalId: backendWebApp.identity.principalId
    principalType: 'ServicePrincipal'
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '7f951dda-4ed3-4680-a7ca-43fe172d538d') // AcrPull角色ID
  }
}

// --- 8. 为前端Web App的托管身份分配AcrPull角色 ---
resource frontendAcrPullRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(acr.id, frontendWebApp.id, 'AcrPull')
  scope: acr
  properties: {
    principalId: frontendWebApp.identity.principalId
    principalType: 'ServicePrincipal'
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '7f951dda-4ed3-4680-a7ca-43fe172d538d') // AcrPull角色ID
  }
}

// --- 9. 输出，供 app-update.bicep 和 CI/CD 使用 ---
output acrLoginServer string = acr.properties.loginServer
output backendWebAppName string = backendWebApp.name
output frontendWebAppName string = frontendWebApp.name
output backendWebAppUrl string = 'https://${backendWebApp.name}.azurewebsites.net' // 前端需要用到的后端 URL
output frontendUrl string = 'https://${frontendWebApp.name}.azurewebsites.net' // 最终前端 URL
output postgresFullyQualifiedDomainName string = postgresServer.properties.fullyQualifiedDomainName
output postgresDatabaseName string = postgresDatabase.name 