提示与错误。错误用alert，普通提示用status；颜色伴随明确文案。

## 调用参数

`text,state,action:string; onPress:()=>void`

使用方提供容器、业务数据和事件处理器。返回DOM节点；挂载用 `DS706.mount(container,"Notice",props)`。所有数据为textContent，不接受任意HTML。

## 状态与组合

展示页可切换375/320/768宽度、默认/长文/空内容以及自定义JSON参数。交互状态按此组件语义适用；不适用的loading/disabled不机械增加。业务请求、权限和原生交接由使用方提供。

## 页面位置（提炼时源码快照）

- feed · 页面级错误、登录承接与重试：error && !sheet · miniprogram/templates/screen.wxml:29
- feed · 保留现有内容的刷新提示：loading && (items.length || record) && !sheet · miniprogram/templates/screen.wxml:30
- feed · 弹层局部错误：sheet-error；底层页面错误由!sheet条件抑制 · miniprogram/templates/sheets.wxml:3
- discover · 页面级错误、登录承接与重试：error && !sheet · miniprogram/templates/screen.wxml:29
- discover · 保留现有内容的刷新提示：loading && (items.length || record) && !sheet · miniprogram/templates/screen.wxml:30
- discover · 弹层局部错误：sheet-error；底层页面错误由!sheet条件抑制 · miniprogram/templates/sheets.wxml:3
- messages · 页面级错误、登录承接与重试：error && !sheet · miniprogram/templates/screen.wxml:29
- messages · 保留现有内容的刷新提示：loading && (items.length || record) && !sheet · miniprogram/templates/screen.wxml:30
- messages · 弹层局部错误：sheet-error；底层页面错误由!sheet条件抑制 · miniprogram/templates/sheets.wxml:3
- me · 页面级错误、登录承接与重试：error && !sheet · miniprogram/templates/screen.wxml:29
- me · 保留现有内容的刷新提示：loading && (items.length || record) && !sheet · miniprogram/templates/screen.wxml:30
- me · 弹层局部错误：sheet-error；底层页面错误由!sheet条件抑制 · miniprogram/templates/sheets.wxml:3
- manage · 页面级错误、登录承接与重试：error && !sheet · miniprogram/templates/screen.wxml:29
- manage · 保留现有内容的刷新提示：loading && (items.length || record) && !sheet · miniprogram/templates/screen.wxml:30
- create-space · 页面级错误、登录承接与重试：error && !sheet · miniprogram/templates/screen.wxml:29
- create-space · 保留现有内容的刷新提示：loading && (items.length || record) && !sheet · miniprogram/templates/screen.wxml:30
- event · 页面级错误、登录承接与重试：error && !sheet · miniprogram/templates/screen.wxml:29
- event · 保留现有内容的刷新提示：loading && (items.length || record) && !sheet · miniprogram/templates/screen.wxml:30
- event · 弹层局部错误：sheet-error；底层页面错误由!sheet条件抑制 · miniprogram/templates/sheets.wxml:3
- member · 页面级错误、登录承接与重试：error && !sheet · miniprogram/templates/screen.wxml:29
- member · 保留现有内容的刷新提示：loading && (items.length || record) && !sheet · miniprogram/templates/screen.wxml:30
- member · 弹层局部错误：sheet-error；底层页面错误由!sheet条件抑制 · miniprogram/templates/sheets.wxml:3
- space · 页面级错误、登录承接与重试：error && !sheet · miniprogram/templates/screen.wxml:29
- space · 保留现有内容的刷新提示：loading && (items.length || record) && !sheet · miniprogram/templates/screen.wxml:30
- space · 弹层局部错误：sheet-error；底层页面错误由!sheet条件抑制 · miniprogram/templates/sheets.wxml:3
- org · 页面级错误、登录承接与重试：error && !sheet · miniprogram/templates/screen.wxml:29
- org · 保留现有内容的刷新提示：loading && (items.length || record) && !sheet · miniprogram/templates/screen.wxml:30
- org · 弹层局部错误：sheet-error；底层页面错误由!sheet条件抑制 · miniprogram/templates/sheets.wxml:3
- entity-events · 页面级错误、登录承接与重试：error && !sheet · miniprogram/templates/screen.wxml:29
- entity-events · 保留现有内容的刷新提示：loading && (items.length || record) && !sheet · miniprogram/templates/screen.wxml:30
- entity-members · 页面级错误、登录承接与重试：error && !sheet · miniprogram/templates/screen.wxml:29
- entity-members · 保留现有内容的刷新提示：loading && (items.length || record) && !sheet · miniprogram/templates/screen.wxml:30
- edit-entity · 页面级错误、登录承接与重试：error && !sheet · miniprogram/templates/screen.wxml:29
- edit-entity · 保留现有内容的刷新提示：loading && (items.length || record) && !sheet · miniprogram/templates/screen.wxml:30
- admins · 页面级错误、登录承接与重试：error && !sheet · miniprogram/templates/screen.wxml:29
- admins · 保留现有内容的刷新提示：loading && (items.length || record) && !sheet · miniprogram/templates/screen.wxml:30
- admins · 弹层局部错误：sheet-error；底层页面错误由!sheet条件抑制 · miniprogram/templates/sheets.wxml:3
- edit-profile · 页面级错误、登录承接与重试：error && !sheet · miniprogram/templates/screen.wxml:29
- edit-profile · 保留现有内容的刷新提示：loading && (items.length || record) && !sheet · miniprogram/templates/screen.wxml:30
- relations · 页面级错误、登录承接与重试：error && !sheet · miniprogram/templates/screen.wxml:29
- relations · 保留现有内容的刷新提示：loading && (items.length || record) && !sheet · miniprogram/templates/screen.wxml:30
- onboarding · 页面级错误、登录承接与重试：error && !sheet · miniprogram/templates/screen.wxml:29
- onboarding · 保留现有内容的刷新提示：loading && (items.length || record) && !sheet · miniprogram/templates/screen.wxml:30
- calendar · 页面级错误、登录承接与重试：error && !sheet · miniprogram/templates/screen.wxml:29
- calendar · 保留现有内容的刷新提示：loading && (items.length || record) && !sheet · miniprogram/templates/screen.wxml:30
- calendar · 弹层局部错误：sheet-error；底层页面错误由!sheet条件抑制 · miniprogram/templates/sheets.wxml:3
- spaces · 页面级错误、登录承接与重试：error && !sheet · miniprogram/templates/screen.wxml:29
- spaces · 保留现有内容的刷新提示：loading && (items.length || record) && !sheet · miniprogram/templates/screen.wxml:30
- campaign · 页面级错误、登录承接与重试：error && !sheet · miniprogram/templates/screen.wxml:29
- campaign · 保留现有内容的刷新提示：loading && (items.length || record) && !sheet · miniprogram/templates/screen.wxml:30
- campaign-edit · 页面级错误、登录承接与重试：error && !sheet · miniprogram/templates/screen.wxml:29
- campaign-edit · 保留现有内容的刷新提示：loading && (items.length || record) && !sheet · miniprogram/templates/screen.wxml:30
- campaign-create · 页面级错误、登录承接与重试：error && !sheet · miniprogram/templates/screen.wxml:29
- campaign-create · 保留现有内容的刷新提示：loading && (items.length || record) && !sheet · miniprogram/templates/screen.wxml:30
- campaign-approval-detail · 页面级错误、登录承接与重试：error && !sheet · miniprogram/templates/screen.wxml:29
- campaign-approval-detail · 保留现有内容的刷新提示：loading && (items.length || record) && !sheet · miniprogram/templates/screen.wxml:30
- campaign-approval-detail · 弹层局部错误：sheet-error；底层页面错误由!sheet条件抑制 · miniprogram/templates/sheets.wxml:3
- campaign-review-progress · 页面级错误、登录承接与重试：error && !sheet · miniprogram/templates/screen.wxml:29
- campaign-review-progress · 保留现有内容的刷新提示：loading && (items.length || record) && !sheet · miniprogram/templates/screen.wxml:30
- event-access · 页面级错误、登录承接与重试：error && !sheet · miniprogram/templates/screen.wxml:29
- event-access · 保留现有内容的刷新提示：loading && (items.length || record) && !sheet · miniprogram/templates/screen.wxml:30
- event-access · 弹层局部错误：sheet-error；底层页面错误由!sheet条件抑制 · miniprogram/templates/sheets.wxml:3
- activity-preview · 页面级错误、登录承接与重试：error && !sheet · miniprogram/templates/screen.wxml:29
- activity-preview · 保留现有内容的刷新提示：loading && (items.length || record) && !sheet · miniprogram/templates/screen.wxml:30
- publish · 页面级错误、登录承接与重试：error && !sheet · miniprogram/templates/screen.wxml:29
- publish · 保留现有内容的刷新提示：loading && (items.length || record) && !sheet · miniprogram/templates/screen.wxml:30
- approvals · 页面级错误、登录承接与重试：error && !sheet · miniprogram/templates/screen.wxml:29
- approvals · 保留现有内容的刷新提示：loading && (items.length || record) && !sheet · miniprogram/templates/screen.wxml:30
- approval-detail · 页面级错误、登录承接与重试：error && !sheet · miniprogram/templates/screen.wxml:29
- approval-detail · 保留现有内容的刷新提示：loading && (items.length || record) && !sheet · miniprogram/templates/screen.wxml:30
- approval-detail · 弹层局部错误：sheet-error；底层页面错误由!sheet条件抑制 · miniprogram/templates/sheets.wxml:3
- approval-progress · 页面级错误、登录承接与重试：error && !sheet · miniprogram/templates/screen.wxml:29
- approval-progress · 保留现有内容的刷新提示：loading && (items.length || record) && !sheet · miniprogram/templates/screen.wxml:30
- registrations · 页面级错误、登录承接与重试：error && !sheet · miniprogram/templates/screen.wxml:29
- registrations · 保留现有内容的刷新提示：loading && (items.length || record) && !sheet · miniprogram/templates/screen.wxml:30
- my-events · 页面级错误、登录承接与重试：error && !sheet · miniprogram/templates/screen.wxml:29
- my-events · 保留现有内容的刷新提示：loading && (items.length || record) && !sheet · miniprogram/templates/screen.wxml:30
- drafts · 页面级错误、登录承接与重试：error && !sheet · miniprogram/templates/screen.wxml:29
- drafts · 保留现有内容的刷新提示：loading && (items.length || record) && !sheet · miniprogram/templates/screen.wxml:30
- following · 页面级错误、登录承接与重试：error && !sheet · miniprogram/templates/screen.wxml:29
- following · 保留现有内容的刷新提示：loading && (items.length || record) && !sheet · miniprogram/templates/screen.wxml:30
- more · 页面级错误、登录承接与重试：error && !sheet · miniprogram/templates/screen.wxml:29
- more · 保留现有内容的刷新提示：loading && (items.length || record) && !sheet · miniprogram/templates/screen.wxml:30
- more · 弹层局部错误：sheet-error；底层页面错误由!sheet条件抑制 · miniprogram/templates/sheets.wxml:3
- login · 页面级错误、登录承接与重试：error && !sheet · miniprogram/templates/screen.wxml:29
- login · 保留现有内容的刷新提示：loading && (items.length || record) && !sheet · miniprogram/templates/screen.wxml:30
- attendees · 页面级错误、登录承接与重试：error && !sheet · miniprogram/templates/screen.wxml:29
- attendees · 保留现有内容的刷新提示：loading && (items.length || record) && !sheet · miniprogram/templates/screen.wxml:30
- invitations · 页面级错误、登录承接与重试：error && !sheet · miniprogram/templates/screen.wxml:29
- invitations · 保留现有内容的刷新提示：loading && (items.length || record) && !sheet · miniprogram/templates/screen.wxml:30
- my-campaigns · 页面级错误、登录承接与重试：error && !sheet · miniprogram/templates/screen.wxml:29
- my-campaigns · 保留现有内容的刷新提示：loading && (items.length || record) && !sheet · miniprogram/templates/screen.wxml:30
- privacy · 页面级错误、登录承接与重试：error && !sheet · miniprogram/templates/screen.wxml:29
- privacy · 保留现有内容的刷新提示：loading && (items.length || record) && !sheet · miniprogram/templates/screen.wxml:30
- feedback · 页面级错误、登录承接与重试：error && !sheet · miniprogram/templates/screen.wxml:29
- feedback · 保留现有内容的刷新提示：loading && (items.length || record) && !sheet · miniprogram/templates/screen.wxml:30
- feedback · 弹层局部错误：sheet-error；底层页面错误由!sheet条件抑制 · miniprogram/templates/sheets.wxml:3
- review-lab · 页面级错误、登录承接与重试：error && !sheet · miniprogram/templates/screen.wxml:29
- review-lab · 保留现有内容的刷新提示：loading && (items.length || record) && !sheet · miniprogram/templates/screen.wxml:30

实现：本目录为独立Web组件；小程序通过 native-mapping.json 对应的原生组件接入。两端事件API分别维护，不直接混用。
