# 706 页面与组件累计盘点

来源提交：`a74168a60ef25a1f50950b7a705369b1869efcf4`。证据等级：**源码推导**；本文件记录真实工具访问 0 页。

注册页 42；未注册页面候选 0；统一组件 family 43；sheet 20；共享模板条件 241。

## 阅读方式

所有42页入口都只有共享包装，不能把读包装声称为逐页访问。沿 `screen.wxml` 与 `sheets.wxml` 追踪分支，控制器为 `lib/page.js`。JSON保留组件位置、具体行号、路由边、条件、弹层来源及完整条件矩阵。组件按我们所需系统累计；原先存在与否只作次要来源说明。

## 页面到组件

| 页面 | 组件 | 弹层候选 |
|---|---|---|
| `feed` · 关注 | FeatureCarousel / PersonCard / FeedItem / EventCard / Avatar / Button / IconButton / Navigation / LoadingState / EmptyState / Notice / Sheet | recommend / comment / city / mini / why |
| `discover` · 发现 | FeatureCarousel / SearchField / FilterChip / ActionRow / EventCard / Button / IconButton / Navigation / LoadingState / EmptyState / Notice / Sheet | city / mini |
| `messages` · 消息 | SegmentedControl / NotificationItem / Avatar / Navigation / IconButton / LoadingState / EmptyState / Notice / Sheet | mini |
| `me` · 我的 | IdentityRow / StatLink / MenuGroup / ActionRow / Avatar / Button / Navigation / IconButton / LoadingState / EmptyState / Notice / Sheet | city / language / notifications / mini |
| `manage` · 管理 | MenuGroup / ActionRow / EntityCard / PermissionState / IconButton / LoadingState / EmptyState / Notice / Sheet |  |
| `create-space` · 创建空间 | FormField / DateTimePicker / MediaUploader / Button / Notice / IconButton / LoadingState / EmptyState / Sheet |  |
| `event` · 活动详情 | Gallery / Section / Avatar / IdentityRow / ParticipantSummary / CommentThread / EventCard / ActionRow / Button / Badge / FloatingBar / IconButton / LoadingState / EmptyState / Notice / Sheet | register / recommend / comment / participants |
| `member` · 成员主页 | Avatar / IdentityRow / FollowControl / StatLink / LinkList / EventCard / Button / Badge / IconButton / LoadingState / EmptyState / Notice / Sheet | member / report |
| `space` · 空间主页 | EntityCard / IdentityRow / FollowControl / ActionRow / LinkList / EventCard / Avatar / Button / IconButton / LoadingState / EmptyState / Notice / Sheet | manage / official / recap |
| `org` · 组织主页 | EntityCard / IdentityRow / FollowControl / ActionRow / LinkList / EventCard / Avatar / Button / IconButton / LoadingState / EmptyState / Notice / Sheet | manage / official / recap |
| `entity-events` · 全部活动 | EventCard / IconButton / LoadingState / EmptyState / Notice / Sheet |  |
| `entity-members` · 空间成员 | IdentityRow / Avatar / FollowControl / IconButton / LoadingState / EmptyState / Notice / Sheet |  |
| `edit-entity` · 编辑实体 | FormField / MediaUploader / Button / IconButton / LoadingState / EmptyState / Notice / Sheet |  |
| `admins` · 管理员 | IdentityRow / Badge / Button / ActionRow / IconButton / LoadingState / EmptyState / Notice / Sheet | invite |
| `edit-profile` · 编辑资料 | FormField / Avatar / MediaUploader / ChoiceGroup / LinkList / Button / IconButton / LoadingState / EmptyState / Notice / Sheet |  |
| `relations` · 关注与粉丝 | SegmentedControl / IdentityRow / Avatar / FollowControl / IconButton / LoadingState / EmptyState / Notice / Sheet |  |
| `onboarding` · 新人引导 | Stepper / FormField / ChoiceGroup / Checkbox / Button / StatusSummary / IconButton / LoadingState / EmptyState / Notice / Sheet |  |
| `calendar` · 活动日历 | Calendar / SegmentedControl / FilterChip / IconButton / EventCard / Button / LoadingState / EmptyState / Notice / Sheet | poster |
| `spaces` · 空间目录 | SegmentedControl / EntityCard / IconButton / LoadingState / EmptyState / Notice / Sheet |  |
| `campaign` · 专题详情 | EntityCard / Section / LinkList / EventCard / Button / IconButton / LoadingState / EmptyState / Notice / Sheet |  |
| `campaign-edit` · 编辑专题 | FormField / MediaUploader / ChoiceGroup / LinkList / Button / Notice / IconButton / LoadingState / EmptyState / Sheet |  |
| `campaign-create` · 创建专题 | Stepper / FormField / MediaUploader / ChoiceGroup / LinkList / Button / EventCard / StatusSummary / IconButton / LoadingState / EmptyState / Notice / Sheet |  |
| `campaign-approval-detail` · 专题审核详情 | StatusSummary / Gallery / ReviewHistory / EventCard / Button / IconButton / LoadingState / EmptyState / Notice / Sheet | return |
| `campaign-review-progress` · 专题审核进度 | ReviewHistory / StatusSummary / Button / IconButton / LoadingState / EmptyState / Notice / Sheet |  |
| `event-access` · 参与方式 | StatusSummary / ActionRow / AccessStep / Button / Notice / IconButton / LoadingState / EmptyState / Sheet | payment / group |
| `activity-preview` · 活动预览 | Gallery / Section / EventCard / Badge / IconButton / LoadingState / EmptyState / Notice / Sheet |  |
| `publish` · 发布活动 | Stepper / FormField / Switch / DateTimePicker / MediaUploader / ChoiceGroup / Button / EventCard / StatusSummary / IconButton / LoadingState / EmptyState / Notice / Sheet |  |
| `approvals` · 审核待办 | SegmentedControl / ActionRow / Badge / IconButton / LoadingState / EmptyState / Notice / Sheet |  |
| `approval-detail` · 活动审核详情 | StatusSummary / Gallery / ReviewHistory / EventCard / Button / IconButton / LoadingState / EmptyState / Notice / Sheet | return |
| `approval-progress` · 活动审核进度 | ReviewHistory / StatusSummary / Button / IconButton / LoadingState / EmptyState / Notice / Sheet |  |
| `registrations` · 我报名的活动 | FilterChip / PersonalEvent / EventCard / StatusSummary / Button / IconButton / LoadingState / EmptyState / Notice / Sheet |  |
| `my-events` · 我发起的活动 | FilterChip / PersonalEvent / EventCard / Button / IconButton / LoadingState / EmptyState / Notice / Sheet |  |
| `drafts` · 草稿 | PersonalEvent / EventCard / Button / IconButton / LoadingState / EmptyState / Notice / Sheet |  |
| `following` · 关注入口 | SegmentedControl / IdentityRow / Avatar / FollowControl / IconButton / LoadingState / EmptyState / Notice / Sheet |  |
| `more` · 更多设置 | MenuGroup / ActionRow / Switch / Button / IconButton / LoadingState / EmptyState / Notice / Sheet | city / language / notifications / about |
| `login` · 登录 | FormField / Button / Notice / IconButton / LoadingState / EmptyState / Sheet |  |
| `attendees` · 报名管理 | IdentityRow / Badge / Button / Notice / IconButton / LoadingState / EmptyState / Sheet |  |
| `invitations` · 管理邀请 | ActionRow / Badge / Button / IconButton / LoadingState / EmptyState / Notice / Sheet |  |
| `my-campaigns` · 我的专题 | PersonalCampaign / StatusSummary / Button / IconButton / LoadingState / EmptyState / Notice / Sheet |  |
| `privacy` · 隐私与可见性 | Switch / MenuGroup / Section / IconButton / LoadingState / EmptyState / Notice / Sheet |  |
| `feedback` · 反馈 | FormField / Button / Notice / IconButton / LoadingState / EmptyState / Sheet | report |
| `review-lab` · 开发者目录 | MenuGroup / ChoiceGroup / Button / Notice / IconButton / LoadingState / EmptyState / Sheet |  |

## 组件到页面

| 组件 | 使用页面 | 要求 |
|---|---|---|
| FeatureCarousel | feed / discover | 保留该组件的语义角色、默认/长文/空内容/窄宽容器；对适用的交互提供选择/焦点/禁用/忙碌/失败状态，嵌套时不重复主行动。 |
| PersonCard | feed | 保留该组件的语义角色、默认/长文/空内容/窄宽容器；对适用的交互提供选择/焦点/禁用/忙碌/失败状态，嵌套时不重复主行动。 |
| FeedItem | feed | 保留该组件的语义角色、默认/长文/空内容/窄宽容器；对适用的交互提供选择/焦点/禁用/忙碌/失败状态，嵌套时不重复主行动。 |
| EventCard | feed / discover / event / member / space / org / entity-events / calendar / campaign / campaign-create / campaign-approval-detail / activity-preview / publish / approval-detail / registrations / my-events / drafts | 公开状态与个人状态分开；未知容量不编分母；无封面/失败、长标题、窄屏；可嵌入动态与个人卡。 |
| Avatar | feed / messages / me / event / member / space / org / entity-members / edit-profile / relations / following | 保留该组件的语义角色、默认/长文/空内容/窄宽容器；对适用的交互提供选择/焦点/禁用/忙碌/失败状态，嵌套时不重复主行动。 |
| Button | feed / discover / me / create-space / event / member / space / org / edit-entity / admins / edit-profile / onboarding / calendar / campaign / campaign-edit / campaign-create / campaign-approval-detail / campaign-review-progress / event-access / publish / approval-detail / approval-progress / registrations / my-events / drafts / more / login / attendees / invitations / my-campaigns / feedback / review-lab | primary/secondary/text/danger；compact/standard、block、canvas/surface；idle/pressed/focus/loading/disabled；长文换行且至少44px点击区。 |
| IconButton | feed / discover / messages / me / manage / create-space / event / member / space / org / entity-events / entity-members / edit-entity / admins / edit-profile / relations / onboarding / calendar / spaces / campaign / campaign-edit / campaign-create / campaign-approval-detail / campaign-review-progress / event-access / activity-preview / publish / approvals / approval-detail / approval-progress / registrations / my-events / drafts / following / more / login / attendees / invitations / my-campaigns / privacy / feedback / review-lab | 保留该组件的语义角色、默认/长文/空内容/窄宽容器；对适用的交互提供选择/焦点/禁用/忙碌/失败状态，嵌套时不重复主行动。 |
| Navigation | feed / discover / messages / me | 4主入口；当前项、键盘/弹层隐藏、安全区；子页返回独立；应用地图不把辅助目录当页面内容。 |
| LoadingState | feed / discover / messages / me / manage / create-space / event / member / space / org / entity-events / entity-members / edit-entity / admins / edit-profile / relations / onboarding / calendar / spaces / campaign / campaign-edit / campaign-create / campaign-approval-detail / campaign-review-progress / event-access / activity-preview / publish / approvals / approval-detail / approval-progress / registrations / my-events / drafts / following / more / login / attendees / invitations / my-campaigns / privacy / feedback / review-lab | 保留该组件的语义角色、默认/长文/空内容/窄宽容器；对适用的交互提供选择/焦点/禁用/忙碌/失败状态，嵌套时不重复主行动。 |
| EmptyState | feed / discover / messages / me / manage / create-space / event / member / space / org / entity-events / entity-members / edit-entity / admins / edit-profile / relations / onboarding / calendar / spaces / campaign / campaign-edit / campaign-create / campaign-approval-detail / campaign-review-progress / event-access / activity-preview / publish / approvals / approval-detail / approval-progress / registrations / my-events / drafts / following / more / login / attendees / invitations / my-campaigns / privacy / feedback / review-lab | 保留该组件的语义角色、默认/长文/空内容/窄宽容器；对适用的交互提供选择/焦点/禁用/忙碌/失败状态，嵌套时不重复主行动。 |
| Sheet | feed / discover / messages / me / manage / create-space / event / member / space / org / entity-events / entity-members / edit-entity / admins / edit-profile / relations / onboarding / calendar / spaces / campaign / campaign-edit / campaign-create / campaign-approval-detail / campaign-review-progress / event-access / activity-preview / publish / approvals / approval-detail / approval-progress / registrations / my-events / drafts / following / more / login / attendees / invitations / my-campaigns / privacy / feedback / review-lab | read/form/choice/menu；打开、关闭、Escape/焦点恢复、脏输入放弃确认、busy禁止关闭；不以付款模拟冒充原生支付。 |
| SearchField | discover | 保留该组件的语义角色、默认/长文/空内容/窄宽容器；对适用的交互提供选择/焦点/禁用/忙碌/失败状态，嵌套时不重复主行动。 |
| FilterChip | discover / calendar / registrations / my-events | 保留该组件的语义角色、默认/长文/空内容/窄宽容器；对适用的交互提供选择/焦点/禁用/忙碌/失败状态，嵌套时不重复主行动。 |
| ActionRow | discover / me / manage / event / space / org / admins / event-access / approvals / more / invitations | 保留该组件的语义角色、默认/长文/空内容/窄宽容器；对适用的交互提供选择/焦点/禁用/忙碌/失败状态，嵌套时不重复主行动。 |
| SegmentedControl | messages / relations / calendar / spaces / approvals / following | 保留该组件的语义角色、默认/长文/空内容/窄宽容器；对适用的交互提供选择/焦点/禁用/忙碌/失败状态，嵌套时不重复主行动。 |
| NotificationItem | messages | 保留该组件的语义角色、默认/长文/空内容/窄宽容器；对适用的交互提供选择/焦点/禁用/忙碌/失败状态，嵌套时不重复主行动。 |
| IdentityRow | me / event / member / space / org / entity-members / admins / relations / following / attendees | 保留该组件的语义角色、默认/长文/空内容/窄宽容器；对适用的交互提供选择/焦点/禁用/忙碌/失败状态，嵌套时不重复主行动。 |
| StatLink | me / member | 保留该组件的语义角色、默认/长文/空内容/窄宽容器；对适用的交互提供选择/焦点/禁用/忙碌/失败状态，嵌套时不重复主行动。 |
| MenuGroup | me / manage / more / privacy / review-lab | 保留该组件的语义角色、默认/长文/空内容/窄宽容器；对适用的交互提供选择/焦点/禁用/忙碌/失败状态，嵌套时不重复主行动。 |
| EntityCard | manage / space / org / spaces / campaign | 保留该组件的语义角色、默认/长文/空内容/窄宽容器；对适用的交互提供选择/焦点/禁用/忙碌/失败状态，嵌套时不重复主行动。 |
| PermissionState | manage | 保留该组件的语义角色、默认/长文/空内容/窄宽容器；对适用的交互提供选择/焦点/禁用/忙碌/失败状态，嵌套时不重复主行动。 |
| FormField | create-space / edit-entity / edit-profile / onboarding / campaign-edit / campaign-create / publish / login / feedback | label/value/helper/error/required/disabled；短长文本、空值、输入中、校验错误、服务错误保留值。 |
| DateTimePicker | create-space / publish | 保留该组件的语义角色、默认/长文/空内容/窄宽容器；对适用的交互提供选择/焦点/禁用/忙碌/失败状态，嵌套时不重复主行动。 |
| MediaUploader | create-space / edit-entity / edit-profile / campaign-edit / campaign-create / publish | 本地选择、多选、部分成功、失败、超限、删除、排序/取消排序、封面变更；网页演示不上传生产。 |
| Gallery | event / campaign-approval-detail / activity-preview / approval-detail | 保留该组件的语义角色、默认/长文/空内容/窄宽容器；对适用的交互提供选择/焦点/禁用/忙碌/失败状态，嵌套时不重复主行动。 |
| Section | event / campaign / activity-preview / privacy | 保留该组件的语义角色、默认/长文/空内容/窄宽容器；对适用的交互提供选择/焦点/禁用/忙碌/失败状态，嵌套时不重复主行动。 |
| ParticipantSummary | event | 保留该组件的语义角色、默认/长文/空内容/窄宽容器；对适用的交互提供选择/焦点/禁用/忙碌/失败状态，嵌套时不重复主行动。 |
| Badge | event / member / admins / activity-preview / approvals / attendees / invitations | 保留该组件的语义角色、默认/长文/空内容/窄宽容器；对适用的交互提供选择/焦点/禁用/忙碌/失败状态，嵌套时不重复主行动。 |
| FloatingBar | event | 保留该组件的语义角色、默认/长文/空内容/窄宽容器；对适用的交互提供选择/焦点/禁用/忙碌/失败状态，嵌套时不重复主行动。 |
| FollowControl | member / space / org / entity-members / relations / following | 保留该组件的语义角色、默认/长文/空内容/窄宽容器；对适用的交互提供选择/焦点/禁用/忙碌/失败状态，嵌套时不重复主行动。 |
| LinkList | member / space / org / edit-profile / campaign / campaign-edit / campaign-create | 保留该组件的语义角色、默认/长文/空内容/窄宽容器；对适用的交互提供选择/焦点/禁用/忙碌/失败状态，嵌套时不重复主行动。 |
| ChoiceGroup | edit-profile / onboarding / campaign-edit / campaign-create / publish / review-lab | single/multiple × tags/list；value/label key；max、禁用、空options；选择值与事件由调用方控制；长活动详情可嵌套。 |
| Stepper | onboarding / campaign-create / publish | 保留该组件的语义角色、默认/长文/空内容/窄宽容器；对适用的交互提供选择/焦点/禁用/忙碌/失败状态，嵌套时不重复主行动。 |
| Checkbox | onboarding | 保留该组件的语义角色、默认/长文/空内容/窄宽容器；对适用的交互提供选择/焦点/禁用/忙碌/失败状态，嵌套时不重复主行动。 |
| StatusSummary | onboarding / campaign-create / campaign-approval-detail / campaign-review-progress / event-access / publish / approval-detail / approval-progress / registrations / my-campaigns | 状态文字/说明/准确下一步；待审、候补、待付款、确认、拒绝、过期、取消/退款不同。 |
| Calendar | calendar | 保留该组件的语义角色、默认/长文/空内容/窄宽容器；对适用的交互提供选择/焦点/禁用/忙碌/失败状态，嵌套时不重复主行动。 |
| ReviewHistory | campaign-approval-detail / campaign-review-progress / approval-detail / approval-progress | subject/items/locale/campaign；待审核、通过、退回、空记录/失败、长审核意见与真实时间。 |
| AccessStep | event-access | 保留该组件的语义角色、默认/长文/空内容/窄宽容器；对适用的交互提供选择/焦点/禁用/忙碌/失败状态，嵌套时不重复主行动。 |
| Switch | publish / more / privacy | 保留该组件的语义角色、默认/长文/空内容/窄宽容器；对适用的交互提供选择/焦点/禁用/忙碌/失败状态，嵌套时不重复主行动。 |
| PersonalEvent | registrations / my-events / drafts | 保留该组件的语义角色、默认/长文/空内容/窄宽容器；对适用的交互提供选择/焦点/禁用/忙碌/失败状态，嵌套时不重复主行动。 |
| PersonalCampaign | my-campaigns | 保留该组件的语义角色、默认/长文/空内容/窄宽容器；对适用的交互提供选择/焦点/禁用/忙碌/失败状态，嵌套时不重复主行动。 |

## 状态与证据边界

- 初载/刷新/错误/分页、空列表、登录缺失、权限变化、图片失败、长文、双语、不同宽度分别验证；不能以HTTP成功或控制器mock加载冒充视觉验收。
- 20种sheet都保留在JSON中。原生登录/支付/相册/系统picker/Modal/Toast属于能力承接，普通网页可演示发起与返回状态，不伪造微信窗口成功。
- `theme.js` 是精确值来源；`docs/design-direction-system-2026-10-23.md` 优先于旧Paper/Community文档中的描边/旧色板。`docs/design-system-global.md` 已自行注明未完成全站组件迁移。
- 原始字体为系统字体栈，无需伪造品牌字体文件；实际图标以 `lib/illustrations.js` 与对应本地资源为准。
- 新的网页API/焦点/键盘支持和展示壳是本次设计/工程决定，不能伪称来自小程序。

正式真实工具访问与阻碍应另写执行日志并与本清单并列；本文件不得将源码推导改标为已访问。

## 映射精度与演示入口

JSON同时保留118个演示入口（静态目录读取、未进入UI）、每页功能分支起止行及分支内所有状态条件。`mappingKind=design-semantic-requirement` 表示功能提炼需求；`shared-conditional` 表示共享组件按运行时条件才显示；不能把这两种映射说成当前小程序已经使用了同名组件。反向映射从最终逐页使用点生成，与正向一致。

## 提示与评论的精确补正

累计组件总数43。Notice映射到全页错误/登录重试（screen:29）、保留内容刷新（screen:30）与弹层局部错误（sheets:3），不得重复显示底页错误。CommentThread映射活动详情讨论区（screen:88）及event/feed的comment弹层候选（sheets:20），保留条件证据与未访问边界。详情和弹层统一回复结构，但公开评论与权限内删除仍由业务数据决定。JSON正反向映射已同步。
