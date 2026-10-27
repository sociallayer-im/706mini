// Public-only presentation snapshots. Draft access/contact and review notes never enter previews.
const eventKeys=['id','title','summary','description','fit_description','cover_url','status','starts_at','ends_at','capacity','registered','city','space_id','venue_name','venue_display','address','price_minor','host_display','organization_name'];
function media(items=[]){return items.filter(x=>x&&x.url).map(({type,url,label})=>({type,url,...(label?{label}:{})}));}
function event(record={}){return {...Object.fromEntries(eventKeys.filter(key=>record[key]!==undefined).map(key=>[key,record[key]])),tags:Array.isArray(record.tags)?record.tags.slice():[],media:media(record.media)};}
function campaign(form={},options=[],cities=[],locale='zh-CN'){
 const items=(form.event_ids||[]).map(id=>options.find(item=>item.id===id)).filter(Boolean).map(event),lang=locale==='en'?'en':'zh';
 const labels=[...new Set(items.map(item=>cities.find(city=>city.id===item.city)?.[lang]||item.city).filter(Boolean))];
 const images=media(form.media),cover=images.find(item=>item.type==='image')?.url||form.cover_url||'';
 return {id:form.id||'',title:form.title||'',kicker:form.kicker||'',introduction:form.introduction||'',cover_url:cover,media:images,status:'DRAFT',can_edit:false,cities:labels,citySummary:labels.join(' · '),meta:items.length+(locale==='en'?(items.length===1?' event':' events'):' 场活动')+(labels.length?' · '+labels.join(' · '):''),event_ids:items.map(item=>item.id),items};
}
module.exports={event,campaign};
