# 原生前端数据需求清单

2026-10-10 · SID-123（父 SID-95）· 40 个实际注册路由 · 147 项原子需求。

状态：讨论稿，仅源代码与已有文档盘点。没有运行测试、编译、GUI、截图或真实接口；当前真实运行、部署和用户验收均不能由本清单确认。

基线：`35fa1eb0ac81bbc06092fa185ba181caa48d533a`。详细机器可读字段、请求参数、预期返回、实体关系、权限、状态、错误和行号证据见 [frontend-inventory.json](frontend-inventory.json)。

## 结构与需要讨论的缺口

- 40 条注册路由逐项检查，包含 onboarding、campaign-create、campaign-approval-detail、campaign-review-progress、所有管理页以及 review-lab，不受原 63 状态约束。
- 所有路由共享 screen.wxml 和 sheets.wxml；eventCard 为模板，无独立自定义组件目录。JSON附录记录模板事件绑定、弹框种类及界面错误字典。
- 默认 Mock；真实 adapter 使用鉴权 WebSocket 函数请求，验证码使用 HTTP。现有socket仅处理请求回包，没有业务订阅分发。
- 表单逐字段单列，区分本机草稿、服务器保存、提交审核及媒体签名上传；预期字段是前端需求，不是后端已返回证明。
- 重点缺口：草稿media数组/嵌套群码预览、已编辑空间与featured归属回读、日历/实体集合分页、专题完成审核列表、实时刷新、微信订阅、退款与正式隐私配置。未决能力不作为已批准新增开发。

## 路由索引

| 路由 | 页面来源 | 需求ID |
| --- | --- | --- |
| feed | miniprogram/app.json:3 | FE-R-config, FE-R-feed, FE-R-people, FE-R-search, FE-W-follow, FE-W-profile-city, FE-T-mode, FE-T-init, FE-T-call, FE-T-close, FE-T-realtime, FE-L-prefs, FE-L-idempotency, FE-L-pagination, FE-L-nav, FE-L-errors, FE-L-sheet |
| discover | miniprogram/app.json:4 | FE-R-config, FE-R-calendar, FE-R-campaigns, FE-R-entities, FE-R-search, FE-W-profile-city, FE-T-mode, FE-T-init, FE-T-call, FE-T-close, FE-T-realtime, FE-L-prefs, FE-L-idempotency, FE-L-pagination, FE-L-filters, FE-L-nav, FE-L-errors, FE-L-sheet |
| messages | miniprogram/app.json:5 | FE-R-config, FE-R-notifications, FE-W-read-notification, FE-T-mode, FE-T-init, FE-T-call, FE-T-close, FE-T-realtime, FE-L-prefs, FE-L-idempotency, FE-L-pagination, FE-L-nav, FE-L-errors, FE-L-sheet, FE-G-subscription |
| me | miniprogram/app.json:6 | FE-R-config, FE-R-me, FE-R-managed, FE-R-mine, FE-R-reviews, FE-T-mode, FE-T-init, FE-T-call, FE-T-close, FE-T-realtime, FE-A-route, FE-L-prefs, FE-L-idempotency, FE-L-pagination, FE-L-nav, FE-L-errors, FE-L-sheet |
| event | miniprogram/app.json:7 | FE-R-config, FE-R-event, FE-R-me, FE-W-recommend, FE-W-withdraw-recommendation, FE-W-comment, FE-W-delete-comment, FE-W-register, FE-W-report, FE-W-cancel-event, FE-T-mode, FE-T-init, FE-T-call, FE-T-close, FE-T-realtime, FE-M-links, FE-L-prefs, FE-L-idempotency, FE-L-pagination, FE-L-nav, FE-L-share, FE-L-errors, FE-L-sheet, FE-G-refund |
| member | miniprogram/app.json:8 | FE-R-config, FE-R-member, FE-W-follow, FE-W-mute, FE-W-report, FE-T-mode, FE-T-init, FE-T-call, FE-T-close, FE-T-realtime, FE-M-links, FE-L-prefs, FE-L-idempotency, FE-L-pagination, FE-L-nav, FE-L-share, FE-L-errors, FE-L-sheet, FE-G-featured-update, FE-G-relations-membership |
| space | miniprogram/app.json:9 | FE-R-config, FE-R-entity, FE-W-follow, FE-T-mode, FE-T-init, FE-T-call, FE-T-close, FE-T-realtime, FE-L-prefs, FE-L-idempotency, FE-L-pagination, FE-L-nav, FE-L-share, FE-L-errors, FE-L-sheet |
| org | miniprogram/app.json:10 | FE-R-config, FE-R-entity, FE-W-follow, FE-T-mode, FE-T-init, FE-T-call, FE-T-close, FE-T-realtime, FE-L-prefs, FE-L-idempotency, FE-L-pagination, FE-L-nav, FE-L-share, FE-L-errors, FE-L-sheet |
| entity-events | miniprogram/app.json:11 | FE-R-entity, FE-T-mode, FE-T-init, FE-T-call, FE-T-close, FE-T-realtime, FE-L-prefs, FE-L-idempotency, FE-L-pagination, FE-L-nav, FE-L-errors, FE-L-sheet, FE-G-entity-pagination |
| entity-members | miniprogram/app.json:12 | FE-R-entity, FE-T-mode, FE-T-init, FE-T-call, FE-T-close, FE-T-realtime, FE-L-prefs, FE-L-idempotency, FE-L-pagination, FE-L-nav, FE-L-errors, FE-L-sheet, FE-G-entity-pagination |
| edit-entity | miniprogram/app.json:13 | FE-R-entities, FE-R-entity, FE-R-managed, FE-W-save-entity, FE-F-entity-cover_url, FE-F-entity-name, FE-F-entity-city, FE-F-entity-opening_hours, FE-F-entity-address, FE-F-entity-introduction, FE-F-entity-public_contact, FE-F-entity-allow_event_requests, FE-T-mode, FE-T-init, FE-T-call, FE-T-close, FE-T-realtime, FE-M-select, FE-M-permit, FE-M-put, FE-M-finish, FE-M-preview, FE-M-local, FE-L-draft, FE-L-prefs, FE-L-idempotency, FE-L-pagination, FE-L-nav, FE-L-errors, FE-L-sheet |
| admins | miniprogram/app.json:14 | FE-R-admins, FE-W-invite, FE-W-revoke-role, FE-T-mode, FE-T-init, FE-T-call, FE-T-close, FE-T-realtime, FE-L-prefs, FE-L-idempotency, FE-L-pagination, FE-L-nav, FE-L-errors, FE-L-sheet |
| edit-profile | miniprogram/app.json:15 | FE-R-entities, FE-R-me, FE-R-managed, FE-R-self-contact, FE-W-save-profile, FE-F-profile-avatar_url, FE-F-profile-display_name, FE-F-profile-wechat, FE-F-profile-city, FE-F-profile-bio, FE-F-profile-interests, FE-F-profile-introduction, FE-F-profile-work_links, FE-F-profile-social_links, FE-F-profile-frequent_spaces, FE-T-mode, FE-T-init, FE-T-call, FE-T-close, FE-T-realtime, FE-M-select, FE-M-permit, FE-M-put, FE-M-finish, FE-M-preview, FE-M-local, FE-L-draft, FE-L-prefs, FE-L-idempotency, FE-L-pagination, FE-L-nav, FE-L-errors, FE-L-sheet, FE-G-featured-update, FE-G-interest-config |
| relations | miniprogram/app.json:16 | FE-R-relations, FE-W-follow, FE-T-mode, FE-T-init, FE-T-call, FE-T-close, FE-T-realtime, FE-L-prefs, FE-L-idempotency, FE-L-pagination, FE-L-nav, FE-L-errors, FE-L-sheet |
| onboarding | miniprogram/app.json:17 | FE-R-entities, FE-R-me, FE-R-managed, FE-R-self-contact, FE-W-save-profile, FE-F-profile-avatar_url, FE-F-profile-display_name, FE-F-profile-wechat, FE-F-profile-city, FE-F-profile-bio, FE-F-profile-interests, FE-F-profile-introduction, FE-F-profile-work_links, FE-F-profile-social_links, FE-F-profile-frequent_spaces, FE-T-mode, FE-T-init, FE-T-call, FE-T-close, FE-T-realtime, FE-A-route, FE-M-select, FE-M-permit, FE-M-put, FE-M-finish, FE-M-local, FE-L-draft, FE-L-prefs, FE-L-idempotency, FE-L-pagination, FE-L-nav, FE-L-errors, FE-L-sheet, FE-G-privacy-subject, FE-G-interest-config |
| calendar | miniprogram/app.json:18 | FE-R-config, FE-R-calendar, FE-R-entities, FE-R-calendar-share, FE-W-profile-city, FE-T-mode, FE-T-init, FE-T-call, FE-T-close, FE-T-realtime, FE-C-code, FE-C-render, FE-C-save, FE-L-prefs, FE-L-idempotency, FE-L-pagination, FE-L-filters, FE-L-nav, FE-L-errors, FE-L-sheet |
| spaces | miniprogram/app.json:19 | FE-R-entities, FE-T-mode, FE-T-init, FE-T-call, FE-T-close, FE-T-realtime, FE-L-prefs, FE-L-idempotency, FE-L-pagination, FE-L-filters, FE-L-nav, FE-L-errors, FE-L-sheet |
| campaign | miniprogram/app.json:20 | FE-R-campaign, FE-T-mode, FE-T-init, FE-T-call, FE-T-close, FE-T-realtime, FE-M-links, FE-L-prefs, FE-L-idempotency, FE-L-pagination, FE-L-nav, FE-L-share, FE-L-errors, FE-L-sheet |
| campaign-edit | miniprogram/app.json:21 | FE-R-entities, FE-R-managed, FE-R-mine, FE-R-draft, FE-R-event-options, FE-W-save-campaign, FE-W-submit-campaign, FE-F-campaign-title, FE-F-campaign-kicker, FE-F-campaign-media, FE-F-campaign-introduction, FE-F-campaign-organization_id, FE-F-campaign-event_ids, FE-F-campaign-resource_links, FE-T-mode, FE-T-init, FE-T-call, FE-T-close, FE-T-realtime, FE-M-select, FE-M-permit, FE-M-put, FE-M-finish, FE-M-preview, FE-M-preview-arrays, FE-M-local, FE-L-draft, FE-L-prefs, FE-L-idempotency, FE-L-pagination, FE-L-nav, FE-L-errors, FE-L-sheet |
| campaign-create | miniprogram/app.json:22 | FE-R-config, FE-R-entities, FE-R-managed, FE-R-mine, FE-R-event-options, FE-W-save-campaign, FE-W-submit-campaign, FE-F-campaign-title, FE-F-campaign-kicker, FE-F-campaign-media, FE-F-campaign-introduction, FE-F-campaign-organization_id, FE-F-campaign-event_ids, FE-F-campaign-resource_links, FE-T-mode, FE-T-init, FE-T-call, FE-T-close, FE-T-realtime, FE-M-select, FE-M-permit, FE-M-put, FE-M-finish, FE-M-preview-arrays, FE-M-local, FE-L-draft, FE-L-prefs, FE-L-idempotency, FE-L-pagination, FE-L-nav, FE-L-errors, FE-L-sheet |
| campaign-approval-detail | miniprogram/app.json:23 | FE-R-review, FE-W-review-approve, FE-W-review-return, FE-T-mode, FE-T-init, FE-T-call, FE-T-close, FE-T-realtime, FE-L-prefs, FE-L-idempotency, FE-L-pagination, FE-L-nav, FE-L-errors, FE-L-sheet |
| campaign-review-progress | miniprogram/app.json:24 | FE-R-progress, FE-T-mode, FE-T-init, FE-T-call, FE-T-close, FE-T-realtime, FE-L-prefs, FE-L-idempotency, FE-L-pagination, FE-L-nav, FE-L-errors, FE-L-sheet |
| event-access | miniprogram/app.json:25 | FE-R-registration, FE-W-cancel-registration, FE-W-private-access, FE-T-mode, FE-T-init, FE-T-call, FE-T-close, FE-T-realtime, FE-M-preview, FE-P-payment, FE-P-reconcile, FE-L-prefs, FE-L-idempotency, FE-L-pagination, FE-L-nav, FE-L-errors, FE-L-sheet, FE-G-refund |
| activity-preview | miniprogram/app.json:26 | FE-R-draft, FE-T-mode, FE-T-init, FE-T-call, FE-T-close, FE-T-realtime, FE-M-preview, FE-L-prefs, FE-L-idempotency, FE-L-pagination, FE-L-nav, FE-L-errors, FE-L-sheet |
| publish | miniprogram/app.json:27 | FE-R-config, FE-R-entities, FE-R-managed, FE-R-draft, FE-W-save-event, FE-W-submit-event, FE-F-event-title, FE-F-event-summary, FE-F-event-media, FE-F-event-starts_at, FE-F-event-ends_at, FE-F-event-city, FE-F-event-space_id, FE-F-event-venue_name, FE-F-event-address, FE-F-event-organization_id, FE-F-event-capacity, FE-F-event-paid, FE-F-event-price_minor, FE-F-event-approval_required, FE-F-event-join_methods, FE-F-event-description, FE-T-mode, FE-T-init, FE-T-call, FE-T-close, FE-T-realtime, FE-M-select, FE-M-permit, FE-M-put, FE-M-finish, FE-M-preview, FE-M-preview-arrays, FE-M-local, FE-L-draft, FE-L-prefs, FE-L-idempotency, FE-L-pagination, FE-L-nav, FE-L-errors, FE-L-sheet |
| approvals | miniprogram/app.json:28 | FE-R-reviews, FE-T-mode, FE-T-init, FE-T-call, FE-T-close, FE-T-realtime, FE-L-prefs, FE-L-idempotency, FE-L-pagination, FE-L-nav, FE-L-errors, FE-L-sheet, FE-G-pending-approvals |
| approval-detail | miniprogram/app.json:29 | FE-R-review, FE-W-review-approve, FE-W-review-return, FE-T-mode, FE-T-init, FE-T-call, FE-T-close, FE-T-realtime, FE-L-prefs, FE-L-idempotency, FE-L-pagination, FE-L-nav, FE-L-errors, FE-L-sheet |
| approval-progress | miniprogram/app.json:30 | FE-R-progress, FE-T-mode, FE-T-init, FE-T-call, FE-T-close, FE-T-realtime, FE-L-prefs, FE-L-idempotency, FE-L-pagination, FE-L-nav, FE-L-errors, FE-L-sheet |
| registrations | miniprogram/app.json:31 | FE-R-mine, FE-T-mode, FE-T-init, FE-T-call, FE-T-close, FE-T-realtime, FE-L-prefs, FE-L-idempotency, FE-L-pagination, FE-L-nav, FE-L-errors, FE-L-sheet |
| my-events | miniprogram/app.json:32 | FE-R-mine, FE-W-clone, FE-T-mode, FE-T-init, FE-T-call, FE-T-close, FE-T-realtime, FE-L-prefs, FE-L-idempotency, FE-L-pagination, FE-L-nav, FE-L-errors, FE-L-sheet |
| drafts | miniprogram/app.json:33 | FE-R-mine, FE-T-mode, FE-T-init, FE-T-call, FE-T-close, FE-T-realtime, FE-L-prefs, FE-L-idempotency, FE-L-pagination, FE-L-nav, FE-L-errors, FE-L-sheet, FE-G-draft-delete |
| following | miniprogram/app.json:34 | FE-R-relations, FE-W-follow, FE-T-mode, FE-T-init, FE-T-call, FE-T-close, FE-T-realtime, FE-L-prefs, FE-L-idempotency, FE-L-pagination, FE-L-nav, FE-L-errors, FE-L-sheet |
| more | miniprogram/app.json:35 | FE-R-me, FE-W-profile-preferences, FE-W-profile-city, FE-W-profile-locale, FE-T-mode, FE-T-init, FE-T-call, FE-T-close, FE-T-realtime, FE-A-signout, FE-L-prefs, FE-L-idempotency, FE-L-pagination, FE-L-nav, FE-L-errors, FE-L-sheet, FE-G-subscription |
| login | miniprogram/app.json:36 | FE-R-me, FE-T-mode, FE-T-init, FE-T-call, FE-T-close, FE-T-realtime, FE-A-phone-send, FE-A-phone-verify, FE-A-email-send, FE-A-email-verify, FE-A-wechat, FE-A-route, FE-L-prefs, FE-L-idempotency, FE-L-pagination, FE-L-nav, FE-L-errors, FE-L-sheet |
| attendees | miniprogram/app.json:37 | FE-R-attendees, FE-W-registration-decision, FE-W-registration-contact, FE-T-mode, FE-T-init, FE-T-call, FE-T-close, FE-T-realtime, FE-L-prefs, FE-L-idempotency, FE-L-pagination, FE-L-nav, FE-L-errors, FE-L-sheet |
| invitations | miniprogram/app.json:38 | FE-R-invitations, FE-W-accept-invite, FE-T-mode, FE-T-init, FE-T-call, FE-T-close, FE-T-realtime, FE-L-prefs, FE-L-idempotency, FE-L-pagination, FE-L-nav, FE-L-errors, FE-L-sheet, FE-G-invite-decline |
| my-campaigns | miniprogram/app.json:39 | FE-R-mine, FE-T-mode, FE-T-init, FE-T-call, FE-T-close, FE-T-realtime, FE-L-prefs, FE-L-idempotency, FE-L-pagination, FE-L-nav, FE-L-errors, FE-L-sheet |
| privacy | miniprogram/app.json:40 | FE-R-me, FE-W-profile-preferences, FE-T-mode, FE-T-init, FE-T-call, FE-T-close, FE-T-realtime, FE-L-prefs, FE-L-idempotency, FE-L-pagination, FE-L-nav, FE-L-errors, FE-L-sheet, FE-G-privacy-subject |
| feedback | miniprogram/app.json:41 | FE-W-report, FE-T-mode, FE-T-init, FE-T-call, FE-T-close, FE-T-realtime, FE-L-prefs, FE-L-idempotency, FE-L-pagination, FE-L-nav, FE-L-errors, FE-L-sheet |
| review-lab | miniprogram/app.json:42 | FE-T-mode, FE-T-init, FE-T-call, FE-T-close, FE-T-realtime, FE-L-prefs, FE-L-idempotency, FE-L-pagination, FE-L-nav, FE-L-errors, FE-L-sheet, FE-L-demo |

## 原子需求

| ID | 业务/动作 | 类型与现有函数 | 现状 | 文件证据 |
| --- | --- | --- | --- | --- |
| FE-R-config | 全局配置：加载城市选项 | read / read / config | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/page.js:18 |
| FE-R-feed | 动态：读取动态流 | read / read / feed | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/page.js:36 |
| FE-R-people | 成员推荐：读取及换一批推荐人员 | read / read / people | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/page.js:17 |
| FE-R-calendar | 活动发现：读取指定时段的活动 | read / read / calendar | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/page.js:39 |
| FE-R-campaigns | 专题发现：读取banner专题集合 | read / read / campaigns | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/page.js:44 |
| FE-R-entities | 空间发现：读取空间选项或目录 | read / read / entities | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/page.js:45 |
| FE-R-event | 活动详情：读取活动完整详情 | read / read / event | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/page.js:47 |
| FE-R-campaign | 专题详情：读取专题和关联活动列表 | read / read / campaign | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/page.js:48 |
| FE-R-member | 成员主页：读取公开成员主页 | read / read / member | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/page.js:50 |
| FE-R-entity | 实体主页：读取实体资料和关联内容 | read / read / entity | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/page.js:50 |
| FE-R-notifications | 站内消息：读取本人消息及分类 | read / read / notifications | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/page.js:53 |
| FE-R-me | 个人工作区：读取当前身份资料和偏好 | read / read / me | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/page.js:55 |
| FE-R-managed | 发布与管理：读取有权管理的实体 | read / read / managed | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/page.js:55 |
| FE-R-mine | 个人业务列表：读取本人活动报名专题及计数依据 | read / read / mine | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/page.js:21 |
| FE-R-relations | 社交关系：读取关注或粉丝列表 | read / read / relations | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/page.js:60 |
| FE-R-reviews | 内容审核：读取当前可处理的审核任务 | read / read / reviews | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/page.js:57 |
| FE-R-review | 内容审核：读取任务、主体与同轮审核方 | read / read / review | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/page.js:63 |
| FE-R-progress | 审核进度：读取主体当前轮审核进度 | read / read / progress | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/page.js:64 |
| FE-R-registration | 报名凭证：读取报名状态及活动信息 | read / read / registration | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/page.js:65 |
| FE-R-attendees | 报名管理：读取活动报名人员与管理动作 | read / read / attendees | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/page.js:66 |
| FE-R-admins | 实体管理员：读取管理员集合 | read / read / admins | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/page.js:67 |
| FE-R-invitations | 管理员邀请：读取本人收到邀请 | read / read / invitations | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/page.js:68 |
| FE-R-draft | 编辑预览：读取活动或专题编辑草稿 | read / read / draft | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/page.js:72 |
| FE-R-self-contact | 私密资料：回读本人微信号 | read / read / selfContact | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/page.js:72 |
| FE-R-event-options | 专题关联选择：读取可选活动并补齐已选项 | read / read / events | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/page.js:76 |
| FE-R-search | 全局搜索：按输入搜索活动成员实体 | read / read / search | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/page.js:99 |
| FE-R-calendar-share | 分享日历回流：读取scene对应筛选时间范围 | read / read / calendarShare | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/page.js:34 |
| FE-W-follow | 关注：关注或取消 | write / write / follow | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/page.js:111 |
| FE-W-read-notification | 消息：单条或全部标已读 | write / write / read | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/page.js:84 |
| FE-W-recommend | 推荐：发布推荐文案 | write / write / recommend | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/page.js:112 |
| FE-W-withdraw-recommendation | 推荐：撤回自己的推荐 | write / write / recommend | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/page.js:127 |
| FE-W-comment | 评论：发布评论或同活动回复 | write / write / comment | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/page.js:112 |
| FE-W-delete-comment | 评论：删除有权删除的评论 | write / write / deleteComment | 调用代码存在；真实运行未知；默认Mock | miniprogram/templates/screen.wxml:57 |
| FE-W-register | 报名：提交直接报名、申请或候补 | write / write / register | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/page.js:118 |
| FE-W-registration-decision | 报名审核：批准或拒绝报名申请 | write / write / registrationDecision | 调用代码存在；真实运行未知；默认Mock | miniprogram/templates/screen.wxml:143 |
| FE-W-cancel-registration | 报名：取消自己的报名 | write / write / cancelRegistration | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/page.js:124 |
| FE-W-private-access | 参与方式：读取群码、组织者微信或联系说明 | write / write / access | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/page.js:65 |
| FE-W-registration-contact | 获准联系方式：读取报名者明确同意共享的微信号 | write / write / registrationContact | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/page.js:126 |
| FE-W-invite | 实体权限：邀请指定成员成为管理员 | write / write / invite | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/page.js:119 |
| FE-W-accept-invite | 实体权限：接受邀请 | write / write / acceptInvite | 调用代码存在；真实运行未知；默认Mock | miniprogram/templates/screen.wxml:144 |
| FE-W-revoke-role | 实体权限：确认后撤销管理员 | write / write / revokeRole | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/page.js:124 |
| FE-W-mute | 动态隐私：屏蔽此成员动态 | write / write / mute | 调用代码存在；真实运行未知；默认Mock | miniprogram/templates/sheets.wxml:10 |
| FE-W-report | 反馈举报：提交举报或反馈原因 | write / write / report | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/page.js:112 |
| FE-W-clone | 活动复用：复制历史活动为新草稿 | write / write / clone | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/page.js:129 |
| FE-W-cancel-event | 活动管理：确认后取消已发布活动 | write / write / cancelEvent | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/page.js:124 |
| FE-W-review-approve | 内容审核：批准当前审核任务 | write / write / review | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/page.js:123 |
| FE-W-review-return | 内容审核：附原因退回或拒绝关联 | write / write / review | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/page.js:123 |
| FE-W-profile-preferences | 偏好：保存通知、公开范围、分享活动偏好 | write / write / profile | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/page.js:156 |
| FE-W-profile-city | 城市偏好：切换城市并同步本人资料 | write / write / profile | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/page.js:93 |
| FE-W-profile-locale | 语言偏好：切换双语并同步资料 | write / write / profile | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/page.js:94 |
| FE-W-save-event | 表单保存：保存event完整表单 | write / write / saveEvent | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/page.js:162 |
| FE-W-submit-event | 提交审核：保存后以新版本提交审核 | write / write / submitEvent | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/page.js:168 |
| FE-W-save-campaign | 表单保存：保存campaign完整表单 | write / write / saveCampaign | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/page.js:162 |
| FE-W-submit-campaign | 提交审核：保存后以新版本提交审核 | write / write / submitCampaign | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/page.js:168 |
| FE-W-save-profile | 表单保存：保存profile完整表单 | write / write / profile | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/page.js:162 |
| FE-W-save-entity | 表单保存：保存entity完整表单 | write / write / entity | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/page.js:164 |
| FE-F-event-title | 表单字段：编辑并持久化 title | write / write / saveEvent | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/forms.js:2 |
| FE-F-event-summary | 表单字段：编辑并持久化 summary | write / write / saveEvent | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/forms.js:2 |
| FE-F-event-media | 表单字段：编辑并持久化 media | write / write / saveEvent | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/forms.js:2 |
| FE-F-event-starts_at | 表单字段：编辑并持久化 starts_at | write / write / saveEvent | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/forms.js:2 |
| FE-F-event-ends_at | 表单字段：编辑并持久化 ends_at | write / write / saveEvent | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/forms.js:2 |
| FE-F-event-city | 表单字段：编辑并持久化 city | write / write / saveEvent | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/forms.js:2 |
| FE-F-event-space_id | 表单字段：编辑并持久化 space_id | write / write / saveEvent | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/forms.js:2 |
| FE-F-event-venue_name | 表单字段：编辑并持久化 venue_name | write / write / saveEvent | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/forms.js:2 |
| FE-F-event-address | 表单字段：编辑并持久化 address | write / write / saveEvent | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/forms.js:2 |
| FE-F-event-organization_id | 表单字段：编辑并持久化 organization_id | write / write / saveEvent | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/forms.js:2 |
| FE-F-event-capacity | 表单字段：编辑并持久化 capacity | write / write / saveEvent | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/forms.js:2 |
| FE-F-event-paid | 表单字段：编辑并持久化 paid | write / write / saveEvent | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/forms.js:2 |
| FE-F-event-price_minor | 表单字段：编辑并持久化 price_minor | write / write / saveEvent | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/forms.js:2 |
| FE-F-event-approval_required | 表单字段：编辑并持久化 approval_required | write / write / saveEvent | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/forms.js:2 |
| FE-F-event-join_methods | 表单字段：编辑并持久化 join_methods | write / write / saveEvent | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/forms.js:2 |
| FE-F-event-description | 表单字段：编辑并持久化 description | write / write / saveEvent | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/forms.js:2 |
| FE-F-campaign-title | 表单字段：编辑并持久化 title | write / write / saveCampaign | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/forms.js:3 |
| FE-F-campaign-kicker | 表单字段：编辑并持久化 kicker | write / write / saveCampaign | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/forms.js:3 |
| FE-F-campaign-media | 表单字段：编辑并持久化 media | write / write / saveCampaign | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/forms.js:3 |
| FE-F-campaign-introduction | 表单字段：编辑并持久化 introduction | write / write / saveCampaign | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/forms.js:3 |
| FE-F-campaign-organization_id | 表单字段：编辑并持久化 organization_id | write / write / saveCampaign | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/forms.js:3 |
| FE-F-campaign-event_ids | 表单字段：编辑并持久化 event_ids | write / write / saveCampaign | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/forms.js:3 |
| FE-F-campaign-resource_links | 表单字段：编辑并持久化 resource_links | write / write / saveCampaign | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/forms.js:3 |
| FE-F-profile-avatar_url | 表单字段：编辑并持久化 avatar_url | write / write / profile | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/forms.js:4 |
| FE-F-profile-display_name | 表单字段：编辑并持久化 display_name | write / write / profile | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/forms.js:4 |
| FE-F-profile-wechat | 表单字段：编辑并持久化 wechat | write / write / profile | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/forms.js:4 |
| FE-F-profile-city | 表单字段：编辑并持久化 city | write / write / profile | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/forms.js:4 |
| FE-F-profile-bio | 表单字段：编辑并持久化 bio | write / write / profile | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/forms.js:4 |
| FE-F-profile-interests | 表单字段：编辑并持久化 interests | write / write / profile | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/forms.js:4 |
| FE-F-profile-introduction | 表单字段：编辑并持久化 introduction | write / write / profile | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/forms.js:4 |
| FE-F-profile-work_links | 表单字段：编辑并持久化 work_links | write / write / profile | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/forms.js:4 |
| FE-F-profile-social_links | 表单字段：编辑并持久化 social_links | write / write / profile | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/forms.js:4 |
| FE-F-profile-frequent_spaces | 表单字段：编辑并持久化 frequent_spaces | write / write / profile | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/forms.js:4 |
| FE-F-entity-cover_url | 表单字段：编辑并持久化 cover_url | write / write / entity | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/forms.js:5 |
| FE-F-entity-name | 表单字段：编辑并持久化 name | write / write / entity | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/forms.js:5 |
| FE-F-entity-city | 表单字段：编辑并持久化 city | write / write / entity | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/forms.js:5 |
| FE-F-entity-opening_hours | 表单字段：编辑并持久化 opening_hours | write / write / entity | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/forms.js:5 |
| FE-F-entity-address | 表单字段：编辑并持久化 address | write / write / entity | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/forms.js:5 |
| FE-F-entity-introduction | 表单字段：编辑并持久化 introduction | write / write / entity | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/forms.js:5 |
| FE-F-entity-public_contact | 表单字段：编辑并持久化 public_contact | write / write / entity | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/forms.js:5 |
| FE-F-entity-allow_event_requests | 表单字段：编辑并持久化 allow_event_requests | write / write / entity | 调用代码存在；真实运行未知；默认Mock | miniprogram/lib/forms.js:5 |
| FE-T-mode | 数据通道：明确选择离线或真实adapter | local / local / transportMode | 源码存在，默认Mock，真实运行unknown | miniprogram/lib/api.js:5 |
| FE-T-init | 数据通道：建立WebSocket并初始化当前app和会话 | auth / socket:init / init | 源码存在，默认Mock，真实运行unknown | miniprogram/lib/montana.js:41 |
| FE-T-call | 数据通道：发送函数请求并关联回包 | local / socket:call-function / call-function | 源码存在，默认Mock，真实运行unknown | miniprogram/lib/montana.js:62 |
| FE-T-close | 数据通道：小程序隐藏或切换身份时关闭socket及拒绝未完成请求 | local / local / close | 源码存在，默认Mock，真实运行unknown | miniprogram/app.js:2 |
| FE-T-realtime | 实时更新：接收业务变更并刷新已打开页面 | read / unknown / unknown | 未接入：未知client-event-id回包被忽略 | miniprogram/lib/montana.js:49 |
| FE-A-phone-send | 身份登录：发送验证码 | auth / HTTP /runtime/auth/send_phone_code / send_phone_code | 源码存在，默认Mock，真实运行unknown | miniprogram/lib/montana.js:67 |
| FE-A-phone-verify | 身份登录：验证验证码并保存可信身份 | auth / HTTP /runtime/auth/verify_phone_code / verify_phone_code | 源码存在，默认Mock，真实运行unknown | miniprogram/lib/montana.js:67 |
| FE-A-email-send | 身份登录：发送验证码 | auth / HTTP /runtime/auth/send_magic_code / send_magic_code | 源码存在，默认Mock，真实运行unknown | miniprogram/lib/montana.js:67 |
| FE-A-email-verify | 身份登录：验证验证码并保存可信身份 | auth / HTTP /runtime/auth/verify_magic_code / verify_magic_code | 源码存在，默认Mock，真实运行unknown | miniprogram/lib/montana.js:67 |
| FE-A-wechat | 身份登录：获取wx.login临时码并交换服务身份 | auth / wechatLogin / wechatLogin | 源码存在，默认Mock，真实运行unknown | miniprogram/lib/page.js:177 |
| FE-A-route | 身份登录：登录后回读资料并按onboarded分流 | read / read / me | 源码存在，默认Mock，真实运行unknown | miniprogram/lib/page.js:175 |
| FE-A-signout | 身份登录：撤销服务会话并清除本地session | auth / HTTP /runtime/signout / signout | 源码存在，默认Mock，真实运行unknown | miniprogram/lib/montana.js:75 |
| FE-M-select | 媒体：选择图片或视频 | upload / local / wx.chooseMedia | 源码存在，默认Mock，真实运行unknown | miniprogram/lib/page.js:153 |
| FE-M-permit | 媒体：申请签名上传地址 | upload / mediaUpload / mediaUpload | 源码存在，默认Mock，真实运行unknown | miniprogram/lib/page.js:153 |
| FE-M-put | 媒体：通过签名地址上传二进制 | upload / HTTP PUT signed upload_url / PUT | 源码存在，默认Mock，真实运行unknown | miniprogram/lib/page.js:153 |
| FE-M-finish | 媒体：完成媒体验证并保存稳定引用 | upload / mediaFinish / mediaFinish | 源码存在，默认Mock，真实运行unknown | miniprogram/lib/page.js:153 |
| FE-M-preview | 媒体：获取当前有权访问的媒体预览 | read / mediaPreview / mediaPreview | 源码存在，默认Mock，真实运行unknown | miniprogram/lib/page.js:179 |
| FE-M-preview-arrays | 媒体：为表单媒体数组及群码稳定引用取得有效预览 | read / mediaPreview / mediaPreview | 部分未接入 | miniprogram/lib/page.js:179 |
| FE-M-local | 媒体：Mock保存本机媒体并产生演示引用 | local / local / mock.localMedia | Mock专用 | miniprogram/lib/page.js:153 |
| FE-M-links | 外部链接：复制公开作品、社交或资料链接 | local / local / wx.setClipboardData | 源码存在，默认Mock，真实运行unknown | miniprogram/lib/page.js:178 |
| FE-P-payment | 付款：取得真实支付参数并发起wx.requestPayment | write / payment / payment | 源码存在，默认Mock，真实运行unknown | miniprogram/lib/page.js:125 |
| FE-P-reconcile | 付款：以服务确认结果刷新凭证并处理支付占位到期 | read / read / registration | 源码存在，默认Mock，真实运行unknown | miniprogram/lib/page.js:125 |
| FE-C-code | 日历分享：生成当前筛选的服务日历分享码和活动清单 | read / calendarCode / calendarCode | 源码存在，默认Mock，真实运行unknown | miniprogram/lib/page.js:184 |
| FE-C-render | 日历海报：绘制活动及服务码为本地海报 | local / local / canvasToTempFilePath | 源码存在，默认Mock，真实运行unknown | miniprogram/lib/page.js:189 |
| FE-C-save | 日历海报：经用户操作保存海报到相册 | local / local / wx.saveImageToPhotosAlbum | 源码存在，默认Mock，真实运行unknown | miniprogram/lib/page.js:200 |
| FE-L-draft | 本地表单：按模式身份路由主体隔离本机表单和步骤 | local / local / draft storage | 源码存在，默认Mock，真实运行unknown | miniprogram/lib/page.js:9 |
| FE-L-prefs | 本地偏好：本机城市语言隔离及登录后同步 | local / local / prefs.sync/fromProfile | 源码存在，默认Mock，真实运行unknown | miniprogram/lib/preferences.js:8 |
| FE-L-idempotency | 请求一致性：同一写请求重试复用command key | write / write / operation dependent | 源码存在，默认Mock，真实运行unknown | miniprogram/lib/page.js:22 |
| FE-L-pagination | 列表读取：末尾续读、去重、载入更多和全量本人计数 | read / read / list dependent | 源码存在，默认Mock，真实运行unknown | miniprogram/lib/page.js:81 |
| FE-L-filters | 活动筛选：设置城市时段空间标签免费和有名额筛选 | local / local / filter | 源码存在，默认Mock，真实运行unknown | miniprogram/lib/page.js:102 |
| FE-L-nav | 原生路由：根据数据ID导航详情与tabBar | local / local / navigate/go | 源码存在，默认Mock，真实运行unknown | miniprogram/lib/page.js:4 |
| FE-L-share | 原生分享：生成分享路径与标题 | local / local / onShareAppMessage | 源码存在，默认Mock，真实运行unknown | miniprogram/lib/page.js:16 |
| FE-L-errors | 界面反馈：显示载入忙碌空态登录提示及具体错误 | local / local / load/run/i18n.message | 源码存在，默认Mock，真实运行unknown | miniprogram/lib/page.js:23 |
| FE-L-sheet | 弹框交互：保持上下文并打开关闭同意/输入/查看弹框 | local / local / sheet/closeSheet | 源码存在，默认Mock，真实运行unknown | miniprogram/lib/page.js:112 |
| FE-L-demo | 开发目录：加载所有开发场景及待查目录并显式切换persona/scenario | local / local / mock catalog/configure/reset | Mock专用；40注册路由之一；非新增业务权限 | miniprogram/lib/page.js:32 |
| FE-G-subscription | 消息：明确微信订阅推送同意及送达回执 | read / unknown / unknown | 未接入/部分缺口/待确认 | docs/montana-integration-matrix.md:19 |
| FE-G-refund | 退款：明确退款申请、状态与退款规则对接 | read / unknown / unknown | 未接入/部分缺口/待确认 | docs/backlog.md:24 |
| FE-G-privacy-subject | 隐私：确认正式隐私主体、渠道和同意版本 | read / unknown / unknown | 未接入/部分缺口/待确认 | miniprogram/config.js:9 |
| FE-G-featured-update | 成员资料：保存常出没空间后与成员组织归属正确组合回读 | read / unknown / unknown | 未接入/部分缺口/待确认 | docs/sid-95-checkpoint.md:10 |
| FE-G-entity-pagination | 实体集合：定义实体全部活动和活跃成员独立游标与统计 | read / unknown / unknown | 未接入/部分缺口/待确认 | miniprogram/lib/page.js:49 |
| FE-G-relations-membership | 成员归属：定义会员关系、管理角色与活动参与的独立数据来源 | read / unknown / unknown | 未接入/部分缺口/待确认 | docs/sid-95-checkpoint.md:10 |
| FE-G-draft-delete | 草稿管理：确认草稿删除或清理能力是否在当前范围 | read / unknown / unknown | 未接入/部分缺口/待确认 | miniprogram/templates/screen.wxml:136 |
| FE-G-invite-decline | 管理员邀请：确认拒绝邀请是否需要独立动作 | read / unknown / unknown | 未接入/部分缺口/待确认 | miniprogram/templates/screen.wxml:144 |
| FE-G-interest-config | 资料选项：确认兴趣选项语言及配置来源 | read / unknown / unknown | 未接入/部分缺口/待确认 | miniprogram/lib/page.js:132 |
| FE-G-pending-approvals | 审核完成列表：确认done=1表示完成审核的数据来源 | read / unknown / unknown | 未接入/部分缺口/待确认 | miniprogram/lib/page.js:62 |

## 状态来源

- `docs/visual-review/2026-10-09/targeted-bugfixes.md`：19项代码修正；未进行运行和视觉验收。
- `docs/sid-95-checkpoint.md` 与 `pause-status.md`：原全量工作仍暂停；已有开发检查不能当本人验收。
- `docs/montana-integration-matrix.md` 与 `native-miniprogram-delivery.md`：历史接口/配置/验证描述，仅提供线索。
- `docs/backlog.md`：退款、角色、自由动态等未决或后置；不擅自提升为当前必交付。

下一步是把本清单逐项对照后台数据和权限契约，标出已覆盖、需接线、需补数据以及需用户决定的条目。

## 本机交互补充

- FE-L-image-view：查看当前可展示图片；miniprogram/lib/page.js:180。
- FE-L-login-mode：切换手机或邮件验证码方式并清理发送状态；miniprogram/lib/page.js:176。
- FE-L-form-step：前后步骤切换及成功页重新编辑；miniprogram/lib/page.js:160。
- FE-L-date-input：编辑日期或分钟时间并转换北京时间ISO；miniprogram/lib/page.js:154。
- FE-L-form-arrays：添加删除链接媒体和关联选择保持顺序；miniprogram/lib/page.js:133。
