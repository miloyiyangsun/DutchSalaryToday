# Sprint 0: Azure 云与 GitHub Actions OIDC 配置权威指南 (2025 版)

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

- **Application (client) ID (应用程序/客户端 ID):** `da2371b3-6fa7-49f1-8d87-d910d030df97`
- **Object ID (对象 ID):** `cae7a710-ce1b-483a-b9ee-098538634b1e` (这个 ID 代表服务主体的唯一标识)
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
