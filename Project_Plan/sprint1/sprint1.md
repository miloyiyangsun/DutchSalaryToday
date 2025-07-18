# Sprint 1: 第一个故事上线 - “行业的冰与火之歌”

**目标**: **发布产品的 v0.1 版本**。端到端地完成第一个故事章节的开发，并将其部署到 Azure 云上，生成一个公开的 URL。

**故事构思**:

- **主题**: 行业薪资变迁：冰火两重天
- **故事钩子**: "曾经并肩的行业，15 年后薪资差距达 3 倍——谁被时代抛下？"

---

## Sprint 1 待办事项 (To-do List)

### 1. 数据分析 (Data Analysis) & “大数字”计算 (Big Numbers Calculation)

- [ ] **任务**: 在 Jupyter Notebook 中，验证并计算出故事所需的三个确切的“大数字”：“增长冠军 (Growth Champion)”、“衰退之王 (Recession King)”和“差距倍数 (Gap Multiplier)”。
- **负责人**: 
- **状态**: 未开始
- **可交付成果**: 一个包含清晰计算过程和最终三个数字的 Notebook 文件。

### 2. 后端开发 (Backend Development)

- [ ] **任务1：数据库模式设计 (Database Schema Design)**: 设计一个最小化的数据库表，仅用于存储此故事所需的数据。
- [ ] **任务2：API 实现 (API Implementation)**: 创建一个单一的 API 端点 (Endpoint)，用于返回故事所需的数据。
- [ ] **任务3：弹性集成 (Resilience Integration)**: 集成 `Spring Retry` (`@Retryable`) 来处理瞬时的数据库连接失败。
- [ ] **任务4：API 超时 (API Timeout)**: 实现数据库访问的超时逻辑。
- **负责人**: 
- **状态**: 未开始
- **可交付成果**: 一个可以工作的、集成了数据库和弹性模式的 Spring Boot 应用程序。

### 3. 前端开发 (Frontend Development)

- [ ] **任务1：主页组件 (Homepage Component)**: 在主页上创建第一个故事板块。
- [ ] **任务2：“大数字”可视化 (Big Numbers Visualization)**: 突出展示三个“大数字”。
- [ ] **任务3：详情页（占位符）(Detail Page (Placeholder))**: 创建一个从“大数字”链接到的占位符页面。
- [ ] **任务4：API 集成 (API Integration)**: 使用 `Axios` 从后端 API 获取数据，并实现 `Axios Timeout`。
- **负责人**: 
- **状态**: 未开始
- **可交付成果**: 一个能够动态加载并可视化故事数据的 React 组件。

### 4. 基础设施与部署 (Infrastructure & Deployment) (CI/CD)

- [ ] **任务1：用于 Azure 的 Bicep (Bicep for Azure)**: 编写 `infra.bicep` 文件来定义 Azure 资源（容器应用、数据库、容器注册表）。
- [ ] **任务2：GitHub Actions 工作流（部署）(GitHub Actions Workflow (Deploy))**: 创建一个新的工作流文件 (`infra.yml`)，该文件将：
    - [ ] 构建前端和后端 Docker 镜像。
    - [ ] 将 Docker 镜像推送到 Azure 容器注册表 (Azure Container Registry)。
    - [ ] 使用 Bicep 文件将应用程序部署到 Azure 容器应用 (Azure Container Apps)。
- [ ] **任务3：Azure Key Vault 集成 (Azure Key Vault Integration)**: 将数据库凭据和其他机密信息存储在 Azure Key Vault 中，并配置应用程序以在部署时安全地检索它们。
- [ ] **任务4：Azure CDN 集成 (Azure CDN Integration)**: 配置 Azure CDN 以提供静态前端资源，加速全球访问。
- **负责人**: 
- **状态**: 未开始
- **可交付成果**: 一个将应用程序从代码提交到公开 URL 的全自动 CI/CD 管道。

### 5. 最终验证 (Final Verification)

- [ ] **任务**: 在部署完成后，访问公开的 URL，端到端验证整个功能是否按预期工作。检查故事是否正确显示，数据是否准确，页面加载是否流畅。
- **负责人**: 
- **状态**: 未开始