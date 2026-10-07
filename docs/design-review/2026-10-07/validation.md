# 集成验证 · 2026-10-07

## 已完成

- `node scripts/validate-design-review.mjs`：21 个入口；原版四文件与基准 commit 字节一致；六套 people/events/campaign 完全一致；全部方案 JS 语法及必需渲染/交互函数通过。
- `python3 scripts/check-design-review-assets.py`：87 个 HTML/CSS 本地引用，0 缺失。
- Chromium 实际渲染：原版＋六套 × feed/discover/event，在 360px、390px 各检查一遍，共 42 个页面/宽度组合。最终均无主容器横向溢出；图片无缺失。截图存于 `screenshots/`。
- 六套实际点击链路：关注 Jiang → 发现 → 免费筛选 → 返回不限 → 打开放映详情 → 申请报名 → 提交申请（审核中且按钮禁用）→ 推荐弹窗 → 提交推荐 → 评论弹窗 → 关闭 → 返回发现。全部通过。免费结果均为苏州河慢走、社区功能许愿工作坊。
- 对比台：21 个独立链接；风格/页面切换更新 URL 与 iframe；原版并排；360px/430px 控件正确更新 iframe 宽；360px 移动窗口主文档无溢出，预览宽 338px，桌面 1280px 无溢出。
- 五份来源 sample 实际打开，有标题和内容，无缺失图片；来源脚本和图片均在项目内。仅来源展示副本改写路径，docs 原始留存不改写。
- 浏览器累计 error 日志检查无错误；常见 credential 模式扫描无匹配。

## 发现并修复

1. Sola 详情返回箭头：原透明顶栏继承白字，浅底上不清楚。加深绿色，复测。
2. Sola 日历入口：新左右留白仅覆盖左侧，继承右 margin 导致 3px 溢出。修正右留白为 16px，360/390 两宽复测均等宽。
3. Original 详情系列入口：新 22px 两侧 margin 与原 width calc(-24px) 不匹配，造成 20px 溢出。修为 calc(-44px)，360/390 复测均等宽。
4. 部分原型关注/清空筛选缺陷在方案副本修正，基准不变。

JSON 留存 `browser-validation.json` 包含初检及 `fixRetests`；有初检溢出记录时以修正后的复测值为准。`source-browser-checks.json` 是源 sample 核验。

## 范围边界

原型搜索输入、分享、支付等演示入口没有接真实后端。此次为设计方案交付及可用演示验证，不代表后端开发完成。来源 sample 中官方外链仍为外链。

## 部署

发布工作流只上传 `dist`。仓库原本 PUBLIC，未修改可见性。公开访问结果在部署后补充。
