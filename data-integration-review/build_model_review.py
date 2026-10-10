"""Render the model-first handoff; no network, app build or database access."""
from pathlib import Path
import json
from html import escape as E

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'data-integration-review'
D = json.loads((ROOT / 'docs/data-integration/storage-review.json').read_text())
entities = D['storage']['entities']
byid = {e['id']: e for e in entities}

def node(x,y,id,label,sub,physical=False):
    return f'<a href="#model-{E(id)}"><rect x="{x}" y="{y}" width="235" height="78" rx="9" class="{ "physical" if physical else "logical"}"/><text x="{x+16}" y="{y+28}" class="node-title">{E(label)}</text><text x="{x+16}" y="{y+51}">{E(id)}</text><text x="{x+16}" y="{y+68}" class="sub">{E(sub)}</text></a>'

def arrow(points,label,x,y):
    return f'<polyline points="{points}" class="rel" marker-end="url(#arrow)"/><text x="{x}" y="{y}" class="edge-label">{E(label)}</text>'

def svg(title,body,height=350):
    return f'<div class="diagram"><svg viewBox="0 0 1050 {height}" role="img" aria-label="{E(title)}"><title>{E(title)}</title><defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 Z" fill="#68849a"/></marker></defs>{body}</svg></div>'

identity = svg('身份账户、公开资料与空间组织关系',
 node(40,30,'profile','成员公开资料','JSON记录') + node(755,30,'$users','系统身份账户','独立SQL表',True) +
 node(40,240,'role','管理角色','JSON记录') + node(755,240,'entity','空间 / 组织','kind = SPACE / ORGANIZATION') +
 arrow('275,69 755,69','profile.owner → $users.id · 每条资料指一个账户',310,57) +
 arrow('158,240 158,165 870,165 870,108','role.owner → $users.id · 一个账户可有多条角色',290,151) +
 arrow('275,279 755,279','role.parent → entity.id · 实体角色指一个空间/组织',295,267) +
 '<text x="40" y="340" class="sub">profile按owner取首条；源码未声明owner唯一约束，不能当成数据库强制1:1。</text>')
activity = svg('报名与评论围绕活动，活动关联空间组织',
 node(40,30,'registration','报名 / 候补 / 支付占位','owner → $users.id') + node(755,30,'event','活动','owner → $users.id') +
 node(40,240,'comment','活动评论 / 回复','owner → $users.id') + node(755,240,'entity','空间 / 组织','一个实体可关联多个活动') +
 arrow('275,69 755,69','registration.parent → event.id · 多条报名 : 一个活动',300,57) +
 arrow('275,279 450,279 450,130 870,130 870,108','comment.parent → event.id · 多条评论 : 一个活动',340,117) +
 arrow('960,108 960,240','0..1 空间 + 0..1 组织',722,192) +
 '<text x="755" y="218" class="sub">event.data.space_id / organization_id</text>' +
 '<text x="40" y="340" class="sub">评论reply_to指同活动的一条评论；报名owner是账户，不是profile记录ID。</text>')
editorial = svg('专题包含多活动，审核按主体与轮次记录',
 node(40,30,'campaign','专题 / 活动合集','owner → $users.id') + node(755,30,'event','活动','可被多个专题引用') +
 node(40,240,'review','审核记录','scope / round / subject_type') + node(755,240,'entity','组织 / 空间审核方','review.data.entity_id 可选') +
 arrow('275,69 755,69','campaign.data.event_ids[] → event.id · 多对多引用',293,57) +
 arrow('110,240 110,108','parent → campaign.id',128,180) +
 arrow('220,240 220,165 870,165 870,108','parent → event.id · 每条审核指一个主体（两者之一）',280,151) +
 arrow('275,279 755,279','review.data.entity_id → entity.id · 依scope可选',300,267) +
 '<text x="40" y="340" class="sub">一个活动/专题可有多条、多轮审核；专题INITIATOR审核另用data.event_id指相关活动。</text>')
physical = '''<div class="physical-map"><div class="sql"><b>community706 · SQL表</b><p>id · type · owner · parent · status<br>version · created_at · updated_at</p><div class="jsonbox"><b>data · JSONB</b><p>24类逻辑记录共用此列</p><span>profile / entity / event / registration / review / campaign / comment / …</span></div></div><div class="sql"><b>$users · SQL表</b><p>身份账户元数据</p><small>业务owner通过文本ID关联</small></div><div class="sql"><b>$files · SQL表</b><p>文件元数据</p><small>字节在对象存储；media为业务引用</small></div></div>'''
keys = {
 'profile':['owner','data.display_name','data.visibility','data.share_activity','data.frequent_spaces'],
 'event':['owner','status','data.title','data.organization_id','data.space_id','data.starts_at','data.ends_at','data.capacity','data.price_minor'],
 'registration':['owner','parent','status','data.approval_status','data.payment_id','data.contact_share_consent'],
 'review':['owner','parent','status','data.round','data.scope','data.subject_type','data.entity_id','data.event_id'],
 'campaign':['owner','status','data.title','data.organization_id','data.event_ids'],
 'comment':['owner','parent','data.text','data.reply_to'],
 'entity':['data.kind','data.name','data.city','data.allow_event_requests'],
 '$users':['id','email','phone','type'], '$files':['id','path','size','content-type'],
}

def evidence(items):
    result=[]
    for x in items:
        file=x.get('file','');line=x.get('line',1)
        back='706-montana' in file or file.startswith(('server/','apps/'))
        rel=file.split('/706-montana/' if back else '/706mini/')[-1]
        repo='sola-day/montana' if back else 'sociallayer-im/706mini'
        commit=D['backendCommit'] if back else D['frontendCommit']
        result.append(f'<li><a href="https://github.com/{repo}/blob/{commit}/{E(rel)}#L{line}">{E(rel)}:{line}</a> {E(x.get("detail",""))}</li>')
    return '<ul>'+''.join(result)+'</ul>'

def card(e):
    id=e['id'];fs=e['fields']
    selected=[f for f in fs if f['name'] in keys.get(id,[])]
    if not selected: selected=[f for f in fs if f['name'].startswith('data.')][:5] or fs[:5]
    reads=sorted({x for f in fs for x in f.get('readers',[])})
    writes=sorted({x for f in fs for x in f.get('writers',[])})
    mappings=[m for m in D['frontendMap']['mappings'] if any(a['entity']==id for a in m['accesses'])]
    reqs={r['id']:r for r in D['requirements']}
    relations=e.get('relationships',[])
    purpose=e.get('purpose','')
    content=f'<p>{E(purpose)}</p><p class="meta">{E(e["storageKind"])} · {E(e.get("physicalCarrier",""))}</p>'
    content+='<p class="fields">'+''.join(f'<code>{E(f["name"])}</code>' for f in selected)+'</p>'
    content+='<p><b>读取</b> '+E('、'.join(reads) or '无直接入口记录')+'</p><p><b>写入</b> '+E('、'.join(writes) or '无直接入口记录')+'</p>'
    content+=f'<details><summary>关联前端需求（{len(mappings)}项）</summary><ul>'+''.join(f'<li><a href="requirements.html#requests">{E(m["requirementId"])}</a> · {E(reqs[m["requirementId"]].get("action",""))}</li>' for m in mappings)+'</ul></details>'
    content+='<details><summary>关系字段与约束</summary><ul>'+''.join(f'<li><code>{E(r.get("field",""))}</code> → {E(r.get("target",""))} · {E(r.get("enforcement",""))}</li>' for r in relations)+'</ul><p>单值文本字段指0或1个目标；数组可指多个目标。反向可被多条记录引用；数据库唯一/外键强制必须另有明确声明。</p></details>'
    content+=f'<details><summary>完整字段 / 索引 / 权限 / 源码（{len(fs)}字段）</summary><p><a href="storage.html#entity-{E(id)}">进入字段与接口讨论页</a></p>'+evidence(e.get('evidence',[]))+'<pre>'+E(json.dumps(e,ensure_ascii=False,indent=2))+'</pre></details>'
    return f'<details class="model" id="model-{E(id)}" data-search="{E(json.dumps([e,mappings],ensure_ascii=False).lower())}"><summary>{E(e["name"])} <code>{E(id)}</code><span>{len(mappings)}项需求</span></summary>{content}</details>'

priority=['event','registration','review','campaign','comment','entity','profile','$users']
ordered=sorted(entities,key=lambda e:priority.index(e['id']) if e['id'] in priority else len(priority))
page='''<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>706 · 数据模型</title><style>
:root{--ink:#26374a;--muted:#627487;--line:#dbe3ec;--bg:#f5f7fa}*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.7 system-ui,-apple-system,sans-serif}main{max-width:1240px;margin:auto;padding:28px}h1{font-size:30px;margin:0}h2{font-size:22px;margin:28px 0 12px}h3{font-size:17px;margin:0}p{margin:8px 0}a{color:#326f9a;overflow-wrap:anywhere}nav{display:flex;gap:18px;flex-wrap:wrap;margin:18px 0}.panel,.model{background:white;border:1px solid var(--line);border-radius:10px;padding:20px;margin:12px 0}.meta,small{color:var(--muted);font-size:12px}.pill{display:inline-block;background:#e9eff6;padding:3px 9px;border-radius:6px;font-size:12px}.physical-map{display:grid;grid-template-columns:2fr 1fr 1fr;gap:14px}.sql{background:#eef0ff;border:1px solid #bec4e2;border-radius:8px;padding:16px}.jsonbox{background:white;border:1px dashed #9ea9bd;border-radius:6px;padding:12px;margin-top:10px;font-size:13px}.diagram{overflow-x:auto;margin-top:12px}.diagram svg{display:block;width:100%;min-width:800px;font:13px system-ui,sans-serif}.logical{fill:#edf7f5;stroke:#8bb5a7}.physical{fill:#eef0ff;stroke:#9b9fc7}.node-title{font-size:17px;font-weight:650;fill:#26374a}.sub{font-size:12px;fill:#627487}.rel{fill:none;stroke:#68849a;stroke-width:2;stroke-dasharray:6 4}.edge-label{font-size:13px;fill:#365976}.legend{display:flex;flex-wrap:wrap;gap:15px;font-size:12px;color:var(--muted)}summary{cursor:pointer;font-weight:650}summary span{float:right;font-weight:400;color:var(--muted);font-size:12px}details details{border-top:1px solid var(--line);padding-top:10px;margin-top:12px}pre{font:12px/1.6 ui-monospace,monospace;white-space:pre-wrap;overflow-wrap:anywhere;max-height:500px;overflow:auto;background:#f5f7fa;padding:14px}code{font-size:12px;background:#edf1f5;padding:3px 5px;border-radius:4px;overflow-wrap:anywhere}.fields{display:flex;gap:7px;flex-wrap:wrap}.toolbar{position:sticky;top:0;background:var(--bg);padding:12px 0;display:flex;gap:10px;z-index:2}input,select{font:inherit;border:1px solid var(--line);border-radius:6px;padding:9px;background:white}input{flex:1;min-width:100px}.relationships{overflow-x:auto}table{border-collapse:collapse;width:100%;font-size:13px}th,td{text-align:left;vertical-align:top;border-bottom:1px solid var(--line);padding:9px}section,details[id]{scroll-margin-top:85px}.notice{border-left:3px solid #b19568;padding-left:12px}@media(max-width:800px){main{padding:16px}.physical-map{grid-template-columns:1fr}.toolbar{position:static;flex-wrap:wrap}summary span{float:none;display:block}h1{font-size:26px}}
</style></head><body><main><header class="panel"><span class="pill">SID-123 · 数据对接第一步</span><h1>706 数据模型</h1><p>先理解账户、活动、参与和审核如何连接，再进入字段、需求、接口与差异讨论。</p><nav><a href="#physical">物理存储层</a><a href="#relationships">核心关系图</a><a href="#models">完整模型</a><a href="storage.html">字段 / 接口 / 差异</a><a href="requirements.html">147项原需求</a></nav><p class="meta">源码范围：前端35fa1eb、后端d70d1db。24类业务记录共用community706.data；$users与$files为独立物理表。此页描述源码与已有结构定义，当前线上数据库未确认。</p></header><section id="physical"><h2>物理存储：三张应用表</h2>__PHYSICAL__<p class="meta">下面绿色节点是逻辑业务记录，全部位于community706；不是每个节点一张SQL表。另有10张身份、函数、文件能力与任务支撑表，在完整模型中展开。</p></section><section id="relationships"><h2>核心关系图</h2><div class="legend"><span>绿色：共享JSONB的逻辑记录</span><span>紫色：独立SQL表</span><span>虚线箭头：从存储关系字段指向目标ID，应用文本/数组关系</span></div><p class="notice">单值ID指一个目标，ID数组指多个目标；反向可以有多条记录。业务关系图中的虚线均不是SQL FK。支撑表迁移声明的app_id SQL FK另见完整模型。</p><article class="panel"><h3>1 · 身份与管理</h3>__IDENTITY__<p class="meta">profile是资料，$users是账户。role承担授权，membership承担成员关系，两者用途不同。</p></article><article class="panel"><h3>2 · 活动与参与</h3>__ACTIVITY__<p class="meta">一个活动对应多条报名和评论；报名状态决定候补、支付占位与确认，公开参与信息还受profile.share_activity控制。</p></article><article class="panel"><h3>3 · 专题与审核</h3>__EDITORIAL__<p class="meta">专题用event_ids数组引用多个活动；review.parent按subject_type指活动或专题，round区分提交轮次。</p></article><details class="panel"><summary>关键关系字段、数量含义与源码依据</summary>__RELATION_TABLE__<p>这些是源码表达的关系形态，不是数据库保证的记录数量；可选字段、历史数据与重复记录需按具体函数约束理解。</p>__EVIDENCE__</details></section><section id="models"><h2>完整模型目录 · 36类</h2><p class="meta">24类业务JSON记录 + 2个系统表 + 10个运行支撑对象。关键字段先显示，完整字段与技术信息折叠；共462字段条目，含各类共同外层字段。</p><div class="toolbar"><input id="search" type="search" aria-label="搜索模型" placeholder="搜索模型、字段、接口或需求ID"><select id="kind" aria-label="模型类别"><option value="">全部模型</option><option value="community706_json_record">业务JSON记录</option><option value="system_tenant_sql_entity">系统应用表</option><option value="runtime_sql_support">运行支撑表</option></select></div><p id="count" class="meta"></p>__CARDS__</section><footer class="panel"><a href="storage.html">下一步：字段、前端读写、接口与差异 →</a><p class="meta">模型目录来源：<a href="../docs/data-integration/storage-catalog.json">storage-catalog.json</a>；需求关联来源：storage-frontend-map.json。<a href="../docs/data-integration/README.md">产物说明与重新生成方式</a></p></footer></main><script>
const search=document.getElementById('search'),kind=document.getElementById('kind'),models=[...document.querySelectorAll('.model')];
function filter(){let count=0;const q=search.value.toLowerCase().trim();models.forEach(m=>{const ok=(!q||m.dataset.search.includes(q))&&(!kind.value||m.dataset.kind===kind.value);m.hidden=!ok;if(ok)count++});document.getElementById('count').textContent=count+' / '+models.length+' 类模型'}
search.addEventListener('input',filter);kind.addEventListener('change',filter);filter();
function reveal(){const target=document.getElementById(decodeURIComponent(location.hash.slice(1)));if(target?.classList.contains('model')){search.value='';kind.value='';filter();target.open=true;target.scrollIntoView({block:'start'})}}window.addEventListener('hashchange',reveal);reveal();
</script></body></html>'''
relations = [
 ('profile.owner','$users.id','单值；函数按owner取首条，非SQL唯一1:1',30),
 ('event.owner','$users.id','每活动一个发起账户；账户可有多个活动',191),
 ('event.data.space_id / organization_id','entity.id','各0..1个；空间/组织可有多个活动',196),
 ('registration.parent / owner','event.id / $users.id','每报名一个活动和账户；两端可有多条报名',215),
 ('comment.parent / data.reply_to','event.id / comment.id','一个活动；可选一个同活动回复目标',187),
 ('campaign.data.event_ids[]','event.id[]','专题多个活动；活动可属于多个专题',200),
 ('review.parent','event.id或campaign.id','每审核一个主体；主体按scope/round有多条审核',196),
 ('review.data.entity_id / event_id','entity.id / event.id','按审核scope可选单值，不是主体parent替代',203),
]
table='<div class="relationships"><table><thead><tr><th>关系字段</th><th>指向</th><th>数量与约束</th></tr></thead><tbody>'+''.join(f'<tr><td><code>{E(a)}</code></td><td>{E(b)}</td><td>{E(c)}</td></tr>' for a,b,c,line in relations)+'</tbody></table></div>'
ev=evidence([{'file':'apps/community706/functions/community.ts','line':line,'detail':a} for a,b,c,line in relations])
cards=''.join(card(e).replace('data-search=',f'data-kind="{E(e["storageKind"])}" data-search=') for e in ordered)
for key,value in {'PHYSICAL':physical,'IDENTITY':identity,'ACTIVITY':activity,'EDITORIAL':editorial,'RELATION_TABLE':table,'EVIDENCE':ev,'CARDS':cards}.items():page=page.replace('__'+key+'__',value)
for name in ['index.html','model.html']:(OUT/name).write_text(page)
print('Rendered model.html and default index.html: 36 models; physical layer and 3 relationship diagrams.')
