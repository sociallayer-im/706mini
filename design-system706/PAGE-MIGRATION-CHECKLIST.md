# 全页面迁移检查清单

本轮统一规则见README的“页面留白与纯文字筛选”。以下42页均由源码检查确认共享screen及pageGutter；不等同于每页全部状态GUI验收。真实GUI范围单列在evidence/page-gutters/README.md。

|页面|共享页面留白|横向内容轨道|例外|
|---|---|---|---|
|pages/feed/index|源码通过|人物推荐轨道|无整页全出血例外|
|pages/discover/index|源码通过|空间筛选轨道|无整页全出血例外|
|pages/messages/index|源码通过|标题栏消息类别 contained轨道|无整页全出血例外|
|pages/me/index|源码通过|无横向轨道|无整页全出血例外|
|pages/manage/index|源码通过|无横向轨道|无整页全出血例外|
|pages/create-space/index|源码通过|无横向轨道|无整页全出血例外|
|pages/event/index|源码通过|无横向轨道|Gallery全出血阅读图|
|pages/member/index|源码通过|无横向轨道|无整页全出血例外|
|pages/space/index|源码通过|空间公开成员轨道|无整页全出血例外|
|pages/org/index|源码通过|组织公开成员轨道|无整页全出血例外|
|pages/entity-events/index|源码通过|无横向轨道|无整页全出血例外|
|pages/entity-members/index|源码通过|无横向轨道|无整页全出血例外|
|pages/edit-entity/index|源码通过|无横向轨道|无整页全出血例外|
|pages/admins/index|源码通过|无横向轨道|无整页全出血例外|
|pages/edit-profile/index|源码通过|无横向轨道|无整页全出血例外|
|pages/relations/index|源码通过|无横向轨道|无整页全出血例外|
|pages/onboarding/index|源码通过|无横向轨道|无整页全出血例外|
|pages/calendar/index|源码通过|空间筛选轨道|无整页全出血例外|
|pages/spaces/index|源码通过|无横向轨道|无整页全出血例外|
|pages/campaign/index|源码通过|无横向轨道|无整页全出血例外|
|pages/campaign-edit/index|源码通过|无横向轨道|无整页全出血例外|
|pages/campaign-create/index|源码通过|无横向轨道|无整页全出血例外|
|pages/campaign-approval-detail/index|源码通过|无横向轨道|无整页全出血例外|
|pages/campaign-review-progress/index|源码通过|无横向轨道|无整页全出血例外|
|pages/event-access/index|源码通过|无横向轨道|无整页全出血例外|
|pages/activity-preview/index|源码通过|无横向轨道|Gallery全出血阅读图|
|pages/publish/index|源码通过|无横向轨道|无整页全出血例外|
|pages/approvals/index|源码通过|无横向轨道|无整页全出血例外|
|pages/approval-detail/index|源码通过|无横向轨道|无整页全出血例外|
|pages/approval-progress/index|源码通过|无横向轨道|无整页全出血例外|
|pages/registrations/index|源码通过|报名阶段轨道|无整页全出血例外|
|pages/my-events/index|源码通过|发起阶段轨道|无整页全出血例外|
|pages/drafts/index|源码通过|无横向轨道|无整页全出血例外|
|pages/following/index|源码通过|无横向轨道|无整页全出血例外|
|pages/more/index|源码通过|无横向轨道|无整页全出血例外|
|pages/login/index|源码通过|无横向轨道|无整页全出血例外|
|pages/attendees/index|源码通过|无横向轨道|无整页全出血例外|
|pages/invitations/index|源码通过|无横向轨道|无整页全出血例外|
|pages/my-campaigns/index|源码通过|无横向轨道|无整页全出血例外|
|pages/privacy/index|源码通过|无横向轨道|无整页全出血例外|
|pages/feedback/index|源码通过|无横向轨道|无整页全出血例外|
|pages/review-lab/index|源码通过|无横向轨道|无整页全出血例外|

20类弹层全部共用ui-sheet外壳，源码核对左右pageGutter与border-box；仅实际进入的弹层计GUI覆盖。固定Navigation/FloatingBar使用独立pageGutter壳，不能再叠一层页面padding。Calendar网格使用minmax(0,1fr)，表单媒体网格在字段内部换行；卡片内部panelInset是内容层级，不替代或重复页面外边距。

负margin白名单：ui-gallery跨页面gutter展示完整阅读图；ParticipantSummary头像叠放；FeatureCarousel内部装饰几何；屏外poster-canvas。horizontal-rail的受控负margin仅扩展滚动视口，必须与内容轨道的双侧padding成对出现。其余独立页面不得抵消pageGutter。

筛选检查：时间、空间、阶段、关系、节点范围、消息类别统一纯文字Chip；前述互斥单选保留，免费与有名额按原业务独立组合。表单兴趣/隐私/参与方式保留Checkbox/Radio。Web/原生数据接口仍分别维护，样式共用各端FilterChip基础。

## 远端整合后的补充代码覆盖

2026-10-26合入a5f6f90后共44个注册路由。新增blocks、platform-admins复用screen和RecordCard右侧动作列、语义Badge与统一gutter，仅代码核对；此前42页GUI记录不扩充为新页面已验收。成员横向列表由ui-compact-member-list接管，保持其双侧track padding与stacked姓名布局。详见evidence/card-content/CODE-REVIEW.md。
