# 前端需求与实际记录关系

2026-10-10 · SID-123 · 147项需求全部保留；仅源码需求映射。

详见 [storage-frontend-map.json](storage-frontend-map.json)。该JSON逐项给出实际记录类型、读/写/派生方向、具体字段、endpoint ID及源码行证据。

## 物理存储与字段

- 业务记录共同存入 `community706`，逻辑实体由 `type` 标识；并非每种记录独立物理表。
- `owner/parent/status/version` 等是外层字段；具体业务字段放 `data.*`；`DTO.*` 是查询派生结果。
- `$users/$files` 是独立系统实体；验证码与令牌使用 system schema 的 `magic_codes/refresh_tokens`。
- 普通写操作还有 `guard` 锁行和 `command` 幂等结果；私密参与方式和联系人读取不缓存到 command。

## 关键关系

- 活动卡：event + registration + profile + entity + recommendation + role，派生人数、剩余名额、参与人和权限。
- 推荐成员：profile + follow + registration + event + entity + recommendation，按明确优先级生成理由。
- 成员常出没：profile的ID数组 + entity + membership + 公开已结束活动的确认报名；membership不授管理权限。实际DTO名是 `frequent_entities`。
- 发布参与方式：表单 join_methods/access_values 转成加密 eventSecret.payload；微信号单独写加密 contact.encrypted。
- 专题：campaign.event_ids关联event；submitCampaign生成每个活动发起人的review；审核不是简单改campaign.status。
- 付款：registration → event可信金额 → wechatIdentity → payment；服务回调才确认报名，requires_refund仅表示异常需要退款处理，未提供退款服务。
- 上传：真实文件字节在storage/$files；media记录稳定引用与私有标记；私有预览还检查registration/eventSecret/role。

## 逐项对应

| 前端需求 ID | 实际记录与方向 | 未归属/待接入原因 |
| --- | --- | --- |
| FE-R-config | 无直接数据库访问 | 读取源码cities/隐私常量和环境capabilities，不是业务type记录；带auth时active()有身份检查，但配置本身不落表。 |
| FE-R-feed | mute(read)、recommendation(read)、event(read)、profile(read)、registration(read)、event(derived)、entity(read)、role(read)、media(read) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-R-people | profile(read)、follow(read)、registration(read)、recommendation(read)、entity(read)、event(read)、profile(derived) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-R-calendar | event(read)、registration(read)、profile(read)、recommendation(read)、entity(read)、event(derived)、role(read)、media(read) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-R-campaigns | campaign(read)、media(read) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-R-entities | entity(read)、event(read)、registration(read)、profile(read)、entity(derived) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-R-event | event(read)、event(derived)、campaign(read)、comment(read)、comment(derived)、registration(read)、profile(read)、recommendation(read)、entity(read)、role(read)、media(read) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-R-campaign | campaign(read)、event(read)、registration(read)、profile(read)、recommendation(read)、entity(read)、event(derived)、role(read)、media(read) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-R-member | profile(read)、follow(read)、registration(read)、profile(derived)、event(read)、recommendation(read)、entity(read)、event(derived)、role(read)、membership(read)、entity(derived) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-R-entity | entity(read)、follow(read)、registration(read)、entity(derived)、event(read)、profile(read)、recommendation(read)、event(derived)、role(read) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-R-notifications | notification(read)、profile(read) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-R-me | profile(read)、follow(read)、notification(read)、role(read)、event(read)、registration(read)、campaign(read)、comment(read)、event(derived)、recommendation(read)、entity(read)、review(read) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-R-managed | entity(read)、role(read) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-R-mine | event(read)、registration(read)、campaign(read)、comment(read)、event(derived)、profile(read)、recommendation(read)、entity(read)、role(read) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-R-relations | follow(read)、profile(read)、entity(read) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-R-reviews | review(read)、event(read)、campaign(read)、role(read) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-R-review | review(read)、event(read)、campaign(read)、role(read) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-R-progress | event(read)、campaign(read)、review(read)、role(read) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-R-registration | registration(read)、event(read)、role(read) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-R-attendees | event(read)、registration(read)、registration(derived)、role(read) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-R-admins | role(read) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-R-invitations | invitation(read) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-R-draft | event(read)、campaign(read)、eventSecret(read)、role(read) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-R-self-contact | contact(read) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-R-event-options | event(read)、registration(read)、profile(read)、recommendation(read)、entity(read)、event(derived)、role(read)、media(read)、campaign(read)、comment(read)、comment(derived) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-R-search | entity(read)、profile(read)、event(read)、registration(read)、recommendation(read)、event(derived)、role(read) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-R-calendar-share | calendarShare(read) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-W-follow | profile(read)、entity(read)、follow(read)、follow(write)、$users(read)、guard(write)、command(read)、command(write) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-W-read-notification | notification(read)、notification(write)、$users(read)、profile(read)、guard(write)、command(read)、command(write) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-W-recommend | event(read)、recommendation(read)、recommendation(write)、role(read)、$users(read)、profile(read)、guard(write)、command(read)、command(write) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-W-withdraw-recommendation | event(read)、recommendation(read)、recommendation(write)、role(read)、$users(read)、profile(read)、guard(write)、command(read)、command(write) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-W-comment | event(read)、comment(read)、comment(write)、notification(write)、role(read)、$users(read)、profile(read)、guard(write)、command(read)、command(write) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-W-delete-comment | comment(read)、comment(write)、role(read)、$users(read)、profile(read)、guard(write)、command(read)、command(write) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-W-register | event(read)、registration(read)、registration(write)、notification(write)、$users(read)、profile(read)、guard(write)、command(read)、command(write) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-W-registration-decision | registration(read)、event(read)、registration(write)、notification(write)、audit(write)、role(read)、$users(read)、profile(read)、guard(write)、command(read)、command(write) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-W-cancel-registration | registration(read)、event(read)、registration(write)、notification(write)、$users(read)、profile(read)、guard(write)、command(read)、command(write) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-W-private-access | registration(read)、event(read)、eventSecret(read)、audit(write)、role(read)、$users(read)、profile(read)、guard(write) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-W-registration-contact | registration(read)、event(read)、contact(read)、audit(write)、role(read)、$users(read)、profile(read)、guard(write) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-W-invite | profile(read)、invitation(write)、notification(write)、audit(write)、role(read)、$users(read)、guard(write)、command(read)、command(write) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-W-accept-invite | invitation(read)、role(read)、role(write)、invitation(write)、$users(read)、profile(read)、guard(write)、command(read)、command(write) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-W-revoke-role | role(read)、role(write)、invitation(read)、invitation(write)、audit(write)、$users(read)、profile(read)、guard(write)、command(read)、command(write) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-W-mute | mute(read)、mute(write)、$users(read)、profile(read)、guard(write)、command(read)、command(write) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-W-report | report(write)、$users(read)、profile(read)、guard(write)、command(read)、command(write) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-W-clone | event(read)、event(write)、role(read)、$users(read)、profile(read)、guard(write)、command(read)、command(write) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-W-cancel-event | event(read)、registration(read)、event(write)、registration(write)、notification(write)、audit(write)、role(read)、$users(read)、profile(read)、guard(write)、command(read)、command(write) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-W-review-approve | review(read)、review(write)、event(read)、event(write)、campaign(read)、campaign(write)、notification(write)、audit(write)、role(read)、$users(read)、profile(read)、guard(write)、command(read)、command(write) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-W-review-return | review(read)、review(write)、event(read)、event(write)、campaign(read)、campaign(write)、notification(write)、audit(write)、role(read)、$users(read)、profile(read)、guard(write)、command(read)、command(write) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-W-profile-preferences | profile(read)、profile(write)、$users(read)、guard(write)、command(read)、command(write) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-W-profile-city | profile(read)、profile(write)、$users(read)、guard(write)、command(read)、command(write) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-W-profile-locale | profile(read)、profile(write)、$users(read)、guard(write)、command(read)、command(write) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-W-save-event | event(read)、event(write)、review(write)、eventSecret(write)、media(read)、role(read)、$users(read)、profile(read)、guard(write)、command(read)、command(write) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-W-submit-event | event(read)、entity(read)、profile(read)、event(write)、review(write)、audit(write)、role(read)、$users(read)、guard(write)、command(read)、command(write) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-W-save-campaign | campaign(read)、campaign(write)、media(read)、$users(read)、profile(read)、guard(write)、command(read)、command(write) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-W-submit-campaign | campaign(read)、event(read)、review(write)、notification(write)、campaign(write)、role(read)、$users(read)、profile(read)、guard(write)、command(read)、command(write) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-W-save-profile | profile(read)、profile(write)、contact(write)、follow(write)、$users(read)、guard(write)、command(read)、command(write) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-W-save-entity | entity(read)、entity(write)、audit(write)、role(read)、$users(read)、profile(read)、guard(write)、command(read)、command(write) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-F-event-title | event(write)、$users(read)、profile(read)、guard(write)、command(read)、command(write) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-F-event-summary | event(write)、$users(read)、profile(read)、guard(write)、command(read)、command(write) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-F-event-media | event(write)、media(read)、$users(read)、profile(read)、guard(write)、command(read)、command(write) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-F-event-starts_at | event(write)、event(derived)、$users(read)、profile(read)、guard(write)、command(read)、command(write) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-F-event-ends_at | event(write)、event(derived)、$users(read)、profile(read)、guard(write)、command(read)、command(write) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-F-event-city | event(write)、$users(read)、profile(read)、guard(write)、command(read)、command(write) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-F-event-space_id | event(write)、entity(read)、$users(read)、profile(read)、guard(write)、command(read)、command(write) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-F-event-venue_name | event(write)、$users(read)、profile(read)、guard(write)、command(read)、command(write) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-F-event-address | event(write)、$users(read)、profile(read)、guard(write)、command(read)、command(write) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-F-event-organization_id | event(write)、entity(read)、$users(read)、profile(read)、guard(write)、command(read)、command(write) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-F-event-capacity | event(write)、$users(read)、profile(read)、guard(write)、command(read)、command(write) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-F-event-paid | event(derived)、$users(read)、profile(read)、guard(write)、command(read)、command(write) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-F-event-price_minor | event(write)、event(derived)、$users(read)、profile(read)、guard(write)、command(read)、command(write) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-F-event-approval_required | event(write)、$users(read)、profile(read)、guard(write)、command(read)、command(write) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-F-event-join_methods | eventSecret(write)、media(read)、$users(read)、profile(read)、guard(write)、command(read)、command(write) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-F-event-description | event(write)、$users(read)、profile(read)、guard(write)、command(read)、command(write) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-F-campaign-title | campaign(write)、$users(read)、profile(read)、guard(write)、command(read)、command(write) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-F-campaign-kicker | campaign(write)、$users(read)、profile(read)、guard(write)、command(read)、command(write) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-F-campaign-media | campaign(write)、media(read)、$users(read)、profile(read)、guard(write)、command(read)、command(write) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-F-campaign-introduction | campaign(write)、$users(read)、profile(read)、guard(write)、command(read)、command(write) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-F-campaign-organization_id | campaign(write)、role(read)、$users(read)、profile(read)、guard(write)、command(read)、command(write) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-F-campaign-event_ids | campaign(write)、event(read)、review(write)、$users(read)、profile(read)、guard(write)、command(read)、command(write) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-F-campaign-resource_links | campaign(write)、$users(read)、profile(read)、guard(write)、command(read)、command(write) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-F-profile-avatar_url | profile(write)、$users(read)、profile(read)、guard(write)、command(read)、command(write) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-F-profile-display_name | profile(write)、$users(read)、profile(read)、guard(write)、command(read)、command(write) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-F-profile-wechat | contact(write)、$users(read)、profile(read)、guard(write)、command(read)、command(write) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-F-profile-city | profile(write)、$users(read)、profile(read)、guard(write)、command(read)、command(write) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-F-profile-bio | profile(write)、$users(read)、profile(read)、guard(write)、command(read)、command(write) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-F-profile-interests | profile(write)、$users(read)、profile(read)、guard(write)、command(read)、command(write) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-F-profile-introduction | profile(write)、$users(read)、profile(read)、guard(write)、command(read)、command(write) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-F-profile-work_links | profile(write)、$users(read)、profile(read)、guard(write)、command(read)、command(write) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-F-profile-social_links | profile(write)、$users(read)、profile(read)、guard(write)、command(read)、command(write) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-F-profile-frequent_spaces | profile(write)、profile(read)、entity(read)、$users(read)、guard(write)、command(read)、command(write) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-F-entity-cover_url | entity(write)、$users(read)、profile(read)、guard(write)、command(read)、command(write) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-F-entity-name | entity(write)、$users(read)、profile(read)、guard(write)、command(read)、command(write) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-F-entity-city | entity(write)、$users(read)、profile(read)、guard(write)、command(read)、command(write) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-F-entity-opening_hours | entity(write)、$users(read)、profile(read)、guard(write)、command(read)、command(write) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-F-entity-address | entity(write)、$users(read)、profile(read)、guard(write)、command(read)、command(write) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-F-entity-introduction | entity(write)、$users(read)、profile(read)、guard(write)、command(read)、command(write) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-F-entity-public_contact | entity(write)、$users(read)、profile(read)、guard(write)、command(read)、command(write) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-F-entity-allow_event_requests | entity(write)、$users(read)、profile(read)、guard(write)、command(read)、command(write) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-T-mode | 无直接数据库访问 | 纯本机/原生交互：明确选择离线或真实adapter。已有加载的DTO或本地storage不等于新增数据库访问；后续保存读取需求另有对应ID。 |
| FE-T-init | runtime:refresh_tokens(read)、$users(read) | socket/session本身是运行内存，不是community706实体；以上仅鉴权lookup。 |
| FE-T-call | 无直接数据库访问 | 传输call-function envelope/pending关联不直接读写业务记录；实体访问由每一具体endpoint单独归属。 |
| FE-T-close | 无直接数据库访问 | 纯本机/原生交互：小程序隐藏或切换身份时关闭socket及拒绝未完成请求。已有加载的DTO或本地storage不等于新增数据库访问；后续保存读取需求另有对应ID。 |
| FE-T-realtime | 无直接数据库访问 | 后台runtime有实时能力，但原生未接收无client-event-id消息；不存在当前前端订阅实体范围，不推定已接线。 |
| FE-A-phone-send | runtime:magic_codes(write) | 发送验证码不等于创建profile/user；短信频率另有RateLimit，未映射为community类型。 |
| FE-A-phone-verify | runtime:magic_codes(read)、$users(read)、$users(write)、runtime:refresh_tokens(write)、runtime:magic_codes(write) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-A-email-send | runtime:magic_codes(write) | 发送验证码不等于创建profile/user；短信频率另有RateLimit，未映射为community类型。 |
| FE-A-email-verify | runtime:magic_codes(read)、$users(read)、$users(write)、runtime:refresh_tokens(write)、runtime:magic_codes(write) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-A-wechat | wechatIdentity(read)、wechatIdentity(write)、$users(write)、runtime:refresh_tokens(write) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-A-route | profile(read)、follow(read)、notification(read)、role(read) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-A-signout | runtime:refresh_tokens(write) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-M-select | 无直接数据库访问 | 纯本机/原生交互：选择图片或视频。已有加载的DTO或本地storage不等于新增数据库访问；后续保存读取需求另有对应ID。 |
| FE-M-permit | profile(read)、follow(read)、notification(read)、role(read)、runtime:upload_urls(write) | 签名许可不是community逻辑type，但实际有system schema upload_urls记录；media实体到mediaFinish/registerMedia才创建。 |
| FE-M-put | $files(write)、runtime:upload_urls(write) | 签名PUT与registerMedia关联路径已追到Storage.record；文件字节存S3，不写community706.data。 |
| FE-M-finish | $files(read)、media(read)、media(write)、registration(read)、event(read)、eventSecret(read)、campaign(read)、entity(read)、role(read) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-M-preview | media(read)、registration(read)、event(read)、eventSecret(read)、campaign(read)、entity(read)、role(read) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-M-preview-arrays | media(read)、registration(read)、event(read)、eventSecret(read)、campaign(read)、entity(read)、role(read) | 后台mediaPreview能力存在，前端数组/嵌套引用刷新未完整接线；access仅代表可用后台路径，不宣称实际每项已调用。 |
| FE-M-local | 无直接数据库访问 | 纯本机/原生交互：Mock保存本机媒体并产生演示引用。已有加载的DTO或本地storage不等于新增数据库访问；后续保存读取需求另有对应ID。 |
| FE-M-links | 无直接数据库访问 | 纯本机/原生交互：复制公开作品、社交或资料链接。已有加载的DTO或本地storage不等于新增数据库访问；后续保存读取需求另有对应ID。 |
| FE-P-payment | registration(read)、event(read)、wechatIdentity(read)、payment(read)、payment(write)、registration(write) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-P-reconcile | payment(read)、payment(write)、registration(read)、registration(write)、event(read)、notification(write)、role(read) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-C-code | calendarShare(write)、event(read)、registration(read)、profile(read)、recommendation(read)、entity(read)、event(derived)、role(read) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-C-render | 无直接数据库访问 | 纯本机/原生交互：绘制活动及服务码为本地海报。已有加载的DTO或本地storage不等于新增数据库访问；后续保存读取需求另有对应ID。 |
| FE-C-save | 无直接数据库访问 | 纯本机/原生交互：经用户操作保存海报到相册。已有加载的DTO或本地storage不等于新增数据库访问；后续保存读取需求另有对应ID。 |
| FE-L-draft | 无直接数据库访问 | 纯本机/原生交互：按模式身份路由主体隔离本机表单和步骤。已有加载的DTO或本地storage不等于新增数据库访问；后续保存读取需求另有对应ID。 |
| FE-L-prefs | 无直接数据库访问 | 纯本机/原生交互：本机城市语言隔离及登录后同步。已有加载的DTO或本地storage不等于新增数据库访问；后续保存读取需求另有对应ID。 |
| FE-L-idempotency | guard(write)、command(read)、command(write) | 已按实际代码关联；条件分支及字段详见JSON |
| FE-L-pagination | 无直接数据库访问 | 纯本机/原生交互：末尾续读、去重、载入更多和全量本人计数。已有加载的DTO或本地storage不等于新增数据库访问；后续保存读取需求另有对应ID。 |
| FE-L-filters | 无直接数据库访问 | 纯本机/原生交互：设置城市时段空间标签免费和有名额筛选。已有加载的DTO或本地storage不等于新增数据库访问；后续保存读取需求另有对应ID。 |
| FE-L-nav | 无直接数据库访问 | 纯本机/原生交互：根据数据ID导航详情与tabBar。已有加载的DTO或本地storage不等于新增数据库访问；后续保存读取需求另有对应ID。 |
| FE-L-share | 无直接数据库访问 | 纯本机/原生交互：生成分享路径与标题。已有加载的DTO或本地storage不等于新增数据库访问；后续保存读取需求另有对应ID。 |
| FE-L-errors | 无直接数据库访问 | 纯本机/原生交互：显示载入忙碌空态登录提示及具体错误。已有加载的DTO或本地storage不等于新增数据库访问；后续保存读取需求另有对应ID。 |
| FE-L-sheet | 无直接数据库访问 | 纯本机/原生交互：保持上下文并打开关闭同意/输入/查看弹框。已有加载的DTO或本地storage不等于新增数据库访问；后续保存读取需求另有对应ID。 |
| FE-L-demo | 无直接数据库访问 | 纯本机/原生交互：加载所有开发场景及待查目录并显式切换persona/scenario。已有加载的DTO或本地storage不等于新增数据库访问；后续保存读取需求另有对应ID。 |
| FE-G-subscription | 无直接数据库访问 | 无微信订阅同意/模板/送达接口；站内notification是另一能力。候选notification扩展只能suggested，不能记已存在字段。 |
| FE-G-refund | payment(read)、registration(read) | partial：没有refund record/service/退款规则；仅payment.requires_refund及取消门槛已有，不推定可提交或执行退款。 |
| FE-G-privacy-subject | profile(write) | partial：同意记录已有，正式主体/法务文案/联系渠道没有现有业务存储entity；config源码版本不是已配置运营主体。 |
| FE-G-featured-update | profile(read)、follow(read)、registration(read)、profile(derived)、event(read)、recommendation(read)、entity(read)、event(derived)、role(read)、membership(read)、entity(derived)、profile(write) | partial：已有field写与read，缺的是featured_entities/frequent_spaces组合契约；非新建表。 |
| FE-G-entity-pagination | entity(read)、follow(read)、registration(read)、entity(derived)、event(read)、profile(read)、recommendation(read)、event(derived)、role(read) | entity当前返回完整嵌入items/members，没有独立entityEvents/entityMembers分页endpoint；当前来源已归属，需求分页接口未确定。 |
| FE-G-relations-membership | membership(read)、entity(read)、registration(read)、event(read)、entity(derived) | membership是实际读取type（维护来源未知），并不由profile表单写/role授予；归属维护服务仍待定。 |
| FE-G-draft-delete | event(read)、campaign(read) | partial：不存在deleteDraft endpoint；不得把deleteComment或cancelEvent当作草稿删除。 |
| FE-G-invite-decline | invitation(read) | partial：acceptInvite仅接受；revokeRole是Owner撤销关联邀请，不是本人拒绝邀请；decline接口未接入。 |
| FE-G-interest-config | profile(write) | partial：兴趣选项是客户端中文常量，read.config只有cities/privacy/capabilities，无interest config record或本地化id协议。 |
| FE-G-pending-approvals | review(read)、event(read)、campaign(read)、role(read) | partial：当前reviews只读PENDING；Mock done仅过滤campaign不是完成。历史completed tasks服务未接入。 |
| FE-L-image-view | 无直接数据库访问 | 纯本机/原生交互：查看当前可展示图片。已有加载的DTO或本地storage不等于新增数据库访问；后续保存读取需求另有对应ID。 |
| FE-L-login-mode | 无直接数据库访问 | 纯本机/原生交互：切换手机或邮件验证码方式并清理发送状态。已有加载的DTO或本地storage不等于新增数据库访问；后续保存读取需求另有对应ID。 |
| FE-L-form-step | 无直接数据库访问 | 纯本机/原生交互：前后步骤切换及成功页重新编辑。已有加载的DTO或本地storage不等于新增数据库访问；后续保存读取需求另有对应ID。 |
| FE-L-date-input | 无直接数据库访问 | 纯本机/原生交互：编辑日期或分钟时间并转换北京时间ISO。已有加载的DTO或本地storage不等于新增数据库访问；后续保存读取需求另有对应ID。 |
| FE-L-form-arrays | 无直接数据库访问 | 纯本机/原生交互：添加删除链接媒体和关联选择保持顺序。已有加载的DTO或本地storage不等于新增数据库访问；后续保存读取需求另有对应ID。 |

## 阅读边界

不是每个列表都能独立按实体分页，实体详情当前内嵌items/members。completed review、草稿删除、邀请拒绝、订阅消息、退款以及正式隐私主体仍有未接入/未决部分；有相关旧记录不等于该能力已存在。

字段证据来自当前源码；历史部署记录未用于确认本映射已在服务运行。
