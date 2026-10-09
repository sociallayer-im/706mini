# SID-95 执行检查点

## 用户暂停，待本人Review（2026-10-09，当前唯一恢复点）

- 用户明确主动暂停；停止新实现、新页面/GUI核对与新测试。仅整理既有代码/文档/证据并按授权WIP提交push；不部署/发布、不重置演示数据。等待用户，禁止自主恢复。
- 全量与本人验收未完成。当前19 VERIFIED /12 NEEDS_FIX /32 PENDING；16–19仍NEEDS_FIX。20–23及其他项未提升。详细实现、验证时间边界、Figma情况和未完成项见`visual-review/2026-10-09/members-16-19-mapping.md`。
- 16最终15:30首屏真正顶部已目视，source_bio恢复；编辑/分享取消/复制/两关系/两活动入口已做。最新中下未终审。17三图已拍但未目视终审，互动回路未做；18–19本批GUI未开始。现有r6数字证据不代表整页通过。
- 最后GUI为林叶查看禾舟成员页下部，拍摄后收到暂停，未继续。r12/系列IN_REVIEW/5待处理/三关联及草稿未更改；不为暂停额外读写演示存储。
- 代码已改：独立成员模板、各首条链接、独立membership/featured关系与记录计算6场、mock来源bio和已编辑区分。后台同步关系和隐私计数。member-r1/bio-r1窄迁移不重置版本。24编辑空间保存与默认featured优先的组合仍待修/GUI，明确留WIP。
- 暂停前已有检查见映射，暂停后不补跑。成员raw截图/Figma留本机私有且不提交；公开目录仅此前去敏证据。提交不是通过。只有用户明确恢复才从未完成16–19继续。

## 当前恢复点（2026-10-09 15:26，成员16–19实现已完成，GUI进行中）

- 共享成员页已独立布局；主页作品/社交各首条，保留编辑4链接；toolbar、自我/访客操作、统计、两关系卡、film/workshop历史按来源顺序。
- member-r1窄迁移不改fixture版本：新增独立membership（不授予role），featured_entities与编辑frequent_spaces分离；复用原历史参与记录的场地得到6场，不增加报名/计数、不重置系列/草稿。实际backend同步按公共、已结束、确认报名去重计算，关闭分享返回null。
- 118场景、42WXML/2WXSS、现有实际backend contract已通过；新增成员专项前端边界通过。后台专项及四人GUI待完成，16–19状态仍NEEDS_FIX。
- 原生完整编译后Console Errors0；本人页首屏初拍已核对。当前根据B意见将两关系卡“屋/组”替换合成实体头像，作品/社交改语义图标，需最终编译重拍。
- 继续保留r12系列IN_REVIEW/五待处理/原三关联与存储；20–23不提升，24/28–30不扩展。
- 24批明确待修：来源主页默认产品组+706空间，与编辑初态706+Sola不同；当前featured_entities优先用于默认来源复现，编辑保存后必须组合保留组织关系并展示新选空间，不能永久遮蔽frequent_spaces。24批实际保存/回读验收，本批不算通过。
- 全局后续范围备忘：原63之外onboarding、campaign-create、campaign-approval-detail、campaign-review-progress四路由需单独additionalRoutes矩阵、全步骤/状态原生GUI与Figma证据，不能以55controller替代。当前不扩展。

## 当前恢复点（2026-10-09 15:14，成员16–19执行中）

- 当前只收尾成员16林叶/17禾舟/18星桥/19云汀及共享成员组件，20–23仅继承代码、GUI下一短批；24编辑、28–30另批，不扩展。唯一代码写入者本线程。
- 先修来源差异：主页toolbar→hero城市bio+完整intro→3tags→edit/follow+share→3统计→作品与社交各1入口→常出没706产品小组/706青年空间及源副文案→film/workshop历史。编辑多链接数组保留，主页不可挤入4重复标签。资料编辑可选空间与主页组织/空间关系分离，空间6场需真实参与记录支持。
- 实际Profile owner19718:8160/visitor19614:9378等已有Figma参考复用，网页步骤web-access。四页各上中下GUI，编辑/关注/更多/分享入口、安全链接复制、组织/空间/两详情、visitor关注列表对象都需核对；不发送真实分享。统计沿已验证r6隐私规则，不把计数通过当整页通过。
- fixture仍r12，系列IN_REVIEW/五待处理/三关联及全部存储保留，禁止全量reset。当前GUI10月月历、海报关闭。19 VERIFIED /12 NEEDS_FIX /32 PENDING，16–19未提升。
- 14已验收，knownHistoricalEvidenceLimitation保留旧Console红2归因未知，remaining无历史gate；下面为已完成14的细节。

## 上一批恢复点（2026-10-09 15:11，coverage14 当前版本原生收尾完成）

- 当前任务仅coverage14独立活动日历。全部功能GUI已实际完成，30项公开去敏图片/海报及mapping/capture-log已落地：`visual-review/2026-10-09/calendar-mapping.md`。不以7060 HTTP200结题，不扩展成员。
- coverage14已VERIFIED，总计19 VERIFIED /12 NEEDS_FIX /32 PENDING，只提升14。B已明确裁定：历史红2无法恢复原消息则准确记录，不继续扩大日志检索，按当前已验证最终版本收尾。历史原消息仍未知，不写成已归因；当前嵌入Console实际无红标，最终AX Errors:0/Warnings:26（游客/旧canvas/预加载/性能警告）。全量SID-95尚未完成。
- 已完成：首次默认与主动取消分离；共享小时轴、19:30–22:00完整时段、全周横向末尾/返回；周/月前后与跨月；三空间及全部；四标签及不限；月blank禁用/日期进入单日；空日/空月/清空筛选；月格及小时块进入film详情、返回保持单日。月有活动图例和四张源活动卡补齐。
- 海报：整月4场完整内容、单日仅1场；原生取消/X、保存PNG通过。图片独立滚动，底部保存/取消完整高于Home Indicator；最终样式再次生成目视/取消通过。最终1080×1440 PNG已落盘并逐图核对，公开为native/calendar-month-poster.png。旧poster-saved只证明首次保存toast，不冒充安全区最终图。
- 主题：日历新增色及canvas海报色均集中lib/theme.js；WXSS/renderer引用tokens。118控制器、42WXML/2WXSS、实际backend calendar边界和隐私handler检查通过；无外部请求/生产写入。前批visual/access-media检查证据保留。
- 保存窗口第二次操作后CUA查询超时，但PNG已成功落盘。使用原生Command-Q正常退出并重开706 IDE，已恢复GUI并完成剩余截图；未强杀、清存储或改CLI/urlCheck/网络。当前GUI为林叶10月月历，海报已取消。
- fixture仍r12，保留系列IN_REVIEW、五待处理、三场关联、原本地草稿；没有重置。CLI关闭/urlCheck开启，不改身份网络配置，无真实支付/消息/分享、commit/push/部署。唯一代码写入者本线程。
- 实际Figma四节点已读，采用19610:85309/19604:82751灰网格薄荷块交互版，另两蓝色版本差异在mapping如实说明；不把蓝色未经证明归为覆盖层。自建Figma标签已关闭。
- 最终全量交付后再执行：先保存可恢复mock快照并记录，再按授权本地初始化恢复双Banner/已发布系列/63原型和118目录。当前不执行。发布39–41的media数组/GROUP_QR预览仍留对应批次。
- 7060独立重启已完成，不再重复。下面12–13等均为历史。

## 上一批恢复点（2026-10-09 14:36，coverage12–13 完成）

- 当前任务：SID-95 原生逐页收尾；本批12–13付费未付款/免费已确认凭证已完成，access/media两项后端权限修复已本地验证。全量未完成，唯一代码写入者仍本线程。7060独立请求已结束，不再作为当前交付或重复重启。
- VERIFIED零基0–13、15、25–27，共18项；NEEDS_FIX为14、16–24、28–30，共13项；PENDING31–62，共32项。只提升12–13，补充联系人操作不提升61。
- fixture仍`2026-10-09-native-details-r12`，演示存储保留。demo-campaign保留上批IN_REVIEW、五项待处理、film/杭州/workshop三场关联；本批只对过期demo-reg-payment做一次receipt-r1窄迁移恢复30分钟窗口，14:26原生显示14:56截止，仍会自然到期，读取不会延长。迁移保留系列对象已断言。
- 原生付费上中下、禁用群/联系人点击、付款sheet打开/X关闭均实际验证，没有付款；免费两入口、合成二维码、稍后联络文本复制toast、完成/X关闭均验证。另用既有CONFIRMED凭证验证合成联系人复制，没有改付费未付款凭证状态。
- 最终证据13张`native/details-r12-access-*.jpg`，完整路径/时间在capture-log。映射`visual-review/2026-10-09/access-receipts-mapping.md`。旧state12/13和本批中间图已私有归档。
- Figma依据为实际Ticket Type Settings与Buy Ticket/已加入活动组件；前者不是凭证整页，后者不是报名成功整页。清晰底部图已关闭缩放菜单；明确组件组合映射，未声称找到精确凭证/contact frame。
- 后端支持非首项GROUP_QR和event/campaign媒体数组的准确编辑预览权限，拒绝公共媒体私有引用/签名凭据，publicMedia继续拒绝private；公开活动clone封面复用通过，未发布他人资产拒绝。实际build及两组handler本地测试、118控制器、42WXML/2WXSS、前后端diff check通过。无生产写入、真实消息/支付、commit/push/部署。
- 后续必办：发布/编辑refreshMedia仍遗漏media数组及access_values.GROUP_QR签名预览，按B指示留publish39–41批实际GUI修复；不能把当前backend通过当作上传预览全链路通过。下一批从未完成项继续，不扩大日历。
- GUI当前为林叶免费凭证，弹窗关闭。额外“我的专题”目录搜索因AX截断/输入未生效未核对到进度页，未修改数据；不据此宣称再次目视确认进度页。以下较早恢复点均为历史。

## 最新：2026-10-09 14:36 凭证12–13与access/media本地边界完成

详情、来源边界、原生操作和保留状态见 `visual-review/2026-10-09/access-receipts-mapping.md`。本批18 VERIFIED /13 NEEDS_FIX /32 PENDING，全量未完成，等待下一项；前后端保持未提交。

## 最新：2026-10-09 14:12 系列详情/编辑 coverage10–11 完成

- fixture仍r12。系列主题/五城/完整介绍/资料包/三场关联/分享与owner管理顺序已原生目视，资料复制toast、film/杭州/workshop三个目的详情、普通成员无管理入口均验证。杭州仅源字段，无上海工作坊串用。film旧双系列映射行已改为r12单源系列，并只替换顶部/事实区两图。
- 编辑加载demo-campaign，按源封面→名称→总介绍→资料→活动顺序；默认保留原三场选中及顺序，候选缺失的已选记录按权限补读。增加替换首图入口与中文城市。原生发现change时重建checkbox导致取消失效，已修正并实际添加/取消walk、恢复三场。
- 封面选择曾导致原生读取超时；正常Command-Q退出706 IDE并重开原项目恢复，没有强杀/修改CLI/urlCheck/网络或清演示存储。随后用原生文件框Return选择项目合成cover-2.png成功，实际提交修改并进入新审核轮；成功页/审核中进度页已拍。
- 当前本地demo-campaign已IN_REVIEW，五项待处理，原三场关联保留；IDE停在审核进度页。此状态会让普通成员/发现页暂不展示该系列，属预期权限效果。未静默重置为PUBLISHED。下轮须继承此状态，勿误判数据丢失。
- 详情8张/编辑7张有效去敏图及capture-log、campaign-detail-edit-mapping.md已更新，旧state10/11私有归档。当前16 VERIFIED /15 NEEDS_FIX /32 PENDING，只提升10–11；全量未完成。
- 118场景、新增字段/数组/封面替换/重审/越权断言、真实backend本地构建与handler测试、42 WXML/2 WXSS及diff check通过。无生产写入、真实消息/支付、commit/push/部署。

### 后续 access/media 必查（B 14:11补充，本批未修改）

1. mediaPermission 无 registration 的编辑分支仍只匹配 eventSecret.payload.value 第一方法；当GROUP_QR在methods后项时，具canEdit但非上传者管理员的预览可能失败。event/campaign media数组也需纳入准确编辑授权。仅在真实已有canEdit范围修正并本地测试，不扩大权限。
2. validateMedia目前仅校验URL非空；核对公共media渲染不得输出私有QR预览凭据或私有引用，保留publicMedia拒绝private。此两项尚未修复或验收，留给对应批次。

## 最新：2026-10-09 13:55 工作坊/飞盘 coverage8–9 完成

- fixture r12，复用已确认详情组件及真实 Figma 三种详情参考。两页完整原文/fit/地点/host/org/标签/独立卡/共享原讨论已核对；原生 GUI 上中下、发起人和场地跳转、评论3项与目标回复2项、底栏状态均已验证。
- 工作坊8确认/12余位、免费免审，林叶凭证可达；新增隔离断言证明新报名直接 CONFIRMED、无付款期限。飞盘¥20、24确认/0余位，林叶真实 WAITLISTED，初芽可打开加入候补表单，新增候补不改变24确认人数。没有伪造当前人已确认状态，也未提交原生表单。
- 19张去敏图 details-r12-workshop/frisbee、capture-log及 workshop-frisbee-mapping.md 已更新；转场图替换为稳定目标画面，旧state08/09私有归档。当前14 VERIFIED /17 NEEDS_FIX /32 PENDING，仅提升8–9；coverage10系列仍待收尾，全量未完成。
- 118场景和新增状态断言通过，diff check通过。本轮仅新增测试及文档/证据，运行代码未变，沿用r12编译和后端本地测试证据。无commit/push/部署/生产写入。IDE停在林叶飞盘详情尾部、弹窗关闭。

## 最新：2026-10-09 13:49 walk 详情 coverage7 单项完成

- fixture `2026-10-09-native-details-r12`。复用 13:44 上/中/实际底部证据及已读取的 Figma 三种详情参考；补齐独立云汀成员、M50 空间跳转、评论/目标回复、未报名免费表单与已报名凭证，全部实际 GUI 并目视去敏图。
- 原文 summary/fit/tags、15 已报名/5 余位/免费、实际 host 最近5条记录、独立 walk 讨论确认。源码共用的电影讨论文案保留；walk 无系列，不加虚构关联。未提交报名、评论或支付。
- 10 张 `native/details-r12-walk-*.jpg`、capture-log 与 `visual-review/2026-10-09/walk-detail-mapping.md` 已更新；旧 state07 私有归档。只提升 coverage7，当前12 VERIFIED /19 NEEDS_FIX /32 PENDING。8–10仍 NEEDS_FIX，留待下轮，不代表全量完成。
- 118 场景及 r12 数据检查、实际 backend handler 本地测试/构建通过。本轮无代码修改，沿用已有 r12 编译验证；diff check通过。无生产写入、commit/push/部署。IDE停在林叶walk详情下部，弹窗关闭。
- 目的凭证通用来源说明含“付款后”措辞已在映射中明确，coverage13完整收尾未在本页算通过。后续从coverage8继续；本次未扩展其他三页。

## 最新：2026-10-09 13:35 film详情coverage6单项完成

- fixture `2026-10-09-native-film-r11`。实际读取Figma参与者已加入19553:25453、未加入19604:82314、主办19553:25605，上下部对照；film完整正文/fit/tags/事实图标/12人参与信息/独立发起人及场地卡/评论回复/底栏已修复并GUI目视。
- 详情与sheet的两套评论使用独立记录，不互相覆盖。第二条详情回应关联实际recommendation；徽标跟随有效推荐/报名及隐私许可。回复只打开目标线程，计数按显示线程。发起人最近最多5条公开活动由记录计算。
- 原生view卡片点击未跳转，改为明确button后已实际进入禾舟成员页、706青年空间、正确系列；已报名凭证、初芽申请报名、推荐、评论及两条回复弹窗均已打开验证。未提交互动或报名，不涉及支付。
- 去敏图13张 `native/film-r11-*.jpg` 及capture-log，映射 `visual-review/2026-10-09/film-detail-mapping.md`。旧state06公开图私有归档。coverage现11 VERIFIED /20 NEEDS_FIX /32 PENDING，仅本项提升状态。
- 118场景和新增film记录/隐私/正文检查、实际backend handler本地测试、42 WXML/2 WXSS编译、diff check通过。无生产写入、commit/push/部署。全量SID-95未完成；后续从coverage7继续，不重做7060服务。

## 最新：2026-10-09 13:18 个人页4–5与通知3回补完成

- fixture `2026-10-09-native-personal-r10`。4–5原型菜单/计数/图标/状态/全部相关入口已实际GUI核对；3按B意见补系统图标/源actor头像、小字同行时间与活动名称强调后重拍。coverage现10 VERIFIED /21 NEEDS_FIX /32 PENDING。
- 当前自我演示账号林叶有真实本地组织OWNER/空间ADMIN记录；个人记录支持1草稿/3未结束报名/2活动/1审核中专题；待办2活动+1专题，权限内读取、按subject去重，真实handler同步去重与标题。普通账号不可见管理记录且越权读取被拒绝。不得把本地角色说成线上授权。
- 设置行style-v2半宽失败已修复，13:14完整编译、实际目视全宽并替换公开final图。旧13:12失败图私有归档；以capture-log最新时间和coverage文件引用为准。
- GUI验证所有源菜单入口、个人主页、城市/语言/通知/隐私切换、关于/反馈/新人资料、退出到游客。最终恢复上海/中文/通知开启/分享开启/公开。目录普通编译显示r10；IDE当前停在评审目录。
- 文档 `visual-review/2026-10-09/personal-pages-mapping.md` 记录源UI/actor/权限/计数定义、真实Figma依据、导航验证范围与通知回补。118场景、真实backend handler本地测试、42 WXML/2 WXSS编译及diff check通过。无生产写入、提交/push/部署；全量未完成，等待B下一项。

## 当前 13:16：4–5与通知回补最终核验

- 设置行原生style-v2半宽问题已通过高优先级100%宽度修复，13:14完整编译后实际重拍、目视确认343px左右全宽，公开personal-r10-me-final-bottom/more-final-top/more-final-bottom已替换。通知系统图标/真实源头像、同行时间与活动蓝色强调已实际重拍。尚在整理coverage与权限回归结果，不以旧13:12失败图验收。

## 最新：2026-10-09 13:00 主页面0–3单项完成

- 当前fixture `2026-10-09-native-main-r7`。0动态、1发现时间入口、2发现空间入口、3消息已完成本次剩余项并在coverage标VERIFIED。全量当前8 VERIFIED /23 NEEDS_FIX /32 PENDING，不能视为全量交付。
- 修复动态完整标题/时间/原人物文案与紧凑活动卡；首Banner短文；标签互斥、空间原选项、共读匹配及空态正文；日历展开关闭不重置所选日期。
- 原生GUI实际验证8人物可达和动态尾部、双Banner切换/手势/第二张点击、周次/空间/标签/单日/清除筛选、两个发现入口、6消息全文和尾部/分类/已读。去敏图和采集时间见coverage/capture-log；映射说明 `visual-review/2026-10-09/main-pages-mapping.md`。旧0–3公开证据已移入私有归档。
- 日期按真实上海自然周，当前/下周各2场；原型browseMode不参与renderDiscover，两个入口共享三层筛选，没有臆造切换控件。
- 118场景与新增正文/筛选/通知检查通过，42 WXML和2 WXSS编译、diff check通过。没有生产写入或提交/push/部署。本项完成；IDE停在发现页“共读”空结果尾部。等待B下一项。

## 最新：2026-10-09 12:52 成员统计单项完成

- 本次只收尾成员关系数：原型目录16–23，自己18关注/42被关注/16共同活动，其余7人32/128/23。数字来自 follow 和 registration/event 记录。
- 统一“共同活动”为该成员已确认报名的公开社区活动去重总数，含已结束/待举办，不是与访客的交集；受公开资料与 share_activity 控制。mock已去除额外 review_fixture 计数排除，和real backend规则一致。详见 `visual-review/2026-10-09/member-counts-mapping.md`。
- fixture为 `2026-10-09-native-batch1-r6`；正常完整编译后实际目录已显示r6。8成员页原生GUI数字全部核对，去敏图 `native/member-counts-r6-16.jpg` 至 `-23.jpg`，总览 `member-counts-r6-contact.jpg`，版本 `fixture-version-r6.jpg`。
- 前端118场景检查与后端build/真实handler本地测试通过；额外验证8成员精确数值、取消报名下降、重复报名去重、UNLISTED排除、关闭分享归零。无网络或生产写入。
- coverage/capture-log已写入各成员的 memberCounts VERIFIED，整体页状态仍NEEDS_FIX，其他来源/视觉缺口不随本项冒充通过。当前原生IDE停在页面目录。本项完成，等待B下一项；全量SID-95未完成，无提交/push/部署。

更新：2026-10-09。本轮为用户视觉反馈修复，执行中，尚未交付。

需求来源：Linear 评论 `a4c23262-d131-4ed7-9d34-c885b2ad870f`、`f0e622e4-2441-47cf-a607-0fb0761d521a`、`8dcbda49-fa41-4e20-8e77-1514bea2d0ad`。前端起点 main `0b78ed8`，工作区 clean。唯一代码写入者不变；上一轮离线演示交付保留。

本轮范围：按确认的 Sola Figma 核对并修正活动列表图文结构；共享原生 button 默认 margin/尺寸及父 flex 导致的评论、关闭叉等错位；全面核对报名、推荐、评论回复、举报、邀请、反馈、海报和系统确认浮层；按 Sola 信息结构完善日历日期层级、分组、周/月切换、筛选与详情跳转。需实际原生 GUI 验证并保存去敏证据，再提交 push，交 B 复查。完成后将按钮默认样式与实际视觉验证要求记录在项目最小继承文档，不改 skill。

当前检查点：已读取最新反馈与工作手册，发现旧样式只加强 width 未加强 margin；尚待实际渲染测量。既有 Figma 图片缺少日历近景，正在重新读取确认设计。不得以旧服务重启、控制器检查或旧截图替代本轮视觉验证。

约束：mock 隔离、无真实支付/消息/生产数据写入；CLI 关闭、urlCheck 开启；测试 AppID/二维码和私密源码不进入公开仓库；外部网页步骤使用 web-access。相关实现、检查、文档及 commit/push 已授权。

## 上一轮交付参考

前端 `0b78ed8`，后端 `b680ce8`，线上 v6/21 函数。40 原生页/55 场景，默认离线；`docs/colleague-review.md`、`docs/montana-integration-matrix.md`、`docs/review-validation.md` 保存上轮范围与验证。本轮不重复实现 mock，不以真实资质缺失阻止可做的视觉修复。

## 本轮新增复现标准与现场证据

Prototype 决定全部页面、组件列表、位置顺序与原 fake 内容；Sola Figma 决定每页/组件内部完整视觉。必须逐 query 映射原 `dist/preview-pages.js` 的 63 个入口，并清点正文、数组、状态、浮层与可达操作。真实姓名/联系标识单独合成替换，日期平移记录映射；不以通用文案替代业务内容。多 Banner 切换/点击、活动卡完整参与头像与权限内管理状态、人物列表、日历及全部表单/审核/编辑页面均在范围内。

已通过实际 Figma UI 读取 Home、Calendar、Profile、Create 分组并取得真实 node ID；私有证据在 `706-montana/apps/community706/evidence/figma/2026-10-09/`。已保存日历日/月近景、完整紧凑活动卡（方形封面、状态标签、图标信息行、参与头像/管理状态）、发布字段近景。尚在逐页读取，不把索引获取算作视觉验证完成。

微信原生模拟器已复现报名浮层 X 偏向中心，修复前截图在私有 `evidence/visual-2026-10-09/register-before.png`；具体 CSS 根因及修复后验证待完成。该截图为全窗私有原始证据，公开前须裁去工具身份和非模拟器区域。

## 历史恢复点（2026-10-09，已由顶部当前恢复点替代）

当前任务是 SID-95 全量原生复现。7060 重启已经完成，不是当前交付条件。

- 原型决定全部结构、顺序、业务内容和状态；实际 Sola Figma 决定各页和组件内部视觉。覆盖原 63 query 状态及 4 个额外路由，不能仅核对首页。
- 未完成：全部页面/弹窗逐项实际 Figma 对照、完整大卡近景、创建/报名/审批/组织编辑细节、人员/通知/档案内容、完整多媒体/链接数组、原 fake 数据与日期/身份映射。
- 日历现有逐条 agenda 是过渡，必须替换为共享小时纵轴和按时段定位/跨度的日视图，处理重叠和跨日；保留原型周/月操作和月格事件。
- 活动卡/头像/管理待办 DTO 已在前后端修改，权限一致性尚待验证；公开头像必须有资料公开和活动分享许可。
- 共享原生按钮 margin 修复已写入但还未实际 GUI 验收；所有 sheet、系统确认框需要实际打开检查。
- coverage.json 仍为 63 项 PENDING。不得用编译、控制器结果、候选 Figma 节点或旧截图冒充当前视觉通过。
- 当前未提交，尚无本轮 push。完成编译/逻辑检查、原生 GUI 去敏证据、逐状态映射、最小 AGENTS.md 项目规则后，提交相关前后端变更并 push，提供 hashes 给 B 复查。
- 唯一代码写入者为本线程；Figma 只读 agent 正在补充 Profile/Edit/组件证据。

### 11:50 原生运行恢复中

一次编辑中间态的未闭合括号被 IDE 热重载捕获；源码已修正并通过 Node / WXML 及 118 controller 检查，但 IDE 当时仍停在旧缓存白屏。错误图已明确改名为私有 `visual-2026-10-09/failure-intermediate-syntax-cache.png`，不得当日历通过证据。随后实际菜单编译变成 `lib/preferences.js is not defined`，正在通过工具菜单清除编译文件缓存后恢复；不清除用户数据或授权。

城市新图 `city-tabbar-hidden.png` 已实际显示 X 右对齐、tabBar 隐藏。63 状态 GUI 尚未通过，coverage 不可改成完成。

### 历史批次恢复点（2026-10-09 12:27，已被后续逐项记录替代）

- 当前唯一代码写入者继续本批；不要回应旧服务重启，不扩展下一批。目录零基 30 才是 drafts（原派发称 10–29）。
- 已有原生上/下部证据：5–30（部分本批最终修复后需重拍；coverage 有明确缺口），19–24 最新；25–27 新关系记录；26 额外 native-scroll-1..4 拍到长列表后段。当前 IDE 在 index 28 registrations，下滚位置。拍摄 helper / CUA 变量保持；重启后必须先 rewriteDocumentation。
- `more` early return 已修，城市显示上海；补品牌介绍/about。头像上传原来只显示签名媒体，已改为兼容已有公开/本地头像。报名列表标题原来使用报名者名字，已修为活动标题，并补封面/时间/地点/发起方。
- 源关系真实记录：18 following /42 followers；two directory cards 4 events/36 active members, 2/12；统计从事件/报名/公开分享状态计算，变更/取消后会下降。额外合成关系与目录活动只用于补齐原型聚合数字，不混入推荐人物池。目录活动不进入主发现原四活动。
- 系列编辑 catalog 11 改为读取已发布 demo-campaign；原来错误载入另一草稿。前后端 saveCampaign 支持所有者修改发布内容 -> DRAFT -> 新审核轮，前端按钮明确提交修改审核。权限/版本/重新审核已用 mock 和实际 backend handler（本地 DB double）验证。
- 报名凭证补成功/通过标题、下一步支付、群和联系人/稍后联络；未付款禁读参与方式，实际到期时间优先。mock 及 backend 默认保留名额30分钟，部署 env 是否覆盖尚未核查；无真实付款/部署。
- mock revision `2026-10-09-native-batch1-r2`；state() 每次检测内存/存储旧版本并重建，草稿 key 包含 revision。已测试 cold-storage 与 in-memory 旧版升级。IDE普通编译后未手动重置，截图实际显示 r2（native/fixture-version-r2.jpg）。手动重置需要实际确认 wx.showModal；此前只点重置未确认不能算成功。真实 GUI 确认后已拍36人。原生滚动在重新打开工程后恢复可用。
- 目录入口现用 reLaunch 避免多个同名后台页干扰 AX。复查上下箭头仅离线+reviewIndex 显示。长列表 AX 会省略固定栏，使用 native App.scroll 当前 Webview 索引即可，必须过滤行首数字，不能把 “The focused UI element...” 当索引。
- coverage 现在有逐项 actual Figma refs、去敏 native 路径、checks/remaining；4项 VERIFIED(15,25,26,27)，27项 NEEDS_FIX，32项 PENDING。这不是全量验收。capture-log 已同步。不要覆盖为全量 PASS。
- 待完成本批：最终重拍11–13（r2中付费film时间已回归19:30），确认15公开截图36，检查24头像实际图；补0–4下部/首屏人物全8可达；29–30列表与源数据/完整卡片仍有缺口。核对每项最新截图后更新coverage，记录可复查批次结果再交B。
- 最新逻辑检查：118场景/所有预设sheet、升级、关系/目录动态统计、campaign重新审核、支付与隐私检查通过；真实 backend read/write handler本地测试通过；42 WXML +2 WXSS编译通过（最后目录导航改动后还需最终Node/diff check）。未提交/push，未全量交付。

### 12:36 同批追加恢复点

- fixture 当前已到 `2026-10-09-native-batch1-r4`（个人列表原copy补齐）。普通完整编译后自动升级已在r2/r3实际观察；r4待当前重拍，不能用热重载旧状态冒充。
- 28 registrations 已恢复4条真实状态记录，29 my-events也4条（审核中/已发布/已结束/草稿），30 drafts单条；有真正phase过滤，后端同contract。审核中编辑保存会把旧轮reviews设SUPERSEDED再回DRAFT；已测试。28–30 r3实际截图已目视，r4仅追加原通知说明。
- 主feed mock按source只显示两条post；人物每次4条、每次前进2位，三次窗口覆盖原8人（含自己显示编辑按钮，避免非法自关注），controller验证通过。真实推荐接口保持权限和筛选。0–4新原生截图待补。
- 事件详情重新分离发起人卡与空间/组织卡；campaign补About、各城市活动/节点数，catalog10用合法owner展示管理入口；需6–10最终重拍。
- 11–13 r3重拍已验证正确系列标题，支付film19:30–22:00、未付款两个参与入口禁用，免费QR+稍后联系；11底部仍须native额外滚动到资源/保存。24头像修复已目视对照Figma，但最新scroll4未到最底部，须补尾部。25/26/27关系列表已目视，26最后邻里35与42总数匹配。
- 原生 scroll 已恢复，可直接App.scroll当前Webview数字索引。辅助翻页handler连续操作不保证每次增量完成，不能只凭scroll4文件名声称到底；必须截图看到尾部。多个后台view会误点，目录reLaunch修复已完整编译验证只剩一个。
