公开空间/组织目录卡。封面、城市/地区、名称、介绍与已知活动数归同一内容面；数量0原样显示，未知不造分母。长文自然增高；媒体保留原图，整卡不增加业务权限推断。

输入item（cover_url/cityLabel/city/district/name/title/introduction/event_count）、locale、interactive（默认true）、disabled、custom、variant（cover默认/plain白面）。custom=true跳过预制文字，用默认slot组合正文；named actions slot承接独立操作。slot不负责业务样式与校验。interactive=false时不赋按钮角色、不发press；独立子操作仍可点，原生tap被slot边界拦截，防止误触整卡。

模板精确替换screen当前space-directory-card分支：

```xml
<ui-entity-card wx:elif="{{route === 'spaces'}}" item="{{item}}" locale="{{locale}}"
 data-route="space" data-id="{{item.id}}" bind:press="navigate"/>
```

父级data-route/data-id与既有navigate保留。默认目录展示不需要复制旧内层image/text；详情页的管理权限、负责人、回顾、活动等应继续由页面业务布局组合，不塞入本视觉组件。
