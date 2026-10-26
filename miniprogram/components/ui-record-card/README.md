通用记录摘要与操作容器。status/title/description/meta为只读数据；默认interactive=false，不伪装为可点击卡片。页面有真实可执行整卡动作时才显式开启interactive并绑定press；disabled/loading只阻该整卡动作，不自动改子操作权限。

支持custom=true完全通过默认slot组合业务内容；默认slot及named actions slot保留子操作，拦截原生tap避免触发卡片导航。子ui-button继续绑定页面原事件、dataset与busy条件。样式仅包含白面、间距、角色字号；不判断报名/审核/邀请业务状态。

screen当前list-card替换建议：外壳换如下组件，原内层业务操作原封保留在默认slot（可后续移到actions slot）。前四个text由props承担，不再复制。

```xml
<ui-record-card wx:elif="{{route !== 'calendar'}}"
 status="{{item.statusLabel}}"
 title="{{item.title || t[item.scope] || item.scope || item.display_name || item.owner}}"
 description="{{item.note || item.motivation || item.dateLabel}}"
 meta="{{route === 'messages' && item.status === 'UNREAD' ? '●' : ''}}"
 interactive="{{route !== 'attendees' && route !== 'admins' && route !== 'invitations' && route !== 'approval-progress' && route !== 'campaign-review-progress'}}"
 data-index="{{index}}" bind:press="openItem">
 <!-- 原有联系信息/审核决定/签到/撤权/接受邀请等子操作及条件原样置于此 -->
</ui-record-card>
```

上述interactive排除项与page.js openItem的明确return对应；approvals等有真实整卡入口继续保留openItem。默认slot拦截native tap不阻自定义press处理器，因此非交互记录的子按钮仍能独立执行。
