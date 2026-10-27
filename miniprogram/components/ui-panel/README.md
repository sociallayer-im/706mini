原生706 panel组件。视觉与交互外壳复用theme令牌，业务权限、请求、草稿与状态机留在调用页面。

layout=form时由面板flex列与itemGap统一字段/操作间距；字段传standalone取消自身底margin，不能叠加两份间距。context/inset继续分别决定背景和外壳留白。适用于反馈、退回意见；通用弹层form-stack使用同一令牌。普通内容Panel默认不改变排版。
