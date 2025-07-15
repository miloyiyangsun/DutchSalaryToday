// =================================================================
// Azure Bicep 部署脚本：DutchSalaryToday - 应用更新
// 描述: 用于更新 DutchSalaryToday 应用（前端和后端）的 Docker 镜像和应用设置。
// =================================================================

// --- 1. 参数定义 ---
@description('资源部署地理位置')
param location string = resourceGroup().location

@description('前端 Web App 名称')
param frontendAppName string = 'frontend-webapp'

@description('后端 Web App 名称')
param backendAppName string = 'backend-webapp'

@description('Docker 镜像标签')
param imageTag string = 'latest'

@description('ACR 登录服务器，从 infra.bicep 输出')
param acrLoginServer string

@description('PostgreSQL 登录名')
@secure()
param postgresAdminLogin string

@description('PostgreSQL 密码')
@secure()
param postgresAdminPassword string

@description('PostgreSQL 完全限定域名，从 infra.bicep 输出')
param postgresFullyQualifiedDomainName string

@description('PostgreSQL 数据库名，从 infra.bicep 输出')
param postgresDatabaseName string

// --- 2. 引用现有资源 ---
// 这里使用 'existing' 关键字引用在 infra.bicep 中创建的 Web App 资源
resource backendWebApp 'Microsoft.Web/sites@2023-01-01' existing = {
  name: backendAppName
}

resource frontendWebApp 'Microsoft.Web/sites@2023-01-01' existing = {
  name: frontendAppName
}

// --- 3. 更新后端 Web App 的配置 ---
resource backendWebAppConfig 'Microsoft.Web/sites/config@2023-01-01' = {
  name: 'web'
  parent: backendWebApp
  location:location
  properties: {
    linuxFxVersion: 'DOCKER|${acrLoginServer}/${backendAppName}:${imageTag}'
    appSettings: [
      { name: 'WEBSITES_PORT', value: '8080' }
      { name: 'DB_URL', value: 'jdbc:postgresql://${postgresFullyQualifiedDomainName}:5432/${postgresDatabaseName}?sslmode=require' }
      { name: 'DB_USER', value: postgresAdminLogin }
      { name: 'DB_PASSWORD', value: postgresAdminPassword }
    ]
  }
}

// --- 4. 更新前端 Web App 的配置 ---
resource frontendWebAppConfig 'Microsoft.Web/sites/config@2023-01-01' = {
  name: 'web'
  parent: frontendWebApp
  location:location
  properties: {
    linuxFxVersion: 'DOCKER|${acrLoginServer}/${frontendAppName}:${imageTag}'
    appSettings: [
      { name: 'WEBSITES_PORT', value: '80' }
      { name: 'VITE_API_BASE_URL', value: 'https://${backendWebApp.name}.azurewebsites.net' } // 使用后端 Web App 的名称构建 URL
    ]
  }
}

// --- 5. 输出 ---
output frontendUrl string = 'https://${frontendWebApp.name}.azurewebsites.net'
output backendUrl string = 'https://${backendWebApp.name}.azurewebsites.net' 