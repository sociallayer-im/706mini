const api=require('./api'),prefs=require('./preferences'),i18n=require('./i18n'),theme=require('./theme'),dates=require('./dates'),forms=require('./forms');
const tabs=['feed','discover','messages','me'];
function go(route,id='',extra={}){const query=Object.entries({...extra,...(id?{id}:{})}).map(([k,v])=>encodeURIComponent(k)+'='+encodeURIComponent(v)).join('&');const url='/pages/'+route+'/index'+(query?'?'+query:'');return tabs.includes(route)?wx.switchTab({url}):wx.navigateTo({url});}
const formKinds={publish:'event','campaign-create':'campaign','campaign-edit':'campaign','edit-profile':'profile',onboarding:'profile','edit-entity':'entity'};
function normalize(item,t,locale){const e=item.event||item;return {...item,activeRegistration:item.registration&&!['CANCELLED','REJECTED','EXPIRED','REFUNDED'].includes(item.registration.status),title:item.title||item.display_name||item.name||item.event?.title||t[item.key]||'',statusLabel:t[item.status]||item.status||'',dateLabel:dates.format(e.starts_at,locale),feeLabel:e.price_minor===0?t.free:e.price_minor!=null?'¥'+(e.price_minor/100).toFixed(2):'',route:item.route||(['event','campaign'].includes(item.type)?item.type:item.type==='registration'?'event-access':item.type==='review'?(item.subject_type==='campaign'?'campaign-approval-detail':'approval-detail'):item.type==='entity'?(item.kind==='SPACE'?'space':'org'):'member'),event:item.event?normalize(item.event,t,locale):null};}
module.exports=function createPage(route){return {
 data:{route,theme:theme.style(),t:{},loading:true,busy:false,error:'',items:[],people:[],campaigns:[],spaces:[],organizations:[],form:{},fields:[],step:1,formKind:formKinds[route]||'',sheet:'',sheetForm:{},filters:{},offset:0,calendarMode:'week',days:[],record:null,cityName:'',selectedDate:'',hasMore:false,nextCursor:null,consent:false,shareContact:false},
 onLoad(options){this.options=options||{};this.filters={};this.commandKeys={};this.refreshLanguage();const kind=formKinds[route];if(kind){const cached=wx.getStorageSync(this.draftKey());this.setData({form:cached||{city:prefs.get().city,price_minor:'',capacity:'',approval_required:false,waitlist_enabled:true,event_ids:[]},step:wx.getStorageSync(this.draftKey()+'.step')||1});this.updateFields();}},
 onShow(){this.setData({access:null,reviewCount:0,needsLogin:false,canRegister:false,contact:null});this.refreshLanguage();this.load();},
 onUnload(){clearTimeout(this.saveTimer);},
 onPullDownRefresh(){this.load().finally(()=>wx.stopPullDownRefresh());},
 onReachBottom(){if(this.data.hasMore&&!this.data.loading)this.load(true);},
 onShareAppMessage(){return {title:this.data.record?.title||'706',path:'/pages/'+route+'/index'+(this.options.id?'?id='+encodeURIComponent(this.options.id):'')};},
 refreshPeople(){this.run(async()=>{const r=await this.read('people',{city:this.data.city,exclude:this.data.people.map(x=>x.owner)});this.setData({people:r.items.slice(0,6)});});},
 refreshLanguage(){const p=prefs.get(),t=i18n.dictionary(p.locale);this.setData({t,locale:p.locale,city:p.city,title:t[route]||'706',demo:api.isMock(),mode:api.mode(),demoName:api.isMock()?api.mock.personas.find(x=>x.id===api.session()?.id)?.label||'游客':'',currentUser:api.session()?.id||'',cityName:this.config?.cities.find(c=>c.id===p.city)?.[p.locale==='en'?'en':'zh']||t.city});if(!tabs.includes(route))wx.setNavigationBarTitle({title:t[route]||'706',demo:api.isMock(),mode:api.mode(),demoName:api.isMock()?api.mock.personas.find(x=>x.id===api.session()?.id)?.label||'游客':'',currentUser:api.session()?.id||'',cityName:this.config?.cities.find(c=>c.id===p.city)?.[p.locale==='en'?'en':'zh']||t.city});tabs.forEach((r,index)=>wx.setTabBarItem({index,text:t[r]}));},
 draftKey(){return '706.draft.'+api.mode()+'.'+route+'.'+(this.options.id||'new')+'.'+(api.session()?.id||'anonymous');},
 read(op,params={}){return api.call('read',{op,params});},
 async write(op,params={}){const fingerprint=op+JSON.stringify(params);const key=this.commandKeys[fingerprint]||(this.commandKeys[fingerprint]='cmd-'+Date.now()+'-'+Math.random().toString(36).slice(2));const r=await api.call('write',{op,params,key});delete this.commandKeys[fingerprint];return r;},
 async load(append=false){
  append=append===true;
  if(this.data.loading&&this.loadingPromise)return this.loadingPromise;
  this.setData({loading:true,error:'',contact:null,access:null});
  this.loadingPromise=this.loadData(append).catch(e=>{const needsLogin=/LOGIN_REQUIRED|VERIFIED_LOGIN/.test(e.message||e.code||'');this.setData({error:i18n.message(e,this.data.t),needsLogin,...(needsLogin?{record:null,items:[],form:{},fields:[],me:null,managed:[],reviewCount:0,contact:null,access:null}: {})});}).finally(()=>{this.setData({loading:false});this.loadingPromise=null;});return this.loadingPromise;
 },
 async loadData(append){
  if(['login','privacy','feedback','more'].includes(route))return;if(route!=='review-lab')await prefs.sync();this.refreshLanguage();const t=this.data.t,p=prefs.get(),id=this.options.id;let result;
  if(route==='review-lab'){this.loadLab();return;}
  if(!this.config){this.config=await this.read('config');this.setData({cities:this.config.cities,cityName:this.config.cities.find(c=>c.id===p.city)?.[p.locale==='en'?'en':'zh']});}
  if(route==='calendar'&&this.options.scene&&!this.shareLoaded){const share=await this.read('calendarShare',{id:decodeURIComponent(this.options.scene)});this.filters=share.params;this.shareLoaded=true;const start=share.params.from;this.sharedRange={from:start,to:share.params.to};const month=Date.parse(share.params.to)-Date.parse(start)>7*86400000;const base=dates.range(month?'month':'week');const a=dates.localDate(new Date(start)).split('-').map(Number),b=dates.localDate(new Date(base.from)).split('-').map(Number);const offset=month?(a[0]-b[0])*12+a[1]-b[1]:Math.floor((Date.parse(start)-Date.parse(base.from))/604800000);this.setData({calendarMode:month?'month':'week',offset,selectedDate:Date.parse(share.params.to)-Date.parse(start)===86400000?dates.localDate(new Date(start)):'',city:share.params.city,cityName:this.config.cities.find(c=>c.id===share.params.city)?.[p.locale==='en'?'en':'zh']});}
  const params={...this.filters,city:this.filters.city||p.city,cursor:append?this.data.nextCursor:null};this.setData({city:params.city,cityName:this.config.cities.find(c=>c.id===params.city)?.[p.locale==='en'?'en':'zh']});
  if(route==='feed'){result=await this.read('feed',params);const people=await this.read('people',{city:p.city});this.setData({people:people.items.slice(0,6)});}
  else if(route==='discover'||route==='calendar'){
   let range=dates.range(this.data.calendarMode,this.data.offset,this.data.selectedDate);if(this.sharedRange){const days=[];for(let n=Date.parse(this.sharedRange.from);n<Date.parse(this.sharedRange.to);n+=86400000){const date=dates.localDate(new Date(n));days.push({date,label:Number(date.slice(-2))});}range={...this.sharedRange,days,label:days[0].date+' — '+days[days.length-1].date};}this.setData({rangeLabel:range.label});
   const all=await this.read('calendar',{...params,from:range.from,to:range.to});
   let days=range.days.map(d=>({...d,count:all.items.filter(e=>dates.localDate(new Date(e.starts_at))===d.date).length}));
   if(this.data.calendarMode==='month'){const weekday=(new Date(new Date(range.from).getTime()+8*3600000).getUTCDay()+6)%7;days=[...Array.from({length:weekday},(_,i)=>({date:'blank-'+i,label:'',disabled:true})),...days];}
   this.setData({days});const items=this.data.selectedDate?all.items.filter(e=>dates.localDate(new Date(e.starts_at))===this.data.selectedDate):all.items;
   result={items};if(route==='discover'){const c=await this.read('campaigns',params);this.setData({campaigns:c.items});}
   const s=await this.read('entities',{kind:'SPACE',city:params.city});this.setData({spaces:s.items});
  }
  else if(route==='event'){const r=await this.read('event',{id});this.setData({record:normalize(r,t,p.locale),comments:r.comments,items:[],canRegister:r.can_register});return;}
  else if(route==='campaign'){const r=await this.read('campaign',{id});this.setData({record:r});result={items:r.items};}
  else if(['member','space','org','entity-events','entity-members'].includes(route)){
   const r=await this.read(route==='member'?'member':'entity',{id});this.setData({record:r});result={items:route==='entity-members'?r.members.map(x=>({...x,id:x.owner,route:'member'})):r.items};
  }
  else if(route==='spaces')result=await this.read('entities',{...params,kind:'SPACE'});
  else if(route==='messages')result=await this.read('notifications',{category:this.data.category||'',cursor:params.cursor});
  else if(route==='me'){
   const r=await this.read('me');const e=await this.read('managed');this.setData({record:r.profile,me:r,managed:e.items});if(r.roles.length){const tasks=await this.read('reviews');this.setData({reviewCount:tasks.total});}return;
  }
  else if(['relations','following'].includes(route))result=await this.read('relations',{id:this.options.id,mode:this.options.mode,cursor:params.cursor});
  else if(['registrations','my-events','drafts','my-campaigns'].includes(route))result=await this.read('mine',{kind:route==='registrations'?'registration':route==='my-campaigns'?'campaign':'event',status:route==='drafts'?'DRAFT':undefined,cursor:params.cursor});
  else if(route==='approvals')result=await this.read('reviews',params);
  else if(['approval-detail','campaign-approval-detail'].includes(route)){const r=await this.read('review',{id});this.setData({record:r,subject:r.subject});return;}
  else if(['approval-progress','campaign-review-progress'].includes(route)){const r=await this.read('progress',{id});this.setData({record:r.subject});result={items:r.items};}
  else if(route==='event-access'){const r=await this.read('registration',{id});this.setData({record:normalize(r,t,p.locale)});return;}
  else if(route==='attendees')result=await this.read('attendees',{id});
  else if(route==='admins')result=await this.read('admins',{id});
  else if(route==='invitations')result=await this.read('invitations');
  else if(formKinds[route]){
   if(!api.session()){this.setData({needsLogin:true});throw Error('LOGIN_REQUIRED');}
   const kind=formKinds[route];let r=null;
   if(!this.formLoaded){if(kind==='profile'){r=(await this.read('me')).profile;const contact=await this.read('selfContact');r={...r,wechat:contact.wechat};}else if(kind==='entity')r=await this.read('entity',{id});else if(id)r=await this.read('draft',{id,kind});
    const cached=wx.getStorageSync(this.draftKey());this.setData({form:cached|| (r?forms.toForm(r):this.data.form),record:r});this.formLoaded=true;}
   const es=await this.read('managed');const spaces=await this.read('entities',{kind:'SPACE',city:p.city});
   this.setData({organizations:es.items.filter(e=>e.kind==='ORGANIZATION'),spaces:spaces.items});
   if(kind==='campaign'){const ev=await this.read('events',{});const mine=await this.read('mine',{kind:'event'});this.setData({eventOptions:[...new Map([...ev.items,...mine.items.filter(e=>e.status==='IN_REVIEW')].map(e=>[e.id,e])).values()]});}
   this.updateFields();await this.refreshMedia();return;
  }
  else if(route==='activity-preview'){const r=await this.read('draft',{id});this.setData({record:normalize(r,t,p.locale)});await this.refreshMedia();return;}
  else if(['more','privacy','feedback','login'].includes(route))return;
  if(result){const items=(result.items||[]).map(x=>normalize(x,t,p.locale));this.setData({items:append?[...this.data.items,...items.filter(x=>!this.data.items.some(i=>i.id===x.id))]:items,nextCursor:result.next_cursor||null,hasMore:!!result.has_more,total:result.total||items.length});}
 },
 navigate(e){const d=e.currentTarget.dataset;if(d.route==='space'&&!d.id)return;go(d.route,d.id||'',d.extra||{});},
 openItem(e){if(['attendees','admins','invitations','approval-progress','campaign-review-progress'].includes(route))return;const item=this.data.items[Number(e.currentTarget.dataset.index)];if(route==='messages'){this.run(async()=>{await this.write('read',{id:item.id});if(item.target?.route)go(item.target.route,item.target.id);});}else go(item.route,item.route==='member'?(item.owner||item.id):item.id);},
 openEvent(e){go('event',e.currentTarget.dataset.id);},
 async run(fn){if(this.data.busy)return;this.setData({busy:true,error:''});try{return await fn();}catch(e){this.setData({error:i18n.message(e,this.data.t),needsLogin:/LOGIN_REQUIRED|VERIFIED_LOGIN/.test(e.message||'')});}finally{this.setData({busy:false});}},
 login(){go('login');},
 chooseCity(){if(!this.config){this.run(async()=>{this.config=await this.read('config');this.chooseCity();});return;}wx.showActionSheet({itemList:this.config.cities.map(c=>c[this.data.locale==='en'?'en':'zh']),success:({tapIndex})=>{const c=this.config.cities[tapIndex];this.sharedRange=null;delete this.filters.city;prefs.set({city:c.id});if(api.session())this.run(()=>this.write('profile',{city:c.id}));this.setData({city:c.id,cityName:c[this.data.locale==='en'?'en':'zh']});this.load();}});},
 toggleLanguage(){prefs.set({locale:this.data.locale==='en'?'zh-CN':'en'});if(api.session())this.run(()=>this.write('profile',{locale:prefs.get().locale}));this.refreshLanguage();this.updateFields();this.load();},
 logout(){this.run(async()=>{await api.logout();wx.reLaunch({url:'/pages/feed/index'});});},
 searchInput(e){this.setData({query:e.detail.value});},
 search(){this.run(async()=>{if(!this.data.query)return this.load();const r=await this.read('search',{q:this.data.query,city:this.data.city});this.setData({items:r.items.map(x=>normalize(x,this.data.t,this.data.locale)),searching:true});});},
 filter(e){this.sharedRange=null;const {key,value}=e.currentTarget.dataset;if(key==='clearTags'){delete this.filters.tag;delete this.filters.free_only;delete this.filters.has_capacity;this.setData({filters:{...this.filters}});this.load();return;}if(key==='date'){this.setData({offset:value==='next'?1:0,selectedDate:'',calendarMode:'week',showWeek:value==='calendar'});}else{this.filters[key]=value;this.setData({filters:{...this.filters}});}this.load();},
 clearFilters(){this.sharedRange=null;this.filters={};this.setData({filters:{},selectedDate:'',offset:0,query:'',searching:false});this.load();},
 period(e){this.sharedRange=null;this.setData({offset:this.data.offset+Number(e.currentTarget.dataset.delta),selectedDate:''});this.load();},
 calendarMode(e){this.sharedRange=null;this.setData({calendarMode:e.currentTarget.dataset.mode,offset:0,selectedDate:''});this.load();},
 selectDay(e){this.sharedRange=null;const day=e.currentTarget.dataset.date;if(day.startsWith('blank-'))return;if(this.data.calendarMode==='month'){const base=dates.range('week');const offset=Math.floor((new Date(day+'T00:00:00+08:00')-new Date(base.from))/604800000);this.setData({calendarMode:'week',offset,selectedDate:day});}else this.setData({selectedDate:this.data.selectedDate===day?'':day});this.load();},
 category(e){this.setData({category:e.currentTarget.dataset.value});this.load();},
 markRead(){this.run(async()=>{await this.write('read');await this.load();});},
 follow(e){const d=e.currentTarget.dataset;this.run(async()=>{await this.write('follow',{id:d.id,enabled:d.enabled!==false});await this.load();});},
 sheet(e){this.setData({sheet:e.currentTarget.dataset.kind,sheetForm:route==='feedback'?this.data.sheetForm:e.currentTarget.dataset.reply?{reply_to:e.currentTarget.dataset.reply}:{},consent:false,shareContact:false});},
 closeSheet(){this.setData({sheet:''});},
 sheetInput(e){this.setData({['sheetForm.'+e.currentTarget.dataset.key]:e.detail.value});},
 consent(e){this.setData({consent:e.detail.value.length>0});},
 contactConsent(e){this.setData({shareContact:e.detail.value.length>0});},
 submitSheet(){this.run(async()=>{const kind=this.data.sheet;let result;
  if(kind==='register')result=await this.write('register',{id:this.options.id,...this.data.sheetForm,privacy_consent:this.data.consent,contact_share_consent:this.data.shareContact});
  else if(kind==='invite')result=await this.write('invite',{id:this.options.id,...this.data.sheetForm});
  else result=await this.write(kind,{id:this.options.id,...this.data.sheetForm});
  this.setData({sheet:''});if(kind==='report'){this.setData({sheetForm:{}});wx.showToast({title:this.data.t.saved,icon:'success'});}if(kind==='register')go('event-access',result.id);else await this.load();});},
 action(e){const {op,id,approve,version}=e.currentTarget.dataset;this.run(async()=>{const p={id:id||this.options.id,version:version||this.data.record?.version,...(approve===undefined?{}:{approve})};
  if(op==='review'&&!approve){if(!this.data.sheetForm.note){this.setData({error:this.data.t.REASON_REQUIRED});return;}p.note=this.data.sheetForm.note;}
  if(['cancelEvent','cancelRegistration','revokeRole'].includes(op)){const yes=await new Promise(resolve=>wx.showModal({title:this.data.t[op]||this.data.t.confirm,success:r=>resolve(r.confirm)}));if(!yes)return;}
  if(op==='payment'){if(api.isMock()){const choice=await new Promise(resolve=>wx.showModal({title:'模拟支付',content:'仅改变本地演示状态，不会扣款。',success:r=>resolve(r.confirm)}));if(choice){await api.call('payment',p);await this.load();}return;}const r=await api.call('payment',p);await new Promise((resolve,reject)=>wx.requestPayment({...r,success:resolve,fail:reject}));await this.load();return;}
  if(op==='registrationContact'){const contact=await this.write('registrationContact',p);this.setData({contact:contact.wechat||this.data.t.noContact});return;}
  if(op==='withdrawRecommendation'){await this.write('recommend',{id:p.id,enabled:false});await this.load();return;}
  const r=await this.write(op,p);
  if(op==='clone'){go('publish',r.id);return;}if(op==='access'){if(r?.type==='GROUP_QR'&&r.value?.startsWith('706-media:')){const asset=await api.call('mediaPreview',{id:r.value.slice(10),registration:p.id});r.value=asset.url;}this.setData({access:r});return;}
  await this.load();
 });},
 updateFields(){const kind=formKinds[route];if(!kind)return;const multi=['publish','campaign-create','campaign-edit','onboarding'].includes(route);this.setData({fields:forms.fields(kind,multi?this.data.step:0,this.data.t,this.data.form).map(f=>({...f,display:f.type==='space'?this.data.spaces.find(x=>x.id===f.value)?.name:f.type==='organization'?this.data.organizations.find(x=>x.id===f.value)?.name:f.type==='access'?this.data.t[f.value]:f.type==='city'?this.config?.cities.find(x=>x.id===f.value)?.[this.data.locale==='en'?'en':'zh']:f.value})),spaces:this.data.spaces.map(x=>({...x,selected:(this.data.form.follow_spaces||[]).includes(x.id)})),venueName:this.data.spaces.find(x=>x.id===this.data.form.space_id)?.name||this.data.form.venue_name,spaceNames:[this.data.t.choose,...this.data.spaces.map(x=>x.name)],organizationNames:[this.data.t.personal,...this.data.organizations.map(x=>x.name)],eventOptions:(this.data.eventOptions||[]).map(x=>({...x,selected:(this.data.form.event_ids||[]).includes(x.id)}))});},
 input(e){const k=e.currentTarget.dataset.key;this.setData({['form.'+k]:e.detail.value});this.persist();},
 switchInput(e){this.input(e);},
 select(e){const {key,type}=e.currentTarget.dataset;const v=Number(e.detail.value);let value;
  if(type==='city')value=this.config.cities[v].id;
  if(type==='space')value=v===0?'':this.data.spaces[v-1].id;
  if(type==='organization')value=v===0?'':this.data.organizations[v-1].id;
  if(type==='access')value=['GROUP_QR','ORGANIZER_WECHAT','ORGANIZER_WILL_CONTACT'][v];
  this.setData({['form.'+key]:value});this.updateFields();this.persist();
 },
 upload(e){const key=e.currentTarget.dataset.key;this.run(async()=>{const selected=await new Promise((resolve,reject)=>wx.chooseMedia({count:1,mediaType:['image'],success:resolve,fail:reject}));const file=selected.tempFiles[0];if(file.size>10*1024*1024)throw Error('MEDIA_INVALID');const path=file.tempFilePath;if(api.isMock()){const saved=await new Promise((resolve,reject)=>wx.getFileSystemManager().saveFile({tempFilePath:path,success:r=>resolve(r.savedFilePath),fail:reject}));const asset=api.mock.localMedia(saved);this.setData({['form.'+key]:key==='access_value'?'706-media:'+asset.id:asset.url,['mediaPreviews.'+key]:asset.url});this.updateFields();this.persist();return;}const ext=(path.split('.').pop()||'jpg').toLowerCase();const permit=await api.call('mediaUpload',{extension:ext,private:key==='access_value'});const data=await new Promise((resolve,reject)=>wx.getFileSystemManager().readFile({filePath:path,success:r=>resolve(r.data),fail:reject}));await new Promise((resolve,reject)=>wx.request({url:permit.upload_url,method:'PUT',data,header:{'content-type':ext==='png'?'image/png':ext==='webp'?'image/webp':'image/jpeg'},success:r=>r.statusCode<300?resolve(r):reject(Error('MEDIA_INVALID')),fail:reject}));const asset=await api.call('mediaFinish',{path:permit.path});this.setData({['form.'+key]:key==='access_value'?'706-media:'+asset.id:asset.url,['mediaPreviews.'+key]:asset.preview_url});this.updateFields();this.persist();});},
 dateInput(e){const key=e.currentTarget.dataset.key;const old=this.data.form[key]?dates.format(this.data.form[key]):dates.localDate()+' 12:00';const next=e.currentTarget.dataset.part==='date'?e.detail.value+' '+old.slice(11,16):old.slice(0,10)+' '+e.detail.value;this.setData({['form.'+key]:new Date(next.replace(' ','T')+':00+08:00').toISOString()});this.updateFields();this.persist();},
 spaceSelection(e){this.setData({'form.follow_spaces':e.detail.value});this.updateFields();this.persist();},
 preference(e){const kind=e.currentTarget.dataset.kind;this.run(async()=>{const me=await this.read('me');if(kind==='share_activity'){await this.write('profile',{share_activity:!me.profile?.share_activity});wx.showToast({title:this.data.t.saved});}else if(kind==='visibility'){const visibility=me.profile?.visibility==='PUBLIC'?'MEMBERS':'PUBLIC';await this.write('profile',{visibility});wx.showToast({title:this.data.t.saved});}else{const enabled=!me.profile?.notification_preferences?.enabled;await this.write('profile',{notification_preferences:{enabled}});wx.showToast({title:this.data.t.saved});}});},
 eventSelection(e){this.setData({'form.event_ids':e.detail.value});this.persist();},
 persist(){wx.setStorageSync(this.draftKey(),this.data.form);wx.setStorageSync(this.draftKey()+'.step',this.data.step);this.setData({draftSaved:true});},
 step(e){this.setData({step:Math.max(1,Math.min(3,this.data.step+Number(e.currentTarget.dataset.delta)))});this.updateFields();this.persist();},
 saveForm(e){const submit=e?.currentTarget?.dataset?.submit;this.run(async()=>{
  const kind=formKinds[route], p=forms.payload(kind,this.data.form);let op=kind==='event'?'saveEvent':kind==='campaign'?'saveCampaign':kind==='profile'?'profile':'entity';
  if(kind==='profile'&&route==='onboarding'){p.complete=!!submit;p.privacy_consent=this.data.consent;}
  if(kind==='entity')p.id=this.options.id;
  if(op==='registrationContact'){const contact=await this.write('registrationContact',p);this.setData({contact:contact.wechat||this.data.t.noContact});return;}
  if(op==='withdrawRecommendation'){await this.write('recommend',{id:p.id,enabled:false});await this.load();return;}
  const r=await this.write(op,p);this.setData({form:forms.toForm({...r,...(kind==='event'?{access:p.access}:{}),...(kind==='profile'?{wechat:p.wechat,follow_spaces:p.follow_spaces}:{})}),record:r});this.persist();
  if(submit&&(kind==='event'||kind==='campaign')){await this.write(kind==='event'?'submitEvent':'submitCampaign',{id:r.id,version:r.version});wx.removeStorageSync(this.draftKey());wx.removeStorageSync(this.draftKey()+'.step');go(kind==='event'?'approval-progress':'campaign-review-progress',r.id);}
  else if(kind==='profile'&&submit){wx.removeStorageSync(this.draftKey());wx.removeStorageSync(this.draftKey()+'.step');go('me');}
  else wx.showToast({title:this.data.t.saved,icon:'success'});
  this.updateFields();
 });},
 loginInput(e){this.setData({[e.currentTarget.dataset.key]:e.detail.value});},
 sendCode(){this.run(async()=>{await api.login(this.data.loginMode||'phone',this.data.address);this.setData({codeSent:true});if(api.isMock())wx.showToast({title:'演示验证码：706000',icon:'none'});});},
 verifyCode(){this.run(async()=>{if(!String(this.data.code||'').trim())throw Error('CODE_REQUIRED');await api.login(this.data.loginMode||'phone',this.data.address,this.data.code);const me=await this.read('me');prefs.fromProfile(me.profile);if(me.profile?.onboarded)go('me');else go('onboarding');});},
 loginMode(){this.setData({loginMode:this.data.loginMode==='email'?'phone':'email',codeSent:false});},
 wechatLogin(){this.run(async()=>{if(api.isMock()){await api.call('wechatLogin');go('me');return;}const r=await new Promise((resolve,reject)=>wx.login({success:resolve,fail:reject}));const login=await api.call('wechatLogin',{code:r.code});api.setSession(login.user);const me=await this.read('me');prefs.fromProfile(me.profile);go(me.profile?.onboarded?'me':'onboarding');});},
 copy(e){wx.setClipboardData({data:e.currentTarget.dataset.value});},
 async refreshMedia(){const values=this.data.formKind?this.data.form:this.data.record||{};const out={};for(const key of ['cover_url','avatar_url','access_value']){const value=values[key];if(!value)continue;const match=value.match(/(?:706-media:|\/community\/media\/)([^/?]+)$/);if(!match)continue;try{out[key]=(await api.call('mediaPreview',{id:match[1]})).url;}catch{out[key]=key==='access_value'?'':value;}}this.setData({mediaPreviews:out});},
 previewImage(e){wx.previewImage({urls:[e.currentTarget.dataset.url]});},
 poster(){this.run(async()=>{
  const range=this.sharedRange||dates.range(this.data.calendarMode,this.data.offset);const params={...this.filters,city:this.data.city,from:range.from,to:range.to};
  if(this.data.selectedDate){params.from=new Date(this.data.selectedDate+'T00:00:00+08:00').toISOString();params.to=new Date(new Date(params.from).getTime()+86400000).toISOString();}
  const share=await api.call('calendarCode',{params});const items=share.items;const height=230+items.length*190;
  const codePath=wx.env.USER_DATA_PATH+'/706-calendar-code.png';if(!share.demo)await new Promise((resolve,reject)=>wx.getFileSystemManager().writeFile({filePath:codePath,data:share.code,encoding:'base64',success:resolve,fail:reject}));
  const covers=await Promise.all(items.map(x=>x.cover_url?new Promise(resolve=>wx.getImageInfo({src:x.cover_url,success:r=>resolve(x.cover_url.startsWith('/')?x.cover_url:r.path),fail:()=>resolve(null)})):Promise.resolve(null)));
  this.setData({posterHeight:height,posterWidth:750});await new Promise(resolve=>wx.nextTick(resolve));
  const c=wx.createCanvasContext('poster',this);c.setFillStyle('#ffffff');c.fillRect(0,0,750,height);c.setFillStyle('#222222');c.setFontSize(30);c.fillText(this.data.cityName+' · 706',30,50);c.setFontSize(18);c.fillText(this.data.rangeLabel,30,92);if(share.demo){c.setFontSize(20);c.fillText('演示数据',580,55);c.setFontSize(14);c.fillText('无有效活动码',580,90);}else c.drawImage(codePath,590,20,130,130);
  items.forEach((x,index)=>{const y=180+index*190;c.setFontSize(17);c.setFillStyle('#777777');c.fillText(dates.format(x.starts_at).slice(5,10),30,y);c.fillText(dates.format(x.starts_at).slice(11),30,y+26);c.setFillStyle('#222222');c.setFontSize(24);String(x.title||'').match(/.{1,18}/g)?.slice(0,2).forEach((line,n)=>c.fillText(line,120,y+n*30));c.setFontSize(16);c.fillText(String(x.venue_display||'').slice(0,28),120,y+78);c.fillText(String(x.host_display||'').slice(0,28),120,y+108);if(covers[index])c.drawImage(covers[index],600,y-18,108,144);});c.setFontSize(14);c.fillText(this.data.t.posterNotice,30,height-24);
  await new Promise(resolve=>c.draw(false,resolve));const r=await new Promise((resolve,reject)=>wx.canvasToTempFilePath({canvasId:'poster',width:750,height,success:resolve,fail:reject},this));this.setData({posterPath:r.tempFilePath,sheet:'poster'});
 });},
 loadLab(){const catalog=require('./mock/catalog');this.setData({personas:api.mock.personas,labState:api.isMock()?api.mock.state():null,catalog,scenarios:[{id:'normal',label:'正常数据'},{id:'loading',label:'加载中（本地延迟）'},{id:'empty',label:'空列表'},{id:'error',label:'加载失败'},{id:'permission',label:'无权限'}]});},
 labOpen(e){const entry=this.data.catalog[Number(e.currentTarget.dataset.index)];if(!api.isMock()){this.setData({error:'合成页面目录仅用于离线演示模式。'});return;}api.mock.configure({persona:entry.persona||'demo-member',scenario:'normal'});prefs.set({city:'shanghai'});wx.reLaunch({url:'/pages/'+entry.route+'/index'+(entry.id?'?id='+entry.id:'')});},
 labPersona(e){api.mock.configure({persona:e.currentTarget.dataset.id});wx.reLaunch({url:'/pages/review-lab/index'});},
 labScenario(e){api.mock.configure({scenario:e.currentTarget.dataset.id});wx.reLaunch({url:'/pages/discover/index'});},
 labReset(){wx.showModal({title:'重置演示数据',content:'清空本地演示修改、草稿、身份与筛选，不影响 Montana 数据。',success:r=>{if(!r.confirm)return;const keys=wx.getStorageInfoSync().keys;keys.filter(k=>k.startsWith('706.draft.mock.')||k.startsWith('706.preferences.mock.')).forEach(k=>wx.removeStorageSync(k));api.mock.reset();wx.reLaunch({url:'/pages/review-lab/index'});}});},
 labMode(){const next=api.isMock()?'montana':'mock';wx.showModal({title:next==='montana'?'连接真实 Montana':'切换离线演示',content:next==='montana'?'真实模式使用独立账号和真实服务，操作可能保存到服务端。请先完成域名与账号配置。':'所有演示操作仅保存在本机。',success:r=>{if(!r.confirm)return;api.setMode(next);wx.reLaunch({url:'/pages/review-lab/index'});}});},
 savePoster(){this.run(()=>new Promise((resolve,reject)=>wx.saveImageToPhotosAlbum({filePath:this.data.posterPath,success:resolve,fail:reject})));}
};};
