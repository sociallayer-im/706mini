# 原生表单字段
负责label、选填、提示、错误及基础input/textarea；custom=true使用slot承载业务特有选择器或媒体组合。保留调用方data-*；input、keyboardheightchange原样转发detail。业务校验、草稿和字段更新由页面负责；组件不清空输入，不运行提交状态机。复杂slot内字段仍由其原生组件负责事件和可访问标签。
