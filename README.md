# 706mini

## 同事离线评审（2026-10-09）

默认离线演示已接入原生小程序。导入仓库根目录，在首页顶部打开“演示数据”进入全部页面和状态目录。见 [同事评审指南](docs/colleague-review.md)、[Montana 真实接入矩阵](docs/montana-integration-matrix.md) 和 [验证记录](docs/review-validation.md)。


706 社区微信原生小程序工程，以及保留的移动端网页交互模型。

原生工程位于 `miniprogram/`，含 39 个页面，接入 Montana 服务。

**[微信开发者工具导入、页面映射与联调状态](docs/native-miniprogram-delivery.md)**。编译与服务部署已完成，真实微信账号端到端验收待进行。

## 开发文档

- [数据模型与关系首页](data-integration-review/model.html)：前后端数据对接的第一视图；继续进入字段、需求、接口和Gap。见[说明](docs/data-integration/README.md)。

- [后端 AI Agent 开发手册](docs/backend-ai-agent-development-manual.md)：产品界面与交互、状态机、数据模型、API、权限、支付、隐私及联调验收标准。
- [产品讨论补充（10/8 导入）](docs/meetings/2026-10-08-community-mini-program-feature-plan.md)：去敏需求、会中决定与未决事项；实际发生日期未知，不覆盖最新确定规则。
- [需求与待确认 Backlog](docs/backlog.md)：节点展示、活动复用及后置需求的可读入口，区分已有规则、候选方案和验证缺口。
- [当前视觉方案评审](docs/design-review/2026-10-07/README.md)：六套方向与原版对比，历史方案记录；2026-10-08 已确认采用 Sola Figma。

## 本地预览

直接打开 `dist/index.html`，或在 `dist` 目录启动任意静态网页服务器。
