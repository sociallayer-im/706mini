# 706mini

706 社区微信原生小程序工程，以及保留的移动端网页交互模型。

原生工程位于 `miniprogram/`，含 39 个页面，接入 Montana 服务。

**[微信开发者工具导入、页面映射与联调状态](docs/native-miniprogram-delivery.md)**。编译与服务部署已完成，真实微信账号端到端验收待进行。

## 开发文档

- [后端 AI Agent 开发手册](docs/backend-ai-agent-development-manual.md)：产品界面与交互、状态机、数据模型、API、权限、支付、隐私及联调验收标准。
- [产品讨论补充（10/8 导入）](docs/meetings/2026-10-08-community-mini-program-feature-plan.md)：去敏需求、会中决定与未决事项；实际发生日期未知，不覆盖最新确定规则。
- [需求与待确认 Backlog](docs/backlog.md)：节点展示、活动复用及后置需求的可读入口，区分已有规则、候选方案和验证缺口。
- [当前视觉方案评审](docs/design-review/2026-10-07/README.md)：六套方向与原版对比，历史方案记录；2026-10-08 已确认采用 Sola Figma。

## 本地预览

直接打开 `dist/index.html`，或在 `dist` 目录启动任意静态网页服务器。
