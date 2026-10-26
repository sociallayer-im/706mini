# 选择组件与替换范围（2026-10-26）

## 全部 Checkbox 使用位置

全仓原生 Checkbox 原先位于 screen.wxml、sheets.wxml 两个共享模板，以下为实际业务入口，不把每个引用共享模板的页面重复算作使用页。

| 形式 | 页面 / 场景 | 数据与处理 |
| --- | --- | --- |
| 自由排列标签、多选 | onboarding 新人资料第2步、edit-profile 编辑资料 | interests，最多5项；至少2项仍由表单校验 |
| 一项一行、多选 | onboarding 第3步关注空间、edit-profile 常去空间 | follow_spaces / frequent_spaces |
| 一项一行、多选，带封面和说明 | campaign-create、campaign-edit 关联活动 | event_ids，保留过滤列表外已有选择 |
| 一项一行、多选 | publish 发布 / 编辑活动的参与方式 | join_methods；选中后的内容输入仍由业务模板负责 |
| 独立勾选 | onboarding 第3步隐私同意 | consent |
| 独立勾选 | event 活动详情的报名弹层 | consent；演示模式另有 shareContact |

## 组件结构

- ui-choice-group：统一 options / value、mode=multiple 或 single、layout=tags 或 list、max（0为不限）、disabled、label、value-key、label-key、event-details。value 始终为字符串数组，包括单选，便于现有页面复用。
- ui-checkbox：单个布尔选项，checked / label / disabled / layout；内部复用同一个 ui-choice-group。
- ui-choice-group/option.wxml：共享原生 Checkbox / Radio + 文本 + 可选说明 / 封面。标签和列表共用这份选项结构。使用 WXML 模板而不是把原生输入跨自定义组件边界嵌套，保持 native group 的直接归属。
- change 统一提供 detail.value；独立勾选额外提供 detail.checked。页面回调仍负责持久化和业务校验。

```xml
<ui-choice-group options="{{interestOptions}}" value="{{form.interests}}"
 layout="tags" max="{{5}}" bindchange="interestsChange"/>
<ui-choice-group options="{{spaces}}" value="{{form.frequent_spaces}}"
 value-key="id" label-key="name" layout="list" bindchange="spaceSelection"/>
<ui-choice-group options="{{options}}" value="{{selected}}" mode="single"/>
<ui-checkbox checked="{{consent}}" label="同意隐私说明" bindchange="consent"/>
```

## 视觉修复

标签容器与每个选项显式 flex / inline-flex，align-items:center；Checkbox 有固定不可收缩的 flex 布局，文本放独立 copy 区，去掉旧 interest-choice / checkbox-row 全局样式。长文案可换行，最小触控高度沿用 touchTarget；隔离样式和 theme tokens 保持页面一致。

## 参考与交付状态

- 微信 WeUI：https://wechat-miniprogram.github.io/weui/docs/checkbox-group.html
- Vant Weapp：https://github.com/youzan/vant-weapp/blob/dev/packages/checkbox/README.md

参考其 Checkbox + Group、单多选、禁用和 max 的成熟组织方式，未引入 UI 库。已完成代码替换与源文件复查；本轮未运行测试、原生编译或模拟器/真机视觉验证，不将 CSS 修改称为已取得截图验证。

## 选中态修正

用户截图指出选中框右侧出现额外白条：原生 Checkbox 外层包含其内部留白，不能给整个 choice-control 添加选中背景。已删除该规则，白色框面交由原生控件绘制。后续同类控件不在原生输入宿主上涂背景；本轮未运行模拟器或测试。
