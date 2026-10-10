# 数据接入差异讨论稿

本稿按代码逐项核对，所有处理方式均为建议。代码存在、部署完成和真实用户验收分别记录；未运行的项目不会自动归为缺接口。

共 30 项。日期：2026-10-10（Asia/Shanghai）。机器可读版本见 [gap-findings.json](gap-findings.json)。

## 读取范围与已有覆盖

SID-123只读讨论稿；全原生路由由共享page.js与模板统一实现，已读取app.json、page.js、montana.js、forms.js、preferences.js、i18n.js、screen/sheets模板及community.ts。

- read/write已覆盖核心event/campaign/registration/review/member/entity/follow/comment/recommendation；不按缺少REST命名误记缺接口。
- 已有当前角色/账号校验、版本冲突、guard串行写、幂等记录、加密联系信息和群码ACL；未运行不等于缺失。
- 分页主列表已接onReachBottom，calendar完整区间返回是现有设计，不能机械算缺分页。
- clone已有后端和前端action，不因历史backlog未核对而写成未实现。
- managed返回全量授权实体；不能与entities的30条分页混淆。
- forms.resource_links使用单反斜杠的JS换行转义join/split，未确认字面反斜杠n问题。
- 评论回复/删除/注册联系人读取已有实际控件；仅mock按source_surface切分示例不是正式数据必须复制的关系字段。

## 差异与待讨论事项

### GAP-MEDIA-PREVIEW｜上传完成返回的短时预览未用于media数组；重新进入表单也未刷新media[]或access_values.GROUP_QR。

**分类：**实现未接入；**状态：**代码可确认

**后端现状：**mediaFinish/mediaPreview及草稿/私有权限已实现。

建议：为数组、嵌套群码建立独立预览映射，持久化只保存canonical URL/private ref，避免把签名URL写入业务字段。

**依赖：**媒体服务配置、前端媒体绑定

**证据：**

- [page.js:153](/Users/shing/Projects/706mini/miniprogram/lib/page.js:153)：media数组仅保存asset.url，丢弃preview_url
- [page.js:179](/Users/shing/Projects/706mini/miniprogram/lib/page.js:179)：refreshMedia只处理cover_url/avatar_url/access_value
- [screen.wxml:113](/Users/shing/Projects/706mini/miniprogram/templates/screen.wxml:113)：media tile直接使用asset.url
- [community.ts:348](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:348)：mediaFinish返回preview_url
- [community.ts:375](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:375)：mediaPermission存在私有和草稿权限分支

### GAP-MEDIA-DETAIL｜活动/专题接受并保存多媒体，详情却只展示封面和文本，未渲染其余media数组。

**分类：**实现未接入；**状态：**代码可确认

**后端现状：**publicEvent/publicContent可返回清洗后的media。

建议：确认详情媒体布局，再接入已有media字段；无需先发明新上传接口。

**依赖：**详情展示需求

**证据：**

- [community.ts:38](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:38)：公开DTO包含media
- [community.ts:140](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:140)：过滤私有媒体
- [screen.wxml:52](/Users/shing/Projects/706mini/miniprogram/templates/screen.wxml:52)：详情封面
- [screen.wxml:67](/Users/shing/Projects/706mini/miniprogram/templates/screen.wxml:67)：专题介绍与资源链接，无media循环

### GAP-NOTIFICATION-CONTENT｜真实通知仅保存key/target/category；模板读取title/description，真实正文可能空白，actor通常也缺失。

**分类：**字段；**状态：**代码可确认

**后端现状：**notify/read notifications存在，但没有生成title/description/actor_id。

建议：定义通知DTO或key模板补齐对象名称、文案与actor；保持真实target跳转。

**依赖：**通知内容契约

**证据：**

- [community.ts:62](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:62)：notify保存key target category
- [community.ts:115](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:115)：仅可选actor_id转公开资料
- [page.js:6](/Users/shing/Projects/706mini/miniprogram/lib/page.js:6)：normalize仅由title或t[key]兜底
- [screen.wxml:138](/Users/shing/Projects/706mini/miniprogram/templates/screen.wxml:138)：正文绑定description/notificationParts

### GAP-NOTIFICATION-EVENTS｜已有通知生产点只覆盖部分业务事件；活动提交未向平台/空间审核人推送通知，关注/推荐/管理员撤销和定时行前提醒未见生产链。

**分类：**缺接口；**状态：**部分需求待确认

**后端现状：**通知存储/read存在，事件生产与提醒调度不完整；消息类型在手册多属建议。

建议：逐类确认首版必要通知，再补事件生产或调度；不要将手册全部建议自动列为必须上线。

**依赖：**产品通知范围、接收者权限

**证据：**

- [backend-ai-agent-development-manual.md:277](/Users/shing/Projects/706mini/docs/backend-ai-agent-development-manual.md:277)：通知类型建议
- [community.ts:195](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:195)：活动审核记录创建未notify审核人
- [community.ts:183](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:183)：follow未notify
- [community.ts:225](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:225)：撤销角色未notify

**待讨论：**

- 首版必须通知的事件有哪些？行前提醒提前量与投递方式是什么？

### GAP-NOTIFICATION-PREFERENCE｜前端可保存enabled，后端notify未读取notification_preferences；开关对真实投递的作用未实现。

**分类：**契约；**状态：**代码可确认

**后端现状：**profile可存偏好，notify始终写通知。

建议：明确开关控制站内消息还是外部提醒，再让对应投递层遵守偏好。

**依赖：**通知开关语义

**证据：**

- [page.js:156](/Users/shing/Projects/706mini/miniprogram/lib/page.js:156)：preference保存enabled
- [community.ts:173](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:173)：profile白名单包含notification_preferences
- [community.ts:62](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:62)：notify未检查偏好

**待讨论：**

- 关闭后保留哪些必要业务消息？

### GAP-PAGINATION-SELECTORS｜空间、关联活动、发起人活动与banner等辅助查询只取第一页；超过30条会遗漏可选择对象。

**分类：**实现未接入；**状态：**代码可确认

**后端现状：**events/entities/campaigns/mine有cursor返回。

建议：按场景接下一页或带搜索分页，补全已选项回读，不改所有列表为无界全量。

**依赖：**列表规模、选择器交互

**证据：**

- [community.ts:49](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:49)：每页30
- [page.js:44](/Users/shing/Projects/706mini/miniprogram/lib/page.js:44)：campaigns仅一页
- [page.js:74](/Users/shing/Projects/706mini/miniprogram/lib/page.js:74)：entities仅一页
- [page.js:76](/Users/shing/Projects/706mini/miniprogram/lib/page.js:76)：events和mine各一页

### GAP-PAGINATION-NESTED｜主列表已有cursor，entity/member详情内嵌活动和成员、详情comments全量返回；评论分页接口存在但页面未用。

**分类：**契约；**状态：**代码可确认

**后端现状：**calendar全区间、entity/member及eventDetail内嵌无分页；comments另有分页。

建议：区分必须完整日历区间与可分页详情列表，确定分页DTO和排序后按需接入。

**依赖：**数据规模、列表排序

**证据：**

- [community.ts:84](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:84)：calendar全量返回
- [community.ts:89](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:89)：entity items/members无cursor
- [community.ts:90](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:90)：member items无cursor
- [community.ts:109](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:109)：comments有paginate
- [page.js:47](/Users/shing/Projects/706mini/miniprogram/lib/page.js:47)：详情直接消费r.comments

### GAP-PAGINATION-STABILITY｜cursor依赖数组中最后ID；部分查询使用未声明排序的rows或reverse，插入/删除/状态变化可能引起漏项或CURSOR_INVALID。

**分类：**契约；**状态：**代码可确认

**后端现状：**分页已存在，不是缺分页接口；稳定排序与游标失效恢复未统一。

建议：明确各列表稳定排序和cursor契约，前端失效后有可读恢复方式。

**依赖：**分页契约

**证据：**

- [community.ts:49](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:49)：findIndex定位cursor
- [community.ts:115](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:115)：notifications reverse数据库结果
- [community.ts:116](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:116)：relations未显式稳定排序
- [page.js:81](/Users/shing/Projects/706mini/miniprogram/lib/page.js:81)：append按ID去重而无游标失效恢复

### GAP-MEMBER-FEATURED｜memberEntities优先featured_entities，编辑资料仅保存frequent_spaces；已有featured_entities会遮住用户新选空间，组织成员关系也无维护入口。

**分类：**关系；**状态：**代码可确认

**后端现状：**memberEntities读取membership且不把管理员等同成员；write profile不支持featured_entities，未见membership操作。

建议：定义组织成员与常出没展示来源，合并或明确覆盖语义；正式成员维护另经授权。

**依赖：**成员展示规则、成员关系维护权限

**证据：**

- [community.ts:67](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:67)：读取独立membership
- [community.ts:70](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:70)：featured_entities || frequent_spaces优先级
- [community.ts:173](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:173)：profile白名单只有frequent_spaces
- [forms.js:5](/Users/shing/Projects/706mini/miniprogram/lib/forms.js:5)：profile字段只有frequent_spaces

**待讨论：**

- 常出没空间与组织成员如何共同展示？谁能创建正式membership？

### GAP-PROFILE-VISIBILITY｜前端提供MEMBERS可见范围，但publicProfile只允许PUBLIC；登录成员浏览MEMBERS资料也被隐藏。

**分类：**权限；**状态：**代码可确认

**后端现状：**PUBLIC过滤已实现，MEMBERS受众授权分支未实现。

建议：先定义members指注册账号还是正式成员，再实现受众DTO，避免擅自放宽。

**依赖：**成员身份定义

**证据：**

- [page.js:156](/Users/shing/Projects/706mini/miniprogram/lib/page.js:156)：PUBLIC与MEMBERS切换
- [community.ts:31](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:31)：publicProfile只PUBLIC
- [community.ts:90](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:90)：member未使用viewer可见范围

**待讨论：**

- MEMBERS究竟指哪类账号？

### GAP-ACTIVE-MEMBER-WINDOW｜空间主页使用所有公开活动，directory却使用尚未结束活动；两处活跃成员统计集合不一致，也未定义近期窗口。

**分类：**契约；**状态：**部分需求待确认

**后端现状：**根据CONFIRMED且同意公开参与派生成员已有实现。

建议：确认近期窗口/排序及directory与主页是否同一集合，再统一派生规则。

**依赖：**活跃定义

**证据：**

- [community.ts:88](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:88)：directory只ends_at>now
- [community.ts:89](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:89)：entity从所有public events派生成员
- [backlog.md:14](/Users/shing/Projects/706mini/docs/backlog.md:14)：近期窗口排序许可待确认

**待讨论：**

- 近期包含过去多久和未来多久？

### GAP-MEMBER-ACTIVITY-COUNT｜activity_count计算本人所有可见已确认活动，未与当前浏览者交集；前端标为共同活动，语义可能错误。

**分类：**契约；**状态：**代码可确认

**后端现状：**计数与活动列表已实现；不是缺member接口。

建议：明确标签是个人参与总数还是与viewer共同参加，再调整返回字段与文案。

**依赖：**计数语义

**证据：**

- [community.ts:90](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:90)：activity_count过滤joined，与viewer无交集
- [screen.wxml:72](/Users/shing/Projects/706mini/miniprogram/templates/screen.wxml:72)：成员统计文案共同活动

**待讨论：**

- 此统计应代表共同活动还是总参与次数？

### GAP-EVENT-FORM-FIELDS｜后端支持tags/fit_description/waitlist_enabled，发布表单定义未提供这些控件；编辑已有活动时无法完整修改。

**分类：**实现未接入；**状态：**代码可确认

**后端现状：**eventFields保存，详情消费对应字段。

建议：确认首版需要可编辑哪些字段，接入已有契约；保留候补既有默认而非擅自改规则。

**依赖：**发布表单范围

**证据：**

- [forms.js:2](/Users/shing/Projects/706mini/miniprogram/lib/forms.js:2)：event定义未含上述三字段
- [community.ts:144](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:144)：eventFields含三字段
- [screen.wxml:55](/Users/shing/Projects/706mini/miniprogram/templates/screen.wxml:55)：详情渲染标签与适合谁

### GAP-VENUE-ADDRESS｜选择受管空间后表单隐藏venue_name/address，而validateEvent仅复制空间名称；publicEvent地址可能为空或保留旧自定义地址。

**分类：**字段；**状态：**代码可确认

**后端现状：**空间完整地址存在，eventDetail未派生空间地址。

建议：确定地址是当前空间值还是发布快照，再保证详情和卡片一致。

**依赖：**地址快照语义

**证据：**

- [forms.js:8](/Users/shing/Projects/706mini/miniprogram/lib/forms.js:8)：选择space隐藏地址字段
- [community.ts:151](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:151)：只赋venue_display
- [community.ts:38](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:38)：公开DTO读取事件address

### GAP-SPACE-REQUEST-POLICY｜allow_event_requests可编辑保存，却未在validateEvent/submitEvent检查；关闭开关并不阻止非管理员申请。

**分类：**权限；**状态：**代码可确认

**后端现状：**字段保存存在，业务授权条件缺失。

建议：明确关闭时谁仍可使用空间，并在服务端提交校验落实。

**依赖：**空间申请规则

**证据：**

- [forms.js:6](/Users/shing/Projects/706mini/miniprogram/lib/forms.js:6)：entity定义开关
- [community.ts:222](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:222)：entity保存开关
- [community.ts:151](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:151)：空间仅检查ACTIVE/kind
- [community.ts:196](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:196)：有space即建审核

**待讨论：**

- 关闭后空间管理员自发活动是否允许？

### GAP-ENTITY-CONTACT｜public_contact对非管理者删除，未見获授权活动发起者的读取函数；公众号/回顾/坐标/设施等补充也未完整表单化。

**分类：**权限；**状态：**部分需求待确认

**后端现状：**实体编辑已有基本字段，entityDTO仅区分管理者；补充需求部分待细化。

建议：区分真正公开链接和私有授权联系人，定义同意/撤回与发起者条件后补DTO/入口。

**依赖：**公开许可、授权联系人用途

**证据：**

- [community.ts:54](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:54)：非管理DTO删public_contact
- [community.ts:222](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:222)：entity字段白名单
- [forms.js:6](/Users/shing/Projects/706mini/miniprogram/lib/forms.js:6)：entity表单基本字段
- [backlog.md:11](/Users/shing/Projects/706mini/docs/backlog.md:11)：节点公开资料补充

**待讨论：**

- 哪些联系方式公开？哪些只对获准发起者可读？

### GAP-REVIEW-SNAPSHOT｜审核行有snapshot，read review返回实时subject，页面也展示实时subject；progress将各轮记录混合展示。

**分类：**实现未接入；**状态：**代码可确认

**后端现状：**round和快照存储存在，专题发起人确认行未写snapshot。

建议：区分审核时快照与当前状态，按轮展示历史，不把最新修改冒充已审内容。

**依赖：**快照契约

**证据：**

- [community.ts:197](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:197)：event review保存snapshot
- [community.ts:203](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:203)：INITIATOR行未保存snapshot
- [community.ts:121](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:121)：review返回实时subject
- [community.ts:122](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:122)：progress返回所有轮
- [page.js:63](/Users/shing/Projects/706mini/miniprogram/lib/page.js:63)：展示r.subject

### GAP-CAMPAIGN-METADATA｜真实campaign DTO未派生cities/citySummary/banner_description/resource_description；演示具有这些字段，但saveCampaign不保存其多数元数据。

**分类：**字段；**状态：**代码可确认

**后端现状：**关联event_ids与items读取已经存在，不是关联活动接口缺失。

建议：由关联活动派生城市与数量，确认banner和资源说明属于独立编辑字段还是衍生文案。

**依赖：**专题展示字段

**证据：**

- [community.ts:87](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:87)：返回campaign原字段及items
- [community.ts:199](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:199)：保存字段不含cities/resource_description
- [page.js:48](/Users/shing/Projects/706mini/miniprogram/lib/page.js:48)：citySummary从r.cities
- [screen.wxml:67](/Users/shing/Projects/706mini/miniprogram/templates/screen.wxml:67)：读取resource_description

### GAP-AUTH-ACCOUNT-LINK｜微信按openid建立独立用户；验证码登录走runtime身份，两条路径未见显式安全绑定，可能形成不同资料。

**分类：**关系；**状态：**部分需求待确认

**后端现状：**微信登录/验证码传输均已实现，账号合并契约未见。

建议：先确认账号绑定目标与证明方式，不按手机号或昵称自动合并。

**依赖：**身份绑定产品规则、Montana runtime auth契约

**证据：**

- [montana.js:67](/Users/shing/Projects/706mini/miniprogram/lib/montana.js:67)：验证码verify保存res.user
- [community.ts:316](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:316)：openid digest查找/创建用户
- [page.js:177](/Users/shing/Projects/706mini/miniprogram/lib/page.js:177)：微信登录独立setSession

**待讨论：**

- 同一人是否需要绑定多种登录方式？

### GAP-AUTH-CONFIG｜默认mock，真实微信/验证码登录依赖真实AppID、合法域名、runtime发送服务与server env；不因代码存在就认为可用。

**分类：**配置依赖；**状态：**未读取真实配置

**后端现状：**wechatLogin实现；config只以WX_APP_ID判断capability，不能证明完整环境。

建议：获准后由配置owner逐项核对并用真实账号验证；本稿不读取密钥、不发送验证码。

**依赖：**真实AppID、域名、发送服务、服务端环境

**证据：**

- [config.js:3](/Users/shing/Projects/706mini/miniprogram/config.js:3)：默认mock
- [montana.js:62](/Users/shing/Projects/706mini/miniprogram/lib/montana.js:62)：runtime auth路径
- [community.ts:82](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:82)：wechat_login capability只检查一个变量
- [community.ts:322](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:322)：完整requireEnv
- [montana-integration-matrix.md:30](/Users/shing/Projects/706mini/docs/montana-integration-matrix.md:30)：配置=false且未发送真实验证码

### GAP-OPERATOR-SEED｜生产组织/空间/平台角色必须由真实确认ID建立；不能用演示身份或首次登录自动授予管理员。

**分类：**配置依赖；**状态：**真实业务输入待提供

**后端现状：**operator.py和role权限链已有；README记载尚无真实manifest应用。

建议：由用户确认真实账号/节点资料，授权后走受限operator流程；不是新增公开seed接口。

**依赖：**真实账号ID、空间组织信息、Owner授权

**证据：**

- [community.ts:34](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:34)：当前role校验管理权
- [README.md:23](/Users/shing/Projects/706-montana/apps/community706/README.md:23)：受限初始操作与真实manifest要求；仅作为已保存记录，不当实时环境事实

### GAP-PAYMENT-CONFIG｜真实付款action/结算/验签/到期关单已实现，依赖商户及微信配置和环境；前端未用capability禁用入口。

**分类：**配置依赖；**状态：**真实运行未确认

**后端现状：**支付代码存在，config.payment仅检查MCHID，未证明回调可达/全环境。

建议：先核对支付资格/环境并授权真实流程验证；可据完整capability呈现可用状态。

**依赖：**商户资格、微信身份、回调、证书环境

**证据：**

- [community.ts:281](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:281)：真实支付action
- [community.ts:301](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:301)：回调验签解密
- [community.ts:82](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:82)：capability仅检查商户ID
- [page.js:125](/Users/shing/Projects/706mini/miniprogram/lib/page.js:125)：真实requestPayment链

### GAP-PAYMENT-SETTLEMENT-UX｜requestPayment成功后只load一次，业务确认仍取决于异步回调；没有等待结算/刷新状态闭环。

**分类：**实现未接入；**状态：**代码可确认

**后端现状：**服务端回调才CONFIRMED，超时异常设置requires_refund并通知。

建议：显示待确认结算并有限重读权威状态；不将客户端成功当报名已确认。

**依赖：**支付异步状态契约

**证据：**

- [page.js:125](/Users/shing/Projects/706mini/miniprogram/lib/page.js:125)：付款后立即一次load
- [community.ts:295](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:295)：只有合法当前状态canConfirm
- [community.ts:297](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:297)：服务端更改CONFIRMED

### GAP-REFUND-LIFECYCLE｜已付款取消被REFUND_POLICY_REQUIRED阻止；迟到支付仅requires_refund标记，未见退款申请/商户退款/查询与回调闭环。

**分类：**缺接口；**状态：**规则待决定

**后端现状：**有安全拒绝和异常标记，无退款实现；不能视为已支持退款。

建议：先决定退款责任/政策，再设计申请、执行、状态和权限；不要先自动退款。

**依赖：**退款政策、平台/发起者责任、支付配置

**证据：**

- [community.ts:218](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:218)：付费报名取消拒绝
- [community.ts:221](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:221)：含已付报名的活动取消拒绝
- [community.ts:296](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:296)：异常支付标requires_refund
- [backlog.md:24](/Users/shing/Projects/706mini/docs/backlog.md:24)：退款由谁定义未决

**待讨论：**

- 谁制定规则、承担退款、处理异常支付？

### GAP-ERROR-COVERAGE｜客户端字典缺PAYMENT_PENDING_CLOSE、WECHAT_LOGIN_REQUIRED、CURSOR_INVALID及部分媒体错误等，导致真实错误降级泛化；details未用于字段提示。

**分类：**契约；**状态：**代码可确认

**后端现状：**明确错误码与版本/状态权限检查已存在。

建议：按真实错误分类补行动提示，保留请求结果和重试幂等key；不把所有失败都引导盲目重试。

**依赖：**错误契约

**证据：**

- [i18n.js:11](/Users/shing/Projects/706mini/miniprogram/lib/i18n.js:11)：错误字典覆盖有限
- [montana.js:64](/Users/shing/Projects/706mini/miniprogram/lib/montana.js:64)：保留result.error.details
- [community.ts:218](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:218)：PAYMENT_PENDING_CLOSE
- [community.ts:275](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:275)：WECHAT_LOGIN_REQUIRED
- [community.ts:51](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:51)：CURSOR_INVALID

### GAP-CALENDAR-PREFERENCES｜城市语言可同步，日历视图/筛选仅页面state；手册提出保存日历偏好但未见账户级字段或写入。

**分类：**实现未接入；**状态：**部分需求待确认

**后端现状：**calendar/calendarCode/calendarShare已实现；日历偏好持久化未见。

建议：确认要跨页面还是跨设备恢复，再选择本地偏好或服务端字段；现有海报链不要误记为缺接口。

**依赖：**偏好保存范围

**证据：**

- [backend-ai-agent-development-manual.md:71](/Users/shing/Projects/706mini/docs/backend-ai-agent-development-manual.md:71)：保存日历偏好
- [page.js:102](/Users/shing/Projects/706mini/miniprogram/lib/page.js:102)：筛选保存在实例
- [preferences.js:3](/Users/shing/Projects/706mini/miniprogram/lib/preferences.js:3)：仅city/locale默认
- [community.ts:359](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:359)：已有分享参数保存

**待讨论：**

- 日历筛选需要跨设备保存吗？

### GAP-POSTPONED-REQUIREMENTS｜自由发帖、外部表单身份匹配/徽章、协办嘉宾、独立模板及节点强制归属未完整实现；历史材料不构成当前新增批准。

**分类：**缺接口；**状态：**明确后置或待讨论

**后端现状：**当前有推荐/报名动态、单向关注、clone、campaign与独立membership读取；后置功能不能算首版阻塞。

建议：保持候选/后置，将角色、身份、模板和节点关系拆开讨论；不自动导入/合并/提权。

**依赖：**产品范围确认、个人资料同意、角色权限

**证据：**

- [backlog.md:20](/Users/shing/Projects/706mini/docs/backlog.md:20)：角色待确认
- [backlog.md:22](/Users/shing/Projects/706mini/docs/backlog.md:22)：外部成员后置
- [backlog.md:23](/Users/shing/Projects/706mini/docs/backlog.md:23)：自由动态后置
- [2026-10-08-community-mini-program-feature-plan.md:52](/Users/shing/Projects/706mini/docs/meetings/2026-10-08-community-mini-program-feature-plan.md:52)：模板/克隆尚未统一
- [community.ts:194](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:194)：已有clone

### GAP-DEPLOYMENT-PROVENANCE｜本稿核对的是本地最新代码；保存的v6部署清单与旧证据不能证明d70d1db源码已经部署，也不能证明真实全旅程验收。

**分类：**运行未确认；**状态：**最新源码部署未确认

**后端现状：**部署记录存在；本任务没有访问生产环境或比对bundle。

建议：后续获准后核对当前部署与源码版本，分别取得配置、接口与真实账号运行证据。

**依赖：**独立部署授权、服务版本证据

**证据：**

- [deployment.json:2](/Users/shing/Projects/706-montana/apps/community706/deployment.json:2)：文件记录version 6，非最新源码部署证明
- [pause-status.md:1](/Users/shing/Projects/706mini/docs/visual-review/2026-10-09/pause-status.md:1)：暂停/尚待验收记录

### GAP-REVIEW-COMPLETED｜完成审核目录是mock-only示例过滤；真实reviews只读PENDING，未提供本人已处理列表或完成筛选。

**分类：**契约；**状态：**代码可确认

**后端现状：**待审核列表与按subject查看历史进度已实现；完成列表缺契约。

建议：定义完成列表的操作者/实体范围和状态/轮次，再补查询与前端筛选；不要将mock done参数作为真实能力。

**依赖：**完成列表范围、历史权限

**证据：**

- [page.js:62](/Users/shing/Projects/706mini/miniprogram/lib/page.js:62)：options.done仅api.isMock分支过滤campaign，未按APPROVED完成状态查询
- [community.ts:120](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:120)：reviews只读status PENDING
- [community.ts:122](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:122)：progress按subject有历史记录但非完成列表

**待讨论：**

- 完成是本人处理过、当前实体处理过，还是整个审核已结束？

### GAP-FEED-PERSONALIZATION｜真实feed按城市聚合公开推荐与报名，应用mute，但未利用关注关系排序或选择；手册概述的个性化应确认具体含义。

**分类：**契约；**状态：**部分需求待确认

**后端现状：**真实推荐/报名动态与屏蔽已有，不是缺feed接口。

建议：先确定同城公共流与关注流关系及排序，再调整查询，避免把演示固定动态当算法。

**依赖：**动态排序规则

**证据：**

- [community.ts:108](/Users/shing/Projects/706-montana/apps/community706/functions/community.ts:108)：feed读取recommendation/registration，city和mute过滤，没有follow关联
- [backend-ai-agent-development-manual.md:58](/Users/shing/Projects/706mini/docs/backend-ai-agent-development-manual.md:58)：动态入口含关注关系同城成员
- [backend-ai-agent-development-manual.md:69](/Users/shing/Projects/706mini/docs/backend-ai-agent-development-manual.md:69)：页面矩阵称个性化动态

**待讨论：**

- 是否优先关注者，还是仅解释共同关系、保持同城公共流？

## 执行说明

仅本两个讨论产物；未修改业务代码、配置或数据，未运行测试/编译、未使用GUI/截图、未调用真实API或部署。

35fa (由B提供；本稿未做远端比对)；d70d1db (由B提供；未据此推断部署)。

全部action是建议，需由需求讨论决定；来源中的建议/后置项保留原性质。
