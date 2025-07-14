# Azure 免费服务额度清单 (Azure Free Services Quota)

**有效期至 (Expires on): 2026 年 8 月 14 日 (Friday, August 14, 2026)**

本项目将严格遵守以下 Azure 免费服务额度，以确保在 12 个月的免费期内零成本运营。所有架构设计和技术选型都将以此为基准。

| 服务类别 (Category)   | 服务名称 (Service Name)                                         | 每月免费额度 (Monthly Free Limit) |
| :-------------------- | :-------------------------------------------------------------- | :-------------------------------- |
| **计算 (Compute)**    | 虚拟机 (Virtual Machines, B1s)                                  | 750 小时 (Hours)                  |
|                       | 虚拟机 (Virtual Machines, B2pts v2)                             | 750 小时 (Hours)                  |
|                       | 虚拟机 (Virtual Machines, B2ats v2)                             | 750 小时 (Hours)                  |
|                       | Windows 虚拟机 (Windows VM, B1s)                                | 750 小时 (Hours)                  |
|                       | Windows 虚拟机 (Windows VM, B2pts v2)                           | 750 小时 (Hours)                  |
|                       | Windows 虚拟机 (Windows VM, B2ats v2)                           | 750 小时 (Hours)                  |
|                       | 红帽企业版 Linux 许可证 (RHEL License)                          | 750 小时 (Hours)                  |
| **存储 (Storage)**    | 文件存储-LRS (Files, LRS Data Stored)                           | 100 GB                            |
|                       | 高级页 Blob-P6 磁盘 (Premium Page Blob, P6 Disks)               | 2.2 个 (Units)                    |
|                       | 标准 HDD 托管磁盘-LRS 快照 (HDD Managed Disks, LRS Snapshots)   | 1 GB                              |
|                       | 标准 HDD 托管磁盘-磁盘操作 (HDD Managed Disks, Disk Operations) | 200 万次 (2M Operations)          |
|                       | 分层块 Blob-热 LRS (Tiered Block Blob, Hot LRS)                 | 5 GB                              |
|                       | 分层块 Blob-存档 LRS (Tiered Block Blob, Archive LRS)           | 10 GB                             |
|                       | 容器注册表-标准 (Container Registry, Standard)                  | 31 天 (Days) / 100 GB             |
| **数据库 (Database)** | SQL 数据库-S0 (SQL Database, S0)                                | 31 天 (Days) / 10 DTUs            |
|                       | Azure Cosmos DB - 存储 (Cosmos DB, Data Stored)                 | 25 GB                             |
|                       | Azure Cosmos DB - 吞吐量 (Cosmos DB, 100 RU/s)                  | 2,976 小时 (Hours)                |
|                       | Azure Database for PostgreSQL - 计算 (B1MS)                     | 750 小时 (Hours)                  |
|                       | Azure Database for PostgreSQL - 存储                            | 32 GB                             |
|                       | Azure Database for PostgreSQL - 备份                            | 32 GB                             |
|                       | Azure Database for MySQL - 计算 (B1MS)                          | 750 小时 (Hours)                  |
|                       | Azure Database for MySQL - 存储                                 | 32 GB                             |
|                       | Azure Database for MySQL - 备份                                 | 32 GB                             |
| **网络 (Networking)** | 数据传出 (Data Transfer Out)                                    | 15 GB                             |
|                       | 公共 IP 地址 (Public IP Addresses)                              | 1,500 小时 (Hours)                |
|                       | 负载均衡器-标准 (Load Balancer, Standard)                       | 750 小时 (Hours)                  |
|                       | VPN 网关 (VPN Gateway)                                          | 750 小时 (Hours)                  |
| **人工智能 (AI)**     | 认知服务-自定义视觉 (Custom Vision, S0)                         | 10,000 次调用, 1 小时训练         |
|                       | 认知服务-计算机视觉 (Computer Vision, S1)                       | 5,000 次调用 (Transactions)       |
|                       | 认知服务-语言理解 (Language Understanding)                      | 10,000 次调用 (Transactions)      |
|                       | 认知服务-人脸识别 (Face, Standard)                              | 30,000 次调用 (Transactions)      |
|                       | 认知服务-文本翻译 (Translator Text, S1)                         | 200 万字符 (2M Characters)        |
|                       | 认知服务-文本分析 (Text Analytics, Standard)                    | 5,000 条记录 (Text Records)       |
|                       | 认知服务-内容审查 (Content Moderator, Standard)                 | 10,000 次调用 (Transactions)      |
|                       | 认知服务-异常检测 (Anomaly Detector, Standard)                  | 20,000 次调用 (Transactions)      |
|                       | 认知服务-表单识别器 (Form Recognizer, S0)                       | 500 次调用 (Transactions)         |
| **其他 (Others)**     | 密钥保管库 (Key Vault, Premium HSM)                             | 10,000 次操作 (Operations)        |
|                       | 服务总线 (Service Bus, Standard)                                | 750 小时 (Hours)                  |
|                       | 媒体服务-编码 (Media Services, Encoding)                        | 20 分钟 (Minutes)                 |
|                       | 媒体服务-直播 (Media Services, Live Channels)                   | 5 小时 (Hours)                    |

---

# 项目计划：荷兰薪酬洞察 (DutchSalaryToday)

## 核心产品理念：数据叙事，而非数据罗列

我们的目标不是构建一个传统、复杂、让用户感到压力的数据仪表盘 (Dashboard)。相反，我们要成为一个**数据故事的讲述者 (Data Storyteller)**。我们将通过引人入胜的视觉和叙事，将枯燥的数据转化为普通人也能理解、关心并能从中获得启发的深度洞察。

### 产品结构

项目将采用一个三层结构，以平衡引导式叙事和自由式探索：

1.  **首页 (Homepage)**: 一个沉浸式的、单页滚动的“故事流”，由 5 个核心故事章节组成。每个章节用极具冲击力的“大数字 (Big Numbers)”作为钩子，吸引用户注意力。
2.  **详情页 (Detail Pages)**: 点击首页的任意“大数字”，用户会进入对应故事的详情分析页。这里将通过丰富的图表和表格，对该故事进行深入、可视化的解读。
3.  **探索页 (Explorer Page)**: 在网站的导航栏，提供一个独立的“数据探索”页面。这里将提供强大的筛选器 (Filters)，让有深度分析需求的用户可以自由地组合维度和指标，进行个性化的数据探索。

---

## 开发策略：持续部署与演进式架构

我们将严格遵循业界顶尖的**持续部署 (Continuous Deployment)**与**演进式架构 (Evolutionary Architecture)**实践，确保快速交付价值、高效迭代，并从第一天起就构建一个健壮、安全的系统。

### 核心原则

1.  **上线优先 (Go-Live First)**: 我们的首要目标是在第一个 Sprint 结束时，就发布一个虽然功能极简但**完整、可用、公开**的产品版本。这能让我们尽早验证整个技术链路和产品价值。
2.  **垂直切片 (Vertical Slicing)**: 我们不按技术分层推进，而是以**“故事”**为单位，**端到端 (End-to-End)** 地完成从开发到部署的每一个功能。
3.  **演进式设计 (Evolutionary Design)**: 我们承认无法在项目初期预知所有需求。因此，我们不进行“预先大型设计”，而是让架构随着我们对业务理解的加深而**逐步演进**。
4.  **YAGNI 原则 (You Ain't Gonna Need It)**: 在每个 Sprint 中，我们**只实现当前故事所必需的功能**，不为任何“未来可能需要”的通用性编写额外代码，避免过度设计。
5.  **适时重构 (Just-in-Time Refactoring)**: 当同一个代码模式或逻辑在**第三次**出现时（三次法则），我们才启动重构，将其抽象为可复用的组件或服务。

### 风险驱动的架构设计

我们将在每个 Sprint 中，主动识别并解决潜在的生产环境风险。

| 风险点           | 解决方案                | 实现方式                               | 实施 Sprint |
| :--------------- | :---------------------- | :------------------------------------- | :---------- |
| 数据库连接失败   | 连接池 + 瞬时故障重试   | HikariCP + Spring Retry (`@Retryable`) | Sprint 1    |
| API 响应缓慢     | 前端超时 + 后端查询优化 | Axios Timeout + 数据库索引             | Sprint 1    |
| 静态资源访问压力 | CDN 加速                | 集成 Azure CDN                         | Sprint 1    |
| 敏感信息泄露     | 密钥集中管理            | 集成 Azure Key Vault                   | Sprint 1    |
| API 动态流量压力 | 结果缓存                | 集成 Redis                             | Sprint 4+   |
| 恶意高频访问     | API 限流                | API Gateway 或 Spring Cloud Gateway    | Sprint 6    |

---

## Sprint -1: 数据探索与产品构思 (Data Exploration & Product Vision)

**状态：已完成 (Completed)**

- **数据采集**: 完整抓取了荷兰统计局(CBS) `85919ENG` OData API 的全部数据集。
- **范围定义**: 决定将核心分析范围集中在 **2010-2024 年**，以确保数据质量。
- **产品构思**: 确立了“数据叙事”的核心产品理念，并设计了 5 个核心故事主题作为产品主线。

---

## Sprint 0: 奠定基石 (Laying the Foundation)

**状态：待开始 (To-Do)**

以下是 Sprint 0 的详细可执行计划，完全遵循您的项目结构要求，细化为可立即执行的具体步骤：

### 1. 版本控制：GitHub 仓库设置

**详细步骤：**

**A. 创建仓库 (Create Repository)：**

1.  登录 GitHub → "New repository" → 名称 `DutchSalaryToday`
2.  描述 (Description)：“荷兰薪酬数据可视化项目”
3.  选择 `Public`
4.  勾选 "Add a README file"

**B. 初始化本地仓库并完成首次同步 (Initialize Local Repository & First Sync)：**

为了将本地的项目文件同步到 GitHub，我们采用标准的“功能分支”工作流，即创建一个新分支 `initial-sync`，然后通过拉取请求 (Pull Request) 将其合并到 `main` 分支。

```bash
# 1. 克隆 (clone) 仓库到本地
git clone https://github.com/miloyiyangsun/DutchSalaryToday.git
cd DutchSalaryToday

# 2. 创建项目目录结构和核心文件
# Create project directory structure and core files
mkdir -p .github/workflows frontend backend data_acquisition/raw_data
touch docker-compose.yml .gitignore

# 3. 创建一个新分支用于首次代码同步
# Create a new branch for the initial code sync
git checkout -b initial-sync

# 4. 添加所有文件到暂存区并提交
# Add all files to staging and commit
git add .
git commit -m "Initial commit: Add project structure"

# 5. 推送新分支到 GitHub
# Push the new branch to GitHub
git push -u origin initial-sync
```

**C. 合并到主分支 (Merge to Main):**

1.  **创建拉取请求 (Create Pull Request)**: 在 GitHub 网站上，为 `initial-sync` 分支创建一个指向 `main` 分支的拉取请求。
2.  **合并 (Merge)**: 由于此时尚未设置分支保护规则，可以直接合并该拉取请求。

**D. 配置分支保护 (Branch Protection) - 后续步骤:**

在完成初始项目结构同步后，为了保证 `main` 分支的稳定性，**再进行**分支保护规则的配置。我们将遵循 2025 年 GitHub 分支保护的最新最佳实践，并结合 OpenID Connect (OIDC) 进一步增强安全性。

**核心分支保护规则 (Core Branch Protection Rules):**

在仓库设置中 (`Settings` > `Branches` > `Branch protection rules`):

- **保护分支 (Branch to protect)**：`main`
- **关于拉取请求审查 (About Pull Request Reviews):**
  - **对于单人项目 (For Single-Developer Projects)**：GitHub 默认不允许拉取请求的作者批准自己的拉取请求。因此，对于单人项目，我们建议：
    - **强调自我审查 (Emphasize Self-Review)**：开发者在提交拉取请求后，应像独立的审查者一样，仔细检查自己的代码更改。这是确保代码质量的关键实践。
    - **暂时不强制要求人工批准 (Temporarily Do Not Enforce Human Approval)**：在分支保护规则中，可以暂时不勾选“`Require pull request reviews before merging`”，或者将所需批准数量设置为 0，以避免流程阻塞。自动化检查将作为主要的质量保障。
    - **未来团队协作 (Future Team Collaboration)**：如果未来有协作者加入，再启用并配置“`Require pull request reviews before merging`”，以适应团队协作的需求。
- **勾选：`Require status checks to pass before merging` (合并前需要状态检查通过)**：
  - **目的 (Purpose)**：在合并代码之前，强制要求所有配置的自动化检查（如单元测试、集成测试、代码风格检查、安全扫描等）必须通过。
  - **配置 (Configuration)**：确保 CI/CD 流水线中的所有关键检查都作为状态检查集成到 GitHub 中。对于本项目，我们将添加状态检查：`build-frontend`, `build-backend` (在 CI/CD 建立后添加)。
  - **注意 (Note)**：目前这些状态检查可能不会在 GitHub 设置中显示，这是正常的。它们只有在 CI/CD 工作流实际运行并向 GitHub 报告了这些状态之后，才会出现在列表中。我们将在 Sprint 1 中实现 CI/CD 工作流。
- **推荐额外配置 (Recommended Additional Configurations)**：
  - **强制签署提交 (Require Signed Commits)**：通过要求提交者使用 GPG 密钥签署其提交，验证提交的真实性和完整性。
  - **强制线性历史 (Require Linear History)**：防止合并提交，保持一个干净、线性的提交历史记录。
  - **禁止强制推送 (Do Not Allow Force Pushes)**：防止开发者通过强制推送覆盖分支历史。
  - **禁止删除分支 (Do Not Allow Deletions)**：保护重要分支不被意外删除。
  - **包含管理员 (Include Administrators)**：即使是仓库管理员也应受到分支保护规则的约束，降低内部风险。

**OpenID Connect (OIDC) 与分支保护的结合 (OIDC Integration with Branch Protection):**

OIDC 是 GitHub Actions 安全最佳实践中的一个关键组成部分，它与分支保护规则协同工作，显著提升了 CI/CD 流水线的安全性。通过 OIDC，我们可以实现：

- **无云秘密 (No Cloud Secrets)**：无需在 GitHub 中存储敏感的长期凭证，大大降低了凭证泄露的风险。
- **凭证自动轮换 (Automated Credential Rotation)**：每次工作流运行时都会生成新的短期令牌。
- **细粒度授权 (Granular Authorization)**：云提供商可以根据 OIDC 令牌中的声明（如仓库、分支、环境）来精确控制哪些工作流可以访问哪些资源，实现最小权限原则。

在未来的 CI/CD 工作流中，我们将利用 OIDC 的细粒度授权能力，确保只有来自 `main` 分支的成功构建才能触发部署到生产环境。

**目录结构初始化后应如下：**

```text
DutchSalaryToday/
├── .github/workflows/    # CI/CD 工作流 (CI/CD Workflows)
├── data_acquisition/
│   ├── .venv/            # Python 虚拟环境 (Python Virtual Environment)
│   ├── raw_data/         # CBS 原始数据 (CBS Raw Data)
│   ├── fetch_all_cbs_data.py
│   └── requirements.txt
├── frontend/             # React 项目 (React Project)
├── backend/              # Spring Boot 项目 (Spring Boot Project)
└── Project_Plan.md
```

---

### 2. 云资源：Azure 配置

**详细步骤：**

**A. 基础设施即代码 (Infrastructure as Code - IaC) - Bicep:**

我们将使用 Bicep 来声明式地定义和部署 Azure 资源。这确保了基础设施的可重复性、可版本控制和自动化。

**B. OpenID Connect (OIDC) 配置 - GitHub Actions 与 Azure 安全认证:**

这是 GitHub Actions 与 Azure 之间进行安全认证的最新、最安全的方式。它通过在 GitHub 和 Azure 之间建立“信任关系”，允许 GitHub Actions 在每次运行时向 Azure 申请一个**短期的、临时的访问令牌 (Token)**，任务结束即作废，从而**无需存储任何长期密码**。

**具体步骤 (使用 Azure Portal):**

1.  **创建 Microsoft Entra ID 应用程序注册 (Create a Microsoft Entra ID Application Registration)**

    - 登录 [Azure Portal](https://portal.azure.com/)。
    - 在搜索栏中输入 "Microsoft Entra ID" 并选择它。
    - 在左侧菜单中，选择 "App registrations" (应用程序注册)。
    - 点击 "New registration" (新注册)。
    - **Name (名称)**：为您的应用程序输入一个有意义的名称，例如 `github-actions-oidc-app`。
    - **Supported account types (支持的帐户类型)**：选择适合您组织需求的选项（通常是 "Accounts in this organizational directory only"）。
    - **Redirect URI (重定向 URI)**：此场景不需要，可以留空。
    - 点击 "Register" (注册)。
    - 注册完成后，您将看到应用程序的概述页面。记下以下值，您稍后会在 GitHub Actions 中用到它们：
      - **Application (client) ID (应用程序（客户端）ID)**
      - **Directory (tenant) ID (目录（租户）ID)**

2.  **配置 API 权限 (Configure API Permissions) (可选，根据您的需求)**

    - 在应用程序注册的左侧菜单中，选择 "API permissions" (API 权限)。
    - 如果您需要此应用程序访问特定的 Azure 服务（例如 Microsoft Graph），请点击 "Add a permission" (添加权限)。
    - 选择所需的 API 和权限类型（例如 "Microsoft Graph" -> "Application permissions"）。
    - 选择具体的权限（例如 `User.Read.All` 如果需要读取所有用户）。
    - 点击 "Add permissions" (添加权限)。
    - **重要**：对于应用程序权限，您通常需要点击 "Grant admin consent for <Your Tenant Name>" (为 <您的租户名称> 授予管理员同意) 来批准这些权限。

3.  **添加联合凭据 (Add Federated Credentials)**

    - 在应用程序注册的左侧菜单中，选择 "Certificates & secrets" (证书和秘密)。
    - 选择 "Federated credentials" (联合凭据) 选项卡。
    - 点击 "Add credential" (添加凭据)。
    - **Federated credential scenario (联合凭据场景)**：选择 "GitHub Actions deploying Azure resources" (GitHub Actions 部署 Azure 资源)。
    - **Organization (组织)**：输入您的 GitHub 组织名称或个人用户名。
    - **Repository (存储库)**：输入您的 GitHub 仓库名称。
    - **Entity type (实体类型)**：选择您希望触发 OIDC 认证的实体类型。常见的选项有：
      - `Branch` (分支)：例如 `main` 或 `refs/heads/main`。
      - `Environment` (环境)：如果您在 GitHub 中使用了部署环境 (deployment environments)。
      - `Pull request` (拉取请求)：用于拉取请求触发的工作流。
    - **GitHub name (GitHub 名称)**：根据您选择的实体类型填写。例如，如果选择 `Branch`，则填写分支名称（如 `main`）。
    - **Name (名称)**：为这个联合凭据提供一个描述性名称，例如 `my-repo-main-branch-oidc`。
    - 点击 "Add" (添加)。
    - 这将建立 Azure AD 和 GitHub 之间的信任关系。

4.  **分配服务主体角色 (Assign Service Principal Roles)**
    - 您的应用程序注册会自动创建一个对应的服务主体 (Service Principal)。您需要为这个服务主体分配适当的 Azure 角色，以便它能够访问您希望部署到的资源。
    - 导航到您希望部署到的 Azure 订阅 (Subscription)、资源组 (Resource Group) 或特定资源。
    - 选择 "Access control (IAM)" (访问控制 (IAM))。
    - 点击 "Add" (添加) -> "Add role assignment" (添加角色分配)。
    - **Role (角色)**：选择所需的权限角色，例如 `Contributor` (参与者) 或更具体的角色（遵循最小权限原则 (principle of least privilege)）。
    - **Members (成员)**：选择 "Service principal" (服务主体)。
    - **Select members (选择成员)**：搜索您之前创建的应用程序注册的名称（例如 `github-actions-oidc-app`）。
    - 点击 "Review + assign" (审阅 + 分配)。

**C. 配置 GitHub Secrets:**

虽然 OIDC 减少了对长期凭证的需求，但一些配置值（如订阅 ID、租户 ID、客户端 ID）仍可能需要。

在 GitHub 仓库的 `Settings` > `Secrets and variables` > `Actions` 中添加以下 `secrets`:

- `AZURE_CLIENT_ID`: Microsoft Entra ID 应用程序的客户端 ID。
- `AZURE_TENANT_ID`: Azure 订阅的租户 ID。
- `AZURE_SUBSCRIPTION_ID`: Azure 订阅 ID。

---

### 3. 本地环境：docker-compose 配置

**文件位置**: `docker-compose.yml`

```yaml
# docker-compose.yml - 07.13, 23:29
version: "3.8"

services:
  # PostgreSQL 数据库服务
  db:
    image: postgres:15
    container_name: salary-db
    environment:
      POSTGRES_DB: salary_data
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: admin123
    ports:
      - "5432:5432" # 将容器的5432端口映射到主机的5432端口
    volumes:
      - postgres_data:/var/lib/postgresql/data # 数据持久化

  # 后端 Spring Boot 服务
  backend:
    build:
      context: ./backend # Dockerfile 路径
      dockerfile: Dockerfile
    container_name: salary-backend
    ports:
      - "8080:8080"
    depends_on:
      - db # 声明依赖数据库服务，会后于数据库启动
    environment:
      DB_URL: jdbc:postgresql://db:5432/salary_data
      DB_USER: admin
      DB_PASSWORD: admin123

  # 前端 React 服务
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: salary-frontend
    ports:
      - "3000:3000"
    stdin_open: true # 保持标准输入打开，用于交互式会话
    tty: true # 分配一个伪终端

volumes:
  postgres_data: # 定义一个命名的 volume 用于数据持久化
```

---

### 4. 项目脚手架 (Project Scaffolding)

**前端初始化 (React + TypeScript):**

```bash
# 进入前端目录
cd frontend

# 使用 Vite 创建 React + TypeScript 项目
npm create vite@latest . -- --template react-ts

# 安装项目依赖：axios 用于API请求, recharts 用于图表
npm install axios recharts @types/recharts

# 创建 Dockerfile
touch Dockerfile
```

**前端 Dockerfile:**

```dockerfile
# frontend/Dockerfile - 07.13, 23:29

# --- 构建阶段 (Build Stage) ---
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# --- 生产阶段 (Production Stage) ---
FROM nginx:stable-alpine
# 从构建阶段复制构建好的静态文件到 Nginx 服务器
COPY --from=build /app/dist /usr/share/nginx/html
# 暴露 80 端口
EXPOSE 80
```

**后端初始化 (Spring Boot):**

1.  访问 **Spring Initializr** (`start.spring.io`)
2.  配置项目:
    - Project: `Maven`
    - Language: `Java 17`
    - Dependencies (依赖): `Spring Web`, `Spring Data JPA`, `PostgreSQL Driver`
3.  下载 ZIP 文件并将其内容解压到 `backend` 目录。

**后端 Dockerfile:**

```dockerfile
# backend/Dockerfile - 07.13, 23:29

# --- 构建阶段 (Build Stage) ---
# 使用 Maven 官方镜像构建项目
FROM maven:3.8.6-openjdk-17 AS build
WORKDIR /app
COPY . .
# 打包项目，跳过测试 (-DskipTests)
RUN mvn clean package -DskipTests

# --- 生产阶段 (Production Stage) ---
# 使用轻量级的 OpenJDK 镜像运行应用
FROM openjdk:17-jdk-slim
WORKDIR /app
# 从构建阶段复制 JAR 文件
COPY --from=build /app/target/*.jar app.jar
# 暴露 8080 端口
EXPOSE 8080
# 启动应用的入口点 (Entrypoint)
ENTRYPOINT ["java","-jar","app.jar"]
```

**数据采集 (Python):**

```bash
# 进入数据采集目录
cd data_acquisition

# 创建并激活虚拟环境
python -m venv .venv
source .venv/bin/activate  # 在 Windows 上使用 `.venv\Scripts\activate`

# 安装依赖
pip install pandas requests python-dotenv
```

---

### 5. 容器化验证 (Containerization Verification)

**测试命令:**

```bash
# 在项目根目录启动所有服务并构建镜像
docker-compose up --build

# 在另一个终端中验证服务是否正常运行
# 检查后端健康状况 (Health Check)
curl http://localhost:8080/actuator/health

# 在浏览器中打开前端页面
open http://localhost:3000
```

---

### 6. CI/CD 基础管道 (Basic CI/CD Pipeline)

**文件位置**: `.github/workflows/build.yml`

```yaml
# .github/workflows/build.yml - 07.13, 23:29
name: Build and Test

on:
  push:
    branches: ["main"]
  pull_request:
    branches: ["main"]

jobs:
  build:
    runs-on: ubuntu-latest
    services:
      # 在工作流中启动一个 PostgreSQL 服务用于测试
      postgres:
        image: postgres:15
        env:
          POSTGRES_DB: testdb
          POSTGRES_USER: testuser
          POSTGRES_PASSWORD: testpass
        ports:
          - 5432:5432

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      # --- 后端构建 ---
      - name: Set up JDK 17
        uses: actions/setup-java@v4
        with:
          java-version: "17"
          distribution: "temurin"

      - name: Build backend with Maven
        working-directory: ./backend
        run: mvn -B package --file pom.xml -DskipTests

      # --- 前端构建 ---
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18

      - name: Install frontend dependencies
        working-directory: ./frontend
        run: npm install

      - name: Build frontend
        working-directory: ./frontend
        run: npm run build
```

---

### 7. 最终验证清单 (Final Verification Checklist)

**仓库结构检查:**

```bash
# 使用 tree 命令查看项目结构 (如果未安装，macOS 可使用 brew install tree)
tree -L 3
```

**本地环境测试:**

1.  运行 `docker-compose up --build`
2.  访问 `http://localhost:3000` (前端) 和 `http://localhost:8080/actuator/health` (后端)

**CI/CD 测试:**

1.  将代码推送到 GitHub 远程仓库
2.  在仓库的 `Actions` 标签页验证工作流是否成功执行

**Azure 连接测试:**

```bash
# 登录 Azure
az login

# 验证资源组是否存在
az group list --output table | grep DutchSalaryToday-RG
```

### 时间估算表 (Time Estimation)

| 任务 (Task)           | 估算时间 (Estimated Time) |
| :-------------------- | :------------------------ |
| GitHub 设置           | 15 分钟                   |
| Azure 配置            | 20 分钟                   |
| `docker-compose` 配置 | 30 分钟                   |
| 项目脚手架            | 45 分钟                   |
| CI/CD 配置            | 30 分钟                   |
| **总计 (Total)**      | **~2.5 小时**             |

这个 Sprint 0 计划完全遵循**基础设施即代码 (Infrastructure as Code, IaC)** 原则，所有配置都是声明式的，确保环境一致性。完成后，您将拥有一个完全容器化的开发环境和自动化构建管道，为 Sprint 1 的快速迭代奠定坚实基础。

---

## Sprint 1: 第一个故事上线 - “行业的冰与火之歌”

**目标**: **发布产品的 v0.1 版本**。端到端地完成第一个故事章节的开发，并将其部署到 Azure 云上，生成一个公开的 URL。

- **故事构思**:

  - **主题**: 行业薪资变迁：冰火两重天
  - **故事钩子**: "曾经并肩的行业，15 年后薪资差距达 3 倍——谁被时代抛下？"

- **本 Sprint 任务**:

  - **数据分析 (EDA)**: 在 Jupyter Notebook 中，验证并计算出故事所需的“增长冠军”、“衰退之王”、“差距倍数”三个**确切的 Big Numbers**。
  - **后端**: 设计并实现仅支撑此故事的数据库表和 API。集成 Spring Retry。
  - **前端**: 开发此故事在首页的 UI 展示及其对应的详情页图表。设置 Axios 超时。
  - **DevOps & Cloud**:
    - **CI/CD**: 编写 GitHub Actions 工作流，实现“代码提交 -> 自动构建 Docker 镜像 -> 推送到 Azure 容器仓库 -> 部署到 Azure App Service”的全自动流程。
    - **基础设施即代码 (IaC)**: 使用 Terraform 或 Bicep 脚本来定义和管理 Azure 资源（App Service, PostgreSQL, Key Vault, CDN）。
    - **安全**: 将数据库密码等敏感信息存入 Azure Key Vault，并配置应用从 Key Vault 动态读取。
    - **性能**: 为前端静态资源配置 Azure CDN。

- **交付物**: 一个公开可访问的 URL，展示包含第一个故事的网页。

---

## Sprint 2: 增量部署 - “崛起的职场女性力量”

**目标**: **发布产品的 v0.2 版本**。在现有基础上，增加第二个故事章节，并更新线上应用。

- **故事构思**:

  - **主题**: 崛起的职场女性力量
  - **故事钩子**: "荷兰职场变迁：女性就业占比突破 40%，她们正在哪些行业崛起？"

- **本 Sprint 任务**:

  - **数据分析 (EDA)**: 在 Jupyter Notebook 中，验证并计算出新故事所需的 Big Numbers。
  - **后端**: **演进式修改**。扩展数据库表结构（如增加`female_employees`字段），开发新的 API。可能会出现第一次重构的机会。
  - **前端**: 开发第二个故事章节的 UI 组件和详情页。
  - **DevOps & Cloud**: **复用并验证**。CI/CD 流水线将自动完成新版本的部署。

- **交付物**: 更新后的网站，现在包含两个可交互的故事章节。

---

## Sprint 3-5: 持续交付与重构

**目标**: **发布 v0.3, v0.4, v0.5 版本**。按照“垂直切片”模式，依次完成剩余三个故事的端到端开发与线上部署。

- **故事主题**: 隐形人力成本、工作模式革命、效率之谜。
- **本阶段核心**:

  - **功能开发**: 逐一完成每个故事的开发。
  - **演进式重构**: 当通用模式出现时（预计在 Sprint 3 或 4），我们将投入时间进行重构，提取通用的服务和 API，以偿还技术债并提升代码质量。
  - **性能优化**: 根据需要，开始引入缓存等策略（如 Sprint 4+引入 Redis）。

- **交付物**: 每个 Sprint 结束时，线上网站都会增加一个新的故事章节。

---

## Sprint 6: 终极功能与产品完善

**目标**: **发布产品的 v1.0 正式版**。

- **本 Sprint 任务**:

  - **“数据探索家”页面**: 基于前几个 Sprint 积累的对维度的理解，设计并开发一个功能强大的“数据探索”页面，并为其开发通用的后端 API。
  - **UI/UX 优化**: 美化整体界面，增加导航栏、页脚、加载动画和错误提示，提升用户体验。
  - **安全加固**: 引入 API 限流等高级安全策略。
  - **文档**: 撰写一份高质量的 `README.md`，作为项目的最终门面。

- **交付物**: 功能完整、体验优良、安全可靠的 v1.0 线上产品。
