# SID-95 coverage14：独立活动日历

2026-10-09 15:11。本批原生交互与海报本地保存已验证；B明确裁定不继续扩大历史日志检索，按已验证最终版本收尾并准确保留历史归因未确认。coverage14现为VERIFIED；总计19 VERIFIED /12 NEEDS_FIX /32 PENDING，只提升14。当前无红标不是旧错误已查明的证明。

fixture仍为 `2026-10-09-native-details-r12`，保留 demo-campaign IN_REVIEW、五项待处理和 film/杭州/workshop 关联。没有重置演示存储，没有真实分享、支付、消息、生产写入、commit/push/部署。

## 来源与 Figma

`dist/app.js` 的 `renderCalendar` / `createCalendarPoster` 决定周/月、周期、全部空间/三空间、不限/免费/有名额/放映/户外、日期清除、月图例、活动卡片、空态、海报/取消/保存。日视图按已授权 Sola 结构使用共享小时轴，不能退回普通 agenda。原四场活动按统一+14天映射：9/26→10/10 film 19:30–22:00，9/27→10/11 walk 15:00–18:00，9/30→10/14 workshop 19:00–21:30，10/3→10/17 frisbee 17:00–19:00。用真实上海自然周和月份修正原型静态周期标签。

四个节点均实际通过 Figma UI 读取：

|节点|私有截图|采用/边界|
|---|---|---|
|19610:85309 日交互版|calendar-day-19610-85309-close.png、-bottom.png|灰画布、灰小时线、薄荷时段块、深色日期；主日视图依据|
|19604:82751 月交互版|calendar-month-19604-82751.png|灰月格、薄荷事件、日期进入单日；主月视图依据|
|19642:4724 日另一版|calendar-day-19642-4724-close.png|蓝色填充版本，未证明可成功取消选择；不把蓝色一概归因工具覆盖层|
|19629:4336 月另一版|calendar-month-19629-4336.png|蓝色版本与邻近灰色交互版同时存在，记录版本差异，不混作唯一颜色基准|

路径均为私有 `706-montana/apps/community706/evidence/figma/2026-10-09/`。紧凑活动卡复用已验证19696:4524。Figma默认月的注释未替代原型周/月入口及本任务要求的首次默认单日；首次默认与用户清除明确区分。自建Figma标签已关闭，用户标签未关闭。

## 实现与原生 GUI

|操作|实测结果|证据（native/，details-r12-calendar-前缀）|
|---|---|---|
|初次周视图|默认10/10；选中深色日期和单日小时轴|final-day-top、final-day-timeline|
|再次点击日期/返回全部日期|清除后全周概览，重新加载/筛选不自动重新选第一日|overview-weekend、final-overview-end|
|共享小时轴|film19:30开始，22:00结束；walk15:00–18:00，两列共用刻度，非普通列表|final-day-timeline、final-overview-end|
|横向导航|到周末后一次返回可移回前面日期；clamp到内容末尾并读取实际scrollLeft，保留横向手势|final-overview-end、final-overview-back|
|周前后/跨月|10/12–18→10/5–11→9/28–10/4，空周；返回当前周|month-select-workshop、week-cross-september|
|月前后/跨月|10月四场→11月空→10月→9月空→10月|month-november、month-september、empty-month-final|
|月日期|14日进入10/12–18周中的14日单日；空白格disabled；1日进入空日，清空筛选恢复全周|month-select-workshop、empty-day|
|三空间/全部|706两场film/workshop；M50一场walk；徐汇一场frisbee；全部四场|space-706、space-m50、space-river、space-all|
|标签互斥|免费2、名额3、放映1、户外2、不限4；与源活动逐项对应|tag-free、tag-capacity、tag-screening、tag-outdoor、tag-any|
|月格与源列表|31天与leading blank正确；有活动图例、计数、本月活动及四张完整卡片，尾部飞盘24人/0余位|month-final-top、month-final-legend、month-final-list-top、month-final-bottom|
|详情往返|月格film和小时块film均进入正确详情；返回单日仍为10/10|month-event-detail、day-event-detail|
|整月海报|全部四场含完整标题、时间、地点、发起者、封面、日期和筛选；无真实二维码|poster-final-safe-actions、calendar-month-poster.png|
|单日海报|仅10/10 film，标题当日活动日历，范围10/10—10/10|poster-selected-day|
|取消/X|取消实际关闭且保持月份；X也已验证。取消不是用X冒充|poster-final-cancelled|
|本地保存|原生保存框保存成功，首次toast；最终安全区版再次保存PNG落盘并目视1080×1440完整内容|poster-saved（较早布局，仅证明保存toast）；calendar-month-poster.png|

海报安全区最终布局：图片独立滚动，保存/取消固定在下方，两个按钮完整可见且与Home Indicator隔开。源月份图例和下方活动卡片已补齐；周视图仍为小时轴。模态期间背景月格/卡片从可访问树隐藏，避免屏幕阅读器跳到遮罩后内容。日历和海报新增颜色集中于 `lib/theme.js`，WXSS和canvas renderer引用token，色值未改变。

日期边界采用数值时间交集 `end > from && start < to`，不再比较混合UTC/+08字符串。跨午夜拆分、重叠lane、同组公共小时轴保留。海报根据全部行数/文本长度增高，不固定截断若干活动；匿名分享源只允许公开发布活动。

## 检查与运行边界

- 最新118场景控制器通过，包括主动取消后load/filter/mode/period不重新选中、leading blank不改变状态、三空间列表、跨日与重叠。
- 42 WXML /2 WXSS 编译通过；最终颜色参数化后118控制器再次通过，实际原生海报重新生成、目视、取消通过。
- 实际编译backend handler的 `tests/calendar-contract.mjs` 本地DB double通过：月底跨夜carry-in、同日重叠、端点排除、UTC/+08等价范围、PUBLIC/PUBLISHED限制（owner也不能把MEMBERS/UNLISTED/DRAFT/CANCELLED送入海报源）、分享参数白名单、匿名scene安全读取。networkCalls=0、productionWrites=0。前批visual/access-media checks保持已有通过证据。
- 最终海报保存在私有 `evidence/visual-2026-10-09/calendar-month-final.png`，公开副本为 `native/calendar-month-poster.png`。首次 `calendar-month-review.png` 与保存toast属于先前布局，不能冒充最终安全区截图。
- 第二次保存后CUA原生查询/按键短暂超时；最终PNG已写入。随后通过原生Command-Q正常退出并重开同一706项目，GUI恢复；未强杀、清存储、修改CLI/urlCheck/网络。恢复后补拍月卡片、单日、横向返回、详情、空月和最终海报。

## Console 历史归因缺口：尚未闭合

较早14:49及以前全窗图存在红色2条。其原消息当时未取得；不能用IDE外层Errors:0或裁去Console的图片当作已排除。14:53–15:08重新读取的实际嵌入Console无红标；最终AX为Errors:0/Warnings:26，警告原文为游客wx.operateWXData模拟返回、旧canvas建议升级、开发工具预加载/性能提示。完整全窗原图与 `calendar-final-console.txt` 私有保留。

对当次14:07启动日志的定向检查没有找到ReferenceError/SyntaxError/TypeError/Uncaught/Failed to load resource/ERR_CONNECTION；较早检索到IDE timing/plugin/实验信息错误，但没有证据可将它们逐条对应旧红2。因此只能确认本轮最终可复现日历/海报未出现当前runtime error，**旧红2准确来源仍未恢复**。B随后明确要求保留上述历史限制，按当前已验证版本完成本批，不继续扩大旧工具日志检索。因此coverage14按当前功能/视觉证据提升VERIFIED；历史原消息仍未恢复，不通过猜测补结论。

## 后续全量交付约束

所有GUI完成后，先保留可恢复的mock快照并记录，再执行已授权的本地初始化，恢复原双Banner、已发布系列、63原型和118目录。现在不重置，保留IN_REVIEW。本批不扩展成员及发布39–41的media预览缺口。
