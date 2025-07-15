# Azure 应用服务认证配置计划

我们现在就动手来配置它吧！这个过程也可以完全在 Azure 门户 (Azure Portal) 中完成。

---

## 行动计划 (Action Plan)

### 1. 为前端应用启用系统分配的托管身份 (Enable Managed Identity for Frontend)

- **位置 (Location):** Azure 门户 (Azure Portal) -> `frontend-webapp-...`
- **步骤 (Steps):**
  1. 在左侧菜单选择 **设置 (Settings)** -> **标识 (Identity)**。
  2. 在 **系统分配 (System assigned)** 选项卡下，将状态切换为 **开 (On)**。
  3. 保存更改。

### 2. 为后端应用配置身份验证 (Configure Authentication for Backend)

- **位置 (Location):** Azure 门户 (Azure Portal) -> `backend-webapp-...`
- **步骤 (Steps):**
  1. 在左侧菜单选择 **设置 (Settings)** -> **身份验证 (Authentication)**。
  2. 点击 **添加标识提供者 (Add identity provider)**。
  3. **标识提供者 (Identity provider):** 选择 **Microsoft**。
  4. **租户类型 (Tenant type):** 保持默认（当前租户）。
  5. **当请求未经验证时 (When request is not authenticated):** 选择 **HTTP 401 未授权 (HTTP 401 Unauthorized)**。
  6. 点击 **添加 (Add)**。

### 3. 修改前端代码以发送认证令牌 (Modify Frontend Code)

这是最后一步，我们需要在前端 React 应用中，当它要调用后端 API 时，先用 Azure 的身份库获取一个令牌，然后加到请求的 `Authorization` 头里。

这个过程需要一些代码层面的改动，但有现成的库（例如 `@azure/identity`）可以帮助我们。

---

## 方案分析：“门口的保安” (Microsoft Entra ID / Easy Auth)

这是我们当前选择的方案。

- **实现方式 (Implementation):**

  - 托管身份 (Managed Identity)
  - App Service 内置身份验证 (App Service built-in Authentication)

- **组件成本 (Component Costs):**

  - **App Service Plan:** 使用 Free F1 套餐 (**免费**)。
  - **托管身份 (Managed Identity) 功能:** ✅ **完全免费**。这是 Azure 平台的基础功能。
  - **App Service 身份验证 (Easy Auth):** ✅ **完全免费**。这是 App Service 的一项内置增值功能，不额外收费。
  - **Microsoft Entra ID:** ✅ **完全免费**。每个 Azure 订阅都包含一个免费版的 Microsoft Entra ID，它完全支持我们需要的所有应用认证功能。

- **结论 (Conclusion):**
  因为我们现在采用方案 B，所以之前担心的 **专用终结点 (Private Endpoint)** 和 **专用 DNS 区域 (Private DNS Zone)** 的费用完全不会产生，因为我们根本就不会创建这两个资源。整个安全认证链路的核心组件都是免费的。

最后，每个冲刺开始前要规划，结束后要重新检查现在所有服务的详细信息，是否符合 12 个月免费。
