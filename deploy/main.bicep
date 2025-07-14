// =================================================================
// Azure Bicep 部署脚本 (Azure Bicep Deployment Script)
// 描述: 用于部署 DutchSalaryToday 应用的全套基础设施，包括前后端容器应用和 PostgreSQL 数据库。
// (Description: Deploys the full infrastructure for the DutchSalaryToday application, including frontend/backend container apps and a PostgreSQL database.)
// 更新时间 (Last Updated): 07.15, 00:30
// =================================================================

// --- 1. 参数定义 (Parameter Definitions) ---

@description('所有资源部署的地理位置 (The geographical location for all resources.)')
param location string = resourceGroup().location

@description('容器应用环境的唯一名称 (A unique name for the Container Apps Environment.)')
param containerAppsEnvName string = 'cae-dutch-salary'

@description('前端容器应用的名称 (The name of the frontend container app.)')
param frontendAppName string = 'frontend-app'

@description('后端容器应用的名称 (The name of the backend container app.)')
param backendAppName string = 'backend-app'

@description('Azure 容器镜像仓库的名称 (The name of the Azure Container Registry.)')
param acrName string = 'acrdutchsalary${uniqueString(resourceGroup().id)}'

@description('用于容器镜像的标签，建议使用 Git commit hash 以实现不可变性 (The tag for the container images. Using a Git commit hash is recommended for immutability.)')
param imageTag string = 'latest'

@description('PostgreSQL 数据库的管理员登录名 (The PostgreSQL server admin login.)')
@secure()
param postgresAdminLogin string

@description('PostgreSQL 数据库的管理员密码 (The PostgreSQL server admin password.)')
@secure()
param postgresAdminPassword string

// --- 2. 核心资源定义 (Core Resource Definitions) ---

// 2.1. Azure 容器镜像仓库 (Azure Container Registry - ACR)
// 用于存储和管理应用的 Docker 镜像 (Used to store and manage Docker images for the application.)
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

// 2.2. Azure PostgreSQL 弹性服务器 (Azure Database for PostgreSQL - Flexible Server)
// 为后端应用提供数据存储服务 (Provides data storage services for the backend application.)
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
    // 注意: 在生产环境中，建议配置虚拟网络集成以增强安全性。
    // (Note: In a production environment, configuring VNet integration is recommended for enhanced security.)
    network: {
      delegatedSubnetResourceId: null
      privateDnsZoneArmResourceId: null
    }
  }
}

// 2.2.1. 在 PostgreSQL 服务器上创建数据库 (Create a database on the PostgreSQL server)
resource postgresDatabase 'Microsoft.DBforPostgreSQL/flexibleServers/databases@2023-03-01-preview' = {
  parent: postgresServer
  name: 'salary_data'
}

// 2.3. 容器应用环境 (Container Apps Environment)
// 为容器应用提供一个安全的、无服务器的运行环境。
// (Provides a secure and serverless execution environment for the container apps.)
resource containerAppsEnv 'Microsoft.App/managedEnvironments@2024-03-01' = {
  name: containerAppsEnvName
  location: location
  properties: {}
}

// --- 3. 容器应用定义 (Container App Definitions) ---

// 3.1. 后端应用 (Backend Application)
resource backendApp 'Microsoft.App/containerApps@2024-03-01' = {
  name: backendAppName
  location: location
  properties: {
    managedEnvironmentId: containerAppsEnv.id
    template: {
      containers: [
        {
          name: 'salary-backend'
          image: '${acr.properties.loginServer}/${backendAppName}:${imageTag}' // [改进] 使用 imageTag 参数 ([IMPROVEMENT] Using imageTag parameter)
          resources: {
            cpu: json('0.5') // [修正] 将数值转换为 JSON 数字 ([FIX] Convert numeric value to JSON number)
            memory: '0.5Gi'
          }
          env: [
            // [改进] 动态获取 FQDN，更健壮 ([IMPROVEMENT] Dynamically get FQDN, more robust)
            {
              name: 'DB_URL'
              value: 'jdbc:postgresql://${postgresServer.properties.fullyQualifiedDomainName}:5432/${postgresDatabase.name}?sslmode=require'
            }
            // [改进] 将用户名和密码都作为机密引用，增强安全性 ([IMPROVEMENT] Reference both user and password as secrets for better security)
            {
              name: 'DB_USER'
              secretRef: 'postgres-user'
            }
            {
              name: 'DB_PASSWORD'
              secretRef: 'postgres-password'
            }
          ]
        }
      ]
      scale: {
        minReplicas: 0 // 开发环境中可以设置为0，节省成本 (Can be set to 0 in dev to save costs)
        maxReplicas: 1
      }
    }
    configuration: {
      // 设置为内部访问，只允许环境内的其他应用访问 (Set to internal ingress, only accessible by other apps within the environment)
      ingress: {
        external: false
        targetPort: 8080
      }
      // 定义应用可以使用的机密信息 (Define secrets available to the application)
      secrets: [
        {
          name: 'postgres-password'
          value: postgresAdminPassword
        }
        {
          name: 'postgres-user' // [改进] 新增用户名的机密 ([IMPROVEMENT] Added secret for username)
          value: postgresAdminLogin
        }
      ]
    }
  }
}

// 3.2. 前端应用 (Frontend Application)
resource frontendApp 'Microsoft.App/containerApps@2024-03-01' = {
  name: frontendAppName
  location: location
  properties: {
    managedEnvironmentId: containerAppsEnv.id
    template: {
      containers: [
        {
          name: 'salary-frontend'
          image: '${acr.properties.loginServer}/${frontendAppName}:${imageTag}' // [改进] 使用 imageTag 参数 ([IMPROVEMENT] Using imageTag parameter)
          resources: {
            cpu: json('0.5') // [修正] 将数值转换为 JSON 数字 ([FIX] Convert numeric value to JSON number)
            memory: '0.5Gi'
          }
          env: [
            // [改进] 直接引用后端应用的 FQDN，更可靠 ([IMPROVEMENT] Directly reference backend FQDN, more reliable)
            {
              name: 'VITE_API_BASE_URL'
              value: 'https://${backendApp.properties.configuration.ingress.fqdn}'
            }
          ]
        }
      ]
      scale: {
        minReplicas: 1
        maxReplicas: 2
      }
    }
    configuration: {
      // 设置为外部访问，允许公网访问 (Set to external ingress to allow public access)
      ingress: {
        external: true
        targetPort: 80
      }
    }
  }
}

// --- 4. 输出 (Outputs) ---

@description('前端应用的公开访问 URL (The public URL for the frontend application.)')
output frontendUrl string = frontendApp.properties.configuration.ingress.fqdn
