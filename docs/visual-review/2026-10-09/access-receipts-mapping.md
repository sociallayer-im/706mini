# SID-95 coverage12–13：报名凭证与参与方式

2026-10-09。本批仅将零基12付费未付款、13免费已确认两页收尾；其他页面不随组件检查提升。fixture仍为 `2026-10-09-native-details-r12`，前端为离线演示，后端为实际编译产物的本地handler测试；无生产请求、支付、消息、commit/push/部署。

## 来源与实际 Figma 范围

原 `dist/app.js` 的 `renderEventAccess` 决定成功/审核通过、活动名称、下一步、付款→入群→联系、通用提示的顺序。原联系人替换为合成人物禾舟与明确无效的演示标识，不复用原微信号。实际状态优先于静态原型的“你可以参加了”：尚未付款显示“报名申请已通过”，免费 CONFIRMED 才显示“你可以参加了”。

本批通过 web-access 工作流实际读取 Sola 文件中的以下节点；使用既有本任务浏览器连接，自己的临时 Figma tab 已关闭，用户标签未动。

|节点|实际内容与证据|用途和边界|
|---|---|---|
|19576:41642|`access-ticket-19576-41642.png`，创建活动的 Ticket Type Settings|不是报名成功整页，不能当作凭证精确匹配。截图缩放菜单遮挡右侧，不据此断言右侧细节。|
|19604:77251|`access-popup-ticket-19604-77251.png`、`access-popup-ticket-close.png`，Buy Ticket sheet|实际读取活动摘要、票种卡片、金额与支付区；close图仍有缩放菜单，不能当作已关闭菜单的证据。|
|19604:77251|`access-popup-ticket-bottom.png`|已关闭缩放菜单并平移，清晰显示票种白卡、Payment Method、底部金额和薄荷渐变付款按钮、安全区。|
|19553:25453|已读 joined-event 的 `film-participant-19553-25453-top/middle/bottom.png`|复用已加入状态、白色圆角卡和操作层级。|

上述 Figma 原始图均在私有 `706-montana/apps/community706/evidence/figma/2026-10-09/`。本轮在已取得的节点清单中检索 Ticket、joined、success/contact相关名称，并实际打开上述 Ticket/Buy Ticket 节点；未找到并验证与凭证/联系人整页一一对应的 frame。结论明确为 **COMPOSED_FROM_VERIFIED_COMPONENTS**：原型结构 + 已读圆角卡、浅灰画布、薄荷操作、sheet handle/圆角/关闭/安全区；不是整页 Figma 精确复刻。未引入原型不存在的票种选择、支付渠道选择。

## coverage12：付费未付款

- 记录 `demo-reg-payment` / `demo-payment-film`，林叶，`APPROVED_AWAITING_PAYMENT`。实际活动为秋日放映，2026-10-10 19:30–22:00，706青年空间，¥30。
- 保留“请在 30 分钟内完成”，同时显示记录中的实际付款截止时间。本轮演示记录自然过期后，只对这一条做一次 `receipt-r1` 窄迁移，恢复30分钟窗口；14:26编译后实际显示14:56截止。后续读取不延长，仍会自然过期。不是把所有旧数据重置，也不是改变真实付款状态；真实后端默认30分钟，部署环境配置本批未改。
- 入群与联系人行完整保留，两处“查看”均为原生 disabled，实际点击后没有弹窗、私有内容或状态变化。禁用按钮增加可读灰底灰字，取消报名全宽。
- 未调用access读取私有方法；联系人显示公开姓名/host及“付款后可查看、复制”，报名联系方式只在同意分享时提供。未同意时明确“仅在你报名时同意后……”而不伪称已授权。
- “去付款”实际打开金额和本地模拟说明，X关闭成功，仍为待付款。没有点击模拟付款或取消报名。
- 原通用提示完整保留：“有些活动不会提供群聊。届时这里会说明‘组织者稍后会与你联络’，或显示公开联系人。”

证据：`native/details-r12-access-paid-final-top.jpg`、`-paid-bottom.jpg`、`-paid-disabled.jpg`、`-paid-payment-sheet.jpg`、`-paid-payment-closed.jpg`（后四项同一 `details-r12-access` 前缀）。顶部与向下滚动后的中下部、所有行及底部按钮已目视。

## coverage13：免费已确认

- `prototype-walk-0` / `demo-walk`，林叶，CONFIRMED；苏州河慢走，2026-10-11 15:00–18:00，M50创意园门口。无需付款，标题“你可以参加了”，步骤只有入群与组织者稍后联络。
- 主页面入群说明“二维码已开放；群内会发布行前提醒”；弹窗说明“你的报名已确认，可查看活动群和组织者的参与说明”，不把付款作为免费活动的前提。
- 使用已有合法组合 GROUP_QR + ORGANIZER_WILL_CONTACT。两个“查看”入口都实际打开统一参与方式层，两个方法均展示；复制稍后联络说明显示“内容已复制”，完成与X均可关闭。
- 合成二维码位于 `miniprogram/assets/demo/access-placeholder.png`，使用 CoreImage QR 生成器编码纯文本 `706_DEMO_ONLY_NO_GROUP_OR_CONTACT`，含白边。只包含DEMO标识，不指向真实群、账号或网址；页面明确标注无真实群信息。它取代早期抽象占位图，旧占位图截图不作为最终证据。
- 通用“有些活动不会提供群聊”说明完整保留，并不把本活动的真实群+稍后联系组合改写成互斥选项。

证据：`native/details-r12-access-free-final-{top,bottom,methods,copy,closed}.jpg` 和 `native/details-r12-access-free-later-open.jpg`。全部目视，含复制toast、合成码完整白边、两方法、底部完成及安全区。

补充合法联系人验证使用已有 CONFIRMED 的 `demo-reg-group`（目录61，页面显示62/118），没有把coverage12改成已付款：展示 `DEMO_HOST_NO_REAL_ACCOUNT`、实际复制toast、X关闭。证据 `native/details-r12-access-confirmed-contact{,-copy}.jpg`。此为12–13共享参与方式的补充操作证据，不提升coverage61。

## 实际后端边界修复

文件：`706-montana/apps/community706/functions/community.ts`。

1. mediaPermission 编辑分支遍历 access.methods，GROUP_QR位于后项也能被已有canEdit管理员预览；公有媒体支持event/campaign media数组引用。event保持canEdit，campaign保持owner/platform，未扩展组织管理员为campaign权限。私有QR仅能通过合法secret引用，放入公有media数组不授予读取权限；原上传者权限保留。
2. validateMedia与cover保存检查拒绝私有引用、canonical私有media、private-media签名预览及payload/signature/token等凭据参数。公有event/campaign DTO对旧数据再次过滤，并只保留asset的type/url/label字段。publicMedia仍始终拒绝private。
3. 普通用户clone公开活动后可复用真正公开可读的源封面；未公开且无编辑权限的其他人资产不能复用。校验优先已有编辑权限，失败时只允许通过现有publicMedia公开可读合同的资产，未扩大私有权限。
4. 报名参与权限继续要求本人/可编辑者、CONFIRMED、活动PUBLISHED；根过期拒绝，后项过期方法不返回、不能预览群码。mock参与方式返回同步过滤过期方法。

`tests/access-media-contract.mjs` 导入真实 build/community.js handlers，使用本地DB double与合成AES-GCM密文、禁止fetch。覆盖非首项QR、event/campaign数组、角色撤销、非owner、未付款/申请中/候补/取消/退款/过期、活动取消、根/单方法过期、上传者原权限、private publicMedia拒绝、非法URL保存、旧DTO清理、公开clone→save与未发布他人媒体拒绝。不是只测试重复实现的权限函数。

## 验证、保留状态与后续

- 118目录/状态控制器检查通过；新增窄迁移不改变已保存IN_REVIEW系列对象、30分钟期限不随读取延长、paid不读私有方法/free组合的断言通过。
- 实际backend build、visual-contract、access-media-contract通过，networkCalls=0 / productionWrites=0。
- 最后版本42 WXML /2 WXSS编译、前后端diff check通过。截图均为原生微信工具实际GUI，不用HTTP200或控制器测试代替视觉验收。
- 保留r12数据和demo-campaign上批IN_REVIEW；本批未提交系列修改或重置数据。原生owner详情/编辑读取仍有film、杭州、workshop三项。核对“我的专题”时目录AX截断、输入未成功，未据此声称再次看到进度页；保留状态由窄修改与隔离迁移断言支持。
- B补充的发布/编辑 `refreshMedia` 未覆盖media数组及access_values.GROUP_QR的前端签名预览问题，仍留待publish39–41批实际GUI修复核验；本批只完成对应后端授权，不能说上传预览全链路已通过。
- 最终原生界面回到林叶免费凭证，弹窗关闭。13张最终手机裁图列入capture-log；旧state12/13及本批中间图移入私有archive。只提升12–13：18 VERIFIED /13 NEEDS_FIX /32 PENDING；全量未完成。
