# GitHub Copilot Enterprise 关联 Azure 订阅指南

本文档解答：如何在已创建好 GitHub Copilot Enterprise 组织后，将其关联到 Azure 订阅以完成计费配置。

---

## 背景

您已完成：
- ✅ 创建了新的 GitHub Enterprise 组织
- ✅ 旧的 Copilot Personal 订阅已被自动取消

下一步：将 GitHub Copilot Enterprise 的账单关联到您的 Azure 订阅。

---

## 操作步骤

### 第一步：确认前提条件

1. 您需要是 GitHub Enterprise 的 **Owner（所有者）**。
2. 您的 Azure 订阅需具备 **Owner** 或 **Contributor** 权限。
3. 您的 Azure 账号与 GitHub 账号使用相同的邮箱地址（或已在 Azure 中授权连接 GitHub）。

---

### 第二步：在 GitHub 中启用 Azure 计费关联

1. 登录 [GitHub.com](https://github.com)，点击右上角头像，选择 **Your enterprises**。
2. 选择您新创建的 Enterprise 组织。
3. 在左侧导航栏中，点击 **Settings（设置）**。
4. 在 Settings 中，找到 **Billing and plans（账单与套餐）** → **Payment information（支付信息）**。
5. 点击 **Add Azure Subscription（添加 Azure 订阅）**。

---

### 第三步：在 Azure 中完成授权

1. 系统会跳转到 Azure 门户进行身份验证。
2. 登录您的 Azure 账号（与 GitHub 账号关联的账号）。
3. 在 Azure 中，选择要用于 GitHub 计费的 **订阅（Subscription）**。
4. 确认授权后，系统会将 GitHub Copilot Enterprise 的账单与该 Azure 订阅绑定。

---

### 第四步：确认绑定成功

1. 返回 GitHub Enterprise 的 **Billing and plans** 页面。
2. 确认页面中显示已关联的 Azure 订阅 ID。
3. GitHub Copilot Enterprise 的后续费用将通过 Azure 订阅进行计费。

---

### 第五步：为成员启用 Copilot Enterprise

1. 回到 GitHub Enterprise Settings。
2. 导航至 **Copilot** → **Policies（策略）**。
3. 启用 Copilot，并根据需要为组织成员分配许可。

---

## 注意事项

| 注意点 | 说明 |
|--------|------|
| Azure 订阅状态 | 确保 Azure 订阅处于**活跃（Active）**状态，且未到期。 |
| 账号匹配 | GitHub 账号和 Azure 账号需可以相互验证（通常需要相同的企业 AAD/Entra ID）。 |
| 旧订阅残留 | 旧的 Personal 订阅取消后，账单会在当前计费周期结算完毕后完全停止。 |
| 多订阅场景 | 如有多个 Azure 订阅，请确保选择正确的一个用于 GitHub 计费。 |

---

## 参考链接

- [GitHub Docs: Connecting an Azure subscription to your enterprise](https://docs.github.com/en/billing/managing-the-plan-for-your-github-account/connecting-an-azure-subscription)
- [GitHub Docs: About Copilot Enterprise](https://docs.github.com/en/copilot/copilot-enterprise/overview/about-github-copilot-enterprise)
- [Azure Portal](https://portal.azure.com)

---

如遇到问题，可联系 [GitHub Support](https://support.github.com) 提交工单，说明您正在将 Copilot Enterprise 关联至 Azure 订阅。
