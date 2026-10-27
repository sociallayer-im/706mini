# 独立设计系统实施记录

## 范围

来源固定为 sociallayer-im/706mini `a74168a`，此前 `9b950e5` 的选择组件抽象和当前checkbox修正均保留。初始阶段为独立Web系统；随后用户明确批准“全部应用到小程序里”。原生迁移已接入共享模板、原生组件与主题样式；业务状态、权限、请求与持久化仍由原控制器处理。未部署或发布。

## 方法适配

完整读取 BaoCut Design System SKILL.md 及 format/craft/from-code/cover，参考本机design-skills索引。服从用户明确授权：完整手写独立Web组件、正常网页、本地素材文件与提交push；没有强制引入BaoCut runtime，没有修改技能。未调用不存在的design_system_check/import；本地验证不是该工具的替代冒称。组件实时预览由主网页装载，逐组件preview是预加载上下文卡片片段。

## 当前规范优先级

本文件按时间记录实现经过；早期数目、顶部对齐、资料包入口等均为历史，不作为当前规则。当前以 `../docs/design-system-current.md`、原生主题与共用组件为准。后续用户明确修正覆盖早期决定。

## 历史来源优先级

当前 `lib/theme.js` 与 `docs/design-direction-system-2026-10-23.md` 优先；global/controls用于语义与状态，paper历史色板不重新引入。主题精确值与原始rpx都保留在tokens，Web按375px基准换算。全部必要新语义按页面位置登记为同一清单，原有组件存在与否仅作次要来源信息。

## 已实现边界

Web bundle有实际DOM、交互与嵌套：单多选/上限、关注与取消确认、搜索清空/Enter、日历选择与取消、轮播、图片弹层、本机媒体校验/删除/前移、表单参数、评论回复、弹层焦点/Escape/忙碌锁闭。没有服务器请求、真实注册/审核/支付/发消息。本地示例状态与业务完成分开。

## 访问

`evidence/page-inventory.json` 是全量源码分支盘点与页面/组件关系，不是UI实测。`evidence/native-review/visits.json` 是通过真实微信开发者工具AX与原生点击到达的快照。原CLI探测返回 IDE service port disabled；未开启安全服务端口。通过原生目录明确切换仅本机离线演示，未重置草稿或业务数据，不发真实服务请求。每个入口是否到达以日志为准，线上、真机及权限状态仍有边界。

## 验证

独立网页的浏览器验证结果保存在 `evidence/validation.json`；截图在同目录。源码盘点、Web组件验证、原生开发工具访问、真机与真实用户验收各自独立。详见最终交付计数，不以演示成功冒充生产成功。

## 历史反馈：评论与分段单选（筛选圆点规则已由最新反馈取代）

评论回复原来使用compact文字按钮，face左右12px内边距导致比正文缩进；DOM没有图标或图标占位。共享Button增加align:start语义变体，CommentThread用它保留44px点击区、文字与正文对齐。

SegmentedControl复用ChoiceGroup；原生radio默认margin叠加了定义的gap/inset。共享选择组件统一零margin、20px指示符、8px gap、12px左右内边距并居中，不在展示样例局部打补丁。

实际浏览器几何：375px默认，回复与正文左缘差0px；分段选中/未选中左右内边距均12px、gap8px、中心差0px。320/768px长文与切换选中状态仍一致、无溢出。视觉证据：evidence/comment-reply-375.png、segmented-375.png、comment-reply-long-320.png、segmented-long-320.png。

## 迁移前原生覆盖（历史记录）

人工核验39/42注册路由、20/20种弹层的阅读/编辑面；33/48当前待查看目录入口直接访问，另沿页面自然递归。84份原始快照排除11份加载中/旧页尝试，73份核验快照保留。不是118入口全部实访，也不是20弹层全部状态转移验收。

未进入：spaces与following当前无可操作GUI入口；invitations当前离线r12数据没有管理员邀请通知入口。未制造数据、改编译配置或开启CLI端口来凑覆盖。payment仅在过期凭证下从离线目录打开模拟付款阅读面，未点击付款。结束已恢复原Montana模式和原演示身份。完整原因与证据编号见evidence/native-review/coverage.json。

## 用户反馈修复：身份头像顶部对齐

PersonCard与IdentityRow原先align-items:center导致头像随多行文本整体居中。统一为identity-layout共享布局，PersonCard、IdentityRow、CommentThread均显式使用顶部对齐；FeedItem和参与者身份列表通过组合继承。PersonCard独立关注按钮使用align-self:center，不因头像顶对齐改变其操作位置。多头像统计行、上下堆叠结果图标、普通功能图标行不机械套用。规则写入README与对应组件指南，并由build.cjs生成保持可继承。

浏览器24个默认/长文、320/375/768px组合：头像与文本块顶部差均0px，无溢出；关注按钮中心误差小于0.004px。回复文字左缘仍为0px差，分段单选仍为零margin、8px gap、12px左右内边距。截图person-top-375.png及person-top-long-320.png。

## 原生迁移实现

43个Web语义家族对应原生组件或组合，精确路径见`native-mapping.json`。42个页面共用screen模板，20类弹层共用sheets模板。原生使用interaction事件桥接handler、dataset、detail与媒体触点/坐标；页面保持校验、草稿、排序、权限与请求。错误定位field-*锚点仍在页面作用域。

评论回复使用Button align:start；身份头像与文本顶部对齐，独立操作按钮单独居中；选择组真实radio/checkbox保持语义，指示器统一40rpx，间距16rpx，左右24rpx。原生日期/输入/开关/share保留平台能力。

迁移后编译、离线回归见`evidence/native-migration-audit.md`与`native-migration-compile.json`；实际GUI检查见`evidence/native-migration/`，与上述迁移前39/42记录分开。

最终源代码检查：44个已注册原生组件均被共享模板或其他原生组件组合使用；43个语义家族对应完整，含42路由及20弹层映射。直接编译90份WXML、49份WXSS均exit0；18项单元测试、26项原生契约检查、原有8组业务回归全部通过，完整输出保存在`evidence/native-migration-regression.json`。样式清理从约96KB降至约23.5KB，移除跨组件的全局控件视觉规则；业务排版与slot布局保留。

## 最新反馈：统一留白与无bullet筛选

人物轨道遗留负margin/加宽但首尾卡片补偿已被移除，造成首卡贴屏。改为统一horizontal-rail/horizontal-track，所有5个横向scroll-view均显式使用轨道，4个page级轨道拥有内容内pageGutter，1个header contained轨道复用标题栏已有inset；清除旧discovery-people局部宽度规则，轨道子组件取消margin。42个路由继续共用唯一screen页面padding；弹层和固定壳按同一token核对，全出血gallery保留。

最新用户决定取代前述筛选圆点修补：筛选全部纯文字Badge/Chip，时间/空间互斥与独立组合布尔筛选不变；表单Radio/Checkbox不变。Web和原生筛选都复用FilterChip/Button compact，新增appearance=filter明确用途。实测Web三类筛选点击区44px、可见面28px、字体12px、padding4px 12px相同，筛选DOM输入控件0，表单checkbox仍存在。选择切换及组合结果见evidence/page-gutters/filter-web.json。

消息筛选裁切修复：轨道按完整触控内容定高，导航行与微信胶囊分别计算；禁止以menuHeight限制44px Badge触控区。根因、复用排查与原生证据见[evidence/message-filter-clip/README.md](evidence/message-filter-clip/README.md)。

日历previous/next方向与主CTA伸展：IconButton方向仅作用glyph，grow同步撑满button与face；详见[evidence/calendar-and-cta/README.md](evidence/calendar-and-cta/README.md)。


2026-10-27 身份布局更新：用户要求全局沿用最新的姓名／城市层级，替代历史顶部对齐决定。IdentityRow 与原生 ui-identity-row 统一为文字组垂直居中、名称 typeSection、说明 typeBody、行距 spaceUnit、图文距 identityGap；Web／原生 PersonCard 均直接组合身份组件。评论正文继续顶部对齐。空间／组织的地址和营业时间与活动详情共用原生 ui-fact-row，只读状态不显示箭头；未关注主操作恢复黄色。原生模拟器已核查发现页推荐用户卡及空间主页。


2026-10-27 专题详情统一：移除独立 series-hero 遮罩和字号，封面复用原生 Gallery，标题／城市采用现有文字角色；资料入口组合 Section、MenuGroup、ActionRow，恢复分组圆角，分享与管理沿用标准等宽按钮。介绍／资料／活动为空时隐藏栏目标题。原有复制资料、分享、编辑、删除权限及活动跳转保持。映射同步至 native-mapping，模拟器核查专题正文与资料卡，原生编译及目录交互检查通过。


2026-10-27 顶部导航：原生 main-navigation::before 去除 canvas／chromeSoft 的浅色渐变填充，只保留透明背景、navigationBlur 与现有渐隐 mask；navigationFade 及布局不变。所有主标签页、任务页、活动／专题／空间／组织封面共用，底部胶囊的材料仍按自身组件规则。


2026-10-27 审查批准修复：R01–R07、R10、R12 完成；R08、R09、R11 保留待确认。Web 同步灰色 secondary／danger 面、字段 radiusField、无装饰成功图标的结果节奏、顶部取消／完成与单一整行提交、显式 navigation 箭头以及回复分组。筛选保留自身白色未选面，列表关注不擅自推广黄色。旧控件记录归档，当前映射为44页／21弹层。专题创建第三步复用记录卡与既有专题详情完成本地公开字段预览，未新增业务路由或发布数据。

2026-10-27：以a210f11最新保留功能为基线，移除项不算缺口、不恢复旧demo。实现与代码边界见evidence/2026-10-27-follow-up/README.md；96WXML/54WXSS编译与11个JS语法检查通过，无新增测试/截图检查。
