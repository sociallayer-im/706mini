# SID-81 · 六套设计 × 三个页面

状态：开发与部署完成，待统筹复查及用户选型；不代表最终选定设计。

## 范围与基准

- 页面：feed 动态首页、discover 活动信息流、event 活动详情。discover 已核对为日期、空间、关键词三组筛选＋活动列表，并非抽象探索页。
- Git 基准：`f9f3bdc99f4dc6fd926ce4a4430258ea0b7a9675`。origin/main 安全拉取检查后无更新；upstream/main `ebce28a` 已是基准祖先。
- 开始时只有用户提供的 `references/sola-mint-cards.png` 未提交，已保留。
- 原 `dist/index.html/app.js/style.css/preview.js` 不改；`dist/design-review/baseline/` 是基准逐字节副本。
- 数据中的日期属于原型样例，保持一致供视觉比较，不将其改为当天活动。

公开对比页：https://sociallayer-im.github.io/706mini/design-review/

## 交付入口

- `dist/design-review/index.html`：切换七套（原版＋六方案）、三个页面；可并排原版、选择 360/390/430px、独立打开，共 21 个主要入口。
- `dist/design-review/<slug>/index.html?view=feed|discover|event&id=film`：每套完整的本地应用副本，原主要事件处理器继续可用。
- `dist/design-review/sources.html`：视觉来源、原始 sample、参考截图与独立作者说明。
- `references/`：原始素材与原 sample 的留存；`reference-sha256.json` 校验留存文件。
- `screenshots/`：真实浏览器手机截图；验证结果见 `validation.md` 与 JSON。

## 独立制作

五个 `fork_turns=none` 子代理：`/root/sola_mint_cards`、`/root/706_original`、`/root/706er`、`/root/706_living_lab`、`/root/706_open_canvas`。各只接收同一基准、自己的唯一视觉源、自己的可写目录，未共享其他方案上下文。

第六次 spawn_agent 两次返回 `agent thread limit reached`，依任务允许的独立对话方式，Spark 706 Green 由全新项目对话 `01a11432-70cb-7fd3-8155-383acff43f10` 实现，无前五套设计历史。详细记录在 `execution-manifest.json` 及每套 `<slug>.md`。

父执行者负责复制基准、来源留存、对比页、统一浏览器验证与必要集成修复、部署；不替任何子代理重做风格。

## 来源与发布

五套本地来源：`/Users/shing/Projects/design-gallery/public/entries/<slug>/`，按实际存在读取设计系统、CSS、sample 脚本、图片。706-original 使用内嵌 CSS 的 sample；Living Lab 无独立 design-system.md，使用 analysis 与 sample。CharacterLab 仅在原样例依赖时复用。

公开来源标识：`https://dreamboard.shing19.cc/design-gallery/<slug>/`。本次优先读取本地，不访问需要登录的镜像，不改图库。

原始 sample 的字节原件保存在 docs；Pages 中 sample 副本只将根绝对资源及站内链接调整为本地相对路径，以适配 GitHub 项目子路径。

GitHub `sociallayer-im/706mini` 原本 PUBLIC，当前账号 ADMIN，未改可见性。Pages 使用 Actions，部署仅上传 `dist`；不上传整个仓库、不将会议记录或统筹文档放入站点。

## 复现

```sh
python3 -m http.server 7060 --bind 127.0.0.1 --directory dist
node scripts/validate-design-review.mjs
```

打开 `http://127.0.0.1:7060/design-review/`。业务演示中的搜索、支付、发布仍是静态原型；视觉适配不宣称接入后端。
