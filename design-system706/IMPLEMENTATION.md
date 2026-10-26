# 独立设计系统实施记录

## 范围

来源固定为 sociallayer-im/706mini `a74168a`，此前 `9b950e5` 的选择组件抽象和当前checkbox修正均保留。初始阶段为独立Web系统；随后用户明确批准“全部应用到小程序里”。原生迁移已接入共享模板、原生组件与主题样式；业务状态、权限、请求与持久化仍由原控制器处理。未部署或发布。

## 方法适配

完整读取 BaoCut Design System SKILL.md 及 format/craft/from-code/cover，参考本机design-skills索引。服从用户明确授权：完整手写独立Web组件、正常网页、本地素材文件与提交push；没有强制引入BaoCut runtime，没有修改技能。未调用不存在的design_system_check/import；本地验证不是该工具的替代冒称。组件实时预览由主网页装载，逐组件preview是预加载上下文卡片片段。

## 来源优先级

当前 `lib/theme.js` 与 `docs/design-direction-system-2026-10-23.md` 优先；global/controls用于语义与状态，paper历史色板不重新引入。主题精确值与原始rpx都保留在tokens，Web按375px基准换算。全部必要新语义按页面位置登记为同一清单，原有组件存在与否仅作次要来源信息。

## 已实现边界

Web bundle有实际DOM、交互与嵌套：单多选/上限、关注与取消确认、搜索清空/Enter、日历选择与取消、轮播、图片弹层、本机媒体校验/删除/前移、表单参数、评论回复、弹层焦点/Escape/忙碌锁闭。没有服务器请求、真实注册/审核/支付/发消息。本地示例状态与业务完成分开。

## 访问

`evidence/page-inventory.json` 是全量源码分支盘点与页面/组件关系，不是UI实测。`evidence/native-review/visits.json` 是通过真实微信开发者工具AX与原生点击到达的快照。原CLI探测返回 IDE service port disabled；未开启安全服务端口。通过原生目录明确切换仅本机离线演示，未重置草稿或业务数据，不发真实服务请求。每个入口是否到达以日志为准，线上、真机及权限状态仍有边界。

## 验证

独立网页的浏览器验证结果保存在 `evidence/validation.json`；截图在同目录。源码盘点、Web组件验证、原生开发工具访问、真机与真实用户验收各自独立。详见最终交付计数，不以演示成功冒充生产成功。

## 用户反馈修复：评论与分段单选

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
