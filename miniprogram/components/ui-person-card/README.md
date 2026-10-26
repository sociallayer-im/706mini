人物推荐卡。复用 ui-identity-row，姓名／多行简介文本组沿头像垂直居中，独立关注动作自行居中；理由是普通内容流，不占用虚构图标位置。

输入`person`（owner/display_name/avatar_url/bio/following）、`t`、`locale`、`reason`、`disabled`。简介自然换行增高，名称与辅助说明复用身份组件的字号与行距。组件拥有样式隔离与theme令牌；动作复用ui-button。

统一输出`interaction`：navigate携带member/owner，personFollow携带id及布尔enabled。取消关注确认、失败回滚与服务写入保留在页面既有处理器。按钮外壳只拦截原生tap，ui-button自定义press仅发送一次关注事件。

rail=true用于共享横向轨道，组件取消外边距且不收缩；外部轨道独占gap及首尾pageGutter。身份文字组与头像居中，独立操作按钮居中。
