from pathlib import Path
import json, html
ROOT=Path(__file__).resolve().parent.parent
DOC=ROOT/'docs/data-integration'
def read(name): return json.loads((DOC/name).read_text())
def requests(r):
    q=r.get('request',{})
    return q if isinstance(q,list) else [q] if isinstance(q,dict) else []
def fn(x): return str(x.get('function','')).removeprefix('community:').removeprefix('HTTP ')
def s(v): return json.dumps(v,ensure_ascii=False) if isinstance(v,(list,dict)) else str(v or '')
front,back,gaps=read('frontend-inventory.json'),read('backend-inventory.json'),read('gap-findings.json')
endpoints=back['endpoints']; rows=[]
for r in front['requirements']:
    matches=[]
    for q in requests(r):
        for e in endpoints:
            if fn(q)==fn(e) and (fn(q) not in ['read','write'] or (q.get('op') or '')==(e.get('op') or '')): matches.append(e['id'])
            if fn(q)=='write' and q.get('op')=='operation dependent' and fn(e)=='write': matches.append(e['id'])
            if fn(q)=='read' and q.get('op')=='list dependent' and fn(e)=='read': matches.append(e['id'])
            if fn(q).startswith('socket:') and e['id']=='runtime.socket': matches.append(e['id'])
            if fn(q)=='PUT signed upload_url' and e['id']=='mediaUpload': matches.append(e['id'])
    partial={'FE-T-realtime':['runtime.socket'],'FE-G-featured-update':['read.member','write.profile'],'FE-G-entity-pagination':['read.entity','read.entities'],'FE-G-relations-membership':['read.member'],'FE-G-interest-config':['read.config'],'FE-G-pending-approvals':['read.reviews']}
    candidates=[eid for eid in partial.get(r['id'],[]) if any(e['id']==eid for e in endpoints)]
    terms=' '.join([s(r.get(k)) for k in ['business','pages','action','request','expectedFields','relations']]).lower()
    related=[g['id'] for g in gaps['gaps'] if any(str(k).lower() in terms for k in g.get('requirementKeywords',[]) if k)]
    local=all(fn(q) in ['local','native','wx'] for q in requests(r)) and bool(requests(r))
    rows.append({'requirementId':r['id'],'endpointIds':list(dict.fromkeys(matches or candidates)),'gapIds':related,'mappingStatus':'local' if local else 'code_match' if matches else 'partial_match' if candidates else 'unmapped','basis':'read/write function+op; action/runtime function; socket shared protocol; signed PUT relies on mediaUpload capability;  Gap keyword association is a discussion aid, not automatic contractual acceptance'})
summary={'pages':len(front.get('pages',[])),'requirements':len(rows),'backendOperations':len(endpoints),'codeMatchedRequirements':sum(x['mappingStatus']=='code_match' for x in rows),'partialMatchedRequirements':sum(x['mappingStatus']=='partial_match' for x in rows),'localRequirements':sum(x['mappingStatus']=='local' for x in rows),'unmappedRequirements':sum(x['mappingStatus']=='unmapped' for x in rows),'gaps':len(gaps['gaps']),'confirmedCodeGaps':sum(g.get('status')=='代码可确认' for g in gaps['gaps'])}
bundle={'generatedDate':'2026-10-10','issue':'SID-123','frontendCommit':'35fa1eb0ac81bbc06092fa185ba181caa48d533a','backendCommit':'d70d1db5e2b7ea9f0fba93ecbe426fe1f0acca8d','summary':summary,'frontend':front,'backend':back,'gapFindings':gaps,'mapping':rows,'boundaries':['讨论稿：代码匹配不等于线上可用或契约完整。','仅代码与已有证据；本轮无真实业务请求、测试、编译、GUI或部署。','Gap关联由关键字辅助，逐条确认范围；完整证据与接口字段见展开详情。']}
(DOC/'mapping.json').write_text(json.dumps(bundle,ensure_ascii=False,indent=2)+'\n')
data=json.dumps(bundle,ensure_ascii=False).replace('<','\\u003c').replace('&','\\u0026')
page=Path(__file__).with_name('template.html').read_text().replace('__DATA__',data)
Path(__file__).with_name('index.html').write_text(page)
print(json.dumps(summary,ensure_ascii=False))
