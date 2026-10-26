# 原生全量迁移只读审查

审查基线：`653221f`（2026-10-26）。本文件只做源码审查；不宣称迁移已落地、原生已编译或界面已验收。组件/页面行号均为该基线共享模板行号，主writer迁移后需重建实际应用地图。

## 结构与迁移边界

- 42个注册页的WXML为`<include src="../../templates/screen.wxml"/>`，JS为`Page(require('../../lib/page')('<route>'))`。共享模板`screen.wxml`承载所有页面，`sheets.wxml`承载20类弹层，修改一次可影响全部路由，但不能由此等同全部分支真实运行。
- 当前11个注册原生组件：ui-button、ui-icon-button、ui-choice-group、ui-checkbox、ui-action-row、ui-filter-chip、ui-status-summary、ui-review-history、ui-access-step、ui-personal-event、ui-personal-campaign。Web的43family是统一语义清单，不能将其DOM导出当成原生落地；也不能为了每格都有名字而给不适用分支塞控件。
- 原生目标可用`ui-<kebab-name>`表达；已有组件优先复用/完善，其他组件采用原生Component与WXML/WXSS实现。原存在与否只是状态标注，不拆成三份清单。
- 页面保留路由/记录/角色/权限/表单/业务条件，组件负责视觉结构、交互容器、native事件和参数。已归一化的`record/items/view`可作为数据传入，不能把后端请求、报名状态推断、审核权限、草稿存储塞进Button/Panel等视觉组件。

## 43 family准确落点与保留契约

下表“既存”仅指审查基线有注册原生实现，并不宣称全部出现点已使用。

| Family | 原生目标 / 既存 | 源码落点（screen/sheets） | 迁移契约 |
|---|---|---|---|
| FeatureCarousel | `ui-feature-carousel` / 无 | screen:33, screen:40 | 保留手动swiper、current/change、节点/专题路由差异、无自动播放与零前后margin。 |
| PersonCard | `ui-person-card` / 无 | screen:37 | 公开头像/姓名导航与关注操作分离；头像顶对齐，独立关注按钮单独对齐。 |
| FeedItem | `ui-feed-item` / 无 | screen:199 | 作者、正文与eventCard组合；REGISTRATION_ROLLUP仍由page.js归一化，不复制计数逻辑。 |
| EventCard | `ui-event-card` / 无 | screen:199, screen:39, screen:74, screen:205, screen:113 等 | 保留图像独立preview与title/open的catchtap防双跳；previewOnly禁业务导航。 |
| Avatar | `ui-avatar` / 无 | screen:37, screen:199, screen:204, screen:56, screen:84 等 | 只负责裁切/缺图和尺寸，不推断公开权限或人物身份。 |
| Button | `ui-button` / 有 | screen:31, screen:39, screen:55, screen:160, screen:87 等 | 保留原生open-type/share、disabled/loading、size与触控区；align:start用于回复正文左缘。 |
| IconButton | `ui-icon-button` / 有 | screen:24 | 保留动态menuHeight与独立44px点击区；三种surface。 |
| Navigation | `ui-navigation` / 无 | screen:221 | 仅4个主路由；sheet/task/keyboard隐藏条件仍由页面控制，保留运行中的唯一导航。 |
| LoadingState | `ui-loading-state` / 无 | screen:30 | 初载骨架与保留内容刷新分开，不能吞掉旧items/record。 |
| EmptyState | `ui-empty-state` / 无 | screen:215 | 沿用原路由排除条件；无数据不等于无权或请求失败。 |
| Sheet | `ui-sheet` / 无 | screen:218 | 壳/焦点/关闭事件归组件；sheetForm快照、busy锁闭、未发送确认仍归控制器。 |
| SearchField | `ui-search-field` / 无 | screen:39 | input/confirm/keyboardheightchange/value与查询提交/清空各自转发，不能只传press。 |
| FilterChip | `ui-filter-chip` / 有 | screen:194 | 保留单/多选语义与data-key/value；不是只读badge。 |
| ActionRow | `ui-action-row` / 有 | screen:39, screen:55, screen:61, screen:92, screen:93 等 | 仅有真实动作才是button；管理员/受限分支不能因封装暴露。 |
| SegmentedControl | `ui-segmented-control` / 无 | screen:204, screen:158, screen:39, screen:197, screen:207 | 沿用ChoiceGroup single数组值契约；radio零margin、统一指示符/gap/对称inset。 |
| NotificationItem | `ui-notification-item` / 无 | screen:204 | openItem索引和单条已读副作用保留；组标题及needsAttention/read状态由页面归一化。 |
| IdentityRow | `ui-identity-row` / 无 | screen:55, screen:84, screen:105, screen:113, screen:200 等 | 左头像/圆形身份标记与多行文本顶对齐；嵌套操作使用catch事件避免整行误跳。 |
| StatLink | `ui-stat-link` / 无 | screen:56, screen:105 | 真实零值保留；有onPress才可操作，不把只读活动数做成按钮。 |
| MenuGroup | `ui-menu-group` / 无 | screen:57, screen:58, screen:59, screen:63, screen:64 等 | 白面分组与分隔归组件；菜单数据、角色判断、locale仍归页面。 |
| EntityCard | `ui-entity-card` / 无 | screen:61, screen:114, screen:197, screen:100 | SPACE/ORGANIZATION/campaign是有意义的数据变体；不把空间公开负责人等同管理员。 |
| PermissionState | `ui-permission-state` / 无 | screen:61 | canManage与登录/权限由控制器判定，组件仅呈现结果及可用下一步。 |
| FormField | `ui-form-field` / 无 | screen:164, screen:185, screen:190, screen:192 | 统一标签/输入/错误；保留field-key锚点供错误滚动定位，optional与各type真实字段不丢。 |
| DateTimePicker | `ui-date-time-picker` / 无 | screen:167 | 仅event starts_at/ends_at实际使用；date/time原生picker及data-part分开，控制器保留时区转换/联动。 |
| MediaUploader | `ui-media-uploader` / 无 | screen:178 | 保留chooseMedia额度/10MB/部分成功/顺序/cover/草稿；组件内selector边界需专门处理拖拽几何。 |
| Gallery | `ui-gallery` / 无 | screen:75, screen:147 | 保留galleryIndex、swiper/change、原图previewImage数据集与图片加载失败。 |
| Section | `ui-section` / 无 | screen:76, screen:78, screen:79, screen:84, screen:86 等 | 仅承担内容区块和标题节奏；阅读顺序/可见条件仍为业务页面布局。 |
| ParticipantSummary | `ui-participant-summary` / 无 | screen:85 | 只能展示record.participants公开名单并标明部分数据，不调用管理端名单接口。 |
| Badge | `ui-badge` / 无 | screen:74, screen:105, screen:193, screen:207 | 只读标签含文字，不能使用filter交互样式或代替真实状态判定。 |
| FloatingBar | `ui-floating-bar` / 无 | screen:97 | 共用导航壳几何但动作比例独立；safe-area/keyboard避让与页面内容预留同时保留。 |
| FollowControl | `ui-follow-control` / 无 | screen:107, screen:117, screen:200 | 未关注/已关注/取消确认/busy/失败回滚仍接真实接口，别以组件本地toggle冒充。 |
| LinkList | `ui-link-list` / 无 | screen:110, screen:111, screen:113, screen:160, screen:100 | 公开资料与资源组数据由页面提供；公众号/文章失败/复制承接保持用户主动触发。 |
| ChoiceGroup | `ui-choice-group` / 有 | screen:172, screen:185, screen:26 | 多选/单选、max、disabled、隐藏已选项、value-key/label-key、eventDetails都保留。 |
| Stepper | `ui-stepper` / 无 | screen:161 | 只显示当前步骤；step与validate/fieldStep、草稿步骤持久化由forms/page控制。 |
| Checkbox | `ui-checkbox` / 有 | screen:185 | checked及change.detail.checked/value两种现有读取契约都保留，复选标签居中与白底修复不回退。 |
| StatusSummary | `ui-status-summary` / 有 | screen:160, screen:147, screen:157, screen:130, screen:132 等 | 区分待审/候补/待付款/确认/退回/发布；组件不能从视觉色彩推业务成功。 |
| Calendar | `ui-calendar` / 无 | screen:49 | 日期网格/选日/取消/period/mode输入输出与计数；range/timeline/跨日拆分仍留业务模块。 |
| ReviewHistory | `ui-review-history` / 有 | screen:147, screen:157 | 复用现有组件，审核项/身份/意见/下一步来自数据，不在组件重做审批规则。 |
| AccessStep | `ui-access-step` / 有 | screen:136, screen:137, screen:138, screen:139 | 复用现有组件；编号/说明/操作布局与权限下参与方式数据隔离。 |
| Switch | `ui-switch` / 无 | screen:166, screen:66, screen:191 | 原生checked/change，保留布尔转换与保存失败后重读，不把switch点击等同保存成功。 |
| PersonalEvent | `ui-personal-event` / 有 | screen:202 | 复用presenter与组件组合；保留personalNavigate/detail.route/id、personalAction的op payload。 |
| PersonalCampaign | `ui-personal-campaign` / 有 | screen:203 | 复用现有组件与personalNavigate；继续编辑/进度由真实记录状态决定。 |
| Notice | `ui-notice` / 无 | screen:29, screen:30, sheets:3 | 页面error、刷新note、sheet局部error层级不重复；request失败不清空内容。 |
| CommentThread | `ui-comment-thread` / 无 | sheets:20, screen:88 | 头像/文本顶部对齐；reply与正文左缘对齐；线程过滤、权限与reply_to保留在控制器。 |

## 42页分支覆盖索引

共同壳必须逐条件迁入：screen:24顶部导航/返回，29页面错误，30初载/刷新，215空态，218弹层，221主导航。共享壳的“已使用”与某页独有分支的“已使用”分开标记。

以下为基线分支索引，不是已迁移状态。每页native状态应写`source-derived / implemented / compiled / tool-visited / device-accepted`等可区分阶段，并关联组件及具体应用位置；不要把此前39页/20弹层的旧视觉访问复用于迁移后的验收。

| 页面 | 主分支 screen 行 | 页面独有组件 family（省略共同壳） |
|---|---|---|
| feed | 31–38 | FeatureCarousel, PersonCard, FeedItem, EventCard, Avatar, Button, Navigation, CommentThread |
| discover | 39–54 | FeatureCarousel, SearchField, FilterChip, ActionRow, EventCard, Button, Navigation |
| messages | 204–204 | SegmentedControl, NotificationItem, Avatar, Navigation |
| me | 55–60 | IdentityRow, StatLink, MenuGroup, ActionRow, Avatar, Button, Navigation |
| manage | 61–65 | MenuGroup, ActionRow, EntityCard, PermissionState |
| create-space | 160–189 | FormField, DateTimePicker, MediaUploader, Button |
| event | 74–99 | Gallery, Section, Avatar, IdentityRow, ParticipantSummary, CommentThread, EventCard, ActionRow, Button, Badge, FloatingBar |
| member | 105–112 | Avatar, IdentityRow, FollowControl, StatLink, LinkList, EventCard, Button, Badge |
| space | 113–128 | EntityCard, IdentityRow, FollowControl, ActionRow, LinkList, EventCard, Avatar, Button |
| org | 113–128 | EntityCard, IdentityRow, FollowControl, ActionRow, LinkList, EventCard, Avatar, Button |
| entity-events | 205–205 | EventCard |
| entity-members | 200–200 | IdentityRow, Avatar, FollowControl |
| edit-entity | 160–189 | FormField, MediaUploader, Button |
| admins | 193–193 | IdentityRow, Badge, Button, ActionRow |
| edit-profile | 160–189 | FormField, Avatar, MediaUploader, ChoiceGroup, LinkList, Button |
| relations | 158–158 | SegmentedControl, IdentityRow, Avatar, FollowControl |
| onboarding | 160–189 | Stepper, FormField, ChoiceGroup, Checkbox, Button, StatusSummary |
| calendar | 39–54 | Calendar, SegmentedControl, FilterChip, EventCard, Button |
| spaces | 197–197 | SegmentedControl, EntityCard |
| campaign | 100–104 | EntityCard, Section, LinkList, EventCard, Button |
| campaign-edit | 160–189 | FormField, MediaUploader, ChoiceGroup, LinkList, Button |
| campaign-create | 160–189 | Stepper, FormField, MediaUploader, ChoiceGroup, LinkList, Button, EventCard, StatusSummary |
| campaign-approval-detail | 147–156 | StatusSummary, Gallery, ReviewHistory, EventCard, Button |
| campaign-review-progress | 157–157 | ReviewHistory, StatusSummary, Button |
| event-access | 129–146 | StatusSummary, ActionRow, AccessStep, Button |
| activity-preview | 74–99 | Gallery, Section, EventCard, Badge |
| publish | 160–189 | Stepper, FormField, Switch, DateTimePicker, MediaUploader, ChoiceGroup, Button, EventCard, StatusSummary |
| approvals | 207–207 | SegmentedControl, ActionRow, Badge |
| approval-detail | 147–156 | StatusSummary, Gallery, ReviewHistory, EventCard, Button |
| approval-progress | 157–157 | ReviewHistory, StatusSummary, Button |
| registrations | 194–194 | FilterChip, PersonalEvent, EventCard, StatusSummary, Button |
| my-events | 194–194 | FilterChip, PersonalEvent, EventCard, Button |
| drafts | 202–202 | PersonalEvent, EventCard, Button |
| following | 158–158 | SegmentedControl, IdentityRow, Avatar, FollowControl |
| more | 66–73 | MenuGroup, ActionRow, Switch, Button |
| login | 190–190 | FormField, Button |
| attendees | 207–211 | IdentityRow, Badge, Button |
| invitations | 207–211 | ActionRow, Badge, Button |
| my-campaigns | 203–203 | PersonalCampaign, StatusSummary, Button |
| privacy | 191–191 | Switch, MenuGroup, Section |
| feedback | 192–192 | FormField, Button |
| review-lab | 26–27 | MenuGroup, ChoiceGroup, Button |


特别校正：旧映射将create-space列入DateTimePicker候选，但`lib/forms.js definitions.space`无datetime字段；只有event定义中starts_at/ends_at会进入该共享分支。审批列表上的SegmentedControl等条目亦需以真实render条件为准，不能单靠语义候选计算实际应用。

## 20种弹层迁移检查

| sheet | 实际分支 sheets 行 | 特别保留 |
|---|---|---|
| register | 19,23 | 姓名/理由/隐私同意/分享联系方式；满员/审核/直接报名CTA由record决定 |
| recommend | 23 | 发布推荐的社交语义，不能等同报名 |
| comment | 1,20 | 线程及reply_to过滤、文字输入/未发送确认；不得提交空回复 |
| participants | 1,4 | 部分公开名单/无公开名单；无管理端私密数据 |
| payment | 15 | 原生付款边界；演示面不能称真实付款成功 |
| group | 1,2,16,25,26 | 授权后的参与方式、多方法、合成二维码声明、用户主动复制 |
| return | 17 | 必填修改意见及data-approve=false；不等同删除 |
| city | 7 | 保留城市切换/跨页面缓存刷新语义 |
| language | 8 | 立即更新系统文案；不自动翻译用户内容 |
| notifications | 1,9 | 偏好保存/失败重读与显示一致 |
| mini | 10 | 菜单导航；非业务提交 |
| about | 11 | 只读介绍；完成/关闭即可 |
| manage | 12 | can_manage/can_admin保持，不能仅靠隐藏UI作为权限控制 |
| member | 13 | owner排除、屏蔽/取消屏蔽block_id与反馈举报分组 |
| why | 14,26 | 只读解释；图标/标题/正文不做提交 |
| poster | 1,5 | 本机生成/预览/保存相册权限/失败承接；不伪造有效小程序码 |
| official | 6 | 真实打开/演示/失败复制承接，不自动复制 |
| recap | 6 | 官方文章URL/演示内容分开，失败可解释 |
| invite | 21 | 成员ID输入，真实邀请只经用户明确提交 |
| report | 22 | reason字段与未发送确认，发送失败保留内容 |


## 三项用户规则与既有选择修复

1. 评论回复是无图标文字动作，基线没有漏图标占位；当前Web偏移修复来自Button align:start。原生Button需等价的align/inline语义，仍有44px触控区；回复正文左缘相同，不用页级负margin抵消。
2. 单选/复选控件指示符与文字gap、左右inset对称；原生radio/checkbox必须清除默认margin，按实际微信渲染确定几何，不能拿浏览器20px测量冒充原生。保留tags居中与选中框右侧多余白底修复；先保留native语义，再调可见面。
3. 头像/圆形身份标记与右侧多行文本顶部对齐：推荐人物、动态作者、成员/空间负责人、评论、公开参与者列表等适用。关注/管理按钮独立决定对齐。多头像统计、上下堆叠结果图、普通功能图标行不是该模式。

## 高风险跨组件边界

- `page.js`大部分动作读取`e.currentTarget.dataset`；Component事件默认不跨边界冒泡。调用点data-*要留在宿主，明确bind:press/change/navigate/action；不要指望组件内部按钮的dataset自动变成页面宿主dataset。
- 输入组件必须保留`detail.value`、`keyboardheightchange.detail.height`、cursor-spacing、maxlength/auto-height、confirm-type/confirm。date/time picker另保留data-part与原有dateInput；重复links还需data-index。
- `ui-choice-group`已保留隐藏选择、禁止变动disabled选项、max只禁新选、single输出数组、valueKey/labelKey。`ui-checkbox`同时发`detail.checked`和`detail.value`，不可破坏。
- `page.js:292`媒体拖拽用页面级`wx.createSelectorQuery().selectAll('.media-tile')`。移入隔离组件后不能穿透；几何查询必须改为组件内createSelectorQuery并发出rects/重排事件，控制器仍负责持久化。长按/删除catchtap/取消拖动/部分上传失败均单独检查。
- native `open-type="share"`、微信登录、相册/图片预览、支付/公众号/文章等不能被统一press替代；视觉组件可封装发起入口，但不重写原生能力。
- Component styleIsolation会改变slot与全局CSS作用域；不能只移动标签却让组件依赖外层`.screen button`穿透样式。真实样式应进入组件，页面保留业务布局。
- `requestCloseSheet`以sheetSnapshot和sheetForm判断未发送改动；组件关闭只发request-close，不能自行绕过busy/放弃确认。提交成功走内部closeSheet，避免重复询问。
- `page.js`权限、`forms.validate/fieldStep/payload`、`mine-phase/personal-event`、`calendar-layout`、`soon-map`与隐私字段公开预览边界继续由对应模块承担。
- 不要为“零手写UI”删除合理业务布局：公开介绍顺序、审核各方进度、表单条件字段、媒体编辑/拖拽、native picker与状态分支仍可在页面组合；基础Button/Field/Identity/Card/Section的几何与样式不能继续各自散写。

## 原生编译工具与命令

本机只读确认以下二进制存在并成功返回`--help`；没有开启IDE安全端口，也没有调用上传/预览/提审。本审查未运行迁移后编译。

- `/Applications/wechatwebdevtools.app/Contents/Resources/app.asar.unpacked/node_modules/wcc-exec/wcc`
- `/Applications/wechatwebdevtools.app/Contents/Resources/app.asar.unpacked/node_modules/wcc-exec/wcsc`

在仓库根目录可用参数数组运行全部实际WXML/WXSS，避免shell展开/遗漏新组件：

```python
from pathlib import Path
import subprocess
root=Path('miniprogram').resolve()
base=Path('/Applications/wechatwebdevtools.app/Contents/Resources/app.asar.unpacked/node_modules/wcc-exec')
for tool,suffix in [('wcc','.wxml'),('wcsc','.wxss')]:
    files=[str(p.relative_to(root)) for p in sorted(root.rglob('*'+suffix))]
    subprocess.run([str(base/tool),'-o','/dev/null',*files],cwd=root,check=True)
```

这只是wcc/wcsc语法与模板依赖编译；组件注册、真实事件路由、CSS隔离、native触控区和可读性必须在开发工具实际复核。输出若需正式留档，主writer保存编译命令/exit与文件数到设计系统evidence，不保存编译器stdout的大体积bundle到聊天。

## 既有验证入口与局限

`node --test test/*.test.js`覆盖紧凑控件、IconButton、个人活动presenter和soon映射。对新增原生组件，只为有意义的事件/状态契约补检查，避免测试仅抄实现。

`config.js`默认`mode:'soon'`。推荐所有离线脚本统一用进程内覆盖，不修改真实配置文件或用户开发工具存储：

```sh
node -e "require('./miniprogram/config').mode='mock';require('./scripts/verify-native-review.cjs')"
```

将脚本名逐一替换为下表入口；每个脚本各自进程运行，避免全局wx/缓存/存储mock相互污染。脚本中的内存mock.reset不等于重置用户开发工具数据。

| 脚本 | 有意义的现有覆盖 |
|---|---|
| verify-native-review.cjs | 118目录控制器与sheet、报名/付款门槛、权限/私密媒体、记录/计数/草稿隔离、日历与参与方式；不等于118界面验收 |
| verify-global-design.cjs | 42路由×中英主题、task chrome、公开预览不含私密字段、防重复提交、错误保留输入、关闭确认 |
| verify-community-navigation.cjs | 4导航和7路由双语token/icon、稳定导航几何/路由切换 |
| verify-event-gallery.cjs | 多选额度、10MB、部分成功保留、顺序/封面、跨行重排、取消拖动 |
| verify-editorial-round.cjs | feed/filter/calendar/me/messages/onboarding双语控制器、校验/状态CTA、release开发入口、海报长内容 |
| verify-node-editorial.cjs | 节点去重/排序/分页/部分失败、公开负责人/公众号/文章安全承接、不静默复制 |
| verify-member-profiles.cjs | 8人物记录归属/计数、隐私/取消/去重、访问导航/分享 |
| verify-paper-layout.cjs | 320/375/430原生header、fallback、双语事实字段、开发入口 |

大量脚本带旧模板/CSS字面串断言，如`is="eventCard"`、`class="row form-actions"`、`navigation-shell`、`sheet-cancel`。迁移应将它们改为真实原生组件契约与语义断言，保留对应行为检查，不是为了通过而删除所有断言。独立Web `verify.cjs`只能校验Web包/源映射，不能代替新原生应用。

## 真实工具回归最小闭环

- 重新编译后确认当前仓库与新组件被加载，避免新JS模块未进入运行包的旧问题。
- 原生查看4主tab、详情/长文/空图、人物/身份/评论顶对齐与回复左缘、选择single/multiple/tags/list/max/disabled、任务表单每步/错误/键盘、媒体操作、个人状态/审核/参与方式，以及20sheet适用阅读/编辑/关闭/提交中状态。
- 原来39/42路由、20sheet阅读面的证据是迁移前结果；须另写本次新验证记录。spaces/following无GUI入口、invitations无当前邀请通知的缺口不得被标成已实访。
- 不发送真实验证码、不微信登录、不付款、不创建邀请/审核真实记录、不改安全端口/编译配置来凑覆盖。局部工具/数据缺口只阻相应验收，保留准确原因，其余迁移继续。

## 原生集成审计补记（2026-10-26）

完成共享入口迁移后的条件分支核对：对照 HEAD 的 bare `wx:else`，不以文本总数强行判错；EventCard、FeatureCarousel、MediaUploader 等已内聚的分支在对应组件内核查。修复 `screen.wxml` 的月视图/下周互斥、已报名/新报名互斥、本人编辑/他人关注互斥、关联活动不可用/打开互斥、二维码上传/文字参与方式互斥、分步草稿/普通直接保存互斥；恢复 Discover 搜索条件、Event 正式详情操作条条件、PENDING 且 IN_REVIEW 审核操作条条件。`sheets.wxml` 通用输入恢复 `wx:else`，避免报名、评论、邀请出现额外兜底字段。城市/语言主标题从 description/value 中拆回独立 label，保留说明与值。其余 ActionRow 主标题未发现说明/值扁平拼接；review-lab 手工箭头与 navigation 双箭头已向主作者提示。

`node scripts/verify-native-system.cjs`：24/24 通过，networkCalls=0，productionWrites=0。测试包括按钮 busy/disabled/native share/form/alignment，ChoiceGroup max/hidden/disabled/single 数组契约，输入与键盘 detail，精确 handler/dataset、交互白名单和 mediaRects 跨边界真实重排/草稿持久化，以及 42 路由共享入口、递归组件注册与四文件存在性、20 sheet 承接、共享模板零裸按钮/输入等控制、关键条件分支和城市语言标题。组件注册按实际引用递归解析，不机械要求 43 个原生目录。

原有 5 项回归脚本已更新旧内联 markup 字面串断言至当前原生组件来源，所有业务运行断言保留：

- `node scripts/verify-global-design.cjs`：42 routes × 2 languages，共享主题、键盘/任务、public-only preview、重复提交与失败输入保留通过。
- `node scripts/verify-community-navigation.cjs`：原生 Navigation 资源/状态/交互、FeedItem/SearchField/PersonCard/EventCard 接线及原有双语业务模型通过。
- `node scripts/verify-paper-layout.cjs`：原生 EventCard、当前主题 stickerWidth=500rpx / eventArtSize=264rpx、标题栏几何、主入口回退通过。
- `node -e "require('./miniprogram/config').mode='mock';require('./scripts/verify-node-editorial.cjs')"`：节点双语、筛选/分页/部分失败、公开资料、native open/fallback、访客隐私及 FeatureCarousel 契约通过。
- `node -e "require('./miniprogram/config').mode='mock';require('./scripts/verify-editorial-round.cjs')"`：原有双语控制器/验证/消息/海报布局通过。

这些结果是本地离线组件/控制器及源码集成检查，不表示 WXML 真机渲染、GUI、部署或用户验收已完成。静态视觉断言迁移后检查组件当前设计契约，旧页面样式不再约束隔离组件。没有改登录实现、安全配置、编译配置或发布状态。

### 二次只读检查

FeedItem 由 IdentityRow 的 `custom` 默认 slot 承接原 subject/action，已恢复 subject 独立粗体、动作常规体及英文空格。社区导航静态断言改为验证这组 slot 语义，不依赖先前扁平化字符串。5 项回归与原生 24 项测试复跑通过。

新增 EmptyState 保留原加载/错误/列表/记录/表单/特殊路由排除条件，Calendar/Discover 才显示 clearFilters；成功 StatusSummary 保留 `formKind && submitted`、非个人资料审核进度路由及 submittedId/optionsId、feed 跳转与个人资料 restartForm 条件；4 个 StatLink 保留 self/member 对应 relations 路由、成员 owner 与 followers extra.mode，组件默认 interactive=true 并通过 press 返回外层绑定。与原 HEAD 对比未发现该轮条件或导航 dataset 遗失。此结论仍是源码/离线检查，无新增 GUI 或真机验收。

### 共享样式清理后的最终离线回归

共享样式移除旧内联组件选择器后，4 个脚本的视觉静态契约已跟随实际所有者：GlobalDesign 检查 FloatingBar 的 keyboardHeight→position:static 与 Sheet 原生圆角；CommunityNavigation 检查 EventCard rim/art 几何、PersonCard 顶对齐/可换行、Button touchTarget 和 Navigation 安全区；EditorialRound 检查 NotificationItem 普通/attention/read 状态；NodeEditorial 检查 FeedItem 间距且无额外边框/阴影、PersonCard 无边框及 reason 换行。所有原控制器、模型、权限、数据与跳转业务断言保持。头像和封面断言允许当前显式空字符串 fallback。

最终复跑：`verify-global-design`、`verify-community-navigation`、`verify-editorial-round`（进程内 mock）、`verify-node-editorial`（进程内 mock）、`verify-paper-layout` 全通过；`verify-native-system` 24/24 通过，networkCalls=0、productionWrites=0。该阶段只修改 scripts 和本审计文件；GUI 最终编译由主作者另行记录。

### SegmentedControl 原生接入后的最终回归

时间段现由 single/tags ChoiceGroup 承接，移除已过期 month FilterChip 裸 else 断言，新增两项有意义契约：Discover 的 week/next/month 与 Calendar 的 week/month 选项；month、offset=0、offset=1、负数及 offset>1 的精确 selected 数组；periodChoice 三值真实转发至 calendarMode/filter，并实际运行原 handler 验证 calendarMode、offset 0/1、selectedDate 清空、sharedRange 清空、calendarSelectionInitialized、load 一次和其他筛选保留，未知/空值不分派。

`verify-native-system` 更新为 26/26，通过（networkCalls=0，productionWrites=0）；上述 5 项业务回归同时复跑全部通过。仅修改脚本与本审计，不改原生源码。
