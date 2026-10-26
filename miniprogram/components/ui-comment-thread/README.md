评论与嵌套回复。头像与右侧完整文本块顶部对齐；回复为无图标文字按钮，通过共享ui-button align=start与正文左缘对齐，保留独立44px触控区。

输入`item/t/currentUser/locale/busy`和`surface`（detail默认，sheet为弹层）。detail保留作者主页、推荐标签与仅本人可删；sheet保留时间且不增加删除入口。回复数据原样保留，不归并作者或改写文案。

统一输出`interaction`：navigate保留member/id；sheet保留kind=comment/reply=id；action保留op=deleteComment/id。组件不写业务数据，删除确认、权限、评论编辑草稿与发送逻辑由父页面处理。
