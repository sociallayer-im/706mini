// Local state machine. No request/socket/login/payment/upload APIs are used here.
const fixtures=require('./seed');
const KEY='706.mock.v1';
const clone=x=>JSON.parse(JSON.stringify(x));
const fail=code=>{throw Object.assign(new Error(code),{code});};
const now=()=>new Date().toISOString();
let db;
function state(){if(!db){db=wx.getStorageSync(KEY);if(!db||db.version!==1){db=fixtures.seed();persist();}}return db;}
function persist(){wx.setStorageSync(KEY,db);}
function rows(type){return state().rows.filter(r=>r.type===type);}
function get(id,type){return state().rows.find(r=>r.id===id&&(!type||r.type===type))||fail('NOT_FOUND');}
function user(){return state().persona||fail('LOGIN_REQUIRED');}
function session(){return state().persona?{id:state().persona,demo:true}:null;}
function profile(id=state().persona){return rows('profile').find(r=>r.owner===id);}
function pub(p){if(!p||p.status!=='ACTIVE'||p.visibility!=='PUBLIC')return null;const {id,owner,display_name,avatar_url,bio,introduction,city,interests,public_links}=p;return {id,owner,display_name,avatar_url,bio,introduction,city,interests,public_links};}
function roles(id=state().persona){return rows('role').filter(r=>r.owner===id&&r.status==='ACTIVE');}
function platform(){return roles().some(r=>r.scope==='PLATFORM');}
function manages(id,owner=false){return roles().some(r=>r.scope==='PLATFORM'||r.parent===id&&(!owner||r.role==='OWNER'));}
function editable(e){return !!session()&&(e.owner===user()||platform()||e.organization_id&&manages(e.organization_id));}
function publicEvent(e){return e.status==='PUBLISHED'&&!['MEMBERS','UNLISTED'].includes(e.visibility);}
function visible(e){if(!publicEvent(e)&&!editable(e))fail('FORBIDDEN');}
function allowed(r){return r.scope==='PLATFORM'?platform():r.scope==='INITIATOR'?r.owner===state().persona:manages(r.entity_id);}
function checkVersion(r,v){if(r.version!==v)fail('VERSION_CONFLICT');}
function save(r,changes){Object.assign(r,changes,{version:r.version+1,updated_at:now()});return r;}
function put(type,data){const r={id:'demo-local-'+(++state().serial),type,owner:user(),parent:'',status:'ACTIVE',version:1,created_at:now(),updated_at:now(),...data};state().rows.push(r);return r;}
function notice(owner,key,target,category='EVENT'){return put('notification',{owner,key,target,category,status:'UNREAD'});}
const inactive=['CANCELLED','REJECTED','EXPIRED','REFUNDED'];
function regs(e){return rows('registration').filter(r=>r.parent===e.id);}
function occupied(e){return regs(e).filter(r=>r.status==='CONFIRMED'||r.status==='APPROVED_AWAITING_PAYMENT'&&r.payment_expires_at>now()).length;}
function card(e){const mine=regs(e).filter(r=>r.owner===state().persona).reverse();return {...e,type:'event',registered:regs(e).filter(r=>r.status==='CONFIRMED').length,remaining:e.capacity==null?null:Math.max(0,e.capacity-occupied(e)),registration:mine.find(r=>!inactive.includes(r.status))||mine[0]||null};}
function page(items,p={}){const start=p.cursor?items.findIndex(x=>x.id===p.cursor)+1:0;if(p.cursor&&!start)fail('CURSOR_INVALID');return {items:items.slice(start,start+30),total:items.length,has_more:start+30<items.length,next_cursor:start+30<items.length?items[start+29].id:null};}
function events(p={}){return rows('event').filter(publicEvent).filter(e=>(!p.city||e.city===p.city)&&(!p.from||e.starts_at>=p.from)&&(!p.to||e.starts_at<p.to)&&(!p.space_id||e.space_id===p.space_id)&&(!p.tag||e.tags.includes(p.tag))&&(!p.free_only||e.price_minor===0)&&(!p.q||[e.title,e.summary,e.host_display,e.venue_display].join(' ').toLowerCase().includes(p.q.toLowerCase()))).sort((a,b)=>a.starts_at.localeCompare(b.starts_at)||a.id.localeCompare(b.id)).map(card).filter(e=>!p.has_capacity||e.remaining===null||e.remaining>0);}
function comments(id){return rows('comment').filter(r=>r.parent===id&&r.status==='ACTIVE').map(r=>({...r,author:pub(profile(r.owner))}));}
function follows(owner,parent){return rows('follow').some(r=>r.owner===owner&&r.parent===parent&&r.status==='ACTIVE');}
function reason(id){const me=state().persona;if(!me)return 'SAME_CITY';if(follows(id,me))return 'FOLLOWS_YOU';const mine=rows('registration').filter(r=>r.owner===me&&r.status==='CONFIRMED').map(r=>r.parent);if(rows('registration').some(r=>r.owner===id&&r.status==='CONFIRMED'&&mine.includes(r.parent)&&profile(id)?.share_activity))return 'COMMON_EVENT';if(rows('entity').some(e=>e.kind==='SPACE'&&follows(me,e.id)&&follows(id,e.id)))return 'COMMON_SPACE';if(rows('recommendation').some(r=>r.owner===id&&r.status==='ACTIVE'&&rows('recommendation').some(x=>x.owner===me&&x.parent===r.parent&&x.status==='ACTIVE')))return 'COMMON_RECOMMENDATION';return 'SAME_CITY';}
function read(op,p={}){
 if(op==='config')return {cities:fixtures.cities,privacy_version:'706-2026-10-08',capabilities:{wechat_login:false,payment:false},demo:true};
 if(state().scenario==='error')fail('DEMO_NETWORK');
 if(state().scenario==='permission'&&op!=='me')fail('FORBIDDEN');
 if(state().scenario==='empty'&&['events','calendar','campaigns','entities','people','search','feed','notifications','relations','mine','managed','reviews','attendees','admins','invitations'].includes(op))return page([]);
 switch(op){
 case 'events':return page(events(p),p);
 case 'calendar':return {items:events(p),generated_at:now()};
 case 'event':{const e=get(p.id,'event');visible(e);return {...card(e),initiator:pub(profile(e.owner)),can_edit:editable(e),can_register:publicEvent(e)&&e.starts_at>now(),campaigns:rows('campaign').filter(c=>publicEvent(c)&&c.event_ids.includes(e.id)),comments:comments(e.id),recommended:rows('recommendation').some(r=>r.owner===state().persona&&r.parent===e.id&&r.status==='ACTIVE')};}
 case 'campaigns':return page(rows('campaign').filter(publicEvent),p);
 case 'campaign':{const c=get(p.id,'campaign');visible(c);return {...c,can_edit:editable(c),items:c.event_ids.map(id=>get(id,'event')).filter(publicEvent).map(card)};}
 case 'entities':return page(rows('entity').filter(e=>e.status==='ACTIVE'&&(!p.kind||e.kind===p.kind)&&(!p.city||e.city===p.city)),p);
 case 'entity':{const e=get(p.id,'entity');return {...e,following:follows(state().persona,e.id),can_manage:manages(e.id),can_admin:manages(e.id,true),items:events().filter(x=>x.space_id===e.id||x.organization_id===e.id),members:rows('role').filter(r=>r.parent===e.id&&r.status==='ACTIVE').map(r=>pub(profile(r.owner))).filter(Boolean)};}
 case 'member':{const r=pub(profile(p.id));if(!r)fail('NOT_FOUND');return {...r,following:follows(state().persona,p.id),items:events().filter(e=>e.owner===p.id)};}
 case 'people':{let pool=rows('profile').filter(r=>pub(r)&&r.owner!==state().persona&&(!p.city||r.city===p.city));const next=pool.filter(r=>!(p.exclude||[]).includes(r.owner));if(next.length)pool=next;return page(pool.map(r=>({...pub(r),reason:reason(r.owner)})),p);}
 case 'search':{const q=String(p.q||'').toLowerCase();return {items:[...events({q}),...rows('entity').filter(e=>e.name.toLowerCase().includes(q)).map(e=>({...e,route:e.kind==='SPACE'?'space':'org'})),...rows('profile').filter(r=>pub(r)&&r.display_name.toLowerCase().includes(q)).map(r=>({...pub(r),id:r.owner,route:'member'}))].sort((a,b)=>Number(b.city===p.city)-Number(a.city===p.city))};}
 case 'feed':{const muted=rows('mute').filter(r=>r.owner===state().persona&&r.status==='ACTIVE').map(r=>r.parent);const items=rows('recommendation').filter(r=>r.status==='ACTIVE'&&!muted.includes(r.owner)).map(r=>({...r,author:pub(profile(r.owner)),event:card(get(r.parent,'event'))})).filter(r=>publicEvent(r.event)&&(!p.city||r.event.city===p.city));for(const e of events(p)){const actors=regs(e).filter(r=>r.status==='CONFIRMED'&&profile(r.owner)?.share_activity&&!muted.includes(r.owner)).map(r=>pub(profile(r.owner))).filter(Boolean);if(actors.length)items.push({id:'attendance-'+e.id,type:'registrationRollup',key:'REGISTRATION_ROLLUP',author:actors[0],count:actors.length,actors,event:e,created_at:e.updated_at});}return page(items.sort((a,b)=>b.created_at.localeCompare(a.created_at)),p);}
 case 'comments':visible(get(p.id,'event'));return page(comments(p.id),p);
 case 'calendarShare':return {params:get(p.id,'calendarShare').params};
 }
 const me=user();
 switch(op){
 case 'me':return {profile:profile(),roles:roles(),following:rows('follow').filter(r=>r.owner===me&&r.status==='ACTIVE').length,followers:rows('follow').filter(r=>r.parent===me&&r.status==='ACTIVE').length,unread:rows('notification').filter(r=>r.owner===me&&r.status==='UNREAD').length};
 case 'selfContact':return {wechat:rows('contact').find(r=>r.owner===me)?.wechat||''};
 case 'registrationContact':{const r=get(p.id,'registration'),e=get(r.parent,'event');if(!editable(e)||!r.contact_share_consent||!['REQUESTED','APPROVED_AWAITING_PAYMENT','CONFIRMED'].includes(r.status)||!publicEvent(e))fail('ACCESS_NOT_GRANTED');return {wechat:rows('contact').find(c=>c.owner===r.owner)?.wechat||''};}
 case 'notifications':return page(rows('notification').filter(r=>r.owner===me&&(!p.category||r.category===p.category)).reverse(),p);
 case 'relations':{const rr=rows('follow').filter(r=>r.status==='ACTIVE'&&(p.mode==='followers'?r.parent===(p.id||me):r.owner===(p.id||me)));return page(rr.map(r=>{const id=p.mode==='followers'?r.owner:r.parent,pr=profile(id);if(pr)return pub(pr)?{...pub(pr),id,route:'member'}:null;const e=get(id,'entity');return {...e,route:e.kind==='SPACE'?'space':'org'};}).filter(Boolean),p);}
 case 'mine':return page(rows(p.kind||'event').filter(r=>r.owner===me&&(!p.status||r.status===p.status)).map(r=>r.type==='registration'?{...r,event:card(get(r.parent,'event'))}:r),p);
 case 'draft':{const e=get(p.id,p.kind==='campaign'?'campaign':'event');if(!editable(e))fail('FORBIDDEN');return {...e,access:rows('eventSecret').find(s=>s.parent===e.id)?.access};}
 case 'managed':return {items:rows('entity').filter(e=>manages(e.id))};
 case 'reviews':return page(rows('review').filter(r=>r.status==='PENDING'&&allowed(r)),p);
 case 'review':{const r=get(p.id,'review');if(!allowed(r))fail('FORBIDDEN');return {...r,subject:get(r.parent)};}
 case 'progress':{const e=get(p.id);if(!editable(e))fail('FORBIDDEN');return {subject:e,items:rows('review').filter(r=>r.parent===e.id)};}
 case 'registration':{const r=get(p.id,'registration'),e=get(r.parent,'event');if(r.owner!==me&&!editable(e))fail('FORBIDDEN');return {...r,event:card(e),can_manage:editable(e)};}
 case 'attendees':{const e=get(p.id,'event');if(!editable(e))fail('FORBIDDEN');return {items:regs(e).map(r=>({...r,can_read_contact:r.contact_share_consent&&['REQUESTED','APPROVED_AWAITING_PAYMENT','CONFIRMED'].includes(r.status)&&publicEvent(e)}))};}
 case 'admins':if(!manages(p.id,true))fail('FORBIDDEN');return {items:rows('role').filter(r=>r.parent===p.id)};
 case 'invitations':return {items:rows('invitation').filter(r=>r.owner===me&&r.status==='PENDING')};
 default:fail('UNKNOWN_OPERATION');
 }
}
function validateEvent(e){if(!String(e.title||'').trim()||!String(e.description||'').trim()||!fixtures.cities.some(c=>c.id===e.city)||!Number.isFinite(Date.parse(e.starts_at))||!Number.isFinite(Date.parse(e.ends_at))||e.starts_at<=now()||e.ends_at<=e.starts_at)fail('EVENT_INVALID');if(e.capacity!==null&&(!Number.isInteger(e.capacity)||e.capacity<1))fail('CAPACITY_INVALID');if(!Number.isInteger(e.price_minor)||e.price_minor<0)fail('PRICE_INVALID');if(e.organization_id&&!roles(e.owner).some(r=>r.scope==='PLATFORM'||r.parent===e.organization_id))fail('FORBIDDEN');if(e.space_id)e.venue_display=get(e.space_id,'entity').name;else if(!e.venue_name||!e.address)fail('VENUE_INVALID');else e.venue_display=e.venue_name;e.host_display=profile(e.owner).display_name;}
function next(e,r){if(e.capacity!==null&&occupied(e)>=e.capacity)return save(r,{status:'WAITLISTED'});return save(r,{status:e.price_minor>0?'APPROVED_AWAITING_PAYMENT':'CONFIRMED',approval_status:'APPROVED',payment_expires_at:e.price_minor>0?new Date(Date.now()+900000).toISOString():null});}
function promote(e){for(const r of regs(e).filter(r=>r.status==='WAITLISTED')){if(e.capacity!==null&&occupied(e)>=e.capacity)break;const n=e.approval_required&&r.approval_status!=='APPROVED'?save(r,{status:'REQUESTED'}):next(e,r);notice(r.owner,n.status,{route:'event-access',id:r.id});}}
function write(op,p={}){
 const me=user();if(state().scenario==='error')fail('DEMO_NETWORK');if(state().scenario==='permission')fail('FORBIDDEN');
 switch(op){
 case 'profile':{let r=profile();if(p.display_name!==undefined&&!String(p.display_name).trim())fail('NAME_REQUIRED');if(p.interests&&(!Array.isArray(p.interests)||p.interests.length<2||p.interests.length>5))fail('INTERESTS_INVALID');if(p.complete&&!p.privacy_consent)fail('CONSENT_REQUIRED');const allowed=['display_name','avatar_url','city','bio','interests','introduction','public_links','locale','notification_preferences','visibility','share_activity'];const values={};allowed.forEach(k=>{if(p[k]!==undefined)values[k]=p[k];});r=save(r,{...values,...(p.complete?{onboarded:true}:{})});if(p.wechat!==undefined){const c=rows('contact').find(r=>r.owner===me);c?save(c,{wechat:p.wechat}):put('contact',{wechat:p.wechat});}for(const id of p.follow_spaces||[])write('follow',{id,enabled:true});return r;}
 case 'follow':{if(p.id===me)fail('CANNOT_FOLLOW_SELF');if(!profile(p.id))get(p.id,'entity');const r=rows('follow').find(r=>r.owner===me&&r.parent===p.id);return r?save(r,{status:p.enabled?'ACTIVE':'INACTIVE'}):put('follow',{parent:p.id,status:p.enabled?'ACTIVE':'INACTIVE'});}
 case 'mute':return put('mute',{parent:p.id});
 case 'report':if(!String(p.reason||'').trim())fail('REASON_REQUIRED');return put('report',{parent:p.id||'',reason:p.reason,status:'OPEN'});
 case 'recommend':{visible(get(p.id,'event'));const r=rows('recommendation').find(r=>r.owner===me&&r.parent===p.id);const v={text:p.text||r?.text||'',status:p.enabled===false?'INACTIVE':'ACTIVE'};return r?save(r,v):put('recommendation',{parent:p.id,...v});}
 case 'comment':{const e=get(p.id,'event');visible(e);if(!String(p.text||'').trim())fail('TEXT_REQUIRED');if(p.reply_to&&get(p.reply_to,'comment').parent!==p.id)fail('NOT_FOUND');const r=put('comment',{parent:p.id,text:p.text,reply_to:p.reply_to||null});notice(e.owner,'COMMENTED',{route:'event',id:e.id},'SOCIAL');return r;}
 case 'deleteComment':{const r=get(p.id,'comment');if(r.owner!==me&&!platform())fail('FORBIDDEN');return save(r,{status:'DELETED',text:''});}
 case 'read':rows('notification').filter(r=>r.owner===me&&(!p.id||r.id===p.id)).forEach(r=>save(r,{status:'READ'}));return {ok:true};
 case 'saveEvent':case 'saveCampaign':{const kind=op==='saveEvent'?'event':'campaign';let r=p.id?get(p.id,kind):null;if(r){if(!editable(r))fail('FORBIDDEN');checkVersion(r,p.version);if(!['DRAFT','CHANGES_REQUESTED'].includes(r.status))fail('STATUS_CONFLICT');}const fields=kind==='event'?['title','summary','description','city','organization_id','space_id','venue_name','address','starts_at','ends_at','capacity','price_minor','approval_required','waitlist_enabled','tags','fit_description','cover_url']:['title','kicker','introduction','cover_url','organization_id','event_ids','resource_links'];const values={visibility:'PUBLIC',status:'DRAFT'};fields.forEach(k=>{if(p[k]!==undefined)values[k]=p[k];});r=r?save(r,values):put(kind,values);if(p.access){const s=rows('eventSecret').find(x=>x.parent===r.id);s?save(s,{access:p.access}):put('eventSecret',{parent:r.id,access:p.access});}return r;}
 case 'clone':{const e=get(p.id,'event');visible(e);return put('event',{title:e.title,summary:e.summary,description:e.description,tags:e.tags,cover_url:e.cover_url,visibility:'PUBLIC',status:'DRAFT',capacity:null,price_minor:0});}
 case 'submitEvent':case 'submitCampaign':{const e=get(p.id,op==='submitEvent'?'event':'campaign');if(!editable(e))fail('FORBIDDEN');checkVersion(e,p.version);if(!['DRAFT','CHANGES_REQUESTED'].includes(e.status))fail('STATUS_CONFLICT');if(e.type==='event')validateEvent(e);else{if(!e.title||!e.introduction||!e.event_ids?.length)fail('CAMPAIGN_INVALID');e.event_ids.forEach(id=>{if(!['PUBLISHED','IN_REVIEW'].includes(get(id,'event').status))fail('EVENT_INVALID');});if(e.organization_id&&!manages(e.organization_id))fail('FORBIDDEN');}
 const round=(e.round||0)+1;const checks=[{scope:'PLATFORM'},...(e.organization_id?[{scope:'ORGANIZATION',entity_id:e.organization_id}]:[]),...(e.type==='event'&&e.space_id?[{scope:'SPACE',entity_id:e.space_id}]:[]),...(e.type==='campaign'?e.event_ids.map(id=>({scope:'INITIATOR',owner:get(id).owner,event_id:id})):[])];checks.forEach(r=>put('review',{parent:e.id,owner:e.owner,title:e.title,subject_type:e.type,status:'PENDING',round,snapshot:clone(e),...r}));return save(e,{status:'IN_REVIEW',round});}
 case 'review':{const r=get(p.id,'review');if(!allowed(r))fail('FORBIDDEN');checkVersion(r,p.version);const e=get(r.parent);if(r.status!=='PENDING'||e.status!=='IN_REVIEW'||r.round!==e.round)fail('STATUS_CONFLICT');if(!p.approve&&!p.note)fail('REASON_REQUIRED');save(r,{status:p.approve?'APPROVED':'CHANGES_REQUESTED',note:p.note||'',decided_by:me});if(!p.approve&&r.scope==='INITIATOR')save(e,{event_ids:e.event_ids.filter(id=>id!==r.event_id)});else if(!p.approve)save(e,{status:'CHANGES_REQUESTED'});const all=rows('review').filter(x=>x.parent===e.id&&x.round===e.round);if(e.status==='IN_REVIEW'&&all.every(x=>x.status==='APPROVED'||x.scope==='INITIATOR'&&x.status==='CHANGES_REQUESTED')){if(e.type==='event')validateEvent(e);save(e,{status:e.type==='campaign'&&!e.event_ids.length?'CHANGES_REQUESTED':'PUBLISHED'});}notice(e.owner,e.status==='PUBLISHED'?'REVIEW_APPROVED':e.status,{route:e.type==='campaign'?'campaign-review-progress':'approval-progress',id:e.id});return {ok:true};}
 case 'register':{const e=get(p.id,'event');if(!publicEvent(e)||e.starts_at<=now())fail('REGISTRATION_CLOSED');if(!p.display_name||!p.privacy_consent)fail('CONSENT_REQUIRED');const old=regs(e).find(r=>r.owner===me&&!inactive.includes(r.status));if(old)return old;const full=e.capacity!==null&&occupied(e)>=e.capacity;if(full&&!e.waitlist_enabled)fail('CAPACITY_FULL');let r=put('registration',{parent:e.id,display_name:p.display_name,motivation:p.motivation||'',status:full?'WAITLISTED':e.approval_required?'REQUESTED':'PENDING',approval_status:e.approval_required?'PENDING':'APPROVED',contact_share_consent:p.contact_share_consent===true,consent_version:'706-2026-10-08'});if(r.status==='PENDING')r=next(e,r);notice(e.owner,'REGISTRATION_REQUESTED',{route:'attendees',id:e.id},'ADMIN');return r;}
 case 'registrationDecision':{const r=get(p.id,'registration'),e=get(r.parent,'event');if(!editable(e))fail('FORBIDDEN');checkVersion(r,p.version);if(r.status!=='REQUESTED')fail('STATUS_CONFLICT');const result=p.approve?next(e,save(r,{approval_status:'APPROVED'})):save(r,{status:'REJECTED'});notice(r.owner,result.status,{route:'event-access',id:r.id});return result;}
 case 'cancelRegistration':{const r=get(p.id,'registration'),e=get(r.parent,'event');if(r.owner!==me)fail('FORBIDDEN');if(r.status==='CONFIRMED'&&e.price_minor>0)fail('REFUND_POLICY_REQUIRED');save(r,{status:'CANCELLED'});promote(e);return {ok:true};}
 case 'registrationContact':return read('registrationContact',p);
 case 'access':{const r=get(p.id,'registration'),e=get(r.parent,'event');if(r.owner!==me&&!editable(e))fail('FORBIDDEN');if(r.status!=='CONFIRMED'||!publicEvent(e))fail('ACCESS_NOT_GRANTED');const s=rows('eventSecret').find(s=>s.parent===e.id);if(s?.access.expires_at&&s.access.expires_at<now())fail('ACCESS_EXPIRED');return s?.access||{type:'ORGANIZER_WILL_CONTACT',value:'演示发起人将在活动前联系你；不会发送消息。'};}
 case 'cancelEvent':{const e=get(p.id,'event');if(!editable(e))fail('FORBIDDEN');checkVersion(e,p.version);if(e.price_minor>0&&regs(e).some(r=>r.status==='CONFIRMED'))fail('REFUND_POLICY_REQUIRED');save(e,{status:'CANCELLED'});regs(e).forEach(r=>{save(r,{status:'CANCELLED'});notice(r.owner,'EVENT_CANCELLED',{route:'event-access',id:r.id});});return {ok:true};}
 case 'entity':{const r=get(p.id,'entity');if(!manages(r.id))fail('FORBIDDEN');checkVersion(r,p.version);const values={};['name','introduction','cover_url','avatar_url','address','opening_hours','public_contact','public_links'].forEach(k=>{if(p[k]!==undefined)values[k]=p[k];});return save(r,values);}
 case 'invite':if(!manages(p.id,true))fail('FORBIDDEN');if(!profile(p.user_id))fail('NOT_FOUND');notice(p.user_id,'ROLE_INVITED',{route:'invitations'},'ADMIN');return put('invitation',{parent:p.id,owner:p.user_id,inviter:me,status:'PENDING',role:'ADMIN'});
 case 'acceptInvite':{const r=get(p.id,'invitation');if(r.owner!==me||r.status!=='PENDING')fail('FORBIDDEN');if(!roles(r.inviter).some(x=>x.scope==='PLATFORM'||x.parent===r.parent&&x.role==='OWNER'))fail('INVITATION_REVOKED');const old=rows('role').find(x=>x.owner===me&&x.parent===r.parent);if(old?.role==='OWNER')fail('STATUS_CONFLICT');old?save(old,{status:'ACTIVE',role:'ADMIN'}):put('role',{parent:r.parent,scope:'ENTITY',role:'ADMIN'});return save(r,{status:'ACCEPTED'});}
 case 'revokeRole':{const r=get(p.id,'role');if(!manages(r.parent,true)||r.role==='OWNER'||r.scope==='PLATFORM')fail('FORBIDDEN');rows('role').filter(x=>x.owner===r.owner&&x.parent===r.parent).forEach(x=>save(x,{status:'REVOKED'}));rows('invitation').filter(x=>x.owner===r.owner&&x.parent===r.parent&&x.status==='PENDING').forEach(x=>save(x,{status:'REVOKED'}));return {ok:true};}
 default:fail('UNKNOWN_OPERATION');
 }
}
function expire(){for(const r of rows('registration'))if(r.status==='APPROVED_AWAITING_PAYMENT'&&r.payment_expires_at<=now()){save(r,{status:'EXPIRED'});promote(get(r.parent,'event'));}}
async function call(name,args={}){
 state();if(db.scenario==='loading')await new Promise(resolve=>setTimeout(resolve,1200));const before=clone(db);try{expire();let result;
 if(name==='read')result=read(args.op,args.params);
 else if(name==='write'){const key=user()+':'+args.key,input=JSON.stringify([args.op,args.params]);const prior=db.commands[key];if(!['access','registrationContact'].includes(args.op)&&prior){if(prior.input!==input)fail('IDEMPOTENCY_CONFLICT');return clone(prior.result);}result=write(args.op,args.params);if(!['access','registrationContact'].includes(args.op))db.commands[key]={input,result:clone(result)};}
 else if(name==='payment'){const r=get(args.id,'registration');if(r.owner!==user())fail('FORBIDDEN');if(r.status!=='APPROVED_AWAITING_PAYMENT'||r.payment_expires_at<=now())fail('STATUS_CONFLICT');result=save(r,{status:'CONFIRMED',demo_payment:true});notice(r.owner,'CONFIRMED',{route:'event-access',id:r.id});}
 else if(name==='wechatLogin'){db.persona='demo-member';result={user:session()};}
 else if(name==='calendarCode'){result={demo:true,items:events(args.params),code:null};}
 else if(name==='mediaPreview'){const r=get(args.id,'media');if(args.registration){const registration=get(args.registration,'registration');if(registration.owner!==user()&&!editable(get(registration.parent)))fail('FORBIDDEN');const access=write('access',{id:registration.id});if(access.value!=='706-media:'+r.id)fail('FORBIDDEN');}else if(r.owner!==user()&&!platform())fail('FORBIDDEN');result={url:r.url};}
 else fail('UNKNOWN_OPERATION');persist();return clone(result);
 }catch(e){db=before;throw e;}
}
function configure(values){state();if(values.persona!==undefined&&!fixtures.personas.some(p=>p.id===values.persona))fail('NOT_FOUND');Object.assign(db,values);persist();}
function reset(){db=fixtures.seed();persist();}
async function login(mode,address,code){if(code){if(code!=='706000')fail('DEMO_CODE_INVALID');configure({persona:'demo-member'});}return {demo:true};}
function localMedia(path){const r=put('media',{url:path});persist();return {id:r.id,url:path,preview_url:path};}
module.exports={call,login,logout:async()=>configure({persona:''}),close(){},session,setSession(u){configure({persona:u?.id||''});},state:()=>clone(state()),configure,reset,personas:fixtures.personas,localMedia};
