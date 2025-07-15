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

我们的目标不是构建一个传统、复杂、让用户感到压力的数据仪表盘 (Dashboard)。我们相反，我们要成为一个**数据故事的讲述者 (Data Storyteller)**。我们将通过引人入胜的视觉和叙事，将枯燥的数据转化为普通人也能理解、关心并能从中获得启发的深度洞察。

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

**状态：已完成 (Completed)**

Sprint 0 的核心目标是搭建一个健壮、自动化、可重复的开发与部署环境。我们成功地完成了所有预定任务，为后续的快速功能迭代奠定了坚实的基础。所有配置均遵循了“基础设施即代码” (Infrastructure as Code, IaC) 的原则。

### 1. 版本控制：GitHub 仓库设置

**状态：已完成**

- **成果**: 成功初始化 `DutchSalaryToday` 公开仓库，并建立了包含 `.github/workflows`, `frontend`, `backend`, `data_acquisition` 的标准项目结构。

### 2. 云资源：Azure 配置

**状态：已完成 (理论验证)**

- **成果**: 详细规划了基于 **Bicep** 的基础设施即代码 (IaC) 方案，并设计了使用 **OpenID Connect (OIDC)** 连接 GitHub Actions 与 Azure 的安全认证流程，为未来的云部署做好了充分的理论和方案准备。

### 3. 本地环境：docker-compose 配置

**状态：已完成**

- **成果**: 最终的 `docker-compose.yml` 文件成功编排了三个核心服务 (`db`, `backend`, `frontend`)，实现了一键式本地开发环境。
- **关键技术**:
  - **数据库 (`db`)**: 使用 `postgres:15` 镜像，并通过 Docker 卷 (volume) `postgres_data` 实现了数据持久化。
  - **后端 (`backend`)**: 依赖 `db` 服务，并通过环境变量 (`DB_URL`, `DB_USER`, `DB_PASSWORD`) 注入数据库连接信息。
  - **前端 (`frontend`)**: 将主机的 `3000` 端口映射到 Nginx 容器的 `80` 端口。

### 4. 项目脚手架 (Project Scaffolding)

**状态：已完成**

- **成果**: 前后端项目均已成功初始化并完成容器化。
- **前端**:
  - **技术栈**: React + TypeScript，使用 Vite 作为构建工具。
  - **Dockerfile**: 采用多阶段构建，构建环境为 `node:20-alpine`，生产环境为 `nginx:stable-alpine`。解决了 Vite 7 与 Node.js 18 的兼容性问题。
- **后端**:
  - **技术栈**: Spring Boot 3.5.3, Java 17, Maven。
  - **依赖**: 集成了 `Spring Data JPA` 用于数据持久化和 `PostgreSQL Driver`。
  - **Dockerfile**: 采用多阶段构建，构建环境为 `maven:3.9.10-eclipse-temurin-17`，生产环境为 `openjdk:17-jdk-slim`。解决了 `spring-boot:repackage` 的构建生命周期问题。

### 5. 容器化验证 (Containerization Verification)

**状态：已完成**

- **成果**: 通过 `docker-compose up --build` 命令，所有服务均能成功构建并启动。
- **验证**:
  - 后端应用成功连接到 `db` 服务，并通过 `spring.jpa.hibernate.ddl-auto=update` 自动管理数据库。
  - 前端应用在 `http://localhost:3000` 正常访问。
  - 后端健康检查端点 `http://localhost:8080/actuator/health` 正常响应。

### 6. CI/CD 基础管道 (Basic CI/CD Pipeline)

**状态：已完成**

- **成果**: 在 `.github/workflows/build.yml` 中建立了一个有效的持续集成管道。
- **关键配置**:
  - **后端**: 使用 **Java 17 (Temurin)** 环境，通过 `mvn -B compile` 验证代码可编译性。
  - **前端**: 使用 **Node.js 20** 环境，通过 `npm install && npm run build` 验证项目可构建性。

### 7. 最终验证清单 (Final Verification Checklist)

**状态：已完成**

- **仓库结构**: 项目结构清晰，符合规划。
- **本地环境**: `docker-compose` 环境稳定可靠。
- **CI/CD**: GitHub Actions 工作流按预期成功执行。

### 时间估算表 (Time Estimation)

| 任务 (Task)           | 估算时间 (Estimated Time)    |
| :-------------------- | :--------------------------- |
| GitHub 设置           | 30 分钟                      |
| Azure 配置            | 180 分钟                     |
| `docker-compose` 配置 | 60 分钟                      |
| 项目脚手架            | 60 分钟                      |
| CI/CD 配置            | 60 分钟                      |
| **总计 (Total)**      | **~ 6.5 小时** （已完成 ✅） |

这个 Sprint 0 计划完全遵循**基础设施即代码 (Infrastructure as Code, IaC)** 原则，所有配置都是声明式的，确保环境一致性。完成后，您将拥有一个完全容器化的开发环境和自动化构建管道，为 Sprint 1 的快速迭代奠定坚实基础！

---

## Sprint 1: 第一个故事上线 - “行业的冰与火之歌”

**目标**: **发布产品的 v0.1 版本**。端到端地完成第一个故事章节的开发，并将其部署到 Azure 云上，生成一个公开的 URL！

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
