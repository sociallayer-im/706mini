任务弹层。返回dialog，调用showModal。焦点由浏览器限制在弹层，Escape关闭；loading时锁关闭；输入后关闭先确认放弃，内部成功close跳过确认。

## 调用参数

`title,error:string; content:Node; actions:ButtonProps[]; loading,dirty,confirmDiscard,removeOnClose:boolean`

使用方提供容器、业务数据和事件处理器。返回DOM节点；挂载用 `DS706.mount(container,"Sheet",props)`。所有数据为textContent，不接受任意HTML。

## 状态与组合

展示页可切换375/320/768宽度、默认/长文/空内容以及自定义JSON参数。交互状态按此组件语义适用；不适用的loading/disabled不机械增加。业务请求、权限和原生交接由使用方提供。

## 页面位置

- feed · Sheet · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:218
- discover · Sheet · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:218
- messages · Sheet · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:218
- me · Sheet · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:218
- manage · Sheet · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:218
- create-space · Sheet · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:218
- event · Sheet · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:218
- member · Sheet · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:218
- space · Sheet · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:218
- org · Sheet · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:218
- entity-events · Sheet · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:218
- entity-members · Sheet · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:218
- edit-entity · Sheet · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:218
- admins · Sheet · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:218
- edit-profile · Sheet · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:218
- relations · Sheet · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:218
- onboarding · Sheet · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:218
- calendar · Sheet · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:218
- spaces · Sheet · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:218
- campaign · Sheet · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:218
- campaign-edit · Sheet · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:218
- campaign-create · Sheet · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:218
- campaign-approval-detail · Sheet · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:218
- campaign-review-progress · Sheet · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:218
- event-access · Sheet · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:218
- activity-preview · Sheet · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:218
- publish · Sheet · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:218
- approvals · Sheet · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:218
- approval-detail · Sheet · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:218
- approval-progress · Sheet · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:218
- registrations · Sheet · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:218
- my-events · Sheet · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:218
- drafts · Sheet · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:218
- following · Sheet · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:218
- more · Sheet · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:218
- login · Sheet · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:218
- attendees · Sheet · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:218
- invitations · Sheet · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:218
- my-campaigns · Sheet · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:218
- privacy · Sheet · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:218
- feedback · Sheet · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:218
- review-lab · Sheet · 共享壳/过渡状态（按条件显示） · miniprogram/templates/screen.wxml:218

实现：独立Web组件，未替换小程序。
