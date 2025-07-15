# Sprint 0: Azure 云与 GitHub Actions OIDC 配置权威指南 (2025 版)

## 状态：已完成 (Status: Completed)

**所有在此计划中描述的核心技术目标均已在 Sprint 0 成功实现并验证。**

---

## 核心理念：安全、自动化、可复现

您好！根据您的要求，我重新审视了我们的云配置计划，并结合 2025 年业界最主流、最安全的实践，为您编写了这份全新的、极其详尽的操作指南。我们将不再仅仅是“配置”，而是要理解每一步背后的“为什么”，并构建一个从第一天起就安全、可靠且完全自动化的云环境。

**我们将遵循以下核心原则：**

1.  **无密码部署 (Passwordless Deployment):** 我们将采用 **OpenID Connect (OIDC)**，这是 GitHub Actions 与 Azure 之间进行安全认证的黄金标准。全程**无需任何长期存在的密码、密钥或证书**，从根本上杜绝了凭证泄露的风险。
2.  **基础设施即代码 (Infrastructure as Code - IaC):** 我们将使用 **Bicep**，这是微软官方推荐的、用于声明式定义 Azure 资源的语言。这意味着我们所有的云资源（服务器、数据库等）都将以代码的形式存在于我们的 GitHub 仓库中。这带来了巨大的好处：
    - **可复现性:** 任何人都可以一键部署一个与生产环境完全一致的测试环境。
    - **版本控制:** 所有的基础设施变更都像代码一样，有历史记录，可审查，可回滚。
    - **自动化:** 彻底告别在 Azure Portal 上手动“点点点”的低效和易错操作。
3.  **最小权限原则 (Principle of Least Privilege):** 我们的自动化流程只会被授予完成其任务所必需的最小权限，不多一分也不少一分，确保整个系统的安全。

---

## Part 1: 准备工作 - 创建我们的“云端沙盒”

在开始之前，我们需要在 Azure 中创建一个“容器”或“文件夹”，用来存放我们项目的所有资源。这个容器被称为**资源组 (Resource Group)**。

**操作步骤：**

1.  登录 [Azure Portal](https://portal.azure.com/)。
2.  在顶部的搜索栏中，搜索并选择 **“Resource groups”** (资源组)。
3.  点击 **“+ Create”** (创建)。
4.  **Subscription (订阅):** 选择您的 Azure 订阅。
5.  **Resource group (资源组):** 输入一个清晰的名称。**我们将使用 `DutchSalaryToday-RG`**。
6.  **Region (区域):** 选择一个离您的用户近的区域，例如 **`(Europe) West Europe`**。
7.  点击 **“Review + create”**，然后点击 **“Create”**。

**结果：** 您现在拥有了一个名为 `DutchSalaryToday-RG` 的空资源组。我们后续所有的操作都将在这个资源组内进行，确保不会影响到您 Azure 账户的其他部分。

---

## Part 2: 创建数字身份 - 为 GitHub Actions 注册“身份证”

现在，我们需要为我们的 GitHub Actions 工作流在 Azure 的世界里创建一个官方认可的身份。这个过程被称为**应用注册 (App Registration)**。

**操作步骤：**

1.  在 Azure Portal 顶部的搜索栏中，搜索并选择 **“Microsoft Entra ID”**。
2.  在左侧菜单中，选择 **“App registrations”** (应用注册)。
3.  点击 **“+ New registration”** (新注册)。
4.  **Name (名称):** 输入 `github-actions-oidc-app`。
5.  **Supported account types (支持的帐户类型):** 保持默认选项 (“Accounts in this organizational directory only”)。
6.  **Redirect URI (重定向 URI):** 留空。
7.  点击 **“Register”** (注册)。

**结果与关键信息记录：**

注册成功后，您会被带到应用的概述页面。请记录以下三个 ID，它们是我们后续配置的基石。根据您之前提供的信息，这些值是：

- **Application (client) ID (应用程序/客户端 ID):** `b7815499-c114-41b5-a8e6-033d13db93af`
- **Object ID (对象 ID):** `a1e363f6-346b-43cf-9b80-1c80df724468` (这个 ID 代表服务主体的唯一标识)
- **Directory (tenant) ID (目录/租户 ID):** `a0c355d7-d058-4798-89fe-f4c9d0851ce9`

---

## Part 3: 建立信任 - 告诉 Azure “请相信我的 GitHub 仓库”

这一步是 OIDC 的核心。我们将配置一个**联合凭据 (Federated Credential)**，它会在 Azure AD 和您的 GitHub 仓库之间建立一个单向的信任关系。

**操作步骤：**

1.  在 `github-actions-oidc-app` 的应用注册页面，从左侧菜单选择 **“Certificates & secrets”** (证书和秘密)。
2.  选择 **“Federated credentials”** (联合凭据) 选项卡。
3.  点击 **“+ Add credential”** (添加凭据)。
4.  在 **“Federated credential scenario”** (联合凭据场景) 的下拉菜单中，选择 **“GitHub Actions deploying Azure resources”**。
5.  **配置 GitHub 信息:**
    - **Organization (组织):** 输入您的 GitHub 用户名或组织名，例如 `miloyiyangsun`。
    - **Repository (存储库):** 输入您的仓库名，例如 `DutchSalaryToday`。
    - **Entity type (实体类型):** 选择 **`Branch`** (分支)。
    - **Branch (分支):** 输入 `main`。这代表我们只信任从 `main` 分支发起的 GitHub Actions 工作流。
6.  **命名凭据:**
    - **Name (名称):** 输入一个描述性的名称，例如 `github-main-branch-trust`。
7.  点击 **“Add”** (添加)。

**结果：** 您已经告诉 Azure：“任何来自 `miloyiyangsun/DutchSalaryToday` 仓库 `main` 分支的工作流，当它拿着一个 GitHub 颁发的特殊令牌来找你时，请相信它就是我授权的 `github-actions-oidc-app`。”

---

## Part 4: 授予权限 - 为“机器人管家”颁发“工作证”

这是我们之前遇到挑战的步骤，现在我们用最精确的方法来完成它。

**操作步骤：**

1.  导航回我们之前创建的资源组 **`DutchSalaryToday-RG`**。
2.  在左侧菜单中，点击 **“Access control (IAM)”** (访问控制 (IAM))。
3.  点击蓝色的 **“+ Add”** (添加) -> **“Add role assignment”** (添加角色分配)。
4.  **第 1 步: 选择角色 (Role)**
    - **关键操作:** 请**不要**在搜索框输入任何内容。
    - 直接点击上方的 **“Job function roles”** (职务职能角色) 选项卡。
    - 在列表的最顶端，您会看到 **“Contributor”** (参与者)。**请选择这一个**。
    - 点击 **“Next”** (下一步)。
5.  **第 2 步: 选择成员 (Members)**
    - 在 “Assign access to” (将访问权限分配给) 部分，确保已选择 **“User, group, or service principal”**。
    - 点击下方的 **“+ Select members”** (选择成员)。
    - **关键操作:** 在右侧滑出的面板中，**再次确认搜索框是空的**。
    - 在搜索框中，输入我们应用的名字: **`github-actions-oidc-app`**。
    - 现在，您的服务主体应该会出现在列表中。点击它来选中。
    - 点击面板底部的蓝色 **“Select”** (选择) 按钮。
    - 点击 **“Next”** (下一步)。
6.  **第 3 步: 审阅与分配 (Review + assign)**
    - 仔细检查摘要信息，确保角色是 `Contributor`，成员是 `github-actions-oidc-app`，范围是 `DutchSalaryToday-RG`。
    - 点击蓝色的 **“Review + assign”** (审阅 + 分配) 按钮。

**结果：** 我们的“机器人管家” (`github-actions-oidc-app`) 现在拥有了在 `DutchSalaryToday-RG` 这个“沙盒”里创建、修改和删除任何资源的权限。

---

## Part 5: 配置 GitHub - 让“机器人管家”知道自己的“身份证号”

最后一步，我们需要在 GitHub 仓库中设置 Secrets，告诉它连接 Azure 所需的几个关键 ID。

**操作步骤：**

1.  在您的 GitHub 仓库页面，进入 `Settings` > `Secrets and variables` > `Actions`。
2.  点击 **“New repository secret”** (新建仓库秘密) 并添加以下三个 Secret：
    - **Name:** `AZURE_CLIENT_ID`
      - **Value:** `da2371b3-6fa7-49f1-8d87-d910d030df97` (您的应用程序/客户端 ID)
    - **Name:** `AZURE_TENANT_ID`
      - **Value:** `a0c355d7-d058-4798-89fe-f4c9d0851ce9` (您的目录/租户 ID)
    - **Name:** `AZURE_SUBSCRIPTION_ID`
      - **Value:** `90c1c9eb-4499-465e-b375-a2955abca856`

**结果：** 我们的 GitHub Actions 工作流现在拥有了连接到 Azure 所需的所有非敏感信息。它将在运行时使用这些信息和 OIDC 流程来获取一个临时的、有权限的访问令牌。我们的云配置工作到此全部完成！

---

## Part 6: 部署到云端 - 两种路径通往 Azure Container Apps

**战略决策：** 我们已确定采用 **Azure Container Apps (ACA)** 作为项目的最终部署平台。ACA 的现代化架构完美契合我们的多容器应用。

本章节将提供两种部署路径，您可以根据需求选择：

- **路径 A：快速手动部署 (Quick Start via Portal & CLI)**
  - **适用场景**: 首次部署、快速功能验证、熟悉 ACA 核心概念。
  - **特点**: 主要通过 Azure Portal 和 Azure CLI 手动操作，使用传统的服务主体凭证 (Service Principal Credentials)。
- **路径 B：生产级自动化部署 (Production-Grade Automation)**
  - **适用场景**: 建立正式的、可重复的、安全的持续部署 (CD) 流程。
  - **特点**: 遵循业界最佳实践，采用**基础设施即代码 (Bicep)** 和 **无密码认证 (OIDC)**。**这是我们为本项目推荐的最终方案。**

---

### 路径 A: 快速手动部署 (Quick Start via Portal & CLI)

此路径让您在几分钟内就能看到应用在云端运行。

#### 步骤 1: 在 Azure Portal 创建托管环境

托管环境 (Managed Environment) 是运行所有容器应用的隔离网络边界。

1.  **登录 Azure Portal** 并导航到 **“Container Apps”** 服务。
2.  点击 **“+ Create”**。
3.  在 “Basics” 选项卡中，填写资源组 (`DutchSalaryToday-RG`) 和应用名称 (例如 `dutch-salary-aca`)。
4.  在 “Environment” 选项卡中，选择 **“Create new”**，并输入一个环境名称，例如 `dutch-salary-env`。
5.  点击 **“Review + create”** -> **“Create”**。

#### 步骤 2: 创建服务主体凭证 (Service Principal Credential)

为了让 GitHub Actions 有权限部署，我们需要创建一个服务主体。

1.  **打开 Azure Cloud Shell** 或在本地安装并登录 Azure CLI。
2.  运行以下命令（请将 `your-subscription-id` 替换为您的实际订阅 ID）：
    ```bash
    az ad sp create-for-rbac --name "github-actions-aca" --role contributor --scopes /subscriptions/your-subscription-id/resourceGroups/DutchSalaryToday-RG --sdk-auth
    ```
3.  **重要**: **完整地复制**命令输出的 JSON 对象。它看起来像这样：
    ```json
    {
      "clientId": "...",
      "clientSecret": "...",
      "subscriptionId": "...",
      "tenantId": "...",
      "activeDirectoryEndpointUrl": "...",
      "resourceManagerEndpointUrl": "...",
      "activeDirectoryGraphResourceId": "...",
      "sqlManagementEndpointUrl": "...",
      "galleryEndpointUrl": "...",
      "managementEndpointUrl": "..."
    }
    ```

#### 步骤 3: 配置 GitHub Secrets

1.  在您的 GitHub 仓库中，进入 `Settings > Secrets and variables > Actions`。
2.  点击 **“New repository secret”**，创建一个名为 `AZURE_CREDENTIALS` 的 Secret。
3.  将上一步复制的**完整 JSON 对象**粘贴到 Secret 的值中。

#### 步骤 4: 配置 GitHub Actions 工作流

在您的 `.github/workflows/` 目录下创建一个 `deploy.yml` 文件（或修改现有文件），内容如下。此工作流会构建一个**单一镜像**并部署。

> **注意**: 此示例假设您的 `Dockerfile` 位于项目根目录。对于我们的多项目结构，您需要为前端和后端分别创建类似的工作流。

```yaml
# .github/workflows/deploy-manual.yml
name: Manual Deploy to Azure Container Apps

on:
  push:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build and push Docker image (example for backend)
        uses: docker/build-push-action@v5
        with:
          context: ./backend # 指定后端目录
          file: ./backend/Dockerfile # 指定 Dockerfile 路径
          push: true
          tags: ghcr.io/${{ github.repository }}/backend:${{ github.sha }}

      - name: Login to Azure
        uses: azure/login@v2
        with:
          creds: ${{ secrets.AZURE_CREDENTIALS }}

      - name: Deploy to Azure Container Apps
        uses: azure/container-apps-deploy-action@v2
        with:
          acrName: ghcr.io
          containerAppName: dutch-salary-backend-app # 容器应用名称
          resourceGroup: DutchSalaryToday-RG
          imageToDeploy: ghcr.io/${{ github.repository }}/backend:${{ github.sha }}
```

---

### 路径 B: 生产级自动化部署 (IaC with Bicep & OIDC)

此路径是我们为项目设定的黄金标准，它实现了完全的自动化、安全和可复现性。**我们已在 Part 1-5 中完成了 OIDC 的所有前期配置**，现在我们将利用它。

#### 步骤 1: 创建 Bicep 模板文件

在您的项目根目录下，创建一个名为 `deploy/` 的新文件夹，并在其中创建一个名为 `main.bicep` 的文件。
此文件将定义我们所有的云端资源。

**文件位置:** `deploy/main.bicep`

```bicep
// deploy/main.bicep
// 基础设施即代码 (IaC) 模板，用于定义我们的云资源

// --- 1. 参数定义 (Parameters) ---
@description('The location for all resources.')
param location string = resourceGroup().location

@description('A unique name for the Container Apps Environment.')
param containerAppsEnvName string = 'cae-dutch-salary'

@description('The name of the frontend container app.')
param frontendAppName string = 'frontend-app'

@description('The name of the backend container app.')
param backendAppName string = 'backend-app'

@description('The name of the Azure Container Registry.')
param acrName string = 'acrdutchsalary${uniqueString(resourceGroup().id)}' // 保证 ACR 名称全局唯一

@description('The PostgreSQL server admin login.')
@secure()
param postgresAdminLogin string

@description('The PostgreSQL server admin password.')
@secure()
param postgresAdminPassword string


// --- 2. 核心资源定义 (Core Resources) ---

// 2.1. Azure 容器仓库 (Azure Container Registry - ACR)
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

// 2.2. Azure Database for PostgreSQL - 灵活服务器 (Flexible Server)
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
    network: {
      delegatedSubnetResourceId: null
      privateDnsZoneArmResourceId: null
    }
  }
}

// 在 PostgreSQL 服务器上创建一个数据库
resource postgresDatabase 'Microsoft.DBforPostgreSQL/flexibleServers/databases@2023-03-01-preview' = {
  parent: postgresServer
  name: 'salary_data'
}


// 2.3. Container Apps 环境 (Container Apps Environment)
resource containerAppsEnv 'Microsoft.App/managedEnvironments@2024-03-01' = {
  name: containerAppsEnvName
  location: location
  properties: {}
}


// --- 3. 容器应用定义 (Container Apps) ---

// 3.1. 后端容器应用 (Backend Container App)
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
    }
  }
}

// 3.2. 前端容器应用 (Frontend Container App)
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
      ingress: {
        external: true
        targetPort: 80
      }
    }
  }
}

// --- 4. 输出 (Outputs) ---
output frontendUrl string = frontendApp.properties.configuration.ingress.fqdn
```

#### 步骤 2: 更新 GitHub Actions 工作流以实现持续部署 (CD)

我们将更新 `.github/workflows/build.yml` 文件，使其能够利用 OIDC 登录，并将构建好的多个镜像推送到 **Azure Container Registry (ACR)**，最后通过 Bicep 部署所有资源。

**文件位置:** `.github/workflows/build.yml` (最终版)

```yaml
name: Build, Push, and Deploy to ACA

on:
  push:
    branches: ["main"]
  pull_request:
    branches: ["main"]

jobs:
  build_and_push:
    runs-on: ubuntu-latest
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    outputs:
      acr_login_server: ${{ steps.acr_login.outputs.acr_login_server }}

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Azure Login via OIDC
        uses: azure/login@v2
        with:
          client-id: ${{ secrets.AZURE_CLIENT_ID }}
          tenant-id: ${{ secrets.AZURE_TENANT_ID }}
          subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}

      - name: Get or Create ACR and get Login Server
        id: acr_login
        run: |
          ACR_NAME=$(az acr list --resource-group DutchSalaryToday-RG --query "[0].name" -o tsv)
          if [ -z "$ACR_NAME" ]; then
            echo "No ACR found. One will be created by Bicep."
            # 预估一个名字，实际名字由 Bicep 创建
            ACR_LOGIN_SERVER="placeholder.azurecr.io"
          else
            ACR_LOGIN_SERVER=$(az acr show --name $ACR_NAME --query loginServer -o tsv)
          fi
          echo "acr_login_server=$ACR_LOGIN_SERVER" >> $GITHUB_OUTPUT

      - name: Login to ACR
        if: steps.acr_login.outputs.acr_login_server != 'placeholder.azurecr.io'
        uses: docker/login-action@v3
        with:
          registry: ${{ steps.acr_login.outputs.acr_login_server }}
          username: $(az acr credential show --name $(az acr list --resource-group DutchSalaryToday-RG --query "[0].name" -o tsv) --query "username" -o tsv)
          password: $(az acr credential show --name $(az acr list --resource-group DutchSalaryToday-RG --query "[0].name" -o tsv) --query "passwords[0].value" -o tsv)

      - name: Build and Push Backend Image
        if: steps.acr_login.outputs.acr_login_server != 'placeholder.azurecr.io'
        uses: docker/build-push-action@v5
        with:
          context: ./backend
          push: true
          tags: ${{ steps.acr_login.outputs.acr_login_server }}/backend-app:latest

      - name: Build and Push Frontend Image
        if: steps.acr_login.outputs.acr_login_server != 'placeholder.azurecr.io'
        uses: docker/build-push-action@v5
        with:
          context: ./frontend
          push: true
          tags: ${{ steps.acr_login.outputs.acr_login_server }}/frontend-app:latest

  deploy_to_aca:
    runs-on: ubuntu-latest
    needs: build_and_push
    environment: production

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Azure Login via OIDC
        uses: azure/login@v2
        with:
          client-id: ${{ secrets.AZURE_CLIENT_ID }}
          tenant-id: ${{ secrets.AZURE_TENANT_ID }}
          subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}

      - name: Deploy Bicep template
        id: deploy
        uses: azure/arm-deploy@v2
        with:
          subscriptionId: ${{ secrets.AZURE_SUBSCRIPTION_ID }}
          resourceGroupName: DutchSalaryToday-RG
          template: ./deploy/main.bicep
          parameters: "postgresAdminLogin=${{ secrets.POSTGRES_ADMIN_LOGIN }} postgresAdminPassword=${{ secrets.POSTGRES_ADMIN_PASSWORD }}"
          failOnStdErr: false

      - name: Echo frontend URL
        run: echo "Frontend URL: ${{ steps.deploy.outputs.frontendUrl }}"
```

#### 步骤 3: 补充所需的 GitHub Secrets

为了让新的工作流正常运行，我们需要在 GitHub 仓库的 `Settings > Secrets and variables > Actions` 中再添加两个用于数据库的 Secret：

- **Name:** `POSTGRES_ADMIN_LOGIN`
  - **Value:** `dutchadmin` (或您选择的任何用户名)
- **Name:** `POSTGRES_ADMIN_PASSWORD`
  - **Value:** (请生成一个强密码并粘贴于此)

#### 步骤 4: 修改前端代码以使用环境变量

最后，我们需要让前端应用知道如何找到后端的 API 地址。

**文件位置:** `frontend/src/main.tsx` (或您集中管理 API 配置的地方)

```typescript
// 示例：在 main.tsx 或 api.ts 中配置 axios
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

// ... 您的其他代码
```

**最终结果：**

完成路径 B 的配置后，您就拥有了一个完整的、企业级的自动化部署流程。每当您向 `main` 分支推送代码时，GitHub Actions 都会安全、可靠、可复现地将您的整个应用（包括基础设施）部署到 Azure。

---

## Part 7: 执行与验证 - 将蓝图变为现实

**目标：** 完成 Sprint 0 的最终里程碑——通过我们设计的生产级 CI/CD 流程，将 `frontend-app` 和 `backend-app` 成功部署到 Azure Container Apps，并验证其端到端连通性。

本部分将指导您完成从代码到云端运行应用的“最后一公里”。我们将严格遵循“路径 B”的自动化方案。

### 前提条件

请确保您已经完成了本指南 **Part 1 至 Part 5** 的所有 OIDC 和 GitHub Secrets 配置。

### 步骤 1: 创建并提交代码文件

我们需要将规划好的 Bicep 和 GitHub Actions 工作流代码文件添加到我们的仓库中。

1.  **创建 Bicep 文件:**

    - 在项目根目录创建一个新文件夹 `deploy`。
    - 在 `deploy/` 文件夹内，创建一个新文件 `main.bicep`。
    - 将 **Part 6, 路径 B, 步骤 1** 中提供的完整 Bicep 代码复制并粘贴到 `deploy/main.bicep` 文件中。

2.  **创建/更新 GitHub Actions 工作流文件:**

    - 在 `.github/workflows/` 目录下，创建一个新文件 `deploy.yml` (或者覆盖现有的 `build.yml`)。
    - 将 **Part 6, 路径 B, 步骤 2** 中提供的完整 YAML 代码复制并粘贴到 `deploy.yml` 文件中。

3.  **更新前端代码以使用环境变量:**

    - 打开 `frontend/src/main.tsx` 文件。
    - 在文件的顶部（`import` 语句之后），添加以下代码行，以确保前端应用知道如何连接到后端的 API：

      ```typescript
      import axios from "axios";

      axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
      ```

4.  **提交代码:**
    - 将所有新建和修改的文件（`deploy/main.bicep`, `.github/workflows/deploy.yml`, `frontend/src/main.tsx`）提交到您的本地 Git 仓库，并推送到 `main` 分支。
      ```bash
      git add deploy/main.bicep .github/workflows/deploy.yml frontend/src/main.tsx
      git commit -m "feat: Add IaC and CD pipeline for ACA deployment"
      git push origin main
      ```

### 步骤 2: 触发并监控 CI/CD 工作流

将代码推送到 `main` 分支后，我们的自动化部署流程将自动启动的。

1.  **打开 GitHub Actions 页面:**
    - 在您的 GitHub 仓库页面，点击顶部的 **“Actions”** 标签页。
2.  **监控工作流:**
    - 您会看到一个名为 “Build, Push, and Deploy to ACA” 的新工作流正在运行。
    - 点击进入，您可以实时查看 `build_and_push` 和 `deploy_to_aca` 这两个作业 (jobs) 的执行情况。
    - **`build_and_push` 作业**: 这个作业会构建前后端的 Docker 镜像，并将其推送到 Azure Container Registry (ACR)。
    - **`deploy_to_aca` 作业**: 这个作业会在上一个作业成功后开始。它会运行 Bicep 模板来创建或更新云端的所有资源。

### 步骤 3: 验证部署结果

当 GitHub Actions 工作流显示绿色对勾，表示成功完成后，我们就可以开始验证部署成果了。

1.  **获取前端访问 URL:**

    - 在 `deploy_to_aca` 作业的日志中，找到名为 **“Echo frontend URL”** 的步骤。
    - 日志会打印出类似 `Frontend URL: https://frontend-app.witty-sand-0123456.westeurope.azurecontainerapps.io` 的 URL。**这就是您应用的公开访问地址。**

2.  **验证前端应用:**

    - 在浏览器中打开上面获取的 URL。
    - 您应该能看到您的 React 应用界面。此时，打开浏览器的开发者工具（按 F12），查看“网络 (Network)”选项卡。您可能会看到一些发往后端 API 的请求失败了，这是正常的，因为我们还需要验证后端。

3.  **验证后端应用:**

    - **在 Azure Portal 中检查日志:**
      - 导航到您的资源组 `DutchSalaryToday-RG`。
      - 点击名为 `backend-app` 的容器应用。
      - 在左侧菜单中，选择 **“Log stream”**。
      - 您应该能看到 Spring Boot 应用的启动日志。检查是否有任何错误。如果一切正常，您会看到类似 `Started DutchSalaryTodayApplication in ... seconds` 的信息。
    - **验证数据库连接:** 日志中不应出现任何与数据库连接相关的错误。

4.  **端到端连通性验证 (End-to-End Connectivity):**
    - 刷新您的前端页面。
    - 再次查看浏览器开发者工具的“网络”选项卡。
    - 现在，发往后端 API 的请求应该会成功返回 `200 OK` 状态码。这证明了前端容器成功地通过 ACA 的内部网络调用了后端容器，后端容器也成功地连接到了 PostgreSQL 数据库。

**恭喜！** 完成以上所有步骤后，您就成功地通过一个完全自动化的、安全可靠的流程，将您的多容器应用部署到了 Azure Container Apps 上。Sprint 0 的所有核心技术目标均已达成。
