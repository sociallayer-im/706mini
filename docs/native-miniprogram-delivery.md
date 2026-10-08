# 微信原生工程交付与联调入口

2026-10-08 · SID-95。工程已实现并部署服务端，尚未完成真实微信账号端到端验收。`dist/` 是保留的网页原型，HTTP 200 不代表原生小程序验收。

## 导入与运行

1. 微信开发者工具 → 导入项目，选择仓库根目录（本机 `/Users/shing/Projects/706mini`）。`project.config.json` 的 `miniprogramRoot` 指向 `miniprogram/`。
2. 填入运营方实际微信小程序 AppID。目前工程为 `touristappid`，这不是生产 AppID；微信登录、支付、真实小程序码不能用游客配置验证。将本地身份配置保存在被忽略的 `project.private.config.json`，不要写入密钥。
3. 微信后台配置 `montana.wamo.city` 为 HTTPS request/download/upload 合法域名，WebSocket 使用 `wss://montana.wamo.city/runtime/session`。存储签名上传/公开下载如返回其他域名，须将实际域名一并登记。
4. 使用实际账号登录，完成个人资料与隐私同意。验证码登录取决于 Montana 已配置的邮件/短信提供商；微信登录取决于服务端微信凭据。工程不会创建演示账号或让第一个登录者成为管理员。
5. 后端按真实账号 ID 完成平台负责人、组织/空间及 Owner 配置后，再走发布、审核、报名。当前业务数据为空是正常初始状态。

`miniprogram/config.js` 仅含公开服务地址及 Montana 应用 ID。网络适配位于 `lib/montana.js`，使用 `wx.request` / `wx.connectSocket`，未引入浏览器 DOM、localStorage 或浏览器 SDK。登录后通过鉴权 WebSocket 调用 `community:read` / `community:write` 与 action；直接数据表读写被服务端拒绝。

## 页面与动作映射

现有 `dist/app.js` 的 33 个业务路由均保留为原生路由，另补 6 个独立业务页面，共 39 个。每条路由都有 `pages/<route>/index.js/.json/.wxml`；共享 `lib/page.js` 和 `templates/screen.wxml`。下表表示实现入口，不表示每项已经真机验收。

| 路由 | 界面与动作 | 服务接口/状态 |
|---|---|---|
| feed | 同城成员、推荐、获同意的报名动态、关注、搜索、发布 | feed / people / follow；share_activity 默认不公开 |
| discover | 搜索、专题、日期/地点/标签/免费/名额筛选 | calendar / campaigns / search；筛选 AND，全局搜索跨城同城优先 |
| messages | 管理/活动/互动分类、单条与全部已读 | notifications / read；UNREAD → READ |
| me | 资料、关注/粉丝、待审提醒、报名/草稿/发布与管理入口 | me / managed / reviews |
| event | 详情、推荐、评论、报名、分享、复用、取消、审核与名单入口 | event / recommend / comment / register / clone / cancelEvent |
| member | 公开资料、活动、关注、屏蔽、举报 | member / follow / mute / report |
| space | 空间介绍、活动、成员、管理 | entity / follow |
| org | 组织介绍、活动、成员、管理 | entity / follow |
| entity-events | 组织或空间活动 | entity.items |
| entity-members | 公开成员列表 | entity.members，仅公开资料 |
| edit-entity | 名称/介绍/图片/地址/开放时间/公开联系信息 | entity 写入，实时角色授权及 version |
| admins | 管理员列表、邀请、撤权 | admins / invite / revokeRole；撤销同时清理待接受邀请 |
| edit-profile | 资料与头像、私密微信号、报名动态开关 | profile；联系方式加密保存 |
| relations | 关注/粉丝列表及跳转 | relations，mode=followers/following |
| onboarding | 三步资料、兴趣、关注空间、隐私确认 | profile；本机草稿和步骤恢复 |
| calendar | 周/月视图、点日进入周、计数、筛选、海报预览保存 | calendar / calendarCode / calendarShare |
| spaces | 同城空间列表 | entities，kind=SPACE |
| campaign | 专题资料、关联活动、审核进度 | campaign |
| campaign-edit | 编辑专题草稿并提交 | draft / saveCampaign / submitCampaign |
| campaign-create | 三步专题、关联活动、资源链接 | saveCampaign / submitCampaign |
| campaign-approval-detail | 专题审核与退回理由 | review / review mutation |
| campaign-review-progress | 专题审核轮次、节点、意见 | progress |
| event-access | 报名状态、支付、参与方式、取消 | registration / payment / access / cancelRegistration |
| activity-preview | 作者/授权管理员草稿预览 | draft；私有图片鉴权预览 |
| publish | 三步活动、费用/审核/候补、私密参与方式 | saveEvent / submitEvent |
| approvals | 当前角色有权处理的审核项 | reviews |
| approval-detail | 活动审核详情、通过/退回 | review / review mutation |
| approval-progress | 历次审核及当前进度 | progress |
| registrations | 我的报名及状态 | mine，kind=registration |
| my-events | 我的活动、编辑、预览及进度 | mine，kind=event |
| drafts | 草稿、继续编辑、预览 | mine，status=DRAFT |
| following | 关注列表 | relations |
| more | 城市、语言、通知偏好、资料可见性、动态公开开关、隐私/反馈/退出 | profile / signout |
| login（新增） | 手机/邮箱验证码、微信登录 | runtime auth / wechatLogin |
| attendees（新增） | 授权发起者查看报名和审核 | attendees / registrationDecision |
| invitations（新增） | 管理员邀请接受 | invitations / acceptInvite |
| my-campaigns（新增） | 我的专题、编辑及进度 | mine，kind=campaign |
| privacy（新增） | 数据用途与隐私说明 | 本地双语说明；运营方身份/联系信息待补 |
| feedback（新增） | 填写举报/反馈 | report |

所有页面共享加载、错误、重试和登录提示；列表支持接口游标，写入有防重复点击和服务端幂等键。表单按账号和路由分开保存本机草稿，提交成功清理。城市/组织/空间/参与方式显示名称，内部 ID 仅用于传参。

## 业务与权限边界

- 活动 `DRAFT → IN_REVIEW → PUBLISHED`；退回进入 `CHANGES_REQUESTED`，再次提交另建审核轮次；平台、组织和空间审核齐备后发布。
- 专题关联活动逐项征得发起者批准；被拒活动从该轮移除，空专题不可发布。
- 报名区分 `REQUESTED / WAITLISTED / APPROVED_AWAITING_PAYMENT / CONFIRMED / REJECTED / CANCELLED / EXPIRED`。候补提升保留原审核要求。人数由服务端确认报名与付款占位计算。
- 付款以微信服务器验签回调或验签查询为准；客户端支付成功回调不会直接确认报名。已创建的外部支付订单关闭前保留占位，取消需等订单关闭。付费报名退款和付费活动取消的产品规则尚未决定，因此显式返回待处理状态，不自动退款。
- 群二维码以加密私密引用保存，不能使用公开图片端点。参与方式每次读取重新检查当前报名/角色；私有预览 URL 有效期 5 分钟，取图时再检查权限，并禁止缓存。已下载或截图的内容无法收回。
- 公开图片仅在被公开活动/专题、有效实体或公开资料引用时可访问。草稿作者与当前有权管理者使用独立鉴权预览；客户端持久保存稳定引用，不保存短时签名地址。
- 全局搜索按开发手册 5.1 保留其他城市明确命中，同城优先；普通发现/日历的城市、日期、地点、标签、免费和名额条件保持 AND。

## 视觉依据与主题

选型为用户确认的 Sola Figma。主色与画布、文字、边线、圆角集中在 `miniprogram/lib/theme.js`，布局在 `app.wxss`；后续换色只需调整主题。

已读取主页面与 Component 页面，参考白卡、灰底、参与者胶囊、右侧海报与 light/dark 组件结构。主页面画布 `#F3F3F3` 来自源属性；薄荷色 `#A4EFCC` 为已渲染主页面截图采样值，尚未核实为 Figma 命名变量。未声称完整提取所有设计 token 或逐像素一致。私有设计截图留在私有后端证据目录，不放公开仓库。

## 验证与外部配置

2026-10-08 完成原生 WXML 40 文件、WXSS、48 JS 语法、JSON 与 39 路由文件检查；微信开发者工具内置 `wcc/wcsc` 编译通过。服务端 TypeScript 无输出检查与 esbuild 构建通过。未新增/运行测试，未创建测试用户、活动或订单。

Montana 部署 v4（21 个 community 函数），匿名 WebSocket 初始化及公开读取已验证。鉴权业务写入、真实媒体上传、微信支付、扫码、真机性能和完整双语视觉检查仍需真实账号联调；不能用编译通过替代这些结果。

待提供/配置：真实微信 AppID/AppSecret、合法域名、微信支付商户及签名/验签/APIv3配置、真实平台负责人和组织空间 Owner 账号 ID、真实组织/空间资料、正式隐私政策运营主体与联系信息、退款产品规则。账号与凭据通过私有受限配置交接，不发到公开 issue 或客户端源码。

当前实现使用通用服务表及串行写锁保证状态一致性，列表先在服务端过滤后分页；上线流量增大前需观察查询量与锁等待，再优化索引/查询。通知偏好已保存，未接入微信订阅消息推送；展示的是站内通知。
