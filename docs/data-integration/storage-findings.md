# 按真实存储类型归组的差异讨论

共 44 个去重事项。原 147 项需求、81 项操作及 30 项差异索引完整保留。

字段缺口可以是 DTO 派生、join、消费者或前端接入差异，不能自动解释为新增数据库字段。冗余与接口重叠仅为候选，未作删除或合并决定。

## 去重统计

| 分类 | 数量 |
| --- | --- |
| field_gap | 10 |
| interface_gap | 16 |
| redundant_field_candidate | 7 |
| overlapping_interface_candidate | 5 |
| unassigned_requirement | 6 |

每个事项只计一次；多个实体引用同一个 ID 不重复计数。

## 真实实体引用索引

- profile：SF-NOTIFICATION-CONTENT, SF-MEMBER-FEATURED, SF-MEMBER-COUNT, SF-ENTITY-ACTIVE-COUNT, SF-INVITATION-TITLE, SF-NOTIFICATION-PREFERENCE, SF-PROFILE-VISIBILITY, SF-MEMBERSHIP-MAINTENANCE, SF-MEDIA-ARRAY-ACCESS, SF-PAGINATION-DETAIL, SF-IDENTITY-LINK, SF-CALENDAR-PREFS, SF-HOST-VENUE-SNAPSHOT, SF-PROFILE-FEATURED-OVERLAP, SF-EVENTS-CALENDAR-OVERLAP, SF-ME-MEMBER-OVERLAP, SF-POSTPONED-SCOPE, SF-LEGAL-PRIVACY-SUBJECT, SF-INTEREST-CONFIG, SF-FEED-PERSONALIZATION
- contact：SF-IDENTITY-LINK, SF-ME-MEMBER-OVERLAP, SF-LEGAL-PRIVACY-SUBJECT
- entity：SF-EVENT-ADDRESS, SF-MEMBER-FEATURED, SF-ENTITY-ACTIVE-COUNT, SF-INVITATION-TITLE, SF-ENTITY-REQUEST-POLICY, SF-ENTITY-CONTACT-ACCESS, SF-MEMBERSHIP-MAINTENANCE, SF-PAGINATION-OPTIONS, SF-PAGINATION-DETAIL, SF-HOST-VENUE-SNAPSHOT
- role：SF-ENTITY-CONTACT-ACCESS, SF-REVIEWS-COMPLETED, SF-NOTIFICATION-PRODUCERS, SF-INVITE-DECLINE, SF-ME-MEMBER-OVERLAP, SF-REVIEWS-PROGRESS-OVERLAP, SF-POSTPONED-SCOPE
- membership：SF-MEMBER-FEATURED, SF-PROFILE-VISIBILITY, SF-MEMBERSHIP-MAINTENANCE, SF-POSTPONED-SCOPE
- event：SF-NOTIFICATION-CONTENT, SF-CAMPAIGN-DERIVED, SF-EVENT-ADDRESS, SF-MEMBER-FEATURED, SF-MEMBER-COUNT, SF-ENTITY-ACTIVE-COUNT, SF-REVIEW-SNAPSHOT, SF-EVENT-FORM-COVERAGE, SF-ENTITY-REQUEST-POLICY, SF-ENTITY-CONTACT-ACCESS, SF-REVIEWS-COMPLETED, SF-REFUND-SERVICE, SF-MEDIA-ARRAY-ACCESS, SF-PAGINATION-OPTIONS, SF-PAGINATION-DETAIL, SF-NOTIFICATION-PRODUCERS, SF-REALTIME-CONTRACT, SF-DRAFT-DELETE, SF-COVER-FIRST-MEDIA, SF-HOST-VENUE-SNAPSHOT, SF-REVIEW-TITLE-COPY, SF-EVENTS-CALENDAR-OVERLAP, SF-MINE-DRAFT-OVERLAP, SF-REVIEWS-PROGRESS-OVERLAP, SF-POSTPONED-SCOPE, SF-FEED-PERSONALIZATION
- eventSecret：SF-MEDIA-ARRAY-ACCESS, SF-ACCESS-LEGACY-FLAT, SF-MINE-DRAFT-OVERLAP, SF-MEDIA-LAYER-OVERLAP
- registration：SF-MEMBER-FEATURED, SF-MEMBER-COUNT, SF-ENTITY-ACTIVE-COUNT, SF-REFUND-SERVICE, SF-PAYMENT-RECONCILE, SF-PAGINATION-DETAIL, SF-NOTIFICATION-PRODUCERS, SF-REALTIME-CONTRACT, SF-PAYMENT-REVERSE-LINK, SF-EVENTS-CALENDAR-OVERLAP, SF-LEGAL-PRIVACY-SUBJECT, SF-FEED-PERSONALIZATION
- review：SF-REVIEW-SNAPSHOT, SF-ENTITY-REQUEST-POLICY, SF-REVIEWS-COMPLETED, SF-NOTIFICATION-PRODUCERS, SF-REALTIME-CONTRACT, SF-REVIEW-TITLE-COPY, SF-REVIEWS-PROGRESS-OVERLAP
- campaign：SF-NOTIFICATION-CONTENT, SF-CAMPAIGN-DERIVED, SF-REVIEW-SNAPSHOT, SF-REVIEWS-COMPLETED, SF-MEDIA-ARRAY-ACCESS, SF-PAGINATION-OPTIONS, SF-DRAFT-DELETE, SF-COVER-FIRST-MEDIA, SF-REVIEW-TITLE-COPY, SF-MINE-DRAFT-OVERLAP, SF-REVIEWS-PROGRESS-OVERLAP, SF-POSTPONED-SCOPE
- notification：SF-NOTIFICATION-CONTENT, SF-NOTIFICATION-PREFERENCE, SF-REFUND-SERVICE, SF-NOTIFICATION-PRODUCERS, SF-REALTIME-CONTRACT, SF-ME-MEMBER-OVERLAP
- follow：SF-NOTIFICATION-PRODUCERS, SF-FEED-PERSONALIZATION
- mute：SF-FEED-PERSONALIZATION
- comment：SF-PAGINATION-DETAIL, SF-COMMENT-RECOMMENDATION-ID
- recommendation：SF-NOTIFICATION-PRODUCERS, SF-COMMENT-RECOMMENDATION-ID, SF-FEED-PERSONALIZATION
- payment：SF-REFUND-SERVICE, SF-PAYMENT-RECONCILE, SF-PAYMENT-REVERSE-LINK, SF-RUNTIME-CONFIG
- wechatIdentity：SF-IDENTITY-LINK, SF-RUNTIME-CONFIG
- media：SF-MEDIA-ARRAY-ACCESS, SF-MEDIA-LAYER-OVERLAP, SF-RUNTIME-CONFIG
- calendarShare：SF-CALENDAR-PREFS, SF-RUNTIME-CONFIG
- invitation：SF-INVITATION-TITLE, SF-INVITE-DECLINE
- $users：SF-IDENTITY-LINK, SF-RUNTIME-CONFIG
- $files：SF-MEDIA-ARRAY-ACCESS, SF-MEDIA-LAYER-OVERLAP

## 去重事项详情

### SF-NOTIFICATION-CONTENT

**分类：**field_gap；代码差异已确认；处理方式待讨论

**实体：**notification, profile, event, campaign
**字段：**notification.DTO.title, notification.DTO.description, notification.data.actor_id, notification.data.target
**操作：**read.notifications, write.read
**前端需求：**FE-R-notifications

前端消息需要title/description/actor；notify只写key/category/target，actor_id未在生产点赋值。可用key模板+目标对象join派生，未决定新增存储正文。

**后台/管理/任务/历史用途：**站内消息target导航和read_at已使用；标题快照与实时名称取舍需考虑历史改名。

**待讨论：**消息文案派生还是存事件时快照？谁作为actor？

**证据：**

- [community.ts:62](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:62)：notify仅key/target/category
- [community.ts:115](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:115)：可选actor_id join
- [screen.wxml:138](/Users/shing/Projects/706mini/miniprogram/templates/screen.wxml:138)：模板消费title/description

原差异引用：GAP-NOTIFICATION-CONTENT

### SF-CAMPAIGN-DERIVED

**分类：**field_gap；代码差异已确认；处理方式待讨论

**实体：**campaign, event
**字段：**campaign.DTO.cities, campaign.DTO.citySummary, campaign.DTO.resource_description, campaign.DTO.banner_description
**操作：**read.campaign, read.campaigns, write.saveCampaign
**前端需求：**FE-R-campaign, FE-R-campaigns

cities可由event_ids→event.city派生；resource_description/banner文案未在保存字段中定义。不能把每个演示固定文案直接变存储字段。

**后台/管理/任务/历史用途：**event_ids是专题关联与审核基础；kicker/introduction可作为文案来源。

**待讨论：**城市派生与编辑说明哪些是正式需要？

**证据：**

- [community.ts:87](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:87)：专题读取items但不派生cities
- [community.ts:199](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:199)：保存白名单
- [page.js:48](/Users/shing/Projects/706mini/miniprogram/lib/page.js:48)：城市摘要消费r.cities

原差异引用：GAP-CAMPAIGN-METADATA

### SF-EVENT-ADDRESS

**分类：**field_gap；代码差异已确认；处理方式待讨论

**实体：**event, entity
**字段：**event.data.space_id, event.data.address, event.DTO.address, entity.data.address
**操作：**write.submitEvent, read.event
**前端需求：**FE-R-event, FE-F-event-space_id, FE-F-event-address

选择space后表单不让填地址；validateEvent只写venue_display而未提供entity.address。因此是join/快照未落实，不是entity缺address。

**后台/管理/任务/历史用途：**自定义地点已有event.address；实体地址可能后来更改，事件历史需考虑。

**待讨论：**详情显示空间当前地址还是提交时快照？

**证据：**

- [forms.js:7](/Users/shing/Projects/706mini/miniprogram/lib/forms.js:7)：受管空间隐藏自定义地址
- [community.ts:151](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:151)：只赋空间名称
- [community.ts:38](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:38)：DTO来自event.address

原差异引用：GAP-VENUE-ADDRESS

### SF-MEMBER-FEATURED

**分类：**field_gap；代码差异已确认；处理方式待讨论

**实体：**profile, membership, entity, registration, event
**字段：**profile.data.featured_entities, profile.data.frequent_spaces, profile.DTO.frequent_entities, membership.parent
**操作：**write.profile, read.member
**前端需求：**FE-F-profile-frequent_spaces, FE-G-featured-update, FE-G-relations-membership

featured_entities优先掩盖frequent_spaces；前端存后回读期望空间与组织组合。已有memberEntities join，不需新增重复成员表。

**后台/管理/任务/历史用途：**组织正式成员来自membership，角色role不能替代；历史profile.featured_entities可能已写入。

**待讨论：**合并空间偏好与正式组织归属，还是保留一套可排序featured清单？

**证据：**

- [community.ts:67](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:67)：读取membership/参与记录
- [community.ts:70](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:70)：优先featured_entities
- [community.ts:173](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:173)：写profile只frequent_spaces

原差异引用：GAP-MEMBER-FEATURED

### SF-MEMBER-COUNT

**分类：**field_gap；代码差异已确认；处理方式待讨论

**实体：**profile, registration, event
**字段：**profile.DTO.activity_count
**操作：**read.member
**前端需求：**FE-R-member, FE-G-relations-membership

activity_count由目标本人CONFIRMED活动派生，前端标共同活动；没有viewer交集。差异是派生定义，不是需要存冗余count。

**后台/管理/任务/历史用途：**分享同意和公开事件条件已经参与过滤。

**待讨论：**共同是社区参与总数还是与浏览者共同参加？

**证据：**

- [community.ts:90](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:90)：计数只joined目标本人
- [screen.wxml:72](/Users/shing/Projects/706mini/miniprogram/templates/screen.wxml:72)：共同活动文案

原差异引用：GAP-MEMBER-ACTIVITY-COUNT

### SF-ENTITY-ACTIVE-COUNT

**分类：**field_gap；代码差异已确认；处理方式待讨论

**实体：**entity, event, registration, profile
**字段：**entity.DTO.event_count, entity.DTO.active_member_count, entity.DTO.members
**操作：**read.entities, read.entity
**前端需求：**FE-R-entities, FE-R-entity, FE-G-entity-pagination

directory只取未来未结束事件，主页所有公开事件；计数和成员范围不同，暂无统一近期定义。

**后台/管理/任务/历史用途：**CONFIRMED、share_activity、PUBLIC是已有展示许可条件，不可删。

**待讨论：**近期窗口与两个入口的集合应一致吗？

**证据：**

- [community.ts:88](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:88)：目录未来事件集合
- [community.ts:89](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:89)：主页全部公开事件集合

原差异引用：GAP-ACTIVE-MEMBER-WINDOW

### SF-INVITATION-TITLE

**分类：**field_gap；代码差异已确认；处理方式待讨论

**实体：**invitation, entity, profile
**字段：**invitation.DTO.title, invitation.data.parent, invitation.data.inviter
**操作：**read.invitations, write.invite
**前端需求：**FE-R-invitations

模板/需求读取title，真实invitations只原始行，缺邀请组织/空间名称和发起者join；可以派生DTO而非另存名称。

**后台/管理/任务/历史用途：**parent定位实体，inviter用于acceptInvite时再次验证邀请人权限，不能以未前端显示为由删除。

**待讨论：**邀请卡显示哪些实体与邀请人信息？

**证据：**

- [community.ts:126](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:126)：返回原始invitation
- [community.ts:223](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:223)：保存inviter和parent
- [community.ts:224](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:224)：inviter权限重查
- [screen.wxml:140](/Users/shing/Projects/706mini/miniprogram/templates/screen.wxml:140)：通用列表title兜底owner

### SF-REVIEW-SNAPSHOT

**分类：**field_gap；代码差异已确认；处理方式待讨论

**实体：**review, event, campaign
**字段：**review.data.snapshot, review.data.round, review.DTO.subject
**操作：**read.review, read.progress, write.review
**前端需求：**FE-R-review, FE-R-progress

已有snapshot但页面展示实时subject；INITIATOR行没有snapshot，progress混合轮次。应明确轮次/快照DTO，不增加重复业务主体。

**后台/管理/任务/历史用途：**旧审核决定与SUPERSEDED保留追溯用途；不能当未使用历史字段删除。

**待讨论：**展示审核时内容还是当前内容，如何并列？

**证据：**

- [community.ts:121](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:121)：读实时subject
- [community.ts:197](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:197)：event快照
- [community.ts:203](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:203)：INITIATOR无snapshot
- [community.ts:122](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:122)：全轮次progress

原差异引用：GAP-REVIEW-SNAPSHOT

### SF-NOTIFICATION-PREFERENCE

**分类：**field_gap；代码差异已确认；处理方式待讨论

**实体：**profile, notification
**字段：**profile.data.notification_preferences.enabled
**操作：**write.profile, read.me
**前端需求：**FE-W-profile-preferences

前端可存通知开关，notify不读取；字段存在，缺消费者或语义，并非缺字段建表。

**后台/管理/任务/历史用途：**安全/审核/支付必要站内通知可能不应被用户屏蔽；先定义开关作用。

**待讨论：**开关控制站内还是微信推送？必要消息是否例外？

**证据：**

- [community.ts:173](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:173)：profile允许保存偏好
- [community.ts:62](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:62)：notify无偏好判断
- [page.js:156](/Users/shing/Projects/706mini/miniprogram/lib/page.js:156)：前端开关

原差异引用：GAP-NOTIFICATION-PREFERENCE

### SF-EVENT-FORM-COVERAGE

**分类：**field_gap；代码差异已确认；处理方式待讨论

**实体：**event
**字段：**event.data.tags, event.data.fit_description, event.data.waitlist_enabled
**操作：**write.saveEvent, write.submitEvent, read.event
**前端需求：**FE-W-save-event, FE-R-event

字段已存在但发布表单没有对应编辑控件；是前端字段接入缺口，不是存储缺字段。

**后台/管理/任务/历史用途：**tags用于筛选，waitlist_enabled控制服务端满额报名，fit_description详情展示。

**待讨论：**当前首版需要允许编辑哪些字段？

**证据：**

- [community.ts:144](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:144)：存储白名单
- [forms.js:2](/Users/shing/Projects/706mini/miniprogram/lib/forms.js:2)：表单缺控件

原差异引用：GAP-EVENT-FORM-FIELDS

### SF-PROFILE-VISIBILITY

**分类：**interface_gap；代码差异已确认；处理方式待讨论

**实体：**profile, membership
**字段：**profile.data.visibility
**操作：**read.member, read.people, read.relations
**前端需求：**FE-W-profile-preferences, FE-R-member

PUBLIC/MEMBERS开关存在，publicProfile只PUBLIC；需要受众授权DTO语义，而不是新增同名接口。

**后台/管理/任务/历史用途：**PUBLIC过滤保护隐私，不能为让列表有值去掉。membership和注册账号不同。

**待讨论：**MEMBERS受众定义？

**证据：**

- [community.ts:31](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:31)：publicProfile只PUBLIC
- [page.js:156](/Users/shing/Projects/706mini/miniprogram/lib/page.js:156)：提供MEMBERS

原差异引用：GAP-PROFILE-VISIBILITY

### SF-ENTITY-REQUEST-POLICY

**分类：**interface_gap；代码差异已确认；处理方式待讨论

**实体：**entity, event, review
**字段：**entity.data.allow_event_requests, event.data.space_id
**操作：**write.entity, write.submitEvent
**前端需求：**FE-F-entity-allow_event_requests, FE-W-submit-event

开关已存但提交仅检查实体ACTIVE/kind，未约束外部申请。缺服务端规则执行而非字段。

**后台/管理/任务/历史用途：**空间审核链仍必要；管理员自己发起可能需例外，未决定。

**待讨论：**关开关后谁仍可申请？

**证据：**

- [community.ts:151](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:151)：空间校验
- [community.ts:196](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:196)：空间审核
- [community.ts:222](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:222)：开关保存

原差异引用：GAP-SPACE-REQUEST-POLICY

### SF-ENTITY-CONTACT-ACCESS

**分类：**interface_gap；代码差异已确认；处理方式待讨论

**实体：**entity, event, role
**字段：**entity.data.public_contact, entity.data.public_links
**操作：**read.entity, write.entity
**前端需求：**FE-F-entity-public_contact, FE-R-entity

非管理DTO删除联系人；没有获准发起者读取路径。公众号/回顾等具体字段未定，可用public_links但不能先默认公开。

**后台/管理/任务/历史用途：**role权限和明确公开许可不能被公共页面替代。

**待讨论：**哪些真正公开，哪些只对已批准发起者？

**证据：**

- [community.ts:54](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:54)：entityDTO去私有联系
- [community.ts:222](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:222)：实体编辑白名单
- [backlog.md:11](/Users/shing/Projects/706mini/docs/backlog.md:11)：节点资料候选

原差异引用：GAP-ENTITY-CONTACT

### SF-MEMBERSHIP-MAINTENANCE

**分类：**interface_gap；代码差异已确认；处理方式待讨论

**实体：**membership, profile, entity
**字段：**membership.owner, membership.parent, membership.data.contribution, profile.data.featured_entities
**操作：**read.member, write.profile
**前端需求：**FE-G-relations-membership, FE-G-featured-update

membership已读取但81操作未见维护入口；不能由profile自行给自己设正式成员。需要授权后台操作设计，不是自动改write.profile白名单。

**后台/管理/任务/历史用途：**独立成员身份与管理员role隔离；可能通过外部受控后台维护，尚未有运行证据。

**待讨论：**谁能创建/撤销成员关系，用什么证明？

**证据：**

- [community.ts:67](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:67)：membership读取
- [community.ts:173](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:173)：profile写入不含membership
- [backlog.md:22](/Users/shing/Projects/706mini/docs/backlog.md:22)：不自动合并提权

原差异引用：GAP-MEMBER-FEATURED, GAP-POSTPONED-REQUIREMENTS

### SF-REVIEWS-COMPLETED

**分类：**interface_gap；代码差异已确认；处理方式待讨论

**实体：**review, event, campaign, role
**字段：**review.status, review.data.decided_by, review.data.round
**操作：**read.reviews, read.progress
**前端需求：**FE-G-pending-approvals, FE-R-reviews

真实reviews仅PENDING；done仅mock过滤专题，非完成列表契约。按操作者/实体/主体完成的含义需定。

**后台/管理/任务/历史用途：**progress历史能查单主体但不等于审核人员已处理集合。

**待讨论：**完成按谁/哪个范围定义？

**证据：**

- [community.ts:120](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:120)：只PENDING
- [page.js:62](/Users/shing/Projects/706mini/miniprogram/lib/page.js:62)：done mock分支

原差异引用：GAP-REVIEW-COMPLETED

### SF-REFUND-SERVICE

**分类：**interface_gap；代码差异已确认；处理方式待讨论

**实体：**payment, registration, event, notification
**字段：**payment.data.requires_refund, registration.status
**操作：**payment, settlePayment, write.cancelRegistration, write.cancelEvent
**前端需求：**FE-G-refund, FE-W-cancel-registration, FE-W-cancel-event, FE-P-reconcile

仅拒绝已付取消及requires_refund标记；无退款申请/执行/回调/查询契约，属于未决规则之后的服务缺口。

**后台/管理/任务/历史用途：**requires_refund后台处理异常支付用途明确，不能删；真实退款凭证也不应只存前端。

**待讨论：**退款责任政策及异常赔付由谁处理？

**证据：**

- [community.ts:218](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:218)：REFUND_POLICY_REQUIRED
- [community.ts:296](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:296)：requires_refund
- [backlog.md:24](/Users/shing/Projects/706mini/docs/backlog.md:24)：规则未决

原差异引用：GAP-REFUND-LIFECYCLE

### SF-PAYMENT-RECONCILE

**分类：**interface_gap；代码差异已确认；处理方式待讨论

**实体：**payment, registration
**字段：**payment.status, registration.status, registration.data.payment_expires_at
**操作：**payment, settlePayment, read.registration, expire
**前端需求：**FE-P-reconcile, FE-P-payment

已有回调结算和read.registration，但前端付款后只load一次，无异步确认闭环。不是新付款接口缺失。

**后台/管理/任务/历史用途：**expiryInfo/expire保证占位和关单，不能因为未前端直接调用删除internal接口。

**待讨论：**使用权威轮询、业务事件刷新或明确手动刷新？

**证据：**

- [page.js:125](/Users/shing/Projects/706mini/miniprogram/lib/page.js:125)：requestPayment后一次load
- [community.ts:297](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:297)：回调确认
- [community.ts:310](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:310)：到期任务

原差异引用：GAP-PAYMENT-SETTLEMENT-UX

### SF-MEDIA-ARRAY-ACCESS

**分类：**interface_gap；代码差异已确认；处理方式待讨论

**实体：**media, $files, event, eventSecret, campaign, profile
**字段：**event.data.media, campaign.data.media, eventSecret.data.payload.methods[].value, media.DTO.preview_url
**操作：**mediaFinish, mediaPreview, privateMedia
**前端需求：**FE-M-preview-arrays, FE-F-event-media, FE-F-campaign-media, FE-F-event-join_methods

媒体权限接口已存在；前端数组丢弃预览值、refreshMedia只平面字段，详情不渲染media[]。这是同一接入缺口涉及多实体，计1项。

**后台/管理/任务/历史用途：**canonical公共引用/private群码标识与短时签名分离，签名不可持久化为业务URL。

**待讨论：**预览映射如何按数组项刷新，并如何展示多媒体？

**证据：**

- [page.js:153](/Users/shing/Projects/706mini/miniprogram/lib/page.js:153)：数组只存asset.url
- [page.js:179](/Users/shing/Projects/706mini/miniprogram/lib/page.js:179)：只平面3键
- [community.ts:348](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:348)：preview_url
- [community.ts:375](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:375)：实时ACL

原差异引用：GAP-MEDIA-PREVIEW, GAP-MEDIA-DETAIL

### SF-PAGINATION-OPTIONS

**分类：**interface_gap；代码差异已确认；处理方式待讨论

**实体：**entity, event, campaign
**字段：**DTO.next_cursor, DTO.has_more
**操作：**read.entities, read.events, read.mine, read.campaigns
**前端需求：**FE-R-event-options, FE-R-entities, FE-R-campaigns, FE-L-pagination

辅助选项只第一30条；managed本来全量，不计入此缺口。需要复用已有cursor或搜索分页。

**后台/管理/任务/历史用途：**主列表onReachBottom、allMine已有，不能误报全站缺分页。

**待讨论：**选择器检索/续读方式？

**证据：**

- [community.ts:49](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:49)：分页30
- [page.js:74](/Users/shing/Projects/706mini/miniprogram/lib/page.js:74)：entities一页
- [page.js:76](/Users/shing/Projects/706mini/miniprogram/lib/page.js:76)：活动选项一页
- [community.ts:119](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:119)：managed全量

原差异引用：GAP-PAGINATION-SELECTORS

### SF-PAGINATION-DETAIL

**分类：**interface_gap；代码差异已确认；处理方式待讨论

**实体：**entity, profile, event, comment, registration
**字段：**DTO.items, DTO.members, DTO.comments, DTO.total
**操作：**read.entity, read.member, read.comments, read.event
**前端需求：**FE-G-entity-pagination, FE-R-member, FE-R-event

详情内嵌集合全量且评论分页未接，需确定独立游标；calendar完整期间为另一契约，不机械要求分页。

**后台/管理/任务/历史用途：**member/entity join派生成员及活动，评论状态/作者隐私必须保留。

**待讨论：**详情集合阈值与稳定排序如何定义？

**证据：**

- [community.ts:89](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:89)：entity内嵌全量
- [community.ts:90](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:90)：member内嵌全量
- [community.ts:109](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:109)：comments已有分页
- [page.js:47](/Users/shing/Projects/706mini/miniprogram/lib/page.js:47)：只r.comments

原差异引用：GAP-PAGINATION-NESTED, GAP-PAGINATION-STABILITY

### SF-NOTIFICATION-PRODUCERS

**分类：**interface_gap；代码差异已确认；处理方式待讨论

**实体：**notification, review, event, registration, follow, recommendation, role
**字段：**notification.data.key, notification.data.target
**操作：**write.submitEvent, write.follow, write.recommend, write.revokeRole
**前端需求：**FE-R-notifications, FE-G-subscription

需确认必要事件生产；活动提交无审核人通知、若干社交/角色提醒未生产。微信订阅另外需同意与投递配置，不能把站内notify当微信送达。

**后台/管理/任务/历史用途：**当前站内notify、角色邀请/支付/评论通知真实代码存在；未做真实投递。

**待讨论：**首版消息类型和渠道有哪些？

**证据：**

- [community.ts:195](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:195)：提交event审核无notify
- [community.ts:62](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:62)：站内存储
- [backend-ai-agent-development-manual.md:277](/Users/shing/Projects/706mini/docs/backend-ai-agent-development-manual.md:277)：类型属于建议

原差异引用：GAP-NOTIFICATION-EVENTS

### SF-REALTIME-CONTRACT

**分类：**interface_gap；代码差异已确认；处理方式待讨论

**实体：**event, registration, review, notification
**字段：**DTO.change_event
**操作：**runtime.socket, read.registration, read.notifications
**前端需求：**FE-T-realtime, FE-P-reconcile

socket仅发函数并按client-event-id处理响应，未订阅业务变更。传输socket存在不等于realtime功能。

**后台/管理/任务/历史用途：**onShow/下拉刷新是已有拉取；runtime其它客户可能使用订阅，不能删通用socket。

**待讨论：**首版需实时刷新哪些对象？

**证据：**

- [montana.js:45](/Users/shing/Projects/706mini/miniprogram/lib/montana.js:45)：onMessage仅pending response
- [page.js:10](/Users/shing/Projects/706mini/miniprogram/lib/page.js:10)：onShow拉取

### SF-IDENTITY-LINK

**分类：**interface_gap；代码差异已确认；处理方式待讨论

**实体：**$users, wechatIdentity, profile, contact
**字段：**wechatIdentity.parent, wechatIdentity.owner
**操作：**wechatLogin, runtime.link_email, runtime.link_phone
**前端需求：**FE-A-wechat, FE-A-phone-verify, FE-A-email-verify

runtime已有link能力目录，但小程序未接；微信openid创建独立$users，验证码与微信资料可能不同。不能自动按联系字段合并。

**后台/管理/任务/历史用途：**openid加密和digest用于找回身份，CONTACT_KEY不可无迁移轮换；runtime其它应用也使用link。

**待讨论：**是否要绑账号，如何证明双身份？

**证据：**

- [community.ts:316](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:316)：openid身份
- [page.js:177](/Users/shing/Projects/706mini/miniprogram/lib/page.js:177)：微信独立登录
- [montana.js:67](/Users/shing/Projects/706mini/miniprogram/lib/montana.js:67)：验证码路径

原差异引用：GAP-AUTH-ACCOUNT-LINK

### SF-CALENDAR-PREFS

**分类：**interface_gap；代码差异已确认；处理方式待讨论

**实体：**profile, calendarShare
**字段：**profile.DTO.calendar_preferences, calendarShare.data.params
**操作：**write.profile, calendarCode, read.calendarShare
**前端需求：**FE-L-prefs, FE-L-filters

日历滤选页面state未账户持久化；calendarShare是一次分享参数，不能冒充账户偏好。是否需要服务端字段未定。

**后台/管理/任务/历史用途：**分享回流参数须保持，不能因为不用于偏好删除。

**待讨论：**需要本机还是跨设备恢复？

**证据：**

- [page.js:102](/Users/shing/Projects/706mini/miniprogram/lib/page.js:102)：页面filters
- [community.ts:359](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:359)：一次分享params
- [backend-ai-agent-development-manual.md:71](/Users/shing/Projects/706mini/docs/backend-ai-agent-development-manual.md:71)：偏好需求

原差异引用：GAP-CALENDAR-PREFERENCES

### SF-DRAFT-DELETE

**分类：**interface_gap；候选需求；未批准实现

**实体：**event, campaign
**字段：**event.status, campaign.status
**操作：**write.saveEvent, write.saveCampaign
**前端需求：**FE-G-draft-delete

前端需求索引明确保留是否需要删除草稿的待确认项；未见deleteDraft操作，不能直接推导必须新增。

**后台/管理/任务/历史用途：**编辑和提交依赖草稿，command历史保留需定义软删除。

**待讨论：**删除/清理草稿是否首版需求？

**证据：**

- [page.js:161](/Users/shing/Projects/706mini/miniprogram/lib/page.js:161)：保存表单
- [community.ts:190](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:190)：saveEvent
- [community.ts:199](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:199)：saveCampaign

### SF-INVITE-DECLINE

**分类：**interface_gap；候选需求；未批准实现

**实体：**invitation, role
**字段：**invitation.status
**操作：**write.invite, write.acceptInvite, write.revokeRole
**前端需求：**FE-G-invite-decline

接受与Owner撤销已有，受邀人主动拒绝未见；不可将role撤销接口当拒绝邀请。

**后台/管理/任务/历史用途：**邀请人权限重查及Owner不可撤销规则已用。

**待讨论：**是否需要拒绝以及拒绝后的历史状态？

**证据：**

- [community.ts:224](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:224)：接受邀请
- [community.ts:225](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:225)：撤销角色及匹配邀请

### SF-COVER-FIRST-MEDIA

**分类：**redundant_field_candidate；冗余候选；禁止据此删除

**实体：**event, campaign
**字段：**data.cover_url, data.media[image].url
**操作：**write.saveEvent, write.saveCampaign, read.event, read.campaigns
**前端需求：**FE-F-event-media, FE-F-campaign-media

cover_url与第一图内容可能重复，但卡片/旧单图记录/clone独立读cover；不是可直接删除。

**后台/管理/任务/历史用途：**旧记录没有media；卡片只需轻量封面；clone只复制cover。

**待讨论：**把cover定义为派生或独立选图？需要兼容迁移吗？

**证据：**

- [forms.js:13](/Users/shing/Projects/706mini/miniprogram/lib/forms.js:13)：从第一图选择cover
- [community.ts:194](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:194)：clone复制cover

### SF-HOST-VENUE-SNAPSHOT

**分类：**redundant_field_candidate；冗余候选；禁止据此删除

**实体：**event, entity, profile
**字段：**event.data.host_display, event.data.venue_display, event.data.organization_id, event.data.space_id
**操作：**write.submitEvent, read.event, read.events
**前端需求：**FE-R-event, FE-R-calendar

显示名与关联实体/个人名称可join，但当前submit固定它们，可能是发布快照。改为全派生会改变历史内容和搜索。

**后台/管理/任务/历史用途：**events q用host_display/venue_display；公开卡片直接消费；历史名称保留可能必要。

**待讨论：**这些是历史快照还是始终最新名称？

**证据：**

- [community.ts:57](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:57)：搜索显示名
- [community.ts:151](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:151)：固定venue_display
- [community.ts:155](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:155)：固定host_display

### SF-ACCESS-LEGACY-FLAT

**分类：**redundant_field_candidate；冗余候选；禁止据此删除

**实体：**eventSecret
**字段：**eventSecret.data.payload.type, eventSecret.data.payload.value, eventSecret.data.payload.methods
**操作：**write.saveEvent, write.access, mediaPreview
**前端需求：**FE-W-private-access, FE-F-event-join_methods

payload同时平面第一method与methods数组；新路径消费methods但旧记录/返回仍兼容平面结构。

**后台/管理/任务/历史用途：**toForm、access与mediaPermission均有fallback；加密数据迁移要保留访问及到期语义。

**待讨论：**是否已存在旧单参与方式记录？有无安全迁移计划？

**证据：**

- [community.ts:192](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:192)：同时写第一项和数组
- [community.ts:220](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:220)：返回平面+methods
- [forms.js:8](/Users/shing/Projects/706mini/miniprogram/lib/forms.js:8)：旧结构fallback

### SF-PROFILE-FEATURED-OVERLAP

**分类：**redundant_field_candidate；冗余候选；禁止据此删除

**实体：**profile
**字段：**profile.data.featured_entities, profile.data.frequent_spaces
**操作：**read.member, write.profile
**前端需求：**FE-G-featured-update

两字段有空间重叠且优先造成显示问题，但featured可含组织与排序，frequent_spaces是本人偏好。不能简单删除一个。

**后台/管理/任务/历史用途：**历史固定featured列表、membership组织许可依赖当前组装。

**待讨论：**合并数据来源还是保留语义不同字段？

**证据：**

- [community.ts:70](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:70)：优先分支
- [community.ts:73](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:73)：组织需membership

原差异引用：GAP-MEMBER-FEATURED

### SF-REVIEW-TITLE-COPY

**分类：**redundant_field_candidate；冗余候选；禁止据此删除

**实体：**review, event, campaign
**字段：**review.data.title, review.data.snapshot.title
**操作：**read.reviews, read.review
**前端需求：**FE-R-reviews, FE-R-review

review.title与snapshot/title可能重复，但INITIATOR无snapshot，列表使用title，删字段会破坏历史列表。

**后台/管理/任务/历史用途：**审核快照稳定标题、列表轻量返回、历史行兼容。

**待讨论：**统一snapshot是否值得增加读取体积？

**证据：**

- [community.ts:197](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:197)：snapshot+title
- [community.ts:203](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:203)：INITIATOR只有title
- [community.ts:120](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:120)：列表title

### SF-PAYMENT-REVERSE-LINK

**分类：**redundant_field_candidate；冗余候选；禁止据此删除

**实体：**payment, registration
**字段：**registration.data.payment_id, payment.parent
**操作：**settlePayment, expiryInfo, read.registration
**前端需求：**FE-R-registration, FE-P-reconcile

双向引用可能冗余，但payment.parent用于支付到报名，registration.payment_id确认到账对象，历史重试订单可能不同。

**后台/管理/任务/历史用途：**支付回调、结算追溯和未来退款定位需要明确订单。

**待讨论：**每报名是否严格单订单？重付/退款如何关联？

**证据：**

- [community.ts:277](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:277)：payment.parent登记
- [community.ts:297](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:297)：registration.payment_id
- [community.ts:309](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:309)：按parent找订单

### SF-COMMENT-RECOMMENDATION-ID

**分类：**redundant_field_candidate；冗余候选；需确认历史用途

**实体：**comment, recommendation
**字段：**comment.data.recommendation_id
**操作：**write.comment, read.comments, write.recommend
**前端需求：**FE-W-comment, FE-R-event

comments badge会读recommendation_id但write.comment未写；可能是遗留兼容字段或缺失关系，并不能认定可删。

**后台/管理/任务/历史用途：**历史管理员导入数据可能赋此字段；推荐徽章也可按owner+event派生但语义不同。

**待讨论：**徽章表示该评论引用某次推荐，还是此人当前推荐过？

**证据：**

- [community.ts:77](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:77)：徽章读字段
- [community.ts:187](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:187)：comment不写该字段

### SF-EVENTS-CALENDAR-OVERLAP

**分类：**overlapping_interface_candidate；接口重叠候选；不代表可合并

**实体：**event, registration, profile
**字段：**DTO.items
**操作：**read.events, read.calendar
**前端需求：**FE-R-calendar, FE-R-event-options

共享events筛选核心，但events分页、calendar完整期间；可复用内部计算，不能直接删一公开op。

**后台/管理/任务/历史用途：**专题选择器分页与日历跨日计数/海报完整数据各有用途。

**待讨论：**是否统一内部query而保留不同响应契约？

**证据：**

- [community.ts:83](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:83)：events paginate
- [community.ts:84](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:84)：calendar完整区间

### SF-MINE-DRAFT-OVERLAP

**分类：**overlapping_interface_candidate；接口重叠候选；不代表可合并

**实体：**event, campaign, eventSecret
**字段：**data.status, DTO.access
**操作：**read.mine, read.draft, read.event
**前端需求：**FE-R-mine, FE-R-draft, FE-R-event

同主体读路径重叠但权限与秘密数据不同：mine列表、draft编辑含access、event公开详情。

**后台/管理/任务/历史用途：**编辑ACL、私人群码解密与公开DTO边界明确，不能统一裸返回。

**待讨论：**是否只统一内部基础加载？

**证据：**

- [community.ts:117](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:117)：mine列表
- [community.ts:118](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:118)：draft解密access
- [community.ts:76](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:76)：event公开详情

### SF-ME-MEMBER-OVERLAP

**分类：**overlapping_interface_candidate；接口重叠候选；不代表可合并

**实体：**profile, contact, role, notification
**字段：**DTO.profile, DTO.roles, DTO.frequent_entities
**操作：**read.me, read.member, read.selfContact, read.people
**前端需求：**FE-R-me, FE-R-member, FE-R-self-contact

都是人员资料但me含本人原始profile与roles/unread，member公开组装，selfContact加密敏感字段单独读取；不可合并为公开大DTO。

**后台/管理/任务/历史用途：**权限边界、推荐理由和计数join各不同。

**待讨论：**只复用公开profile投影和派生计数，而保持授权入口？

**证据：**

- [community.ts:90](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:90)：公开member
- [community.ts:113](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:113)：私密selfContact
- [community.ts:114](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:114)：本人me

### SF-MEDIA-LAYER-OVERLAP

**分类：**overlapping_interface_candidate；接口重叠候选；不代表可合并

**实体：**media, $files, eventSecret
**字段：**media.parent, media.data.private
**操作：**mediaUpload, mediaFinish, registerMedia, mediaPreview, privateMediaPermission, privateMedia, publicMedia, media
**前端需求：**FE-M-permit, FE-M-finish, FE-M-preview

函数名相近但action/internal/HTTP职责、上传验证和访问权限分离；仅共享内部ACL/metadata有复用机会。

**后台/管理/任务/历史用途：**HTTP匿名公共资源与HMAC私有读取、服务端签名存储地址都在实际链路。

**待讨论：**可统一内部权限函数，不改变公开/私有授权边界吗？

**证据：**

- [community.ts:332](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:332)：upload capability
- [community.ts:343](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:343)：finish检查字节
- [community.ts:355](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:355)：公共internal+HTTP
- [community.ts:394](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:394)：preview签名
- [community.ts:397](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:397)：私有HTTP重检

### SF-REVIEWS-PROGRESS-OVERLAP

**分类：**overlapping_interface_candidate；接口重叠候选；不代表可合并

**实体：**review, event, campaign, role
**字段：**review.parent, review.data.round
**操作：**read.reviews, read.review, read.progress
**前端需求：**FE-R-reviews, FE-R-review, FE-R-progress

待办列表、审核者详情和发起者进度都读review，但授权主体不同；可共用按轮读取，不能把canEdit与reviewAllowed混成一个权限。

**后台/管理/任务/历史用途：**审核人scope与发起者编辑权限分离、历史轮次展示。

**待讨论：**内部组装是否统一而保持独立入口？

**证据：**

- [community.ts:120](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:120)：待办reviewAllowed
- [community.ts:121](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:121)：审核详情reviewAllowed
- [community.ts:122](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:122)：发起者progress canEdit

### SF-RUNTIME-CONFIG

**分类：**unassigned_requirement；配置与运行未确认；非新增表需求

**实体：**$users, wechatIdentity, payment, media, calendarShare
**字段：**environment.WX_*, environment.CONTACT_KEY, environment.MONTANA_*
**操作：**wechatLogin, payment, mediaUpload, calendarCode, runtime.send_phone_code, runtime.send_magic_code
**前端需求：**FE-A-wechat, FE-A-phone-send, FE-A-email-send, FE-P-payment, FE-C-code

真实配置、合法域名和生产账号初始化不是community706业务字段缺口。当前接口存在，未读密钥或调用生产，能力flag检查不代表完整配置。

**后台/管理/任务/历史用途：**CONTACT_KEY保护历史加密数据和签名；AppID/商户/短信服务由配置owner维护。

**待讨论：**由谁确认配置与真实账号运行？

**证据：**

- [community.ts:82](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:82)：capabilities仅部分环境
- [community.ts:282](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:282)：支付环境
- [community.ts:322](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:322)：登录环境
- [config.js:3](/Users/shing/Projects/706mini/miniprogram/config.js:3)：默认mock

原差异引用：GAP-AUTH-CONFIG, GAP-PAYMENT-CONFIG, GAP-OPERATOR-SEED, GAP-DEPLOYMENT-PROVENANCE

### SF-POSTPONED-SCOPE

**分类：**unassigned_requirement；后置/候选；不可自动实施

**实体：**profile, membership, role, event, campaign
**字段：**无已决定字段
**操作：**未定
**前端需求：**FE-G-relations-membership

自由动态、外部成员导入/徽章、协办嘉宾、模板及节点归属仍后置/候选；147需求与81操作未给定完整正式契约。不得强配现有表后直接建字段。

**后台/管理/任务/历史用途：**已有clone/campaign/membership读取保留；注册不等于正式成员，不能自动提权。

**待讨论：**哪些未来需求真正进入本期？

**证据：**

- [backlog.md:20](/Users/shing/Projects/706mini/docs/backlog.md:20)：角色未决
- [backlog.md:22](/Users/shing/Projects/706mini/docs/backlog.md:22)：外部成员后置
- [backlog.md:23](/Users/shing/Projects/706mini/docs/backlog.md:23)：自由动态后置

原差异引用：GAP-POSTPONED-REQUIREMENTS

### SF-LEGAL-PRIVACY-SUBJECT

**分类：**unassigned_requirement；运营输入待确认

**实体：**profile, registration, contact
**字段：**configuration.privacyVersion, configuration.legal_entity, configuration.privacy_contact
**操作：**未定
**前端需求：**FE-G-privacy-subject

已有consent_version/time，但正式隐私主体/联系方式未补齐；这是法律/运营输入，不是复制一份profile字段即可解决。

**后台/管理/任务/历史用途：**已有报名用途同意和加密联系方式的证据仍需保留。

**待讨论：**正式主体及渠道由谁提供并批准？

**证据：**

- [screen.wxml:125](/Users/shing/Projects/706mini/miniprogram/templates/screen.wxml:125)：隐私正文说明主体待补齐
- [community.ts:177](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:177)：profile同意版本时间
- [community.ts:215](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:215)：报名同意

### SF-INTEREST-CONFIG

**分类：**unassigned_requirement；候选配置需求

**实体：**profile
**字段：**profile.data.interests, configuration.interest_options
**操作：**read.config, write.profile
**前端需求：**FE-G-interest-config, FE-F-profile-interests

兴趣选项固定中文，config仅城市；是否需要稳定interest ID/双语配置尚未定，不能直接迁移字符串历史资料。

**后台/管理/任务/历史用途：**已有兴趣字符串参与共同兴趣推荐，历史值与翻译一致性需考虑。

**待讨论：**中文自由标签还是配置化多语言ID？

**证据：**

- [page.js:132](/Users/shing/Projects/706mini/miniprogram/lib/page.js:132)：固定中文interestOptions
- [community.ts:82](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:82)：config仅城市等
- [community.ts:104](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:104)：共同兴趣比较

### SF-ERROR-CONTRACT

**分类：**unassigned_requirement；代码接入差异；非存储缺字段

**实体：**跨表/非存储需求
**字段：**DTO.error.code, DTO.error.details
**操作：**runtime.socket
**前端需求：**FE-L-errors, FE-T-call

错误映射未完整覆盖，涉及多操作但不归一业务表，不应按实体重复计缺字段。

**后台/管理/任务/历史用途：**版本冲突/状态冲突/幂等key保留，错误不应都改盲目重试。

**待讨论：**统一错误字典与行动说明由哪个层维护？

**证据：**

- [i18n.js:11](/Users/shing/Projects/706mini/miniprogram/lib/i18n.js:11)：字典缺若干真实码
- [montana.js:64](/Users/shing/Projects/706mini/miniprogram/lib/montana.js:64)：details已保留

原差异引用：GAP-ERROR-COVERAGE

### SF-FEED-PERSONALIZATION

**分类：**unassigned_requirement；产品语义待讨论

**实体：**follow, mute, recommendation, registration, profile, event
**字段：**无已决定字段
**操作：**read.feed
**前端需求：**FE-R-feed

关注流与同城公共流排序要求未定；已有feed city/mute，不是缺feed字段，也不把演示固定推荐语升成数据。

**后台/管理/任务/历史用途：**follow和mute独立，推荐/参与公开许可必须保留。

**待讨论：**关注应影响排序、过滤还是只解释关系？

**证据：**

- [community.ts:108](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:108)：同城聚合及mute
- [backend-ai-agent-development-manual.md:69](/Users/shing/Projects/706mini/docs/backend-ai-agent-development-manual.md:69)：个性化概述

原差异引用：GAP-FEED-PERSONALIZATION

## 保留与执行说明

- 全部冗余/重叠为候选，未前端调用不是删除依据；已逐项注明任务/后台/历史兼容用途。
- 30 Gap中media两个合为同一接入差异；部分配置/运行Gap归非表输入，原索引保留。
- 未提出删除command.result/audit/guard/invitation.inviter/registration同意记录等后台必需字段；command记录幂等，audit追溯，guard并发，inviter重验权限，隐私同意用于证明授权。
- 纯本地draft/prefs/navigation/canvas不强行分配到数据库；由前端映射产物维护。
- 本次只写此JSON/Markdown，不改业务代码/schema/配置，不调用API，不运行测试/编译/GUI/截图，不部署。
- 接口字段以代码为准，示例reason_text/list_note/display_time等不是自动新增存储字段的理由。
