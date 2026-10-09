# 48项待查看目录

2026-10-09最新有限授权：仅做简单原生目录，其他开发/修复/视觉核对继续暂停。原67项详细目录、隔离状态系统与筛选方案已撤回，未提交。

入口：小程序“我的” → **待查看页面（48项）**；也可用已有页面顶部“页面目录”进入。微信开发者工具如需手动直达，启动页面填 `pages/review-lab/index`，无需参数；本轮不改项目编译配置。

内容来自既有 `coverage.json`：12 NEEDS_FIX + 32 PENDING，另加onboarding、campaign-create、campaign-approval-detail、campaign-review-progress。19 VERIFIED不列入；coverage及已有业务实现不变，开发核对不代表本人验收。`pending-review.json`仅存待查看sourceQuery和4路由的选择快照。

按钮使用原118目录中的索引和角色/实体ID/步骤/弹框参数，不重新编号后传错索引。本目录不显示旧“前后项/118”工具条；沿用已有顶部目录入口。tabBar页面通过一次性内存参数接力，再reLaunch无query的tabBar路径，避免把sheet参数塞入tabBar URL。非tab页继续原query跳转。

保留r12 VERSION与所有现有业务记录、草稿，不reset。沿用原labOpen切换当前演示身份、normal场景及上海筛选；这不是隔离沙盒，用户在页面内提交的Mock操作仍会修改本地演示数据，返回目录不回滚。目录上已说明身份/筛选变化。

需手动操作：引导和系列创建继续现有表单/草稿，各步骤与成功态自行操作；发布成功项仅展示成功界面，完整提交从发布第一步进入；付款依赖有效待付款凭证，过期时保持过期，不自动恢复；审核节点和既有处理状态保留，目录不代办审核。活动群二维码：需先在现有报名凭证完成模拟支付，已确认后再打开；不自动改状态。除既有options支持的步骤/弹框外，不补业务实现。

本轮仅静态阅读与文件差异检查：按coverage选44项并追加4路由；对照prototype-catalog与已有catalog的route/id/persona/options；git diff --check无空白错误。**未新增或运行任何测试，未运行编译、未启动GUI或逐页视觉核对**。没有后端改动/部署、没有恢复其他暂停工作。实际点击体验留给本人Review。

变更文件：`miniprogram/lib/mock/pending-review.json`、`miniprogram/lib/page.js`、`miniprogram/templates/screen.wxml`及本说明。
