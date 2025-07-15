我们现在就动手来配置它吧！这个过程也可以完全在 Azure 门户中完成。
行动计划：
为前端应用启用系统分配的托管身份 (Enable Managed Identity for Frontend):
进入 frontend-webapp-... 的 Azure 门户页面。
在左侧菜单选择 设置 (Settings) -> 标识 (Identity)。
在 系统分配 (System assigned) 选项卡下，将状态切换为 开 (On)，然后保存。
为后端应用配置身份验证 (Configure Authentication for Backend):
进入 backend-webapp-... 的 Azure 门户页面。
在左侧菜单选择 设置 (Settings) -> 身份验证 (Authentication)。
点击 添加标识提供者 (Add identity provider)。
标识提供者: 选择 Microsoft。
租户类型: 保持默认（当前租户）。
当请求未经验证时: 选择 HTTP 401 未授权 (HTTP 401 Unauthorized)。
点击 添加 (Add)。
修改前端代码以发送认证令牌 (Modify Frontend Code):
这是最后一步，我们需要在前端 React 应用中，当它要调用后端 API 时，先用 Azure 的身份库获取一个令牌，然后加到请求的 Authorization 头里。
这个过程需要一些代码层面的改动，但有现成的库（例如 @azure/identity）可以帮助我们。

“门口的保安”方案 (Microsoft Entra ID / Easy Auth) - 我们当前选择的方案
实现方式: 托管身份 (Managed Identity) + App Service 内置身份验证。
组件成本:
App Service Plan: 使用 Free F1 套餐（免费）。
托管身份 (Managed Identity) 功能: ✅ 完全免费。这是 Azure 平台的基础功能。
App Service 身份验证 (Easy Auth): ✅ 完全免费。这是 App Service 的一项内置增值功能，不额外收费。
Microsoft Entra ID: ✅ 完全免费。每个 Azure 订阅都包含一个免费版的 Microsoft Entra ID，它完全支持我们需要的所有应用认证功能。
结论: 因为我们现在采用方案 B，所以你之前担心的专用终结点 (Private Endpoint)和专用 DNS 区域 (Private DNS Zone)的费用完全不会产生，因为我们根本就不会创建这两个资源。整个安全认证链路的核心组件都是免费的。
