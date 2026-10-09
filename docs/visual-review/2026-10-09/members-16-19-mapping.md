# SID-95 暂停交接：成员16–19（WIP）

状态：**用户暂停，待本人Review**。2026-10-09。本批不验收；全量及真实账号/设备/用户验收均未完成。停止新增实现、页面核对与测试，不部署、不重置演示存储。只有用户明确恢复后继续。

## 已做代码

- 成员主页独立于组织/空间共用模板：toolbar、头像/姓名/城市bio/完整intro、3tags、编辑或关注+分享、3统计、作品与社交、常出没于、两场活动历史依来源顺序排列。
- 主页作品/社交各取首条，编辑数组四条仍保留；历史标题可打开film/workshop详情。关系卡使用已有合成实体头像，链接使用语义图标，不用“屋/组/作/社”作图标。
- mock默认成员bio采用source_bio；member_bio_edited区分初始样例和实际保存值。旧存储迁移仅推断仍等于初始值的资料，保留不同的既有编辑。真实API不应用mock来源覆写。
- 独立membership不授予role；featured_entities与编辑frequent_spaces分开。复用既有已结束活动和报名记录，只更正历史场地映射，默认6场由确认参与的公开已结束活动去重计算。隐私关闭时不显示数值，失效关系/实体不显示。真实backend同一关系及计数逻辑。
- member-r1与bio-r1均为窄迁移，fixture仍r12；不全量reset，不改系列审核/活动关联/草稿。

## 已有验证，不等于整页通过

暂停前已运行：118场景控制器（在后续简介修正前）；42WXML/2WXSS编译（在最终图标微调前）；真实backend build和visual-contract；新增前端verify-member-profiles与真实backend member-contract。后两者覆盖关系/计数、取消/重复/私有活动/分享关闭/失效实体、独立membership不授予管理、访客关注对象、首条链接/分享路径、迁移保留。前端专项最终也验证8人的来源bio及实际保存后的bio。暂停后未新增测试。

原生最后完整编译后Errors0；已有截图显示游客/性能警告，未宣称零警告。

| coverage | 已有实际GUI | 未完成 |
|---|---|---|
|16 林叶|最终15:30真正首屏已目视：头像、toolbar、完整名字和来源bio可见；已拍中/下；两个编辑入口、分享弹窗打开并取消、安全示例链接复制、组织/空间、film/workshop详情已实际打开|最后重拍的中/下未再逐图终审；分享/编辑/部分目的截图早于最终bio修正；整页最终证据整理未完成|
|17 禾舟|最终代码已进入，AX核对产品设计·放映组织者、已关注、32/128；拍top/middle/bottom|新三图尚未目视终审；关注/取消关注、更多、分享、访客关系与详情回路尚未完成|
|18 星桥|本批共享代码继承；既有r6计数证据保留|本批最终GUI未开始|
|19 云汀|本批共享代码继承；既有r6计数证据保留|本批最终GUI未开始|

16–19全维持NEEDS_FIX；20–23没有提升。当前总计19 VERIFIED /12 NEEDS_FIX /32 PENDING。

## Figma来源与边界

实际读取owner 19718:8160（Posts变体及旁边Groups）和visitor 19614:9378（Events）85%近景；闭合缩放菜单后截图，访客含上部及向下卡片区域。复用已实际核对紧凑活动卡19696:4524。采用白色紧凑hero、圆形头像/操作pill、灰底白卡、右侧封面结构；源原型决定顺序/功能，不添加Figma-only tabs或Add contact。owner不是精确历史活动整页，下部截图局部被Figma登录栏遮挡，不声称完整长页到底。

私有Figma文件在 `706-montana/apps/community706/evidence/figma/2026-10-09/`：`member-owner-19718-8160.png`、`member-visitor-19614-9378-top.png`、`member-visitor-19614-9378-bottom.png`。临时Figma标签已关闭。

## 当前证据与暂停位置

本批原始全IDE截图留本机私有目录 `706-montana/apps/community706/evidence/visual-2026-10-09/`，文件前缀 `details-r12-member-`；采集时间在同目录 `details-r12-captures.json`。此批尚未整理发布去敏图，**不加入公开仓库**。旧失败/转场截图不作最终证据；文件名top不代替实际目视位置。此前已去敏的其他批次公开证据保留。

最后GUI：林叶作为查看者、禾舟成员页下部（已执行两次下滚并截图）。没有继续星桥/云汀或关注操作，没有真实分享/消息/支付。当前演示系列沿用IN_REVIEW、5待处理与原三关联；本批未修改它们，暂停时未额外进入核对。存储与未完成改动完整保留。

## 恢复条件与待办

仅用户明确恢复后：先读checkpoint、此映射与真实当前GUI，继承r12和窄迁移，继续16–19未完成GUI/逐字段/逐图验证。不得以代码、测试、目录可达或HTTP200代替验收。

24编辑另批：源主页默认产品组+706空间、编辑初态706+Sola确有差异。当前featured_entities优先用于初态；保存新空间后需组合保留组织membership并展示新空间，不能被默认featured永久遮蔽。实际保存/回读尚未做，不能算通过。20–23、24、28–30以及31–62均按coverage继续，不扩展本次暂停整理。

原63之外onboarding、campaign-create、campaign-approval-detail、campaign-review-progress需后续additionalRoutes矩阵与原生全步骤/状态证据；55控制器不是这些路由的GUI覆盖。
