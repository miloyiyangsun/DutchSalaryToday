# 项目计划：荷兰薪酬洞察 (Dutch Salary Insights)

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

**创建仓库 (Create Repository)：**

1.  登录 GitHub → "New repository" → 名称 `DutchSalaryToday`
2.  描述 (Description)：“荷兰薪酬数据可视化项目”
3.  选择 `Public`
4.  勾选 "Add a README file"

**配置分支保护 (Branch Protection)：**

在仓库设置中 (`Settings` > `Branches` > `Branch protection rules`):

- 保护分支 (Branch to protect)：`main`
- 勾选：`Require pull request reviews before merging` (合并前需要拉取请求审查)
- 勾选：`Require status checks to pass before merging` (合并前需要状态检查通过)
- 添加状态检查 (Add status checks)：`build-frontend`, `build-backend`

**初始化仓库结构 (Initialize Repository Structure)：**

```bash
# 克隆 (clone) 仓库到本地
git clone https://github.com/miloyiyangsun/DutchSalaryToday.git
cd DutchSalaryToday

# 创建核心目录和文件
mkdir -p .github/workflows frontend backend data_acquisition/raw_data
touch .gitignore docker-compose.yml
```

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

**创建资源组 (Resource Group):**

```bash
# 使用 Azure 命令行工具 (Command-Line Interface)
az group create --name DutchSalaryToday-RG --location westeurope
```

**创建服务主体 (Service Principal):**

```bash
# 为 GitHub Actions 创建一个有贡献者 (contributor) 权限的服务主体
az ad sp create-for-rbac \
  --name DutchSalaryToday-SP \
  --role contributor \
  --scopes /subscriptions/<subscription-id>/resourceGroups/DutchSalaryToday-RG \
  --sdk-auth
```

**重要提示**: 请务必保存命令输出的完整 JSON 凭证，后续步骤需要用到。

**配置 GitHub Secrets:**

在 GitHub 仓库的 `Settings` > `Secrets and variables` > `Actions` 中添加以下 `secrets`:

- `AZURE_CREDENTIALS`: 粘贴上一步输出的完整 JSON 凭证。
- `AZURE_RESOURCE_GROUP`: `DutchSalaryToday-RG`
- `AZURE_REGION`: `westeurope`

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
