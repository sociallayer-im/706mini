# 日历方向与底栏CTA反馈修复

## 根因与规则

日历左右都传入左指back资源，共享原生IconButton没有direction属性或旋转glyph的路径。新增方向参数，仅旋转图形：默认none保留资源；左箭头资源previous→left/0度，next→right/180度，up/90度，down/-90度。方向与事件delta独立但必须语义一致。页面返回未设置方向，保持向左；关闭/删除等非方向图标不旋转。全项目WXML中唯一使用同一back资源的前后成对按钮为calendar-period；review前后按钮使用‹/›文本、表单步骤使用文字，均无需旋转。Web Calendar同步使用左右IconButton，组件指南同步。

底栏原生ui-button是virtualHost，button本身已flex:1占据剩余宽度，但control-face仍是width:auto，所以黄色背景只按文字宽居中。修复只作用于显式grow：control-face width100%/flex1/min-width0。外层触控盒和背景一致，次要推荐保持内容宽，普通内联按钮不变。FloatingBar的gap、双侧pageGutter、内padding与safe-area不变；所有复用grow的固定动作栏、弹层共享该修复。独立Web Button增加grow及类型定义，FloatingBar示例主CTA显式grow。

## 原生实际验证

week-start→week-next→week-return：2026年10月26日—11月1日→11月2日—8日→10月26日—11月1日。
month-start→month-next→month-return：2026年10月→11月→10月。六组PNG/TXT记录真实点击与日期；week-start截图右箭头向右、左箭头及页面返回向左。未生成海报或提交业务动作。

event-cta-390及event-cta-320记录真实原生活动详情（390/320宽）：推荐为内容宽，申请报名黄色背景延伸至底栏内右padding，触控button使用相同伸展宽度。此次未点击推荐或申请报名。

## 其他验证与边界

web-check.txt是真实独立Web DOM几何检查：320/390/430宽，每种normal/disabled/loading/long状态，主button和face宽度相等且右边界一致，保持8px栏内padding；长文本可增高。Web日历next旋转180度，11月→12月→11月。
checks.json为28项原生契约、paper-layout、page-gutters、event-gallery以及90WXML/49WXSS编译，全部exit0。原生disabled/loading/长文本组合、真机触控边界和全量底栏逐页GUI未执行，不用Web结果替代。

预览机型已恢复390宽iPhone12/13(Pro)、16字体。此次沿用打开项目中的数据环境，无服务切换、账号切换或数据提交。
