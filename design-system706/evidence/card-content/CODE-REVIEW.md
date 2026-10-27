# 本轮卡片与内容代码交付

## 验证偏好（当前有效）

2026-10-26用户明确要求：“不用截图检查，但是要检查代码”。收到后停止新增截图和截图检查，完成门槛改为共享组件、全部调用点、WXSS作用域/优先级、结构参数和必要编译/已有功能检查。不启用自动化。本目录me-390 PNG/TXT产生于该指令之前，只是旧阶段记录；不能当成本轮最终版本的视觉验收。最终状态仅作代码与编译结论，不声称真机或全页面视觉通过。

## 卡片内Header：容器负责留白

- `templates/screen.wxml:38,45`：我的页menuGroups和管理页“我管理的”不再把裸标题塞入默认slot，而传MenuGroup.title。
- `ui-menu-group/index.wxml`：Header在白色surface内部；组件virtualHost和isolated不影响容器内部标题。`index.wxss`以panelInset提供上/左右留白，headingGap提供标题到内容间距。下面ActionRow本就以panelInset起步，标题与行icon左缘一致。Header title flex1/min-width0/overflow-wrap，右侧header-actions独立max45%，避免长标题冲突。
- `ui-section`新增显式context=page|card，默认page保留页面外标题；card自身提供一次panelInset与白面。已在Panel内部的标题不重复传card，不双重padding。当前discover的Section仍是page。
- Panel、RecordCard、PersonalEvent、PersonalCampaign及ReviewHistory.entry的标题都由各自panelInset容器包裹；EntityCard plain同样如此，cover模式保留sectionInset作为图文封面排版。
- self-profile、member-hero、calendar-entry、series-copy和活动发起方/关联专题/讨论白卡改用统一panelInset。页面外people/calendar-results/entity-events/member-history/campaign列表标题继续由screen.pageGutter承接；`.section-heading>text:first-child`可伸展与换行，不给整个页面标题再加card padding。

## 卡片级辅助操作：右上独立区域

| 位置 / 共享组件 | 处理与覆盖 |
|---|---|
| 我的个人卡 / IdentityRow | Edit profile进入actions具名slot；头像与copy顶部对齐，copy flex1/min-width0，actions右上且max45%。flush去掉身份行自身纵向padding，外层card只留一次panelInset。 |
| 人物推荐 / PersonCard（关注页、搜索组合） | person-copy占余宽，person-action改flex-start，头像与正文保持顶部。理由文本仍是该身份行之前的内容流；不绝对定位覆盖理由。 |
| 空间/组织管理入口、relations/following/entity-members | 全部IdentityRow.actions调用继承右上规则，不修改follow/manage事件。 |
| 报名管理、管理员、邀请 / RecordCard | 显式actionRail，将信息/Badge放record-copy，具名actions放最右列。动作列max45%、min-width0、顶部对齐；多个动作纵向排列，拒绝/通过小组允许换行且右对齐。保留原WXML条件、data-op/id/version/user-id、catch:press与授权条件。 |
| 我的活动/草稿/报名 / PersonalEvent | 左信息右动作，动作列max40%，纵向右对齐并置顶；封面max35%避免窄信息列溢出；原业务actions数组和act分发不变。 |
| 我的专题 / PersonalCampaign | 左状态/标题/摘要，右编辑/进度独立max40%纵向动作区。 |
| 活动/专题审核进度 / ReviewHistory | 左状态/标题/说明，修改重提右上；审核记录行只读状态不改为操作。 |

合理保留层级：评论回复与正文左缘对齐；表单提交和固定FloatingBar是任务主动作；成员主页编辑/分享/更多是整页多操作区；EventCard标题/海报是内容入口；AccessStep是步骤交易动作，已有右侧action与窄屏换行；EntityCard/RecordCard的通用footer slot没有卡片级辅助动作调用，不机械绝对定位。所有按钮都不改成全宽或position:absolute。

`component-inventory.json`列出45个原生组件的标题/操作/slot位置；screen/sheets为44页/20弹层共享调用入口。代码覆盖不等于逐页视觉验收。

## 状态Badge语义色

统一源`lib/status-tone.js`以真实枚举映射，`lib/theme.js`集中定义色token，原生Badge与独立Web复用；不按中文label猜状态、不在页面硬编码颜色。

| tone | 枚举 | 色义 |
|---|---|---|
| success | CONFIRMED, APPROVED, PUBLISHED, ACTIVE, CHECKED_IN, REVIEW_APPROVED | 绿字/浅绿底 |
| pending | REQUESTED, PENDING, IN_REVIEW, APPROVED_AWAITING_PAYMENT, CHANGES_REQUESTED, ROLE_INVITED, REVIEW_REQUESTED | 棕字/浅暖底 |
| waiting | WAITLISTED | 蓝字/浅蓝底 |
| danger | REJECTED, CANCELLED, REVOKED, DECLINED | 现有danger字/浅红底 |
| neutral | DRAFT, EXPIRED, REFUNDED, ENDED及未知枚举 | 中性色，保留状态文字 |

RecordCard管理/审批列表、PersonalEvent报名及发起列表、PersonalCampaign、ReviewHistory主体/记录已接入。报名状态与活动发布状态分别取对应实体枚举，个人报名优先item.status。主操作黄色accent与上述状态背景分工明确。状态文字保留，不仅靠颜色。

## 活动介绍重复：字段展示层，不改数据

调用链：page.js event分支一次read('event',{id})，normalizeBase以...item保留summary/description，旧screen.wxml分别输出summary和description，只以!==排除完全相同值。因此一个字段是摘要，另一个字段以该摘要开篇但还有正文时，会出现重复；不是证据支持的“同一字段请求了两次”。activity-preview也经过同一normalize。

只读核对本机Storage的706.mock.v1：version=2026-10-09-native-details-r12，anchor=2026-10-08T16:00:00.000Z；demo-film保存的summary和description完全相同，均为“一起看一部关于城市、居住与漂泊的纪录片。映后围成一圈，聊聊我们为什么留在一座城市。”（见saved-mock-fields.txt）。源码restore-prototype.js也将两者赋为e.summary。这个保存值与用户本次截图的“城市居住…映后围坐聊天”不同，不能冒充截图的直接源。读取时transport为soon；保存mock与当前活动响应的来源分开，未改Storage或重新seed。

共享event-content仅产生detailSummary/detailDescription，不改summary/description，不写数据库或本机数据：
- 两者完全相同：只输出正文一次；
- 正文在开头完整包含摘要，且以空白/换段分隔：隐藏摘要，保留整个正文及其他段落；
- 仅摘要、仅正文：保留存在的内容；
- 摘要正文不同、只是相似词、正文后部再次出现摘要：分别保留，不模糊删句。

空白规范化仅用于比较，原始正文显示值不裁剪、不改字。列表摘要、编辑表单原值不受影响。独立Web Section的summary/description采用同一算法，children优先，普通无字段Section不变。收到“不新增测试”要求之前已添加的9种数据边界检查保留并执行；不是视觉验收。

## 既有修复复查

screen统一pageGutter；screen当前4条scroll-x保留horizontal-track（3page rail双侧padding、1contained header rail），远端新增CompactMemberList以自己的strip/track保留双侧pageGutter与完整内容宽度，共5条横向轨道；gallery为有意fullbleed。消息筛选无menuHeight固定viewport/行高，最小touchTarget与导航占位分离；页面filter仍appearance=filter纯文字Chip，表单radio/checkbox保留。Button仅grow的face width100%/flex1，普通inline未改。日历delta-1/left与delta+1/right保持对应，页面返回默认none不旋转。上述源码契约及必要编译通过，未重新进行截图检查。

## 检查与边界

checks.json记录最终WXML/WXSS编译、原生契约、paper-layout、page-gutters、既有离线业务检查与9种文本边界。最初直接执行native-review因默认live transport在测试桩中被拒绝（网络连接失败），之后仅在测试进程设置config.mode=mock重跑；不修改真实config/Storage，不做真实用户操作。一次编辑过程中WXML标签不闭合被wcc发现并修复；最终编译为exit0。


## 远端并行提交合并复核

推送前发现远端main新增f18a5f9、b128808、a5f6f90，已在其上rebase整合，不覆盖账号引导、唯一edit-profile复用、权限映射和成员头像下姓名布局。IdentityRow同时保留stacked与flush；PersonalCampaign保留新PUBLISHED管理和remove入口；RecordCard报名操作沿用新can_approve/can_check_in，且invitations保留declineInvite，blocks/platform-admins新增操作同样进入右侧列。

远端新增blocks/platform-admins后44路由均在native-mapping中登记；ui-compact-member-list是第45个原生组件（私有组合支持，语义family仍43）。原先42页证据保持历史，不将新增页面写成GUI通过。旧“42路由”契约改为注册页面与映射精确一致检查；新表单saveForm的wx:elif保持远端防重复提交分支，不强行恢复旧wx:else。

最终checks.json是在整合后重新产生，包含新增账号/紧凑控件/个人活动/soon-map的29项既有测试。该合并后未新增截图检查。顶部Header、正文消重、管理动作、状态色与权限回调均以最终代码为准。

整合后的member-identity仍采用横向身份区，头像/姓名块改为flex-start；CompactMemberList的stacked头像下姓名是独立结构例外并保持原样。最后一次CSS调整单独通过50WXSS重编译，无需重复未受影响的业务检查。
