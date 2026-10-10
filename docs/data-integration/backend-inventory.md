# 后端接口与记录清单

源码读取结果：81 个入口：28 个 read op、24 个 write op、19 个其他 community 函数、9 个 auth HTTP、1 个 socket入口；26 类逻辑/系统记录。完整参数、返回、权限、错误与逐项证据见 [backend-inventory.json](backend-inventory.json)。本次零运行请求。

## 数据与验证边界

- 范围为SID-123只读盘点；不执行接口、测试、编译、GUI、截图、部署或业务修改。JSON字段列出代码事实，未知运行状态不阻塞。
- 历史v6部署记录含21函数，2026-10-08T16:39:34Z；只确认函数名和当时部署，当前源码commit一致性未确认。runtime.json记录匿名config/events/people空结果及受保护调用拒绝，0业务写。
- 所有public read先active检查已有auth；匿名公开read允许；受保护read需uid。write validator需要op/params/key，即敏感读取也传key；active+非guest+guard行锁。普通op SHA256输入/幂等缓存；access/registrationContact绕过缓存并记录读取。
- 共有分页契约固定30条；未知cursor错误；events AND筛选(city/from/to/space_id/tag/free_only/q/has_capacity)；时间范围为ends_at>from且starts_at<to。calendar无分页。search无分页，跨城搜索同城优先。
- 全部client表访问/文件直读写/streams默认deny；$users仅本人view；attrs create deny；服务函数使用admin DB但业务权限另查。server/lib/montana/functions.ex:154、169限制internal；公共不等于匿名有权。
- README付款默认15分钟为旧说明，实际源码community.ts:162默认30分钟。memberEntities:69读取membership/featured_entities是v6后续源码，不能推定已部署。
- canEdit对event/campaign共用owner/platform/organization；saveCampaign/submitCampaign专门限制owner，draft/progress可读范围较宽。member publicProfile.id为profile记录id/owner为用户id，客户端成员跳转需使用owner。
- 真实配置历史wechat_login/payment false；微信资质、真实平台/实体owner与角色、隐私主体/退款政策未确认。没有真实支付/上传/验证码/登录/日历码调用证据。
- 没有独立公开创建entity、分配platform/owner、组织membership编辑接口；operator.py为外部确认manifest受控管理事务，不是小程序业务接口。普通profile写入不授予角色。
- 公开DTO移除private媒体引用/带token能力；private GET HMAC5分钟+实时权限+60秒内部storage，no-store。媒体限制event9image/1video/3link，campaign12image；≤10MiB文件与MIME/magic检查。
- 正式小程序socket adapter带20秒超时，错误保留type/message；API调用证明需独立运行证据。adapter只单次call，没有运行函数订阅；runtime支持subscribe-function但未在原生接入。
- Mock源码仅本地存储状态机，不证明真实后端。支付直接CONFIRMED，微信登录仅persona切换，calendarCode code:null，localMedia保存本地路径；fixture source_bio/source_mine/source_review等原型特例后端不提供。
- row所有实体仅逻辑关系，无数据库外键/逐字段validator断言；schema部署脚本读取现存community706表并补type/owner/parent/status/created_at索引，当前数据库schema未重新读取。
- 证据路径是本机私有Montana源码；此公开客户端文档仅记文件/行号与合同，不复制凭据、个人号、原始私有截图或生产业务数据。
- Runtime还支持verify_refresh_token/sign_in_guest/link_email/link_phone，本清单列出，原生adapter当前未显式调用。runtime SSE/OAuth/通用数据库与streams不是本项目显式业务接入；$streams规则deny；不因底层存在就认定已接通。

## 逐项接口

| ID | 必填业务参数 | 返回摘要 | 权限/状态 | 源码行 |
| --- | --- | --- | --- | --- |
| read.calendarShare | id | params | 匿名可读；按分享id读取参数 | community.ts:81 |
| read.config | 无；见公共envelope | cities[{id,zh,en,timezone}], privacy_version, capabilities{wechat_login,payment} | 匿名可读 | community.ts:82 |
| read.events | 无；见公共envelope | items, next_cursor, has_more, total | 匿名可读，仅PUBLISHED且非UNLISTED/MEMBERS | community.ts:83 |
| read.calendar | 无；见公共envelope | items, generated_at | 同events | community.ts:84 |
| read.event | id | id, owner, title, summary, description, city, organization_id, space_id, venue_name, address, starts_at, ends_at, capacity, price_minor, approval_required, waitlist_enabled, tags, fit_description, cover_url, media, host_display, venue_display, status, version, visibility, updated_at, type, organization_name, participants(最多5公开且允许分享), initiator, can_manage, pending_count(仅管理者), recommended, registered, remaining, registration(当前身份记录或null), host_recent_count, can_edit, can_register, campaigns, comments | 公开活动或当前可编辑者 | community.ts:85 |
| read.campaigns | 无；见公共envelope | items, next_cursor, has_more, total | 仅公开专题 | community.ts:86 |
| read.campaign | id | id, type, owner, parent, status, version, created_at, updated_at, data 中展开的业务字段（put 返回不保证时间字段）, title, kicker, introduction, cover_url, organization_id, event_ids, resource_links, media, visibility, items(public event cards), can_edit | 公开专题或owner/platform；关联活动仅公开 | community.ts:87 |
| read.entities | 无；见公共envelope | items, next_cursor, has_more, total | ACTIVE实体，public_contact不公开 | community.ts:88 |
| read.entity | id | id, type, owner, parent, status, version, created_at, updated_at, data 中展开的业务字段（put 返回不保证时间字段）, entity业务字段, public_contact(仅管理者), following, can_manage, can_admin, items, members | ACTIVE或管理者；public_contact仅管理者 | community.ts:89 |
| read.member | id | id, owner, display_name, avatar_url, bio, introduction, city, interests, public_links, frequent_spaces, items, activity_count, following_count, followers_count, frequent_entities, following | ACTIVE PUBLIC profile；分享活动须share_activity | community.ts:90 |
| read.people | 无；见公共envelope | items, next_cursor, has_more, total | ACTIVE PUBLIC非本人；共同报名理由须对方share_activity | community.ts:91 |
| read.search | 无；见公共envelope | items | 公开活动/ACTIVE实体/ACTIVE PUBLIC profile | community.ts:107 |
| read.feed | 无；见公共envelope | items, next_cursor, has_more, total | 公开活动；参与人PUBLIC且share_activity；尊重mute | community.ts:108 |
| read.comments | id | items, next_cursor, has_more, total | 活动可见权限 | community.ts:109 |
| read.selfContact | 无；见公共envelope | wechat | 本人加密联系信息 | community.ts:113 |
| read.me | 无；见公共envelope | profile(本人完整profile), roles, following, followers, unread | 本人 | community.ts:114 |
| read.notifications | 无；见公共envelope | items, next_cursor, has_more, total | 仅本人 | community.ts:115 |
| read.relations | 无；见公共envelope | items, next_cursor, has_more, total | 登录；关系对象仅公开profile/实体 | community.ts:116 |
| read.mine | 无；见公共envelope | items, next_cursor, has_more, total | 仅本人owner | community.ts:117 |
| read.draft | id | id, type, owner, parent, status, version, created_at, updated_at, data 中展开的业务字段（put 返回不保证时间字段）, event/campaign全部字段, access(解密，仅编辑者) | 当前canEdit；campaign使用同canEdit逻辑（owner/platform/organization管理） | community.ts:118 |
| read.managed | 无；见公共envelope | items(entity完整记录) | 当前active角色或platform | community.ts:119 |
| read.reviews | 无；见公共envelope | items, next_cursor, has_more, total | 同review逐条判断 | community.ts:120 |
| read.review | id | id, type, owner, parent, status, version, created_at, updated_at, data 中展开的业务字段（put 返回不保证时间字段）, subject, reviews(相同轮次), scope, entity_id, round, subject_type, snapshot, title, event_id | scope PLATFORM/INITIATOR/实体当前角色 | community.ts:121 |
| read.progress | id | subject, items(全部历史轮review) | 当前canEdit | community.ts:122 |
| read.registration | id | id, type, owner, parent, status, version, created_at, updated_at, data 中展开的业务字段（put 返回不保证时间字段）, display_name, motivation, approval_status, contact_share_consent, payment_expires_at, event(publicEvent), can_manage | 报名本人或活动canEdit | community.ts:123 |
| read.attendees | id | items | 活动canEdit | community.ts:124 |
| read.admins | id | items(role记录) | 平台或对应OWNER | community.ts:125 |
| read.invitations | 无；见公共envelope | items(invitation记录) | 仅本人PENDING | community.ts:126 |
| write.profile | 无；见公共envelope | id, type, owner, parent, status, version, display_name, avatar_url, bio, introduction, city, interests, public_links, frequent_spaces, locale, notification_preferences, visibility, share_activity, onboarded, consent_version, consented_at | 仅本人；complete需privacy_consent；兴趣2–5；不授予角色 | community.ts:172 |
| write.follow | id | id, type, owner, parent, status, version | 禁止自己；目标profile存在或entity存在（未强制公开） | community.ts:183 |
| write.mute | id | id, type, owner, parent, status, version | 本人屏蔽；不检查目标存在 | community.ts:184 |
| write.report | reason | id, type, owner, parent, status, version, reason | 本人；reason非空；id可缺省为空 | community.ts:185 |
| write.recommend | id | id, type, owner, parent, status, version, text | 活动visible；enabled=false撤回 | community.ts:186 |
| write.comment | id; text | id, type, owner, parent, status, version, text, reply_to | 活动visible；reply_to必须同活动 | community.ts:187 |
| write.deleteComment | id | id, type, owner, parent, status, version, text | 评论owner或platform | community.ts:188 |
| write.read | 无；见公共envelope | ok | 本人未读；id缺省全部 | community.ts:189 |
| write.saveEvent | 无；见公共envelope | id, type, owner, parent, status, version, title, summary, description, city, organization_id, space_id, venue_name, address, starts_at, ends_at, capacity, price_minor, approval_required, waitlist_enabled, tags, fit_description, cover_url, media, visibility | 新建本人；编辑canEdit+version；DRAFT/CHANGES_REQUESTED/IN_REVIEW；公开媒体验证；QR必须private媒体且有权 | community.ts:190 |
| write.clone | id | id, type, owner, parent, status, version, title, summary, description, tags, fit_description, cover_url, visibility, capacity, price_minor, source_event_id | 源活动visible；新建本人DRAFT | community.ts:194 |
| write.submitEvent | id; version | id, type, owner, parent, status, version, event fields, round, host_display, venue_display, published_at(if previous) | canEdit+version+草稿/退回；验证时间容量价格城市实体profile；生成所有审核方 | community.ts:195 |
| write.saveCampaign | 无；见公共envelope | id, type, owner, parent, status, version, title, kicker, introduction, cover_url, organization_id, event_ids, resource_links, media, visibility | owner+version，DRAFT/CHANGES_REQUESTED/PUBLISHED；媒体验证 | community.ts:199 |
| write.submitCampaign | id; version | id, type, owner, parent, status, version, campaign fields, round | owner+version；草稿/退回；组织管理权；关联活动PUBLISHED/IN_REVIEW | community.ts:200 |
| write.review | id; version; approve | ok | 当前reviewAllowed+version+PENDING+相同round IN_REVIEW；拒绝需note | community.ts:205 |
| write.register | id; display_name; privacy_consent | id, type, owner, parent, status, version, display_name, motivation, approval_status, contact_share_consent, consent_version, consented_at, payment_expires_at | 公开活动且开始前>2h；姓名与隐私同意；满员需允许候补 | community.ts:213 |
| write.registrationDecision | id; version; approve | id, type, owner, parent, status, version, registration fields, approval_status, payment_expires_at | 活动canEdit+version，REQUESTED | community.ts:217 |
| write.cancelRegistration | id | ok | 报名本人；未关闭外部订单/已付费确认禁止直接取消 | community.ts:218 |
| write.registrationContact | id | wechat | canEdit+本次contact_share_consent+REQUESTED/APPROVED_AWAITING_PAYMENT/CONFIRMED+活动PUBLISHED；不缓存 | community.ts:219 |
| write.access | id | type, value, expires_at, methods[{type,value,expires_at}] | 报名本人或canEdit；CONFIRMED+PUBLISHED+未过期；每次解密，不缓存 | community.ts:220 |
| write.cancelEvent | id; version | ok | canEdit+version；付费确认需退款政策，未关闭订单拒绝 | community.ts:221 |
| write.entity | id; version | id, type, owner, parent, status, version, name, introduction, cover_url, avatar_url, address, opening_hours, public_contact, public_links, city, allow_event_requests | manages+version；不提供普通创建实体接口 | community.ts:222 |
| write.invite | id; user_id | id, type, owner, parent, status, version, inviter, role | 平台/实体OWNER；目标profile存在 | community.ts:223 |
| write.acceptInvite | id | id, type, owner, parent, status, version, inviter, role | 本人PENDING且邀请者仍platform/OWNER；不得覆盖OWNER | community.ts:224 |
| write.revokeRole | id | ok | 平台/实体OWNER；不得撤销OWNER/PLATFORM；同步撤销pending邀请 | community.ts:225 |
| expireHold | id | ok | internal；scheduler通过expire调用，guard串行；仅过期支付占位 | community.ts:246 |
| preparePayment | id | order_id, amount_minor, title, openid(仅内部), expires | internal；active本人报名、未过期待支付、活动PUBLISHED、微信identity | community.ts:271 |
| payment | id | timeStamp, nonceStr, package, signType, paySign | 本人；微信商户配置必需；金额openid由internal派生 | community.ts:281 |
| settlePayment | transaction | ok | internal；微信appid/mchid/金额币种trade_state/transaction_id匹配；重复成功幂等；晚支付requires_refund | community.ts:288 |
| paymentNotify | POST body{event_type,resource{algorithm,nonce,associated_data,ciphertext}}; Wechatpay-Timestamp/Nonce/Signature/Serial headers | HTTP204成功/非TRANSACTION.SUCCESS；HTTP400{code:FAIL,message} | 公开HTTP；微信平台RSA验签+时间±300秒+AES-GCM；仅可信成功回调 | community.ts:301 |
| expiryInfo | id | registration, order | internal only | community.ts:309 |
| expire | id | ok或retry | internal scheduler；查/关闭远程订单后expireHold；失败60秒重排 | community.ts:310 |
| wechatIdentity | openid | id | internal；按app/openid digest身份去重，无自动管理员 | community.ts:316 |
| wechatLogin | code | Montana refresh-token响应（不固定包装；由token.json透传） | 公开action；微信code交换后内部建立身份、mint token；配置必需 | community.ts:321 |
| mediaUpload | extension | path, upload_url | 已验证非guest登录；后缀jpg/jpeg/png/webp/mp4，private不允许mp4 | community.ts:332 |
| registerMedia | path | id, url | internal，active本人路径前缀；文件存在≤10MiB MIME合法 | community.ts:338 |
| mediaFinish | path | id, url, preview_url | 本人路径；文件magic bytes验证后登记；返回私有预览能力 | community.ts:343 |
| publicMedia | id | path | internal；非private且公开event/campaign/ACTIVE entity/PUBLIC profile实际引用 | community.ts:355 |
| media | GET path id | HTTP302签名存储下载地址；HTTP404 | 公开HTTP，仅publicMedia允许则302 | community.ts:356 |
| saveCalendarShare | params.from; params.to | id, items, params, generated_at | internal登录；仅允许city/from/to/space_id/tag/free_only/has_capacity；合法正跨度≤32天 | community.ts:359 |
| calendarCode | params.from; params.to | id, items, params, generated_at, code(base64真实微信码) | 登录+微信配置；保存筛选并生成真实pages/calendar/index小程序码 | community.ts:365 |
| privateMediaPermission | id; user | path | internal；代用户active，owner/当前编辑权限或有效已确认报名GROUP_QR绑定 | community.ts:391 |
| mediaPreview | id | url(5分钟签名能力) | 登录；调用privateMediaPermission实时权限检查 | community.ts:394 |
| privateMedia | GET query payload,signature | 文件bytes，Content-Type，Cache-Control:private,no-store；错误404 | 公开能力HTTP入口；HMAC/5分钟时限；每GET再查live ACL，内部存储URL60秒不外露 | community.ts:397 |
| runtime.send_magic_code | app-id; email | sent | app存在；verify需有效code；signout需token | server/lib/montana_web/controllers/auth_controller.ex:9 |
| runtime.verify_magic_code | app-id; email; code | user, created | app存在；verify需有效code；signout需token | server/lib/montana_web/controllers/auth_controller.ex:18 |
| runtime.send_phone_code | app-id; phone | sent | app存在；verify需有效code；signout需token | server/lib/montana_web/controllers/auth_controller.ex:29 |
| runtime.verify_phone_code | app-id; phone; code | user, created | app存在；verify需有效code；signout需token | server/lib/montana_web/controllers/auth_controller.ex:38 |
| runtime.signout | app-id; refresh-token |  | app存在；verify需有效code；signout需token | server/lib/montana_web/controllers/auth_controller.ex:96 |
| runtime.socket | init:app-id; call-function:name | init-ok{session-id,attrs,app-status,auth.user,client-event-id}, call-function-ok{result,client-event-id}, function-result(subscription), error{status,type,message,original-event} | AppID校验、refresh-token lookup；internal visibility禁止；函数另做业务授权 | server/lib/montana_web/session.ex:109 |
| runtime.verify_refresh_token | app-id; refresh-token | user | 有效token对应用户 | server/lib/montana_web/controllers/auth_controller.ex:73 |
| runtime.sign_in_guest | app-id | user | App存在；guest不可community:write或mediaUpload | server/lib/montana_web/controllers/auth_controller.ex:84 |
| runtime.link_email | app-id; refresh-token; email; code | user | 有效登录token+邮件验证code绑定到本人 | server/lib/montana_web/controllers/auth_controller.ex:50 |
| runtime.link_phone | app-id; refresh-token; phone; code | user | 有效登录token+手机验证code绑定到本人 | server/lib/montana_web/controllers/auth_controller.ex:59 |

## 记录关系

| 类型 | 关系 | 状态 |
| --- | --- | --- |
| profile | owner->$users | ACTIVE;visibility PUBLIC/private |
| contact | owner->$users | ACTIVE |
| entity | kind SPACE/ORGANIZATION；owner关系由role治理 | ACTIVE |
| role | owner->$users,parent->entity或PLATFORM scope | ACTIVE/REVOKED |
| membership | owner->$users,parent->entity；不是role，不授予权限 | ACTIVE |
| event | owner->$users,organization_id/space_id->entity | DRAFT/CHANGES_REQUESTED/IN_REVIEW/PUBLISHED/CANCELLED;visibility PUBLIC/UNLISTED/MEMBERS |
| eventSecret | parent->event | ACTIVE |
| registration | owner->$users,parent->event,payment_id->payment | PENDING/WAITLISTED/REQUESTED/APPROVED_AWAITING_PAYMENT/CONFIRMED/CANCELLED/REJECTED/EXPIRED/REFUNDED(终态识别，未实现退款动作) |
| review | parent->event/campaign,entity_id->entity,event_id->event,owner->initiator | PENDING/APPROVED/CHANGES_REQUESTED/SUPERSEDED |
| campaign | owner->$users,organization_id->entity,event_ids[]->event | DRAFT/CHANGES_REQUESTED/IN_REVIEW/PUBLISHED |
| notification | owner->$users,target{route,id}->业务对象，actor_id可选 | UNREAD/READ |
| follow | owner->$users,parent->$users/entity | ACTIVE/INACTIVE |
| mute | owner->$users,parent->$users | ACTIVE |
| report | owner->$users,parent->任意报告目标或空 | OPEN |
| comment | owner->$users,parent->event,reply_to->comment | ACTIVE/DELETED |
| recommendation | owner->$users,parent->event | ACTIVE/INACTIVE |
| command | owner->$users,parent->key | ACTIVE |
| audit | owner->$users,parent->操作目标 | ACTIVE |
| payment | owner->$users,parent->registration | PENDING/SUCCEEDED |
| wechatIdentity | owner->$users,parent->digest(appid,openid) | ACTIVE |
| media | owner->$users,parent->$files.path | ACTIVE |
| calendarShare | owner->$users | ACTIVE |
| invitation | owner->被邀请$user,parent->entity,inviter->$users | PENDING/ACCEPTED/REVOKED |
| guard | 固定初始化锁行 | ACTIVE |
| $users | runtime account | SUSPENDED/DELETED拒绝active |
| $files | storage path与media.parent关联 | 文件存在检查 |

## 历史部署与调用证据

- `apps/community706/deployment.json`：历史 v6、21 函数名；不能证明当前源码已发布。
- `apps/community706/evidence/runtime.json`：2026-10-08 匿名 init/config/events/people成功；events/people为空，me/selfContact/registrationContact拒绝；业务写0。
- `apps/community706/README.md` 与前端 `docs/montana-integration-matrix.md`：历史实现、部署、Mock说明；未见真实业务验收证据。
- `apps/community706/rules.json:22`：$users本人view；`:33` community706 deny；`deploy.py:23` / `:32`：规则与索引维护（未执行）。
- `server/lib/montana/functions.ex:154` / `:169`：internal限制；`server/lib/montana_web/session.ex:109` / `:299` / `:803`：socket身份与响应。

未运行测试、编译或界面检查。此清单是代码接入依据，不代表当前服务连通或真实账号操作通过。
