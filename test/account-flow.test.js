const {test,beforeEach}=require('node:test'),assert=require('node:assert/strict');
const store=new Map();let navigation=[];
global.wx={getStorageSync:k=>store.get(k),setStorageSync:(k,v)=>store.set(k,structuredClone(v)),removeStorageSync:k=>store.delete(k),setNavigationBarTitle(){},showToast(){},navigateTo:({url})=>navigation.push(url),redirectTo:({url})=>navigation.push(url),reLaunch:({url})=>navigation.push(url),request(){throw Error('Unexpected network');}};
global.getCurrentPages=()=>[];
const api=require('../miniprogram/lib/api'),flow=require('../miniprogram/lib/account-flow'),factory=require('../miniprogram/lib/page');
function page(route,options={}){const p=factory(route);p.data=structuredClone(p.data);p.setData=values=>{for(const [key,value]of Object.entries(values)){let at=p.data;const parts=key.split('.');while(parts.length>1){const part=parts.shift();at=at[part]||(at[part]={});}at[parts[0]]=value;}};p.onLoad(options);return p;}
beforeEach(()=>{store.clear();store.set('706.transport','mock');api.mock.reset();navigation=[];});
test('developer journey starts with browsing, gates real actions and can replay after setup without resetting other work',async()=>{
 const before=api.mock.state(),host=before.rows.find(r=>r.type==='profile'&&r.owner==='demo-host'),draft='706.draft.mock.'+before.version+'.publish.new.demo-host';store.set(draft,{title:'保留活动草稿'});
 const newcomer=before.rows.find(r=>r.type==='profile'&&r.owner==='demo-new');Object.assign(newcomer,{onboarded:true,phone_verified:true,display_name:'上次走查'});api.mock.configure(before);store.set('706.account-draft.mock.demo-new',{step:3});flow.remember('event','demo-film');
 const lab=page('review-lab');await lab.load();lab.labNewUserJourney();assert.equal(navigation.at(-1),'/pages/feed/index');assert.equal(api.session(),null);assert.equal(flow.pending(),null);assert(!store.has('706.account-draft.mock.demo-new'));assert.deepEqual(store.get(draft),{title:'保留活动草稿'});assert.deepEqual(api.mock.state().rows.find(r=>r.id===host.id),host);
 const feed=page('feed');await feed.load();assert(!feed.data.accountOpen);assert(feed.data.people.length);await feed.follow({currentTarget:{dataset:{id:'demo-peer-0',enabled:true}}});assert.equal(feed.data.accountStage,'login');assert.equal(feed.data.accountOpen,true);assert.equal(flow.pending().action,'follow');feed.loginConsent({detail:{value:['yes']}});await feed.wechatLogin();assert.equal(feed.data.accountStage,'identity');await feed.confirmAccountIdentity();assert.equal(feed.data.accountStage,'phone');assert.equal(feed.data.accountForm.display_name,'初芽');assert(feed.data.accountForm.avatar_url);feed.onUnload();
 lab.labNewUserJourney();const fresh=page('feed');await fresh.load();await fresh.navigate({currentTarget:{dataset:{route:'publish'}}});assert.equal(fresh.data.accountStage,'login');assert.equal(flow.pending().route,'publish');fresh.onUnload();
 const unchanged=api.mock.state();api.setMode('soon');const liveLab=page('review-lab');const count=navigation.length;liveLab.labNewUserJourney();assert.equal(navigation.length,count);assert.deepEqual(api.mock.state(),unchanged);
});
test('guest signs in over the original page, finishes setup, previews own profile and resumes registration explicitly',async()=>{
 await api.logout();const event=page('event',{id:'demo-film'});await event.load();assert(event.data.record);
 await event.sheet({currentTarget:{dataset:{kind:'register'}}});assert.equal(event.data.accountOpen,true);assert.equal(event.data.accountStage,'login');assert.equal(api.session(),null);assert.equal(navigation.length,0);
 event.browseAccount();assert.equal(event.data.accountOpen,false);assert.equal(event.data.record.id,'demo-film');await event.sheet({currentTarget:{dataset:{kind:'register'}}});
 event.loginConsent({detail:{value:['yes']}});await event.wechatLogin();assert.equal(navigation.length,0);const identity=api.session().id;
 const setup=event;assert.equal(setup.data.accountStage,'identity');await setup.confirmAccountIdentity();assert.equal(setup.data.accountStage,'phone');
 setup.phoneInput({detail:{value:'13800138000'}});await setup.sendPhoneCode();setup.phoneCodeInput({detail:{value:'000000'}});await setup.bindPhone();assert.equal(setup.data.accountStage,'phone');
 setup.phoneCodeInput({detail:{value:'706000'}});await setup.bindPhone();assert.equal(setup.data.accountStage,'profile');assert.equal(api.session().id,identity);
 setup.accountNickname({detail:{value:'社区新朋友'}});setup.accountText({currentTarget:{dataset:{key:'bio'}},detail:{value:'喜欢散步，也喜欢听人讲故事'}});setup.accountNext();assert.equal(setup.data.accountQuestion,2);setup.accountNext();assert.equal(setup.data.accountQuestion,3);
 const introduction='喜欢沿着河散步。\n也想听听你最近遇见的事。';setup.accountText({currentTarget:{dataset:{key:'introduction'}},detail:{value:introduction}});setup.consent({detail:{value:['yes']}});await setup.completeAccount();setup.onUnload();assert.equal(setup.data.accountStage,'welcome');assert.equal(navigation.length,0);
 const account=await api.call('read',{op:'account'});assert.equal(account.profile.introduction,introduction);assert.equal(account.profile.bio,'喜欢散步，也喜欢听人讲故事');
 setup.finishAccountWelcome();assert.match(navigation.at(-1),new RegExp('member/index\\?id='+identity));
 const own=page('member',{id:identity});await own.load();assert.equal(own.data.accountPending,true);await own.returnFromAccount();assert.match(navigation.at(-1),/event\/index\?accountReturn=1&id=demo-film/);
 const resumed=page('event',{id:'demo-film',accountReturn:'1'});await resumed.load();await resumed.resumeAccountAction();assert.equal(resumed.data.sheet,'register');assert.equal(resumed.data.sheetForm.display_name,'社区新朋友');
 assert.equal(api.mock.state().rows.filter(r=>r.type==='registration'&&r.owner===identity).length,0);assert.equal(flow.pending(),null);
});
test('closing and reopening resumes the profile question without changing the underlying editor draft',async()=>{
 api.mock.configure({persona:'demo-new'});const state=api.mock.state();state.rows.find(r=>r.owner==='demo-new'&&r.type==='profile').phone_verified=true;api.mock.configure(state);
 const p=page('publish');p.setData({form:{title:'Unsent activity draft'}});await p.requireAccount();p.accountNickname({detail:{value:'散步的人'}});p.accountNext();p.browseAccount();assert.equal(p.data.form.title,'Unsent activity draft');
 await p.requireAccount();assert.equal(p.data.accountQuestion,2);assert.equal(p.data.accountForm.display_name,'散步的人');assert.equal(p.data.form.title,'Unsent activity draft');p.onUnload();
});
test('existing completed account returns without onboarding; phone verified is independent of profile completion',async()=>{
 const state=api.mock.state();state.rows.find(r=>r.type==='profile'&&r.owner===state.persona).phone_verified=true;api.mock.configure(state);
 flow.remember('event','demo-film','sheet',{kind:'register'});const login=page('login');login.loginConsent({detail:{value:['yes']}});await login.wechatLogin();assert.match(navigation.at(-1),/event\/index/);
 assert.equal(flow.stage({phone_verified:false,profile:{onboarded:true}}),'phone');
 assert.equal(flow.stage({phone_verified:true,profile:{onboarded:false}}),'profile');
});
test('return destination expires and cannot cross accounts',()=>{
 flow.remember('event','demo-film');flow.claim();api.mock.configure({persona:'demo-host'});assert.equal(flow.pending(),null);
 store.set('706.account-return.mock',{route:'event',at:Date.now()-1800001});assert.equal(flow.pending(),null);
});
test('private phone state never appears in a public member record',async()=>{
 const state=api.mock.state();state.rows.find(r=>r.type==='profile'&&r.owner===state.persona).phone_verified=true;api.mock.configure(state);
 const member=await api.call('read',{op:'member',params:{id:state.persona}});assert(!('phone_verified'in member));assert(!('phone'in member));
});
test('a minimal profile can later be saved with no interests selected',async()=>{
 await api.call('write',{op:'profile',params:{display_name:'简洁资料',interests:[]},key:'optional-interests'});
 const me=await api.call('read',{op:'me'});assert.deepEqual(me.profile.interests,[]);
});
test('editing optional profile fields saves full text, permits blanks and keeps onboarding complete',async()=>{
 const editor=page('edit-profile');await editor.load();const identity=api.session().id;
 editor.setData({'form.bio':'我'.repeat(81)});await editor.saveForm();assert(editor.data.formErrors.bio);assert.notEqual((await api.call('read',{op:'me'})).profile.bio,'我'.repeat(81));
 const introduction='慢慢认识彼此。\n保留每个人自己的表达。';editor.setData({'form.bio':'散步时想事情','form.introduction':introduction});await editor.saveForm();assert.equal(editor.data.error,'');
 let own=page('member',{id:identity});await own.load();assert.equal(own.data.record.introduction,introduction);assert.equal(own.data.record.bio,'散步时想事情');
 editor.setData({'form.bio':'','form.introduction':''});await editor.saveForm();own=page('member',{id:identity});await own.load();assert.equal(own.data.record.bio,'');assert.equal(own.data.record.introduction,'');assert.equal(flow.stage(await api.call('read',{op:'account'})),'ready');
});
test('completed accounts reuse the existing editor from every profile entry and old onboarding links',async()=>{
 flow.remember('event','demo-film','sheet',{kind:'register'});flow.claim();
 for(const [route,extra]of [['me',{}],['member',{field:'bio'}],['member',{field:'introduction'}],['more',{}]]){
  const source=page(route,{id:route==='member'?api.session().id:''});await source.load();await source.navigate({currentTarget:{dataset:{route:'edit-profile',extra}}});
  assert.equal(navigation.at(-1),'/pages/edit-profile/index'+(extra.field?'?field='+extra.field:''));assert(!source.data.accountOpen);
 }
 const settings=page('more');await settings.load();await settings.navigate({currentTarget:{dataset:{route:'onboarding'}}});assert.equal(navigation.at(-1),'/pages/edit-profile/index');
 const legacy=page('onboarding');await legacy.load();assert.equal(navigation.at(-1),'/pages/edit-profile/index');assert(!legacy.data.accountOpen);assert.equal(legacy.data.formKind,'');assert.equal(flow.pending().id,'demo-film');
 api.mock.configure({persona:'demo-new'});navigation=[];const incomplete=page('more');await incomplete.load();await incomplete.navigate({currentTarget:{dataset:{route:'edit-profile'}}});assert.equal(incomplete.data.accountStage,'phone');assert.equal(navigation.length,0);incomplete.onUnload();
});
test('signature and full introduction enforce limits without flattening or truncating stored words',async()=>{
 const rules=require('../miniprogram/lib/profile-rules');assert.equal(rules.length('🌿'),1);assert.equal(rules.validate({bio:'🌿'.repeat(80),introduction:'我'.repeat(300)}),'');
 await assert.rejects(api.call('write',{op:'profile',params:{bio:'我'.repeat(81)},key:'long-signature'}),/SIGNATURE_TOO_LONG/);
 await assert.rejects(api.call('write',{op:'profile',params:{introduction:'我'.repeat(301)},key:'long-intro'}),/INTRODUCTION_TOO_LONG/);
 const forms=require('../miniprogram/lib/forms');assert(!forms.fields('profile',0,{},{}).some(f=>f.key==='interests'));assert(!('interests' in forms.payload('profile',{interests:['reading']})));
});
test('binding uses authenticated bind context, rejects account switching and never marks an unbound self as complete',async()=>{
 const soon=require('../miniprogram/lib/soon');store.set('706.session',{id:'wechat-user',token:'original'});let requests=[],different=true;
 wx.request=options=>{requests.push(options);options.success({statusCode:200,data:options.url.endsWith('/users/me')?{id:'wechat-user',phone:null}:{user:{id:different?'phone-user':'wechat-user'},token:'other'}});};
 await assert.rejects(soon.call('bindPhone',{phone:'13800138000',code:'123456'}),/PHONE_ACCOUNT_CONFLICT/);assert.equal(soon.session().id,'wechat-user');assert.equal(soon.session().token,'original');
 different=false;await assert.rejects(soon.call('bindPhone',{phone:'13800138000',code:'123456'}),/PHONE_BIND_UNCONFIRMED/);
 assert.equal(requests[0].data.context,'bind_phone');assert.equal(requests[0].header.Authorization,'Bearer original');
 wx.request=()=>{throw Error('Unexpected network');};
});
test('agreement is required, reminders are optional, and documents return to the same login form',async()=>{
 await api.logout();const event=page('event',{id:'demo-film'});await event.load();await event.sheet({currentTarget:{dataset:{kind:'register'}}});
 await event.wechatLogin();assert.equal(api.session(),null);assert.match(event.data.error,/用户协议/);
 event.activityReminderConsent({detail:{value:['checked']}});event.loginConsent({detail:{value:['checked']}});
 for(const document of ['terms','privacy']){event.openAccountDocument({currentTarget:{dataset:{document}}});assert(event.data.accountPrivacy);assert.match(event.data.accountDocument.text,/草稿/);event.accountBack();assert(!event.data.accountPrivacy);assert(event.data.accountOpen);assert(event.data.loginConsent);assert(event.data.activityReminders);}
 event.activityReminderConsent({detail:{value:[]}});await event.wechatLogin();assert(api.session());assert.equal(event.data.accountStage,'identity');await event.confirmAccountIdentity();assert.equal(event.data.accountStage,'phone');assert.equal((await api.call('read',{op:'me'})).profile.notification_preferences.enabled,false);event.onUnload();
});
test('WeChat subscription uses real IDs and never treats rejection or a missing template as acceptance',async()=>{
 const request=require('../miniprogram/lib/wechat-subscription');let calls=0;
 const runtime={requestSubscribeMessage(options){calls++;options.success({one:'reject',two:'accept'});}};
 assert.equal((await request(runtime,{enabled:false,templateIds:['one']})).status,'off');
 assert.equal((await request(runtime,{enabled:true,demo:true,templateIds:['one']})).status,'demo');
 assert.equal((await request(runtime,{enabled:true,templateIds:[]})).status,'unavailable');assert.equal(calls,0);
 assert.equal((await request(runtime,{enabled:true,templateIds:['one']})).accepted,false);
 const accepted=await request(runtime,{enabled:true,templateIds:['one','two']});assert(accepted.accepted);assert.deepEqual(accepted.results,{one:'reject',two:'accept'});
 assert.equal((await request({requestSubscribeMessage:o=>o.fail({})},{enabled:true,templateIds:['one']})).accepted,false);
});
test('guest private tabs open the shared login overlay over the current feed or discover page',async()=>{
 await api.logout();
 for(const source of ['feed','discover'])for(const target of ['messages','me']){
  const p=page(source);await p.load();const before=structuredClone(p.data.items),count=navigation.length;
  await p.navigate({currentTarget:{dataset:{route:target}}});
  assert.equal(p.data.accountOpen,true);assert.equal(p.data.accountStage,'login');assert.equal(flow.pending().route,target);
  assert.equal(navigation.length,count);assert.equal(p.data.tab,source);assert.deepEqual(p.data.items,before);
  p.accountBack();assert.equal(p.data.accountOpen,false);assert.equal(p.data.tab,source);assert.equal(navigation.length,count);p.onUnload();
 }
});
test('direct guest private-tab links open login automatically and close to the public feed',async()=>{
 await api.logout();
 for(const target of ['messages','me']){
  const p=page(target);await p.load();assert.equal(p.data.accountOpen,true);assert.equal(p.data.accountStage,'login');assert.equal(flow.pending().route,target);assert.equal(p.data.error,'');
  p.accountBack();assert.equal(p.data.accountOpen,false);assert.equal(navigation.at(-1),'/pages/feed/index');p.onUnload();
 }
});
test('private tabs continue to their destination for returning users and gate incomplete accounts',async()=>{
 const p=page('feed');await p.load();
 for(const target of ['messages','me']){await p.navigate({currentTarget:{dataset:{route:target}}});assert.equal(navigation.at(-1),'/pages/'+target+'/index');assert(!p.data.accountOpen);}
 api.mock.configure({persona:'demo-new'});const newcomer=page('discover');await newcomer.load();const count=navigation.length;
 await newcomer.navigate({currentTarget:{dataset:{route:'messages'}}});assert.equal(newcomer.data.accountStage,'phone');assert.equal(flow.pending().route,'messages');assert.equal(navigation.length,count);newcomer.onUnload();
});
test('setup prefills an existing name and avatar, retains edits on reopen and saves the replacement',async()=>{
 const state=api.mock.state(),profile=state.rows.find(r=>r.type==='profile'&&r.owner==='demo-new');
 Object.assign(profile,{phone_verified:true,onboarded:false,display_name:'已选微信昵称',avatar_url:'https://example.com/chosen-avatar.png'});api.mock.configure({...state,persona:'demo-new'});
 store.set('706.account-draft.mock.demo-new',{values:{bio:'保留签名草稿'},step:1});
 const p=page('feed');await p.load();await p.requireAccount();assert.equal(p.data.accountForm.display_name,'已选微信昵称');assert.equal(p.data.accountForm.avatar_url,profile.avatar_url);assert.equal(p.data.accountForm.bio,'保留签名草稿');
 await p.chooseAccountAvatar({detail:{}});assert.equal(p.data.accountForm.avatar_url,profile.avatar_url);
 await p.chooseAccountAvatar({detail:{avatarUrl:'wxfile://new-avatar.png'}});p.accountNickname({detail:{value:'新的社区昵称'}});p.browseAccount();await p.requireAccount();
 assert.equal(p.data.accountForm.display_name,'新的社区昵称');assert.equal(p.data.accountForm.avatar_url,'wxfile://new-avatar.png');
 p.accountNext();p.accountNext();p.consent({detail:{value:['yes']}});await p.completeAccount();assert.equal(p.data.accountStage,'welcome');
 const saved=(await api.call('read',{op:'account'})).profile;assert.equal(saved.display_name,'新的社区昵称');assert.equal(saved.avatar_url,'wxfile://new-avatar.png');assert.equal(saved.bio,'保留签名草稿');p.onUnload();
});
test('developer profile preview shows the prior WeChat selection and keeps edits on reload',async()=>{
 const entry=require('../miniprogram/lib/mock/catalog').find(e=>e.options?.accountPreview==='profile');assert(entry);
 const host=api.mock.state().rows.find(r=>r.id==='profile-demo-host');
 const p=page(entry.route,entry.options);await p.load();assert.equal(p.data.accountStage,'profile');assert.equal(p.data.accountQuestion,1);assert.equal(p.data.accountForm.display_name,'初芽');assert.equal(p.data.accountForm.avatar_url,'/assets/demo/avatar-3.png');assert.equal(p.data.account.phone_verified,true);
 p.accountNickname({detail:{value:'预览中修改的昵称'}});p.accountText({currentTarget:{dataset:{key:'bio'}},detail:{value:'我'.repeat(80)}});await p.load();assert.equal(p.data.accountForm.display_name,'预览中修改的昵称');assert.equal(p.data.accountBioCount,80);assert.equal(p.data.accountForm.bio,'我'.repeat(80));
 assert.deepEqual(api.mock.state().rows.find(r=>r.id==='profile-demo-host'),host);p.onUnload();
});
test('80-character short introductions round-trip through the shared editor and reject 81 without truncation',async()=>{
 const p=page('edit-profile');await p.load();const bio='🌿'.repeat(80);p.setData({'form.bio':bio});await p.saveForm();assert.equal(p.data.error,'');assert.equal((await api.call('read',{op:'me'})).profile.bio,bio);
 p.setData({'form.bio':bio+'多'});await p.saveForm();assert(p.data.formErrors.bio);assert.equal((await api.call('read',{op:'me'})).profile.bio,bio);p.onUnload();
});
test('login identity confirmation carries chosen details through phone verification into setup',async()=>{
 await api.logout();const p=page('feed');await p.load();await p.navigate({currentTarget:{dataset:{route:'me'}}});p.loginConsent({detail:{value:['yes']}});await p.wechatLogin();assert.equal(p.data.accountStage,'identity');
 p.accountNickname({detail:{value:''}});await p.confirmAccountIdentity();assert.equal(p.data.accountStage,'identity');assert(p.data.accountErrors.display_name);
 p.accountNickname({detail:{value:'微信里选好的名字'}});await p.chooseAccountAvatar({detail:{avatarUrl:'wxfile://wechat-choice.png'}});p.browseAccount();await p.requireAccount();assert.equal(p.data.accountStage,'identity');
 await p.confirmAccountIdentity();assert.equal(p.data.accountStage,'phone');p.phoneInput({detail:{value:'13800138000'}});await p.sendPhoneCode();p.phoneCodeInput({detail:{value:'706000'}});await p.bindPhone();
 assert.equal(p.data.accountStage,'profile');assert.equal(p.data.accountForm.display_name,'微信里选好的名字');assert.equal(p.data.accountForm.avatar_url,'wxfile://wechat-choice.png');
 const saved=(await api.call('read',{op:'account'})).profile;assert.equal(saved.display_name,'微信里选好的名字');assert.equal(saved.avatar_url,'wxfile://wechat-choice.png');assert.equal(saved.onboarded,false);p.onUnload();
});
test('shared setup back navigation preserves city selection and profile text',async()=>{
 const entry=require('../miniprogram/lib/mock/catalog').find(e=>e.options?.accountPreview==='profile'),p=page(entry.route,entry.options);await p.load();p.accountNext();
 const cityIndex=p.data.cities.length-1;p.accountCity({detail:{value:String(cityIndex)}});const city=p.data.cities[cityIndex];assert.equal(p.data.accountCityIndex,cityIndex);assert.equal(p.data.accountCityLabel,city.zh);
 p.accountNext();p.accountText({currentTarget:{dataset:{key:'introduction'}},detail:{value:'保留完整介绍\n回来继续编辑'}});p.accountBack();assert.equal(p.data.accountQuestion,2);assert.equal(p.data.accountOpen,true);assert.equal(p.data.accountForm.city,city.id);
 p.accountBack();assert.equal(p.data.accountQuestion,1);p.accountNext();p.accountNext();assert.equal(p.data.accountForm.introduction,'保留完整介绍\n回来继续编辑');p.onUnload();
});

test('inline privacy documents preserve onboarding text and the registration sheet without granting consent',async()=>{
 const entry=require('../miniprogram/lib/mock/catalog').find(e=>e.options?.accountPreview==='profile');const setup=page(entry.route,entry.options);await setup.load();setup.accountNext();setup.accountNext();
 setup.accountText({currentTarget:{dataset:{key:'introduction'}},detail:{value:'留下这段文字。'}});
 setup.openAccountDocument({currentTarget:{dataset:{document:'privacy'}}});assert(setup.data.accountPrivacy);assert.equal(setup.data.consent,false);
 setup.accountBack();assert(setup.data.accountOpen);assert.equal(setup.data.accountQuestion,3);assert.equal(setup.data.accountForm.introduction,'留下这段文字。');assert.equal(setup.data.consent,false);setup.onUnload();
 api.mock.configure({persona:'demo-host'});const event=page('event',{id:'demo-film'});await event.load();await event.sheet({currentTarget:{dataset:{kind:'register'}}});
 event.sheetInput({currentTarget:{dataset:{key:'motivation'}},detail:{value:'保留报名理由'}});const before=structuredClone(event.data.sheetForm);let visible;event.getTabBar=()=>({setData:values=>visible=!values.hidden});
 event.openAccountDocument({currentTarget:{dataset:{document:'privacy'}}});assert(event.data.accountOpen);assert(event.data.accountPrivacy);assert.equal(visible,false);assert.equal(event.data.consent,false);
 event.accountBack();assert.equal(event.data.accountOpen,false);assert.equal(event.data.accountPrivacy,false);assert.equal(event.data.sheet,'register');assert.deepEqual(event.data.sheetForm,before);assert.equal(event.data.consent,false);assert.equal(visible,false);assert.equal(navigation.length,0);event.onUnload();
});

test('event and series steps expose the new heading and matching fields in one render without reloading',()=>{
 const forms=require('../miniprogram/lib/forms');
 for(const [route,kind]of [['publish','event'],['campaign-create','campaign']]){
  const p=page(route);p.setData({form:{...p.data.form,title:'完整标题',description:'活动介绍',introduction:'专题介绍'}});
  const snapshots=[],commit=p.setData;p.setData=patch=>{commit(patch);snapshots.push(structuredClone(p.data));};
  p.load=()=>{throw Error('A local step must not reload the page');};
  p.step({currentTarget:{dataset:{delta:1}}});assert.equal(p.data.step,2);assert.equal(snapshots.length,1);
  assert.deepEqual(snapshots[0].fields.map(f=>f.key),forms.fields(kind,2,p.data.t,p.data.form).map(f=>f.key));
  snapshots.length=0;p.step({currentTarget:{dataset:{delta:-1}}});assert.equal(snapshots.length,1);assert.equal(snapshots[0].step,1);assert.deepEqual(snapshots[0].fields.map(f=>f.key),forms.fields(kind,1,p.data.t,p.data.form).map(f=>f.key));p.onUnload();
 }
});
test('onboarding advances in one render while preserving its inputs',async()=>{
 const entry=require('../miniprogram/lib/mock/catalog').find(e=>e.options?.accountPreview==='profile'),p=page(entry.route,entry.options);await p.load();
 p.accountText({currentTarget:{dataset:{key:'bio'}},detail:{value:'保留输入'}});const snapshots=[],commit=p.setData;p.setData=patch=>{commit(patch);snapshots.push(structuredClone(p.data));};
 p.accountNext();assert.equal(snapshots.length,1);assert.equal(snapshots[0].accountQuestion,2);assert.equal(snapshots[0].accountForm.bio,'保留输入');assert.deepEqual(snapshots[0].accountErrors,{});p.onUnload();
});
test('fast loads omit loading feedback; slow loads show it after the threshold and clear it when complete',async t=>{
 t.mock.timers.enable({apis:['setTimeout']});
 const p=page('feedback');p.loadData=async()=>{};await p.load();t.mock.timers.tick(200);assert.equal(p.data.showLoading,false);
 let finish;p.loadData=()=>new Promise(resolve=>finish=resolve);const pending=p.load();t.mock.timers.tick(179);assert.equal(p.data.showLoading,false);t.mock.timers.tick(1);assert.equal(p.data.showLoading,true);finish();await pending;assert.equal(p.data.showLoading,false);assert.equal(p.data.loading,false);p.onUnload();
});

test('first login renders identity directly without a transient phone step',async()=>{
 await api.logout();const p=page('feed');await p.load();await p.requireAccount();p.loginConsent({detail:{value:['yes']}});
 const stages=[],commit=p.setData;p.setData=patch=>{commit(patch);if(patch.accountStage)stages.push(patch.accountStage);};
 await p.wechatLogin();assert.deepEqual(stages,['identity']);assert.equal(p.data.accountStage,'identity');p.onUnload();
});

test('shared native avatar selection updates the editor draft and only saves with the existing profile save',async()=>{
 const p=page('edit-profile');await p.load();const before=(await api.call('read',{op:'me'})).profile;
 await p.chooseProfileAvatar({detail:{}});assert.equal(p.data.form.avatar_url,before.avatar_url);
 await p.chooseProfileAvatar({detail:{avatarUrl:'wxfile://replacement-avatar.png'}});assert.equal(p.data.form.avatar_url,'wxfile://replacement-avatar.png');assert.equal((await api.call('read',{op:'me'})).profile.avatar_url,before.avatar_url);
 await p.saveForm();const after=(await api.call('read',{op:'me'})).profile;assert.equal(after.avatar_url,'wxfile://replacement-avatar.png');assert.equal(after.onboarded,before.onboarded);p.onUnload();
});

test('calendar expands and collapses around the visible date while retaining filters and selection',async()=>{
 const p=page('calendar');await p.load();await p.period({currentTarget:{dataset:{delta:6}}});
 const chosen=p.data.days.filter(day=>!day.disabled)[2].date;p.setData({selectedDate:chosen});p.filters={free_only:true,has_capacity:true};
 await p.uiInteraction({detail:{handler:'toggleCalendar'}});assert.equal(p.data.calendarMode,'month');assert(p.data.days.some(day=>day.date===chosen&&day.selected));assert(p.data.days.filter(day=>!day.disabled).length>=28);assert.equal(p.data.selectedDate,chosen);assert.deepEqual(p.filters,{free_only:true,has_capacity:true});
 await p.uiInteraction({detail:{handler:'toggleCalendar'}});assert.equal(p.data.calendarMode,'week');assert.equal(p.data.days.length,7);assert(p.data.days.some(day=>day.date===chosen&&day.selected));assert.equal(p.pendingCalendarView,null);p.onUnload();
});


test('event participation choices keep their values across draft save without exposing private instructions in the event',async()=>{
 api.mock.configure({persona:'demo-host'});const p=page('publish');await p.load();
 assert.deepEqual(p.data.accessOptions.map(x=>x.value),['GROUP_QR','ORGANIZER_WECHAT','OTHER']);p.updateFields({step:2});
 p.checkboxInput({currentTarget:{dataset:{key:'paid'}},detail:{checked:true}});assert.equal(p.data.form.paid,true);assert(p.data.fields.some(x=>x.key==='price_minor'));
 p.checkboxInput({currentTarget:{dataset:{key:'paid'}},detail:{checked:false}});assert.equal(p.data.form.paid,false);assert(!p.data.fields.some(x=>x.key==='price_minor'));
 p.checkboxInput({currentTarget:{dataset:{key:'approval_required'}},detail:{checked:true}});assert.equal(p.data.form.approval_required,true);
 p.participationChange({currentTarget:{dataset:{type:'OTHER'}},detail:{checked:true}});
 p.participationChange({currentTarget:{dataset:{type:'ORGANIZER_WECHAT'}},detail:{checked:true}});
 p.accessInput({currentTarget:{dataset:{type:'ORGANIZER_WECHAT'}},detail:{value:'PRIVATE_HOST_CONTACT'}});
 p.accessInput({currentTarget:{dataset:{type:'OTHER'}},detail:{value:'PRIVATE_JOIN_INSTRUCTIONS'}});
 p.setData({'form.title':'参与方式草稿'});await p.saveForm();assert(p.data.form.id);
 const saved=await api.call('read',{op:'draft',params:{id:p.data.form.id,kind:'event'}});assert.deepEqual(saved.access.methods,[{type:'ORGANIZER_WECHAT',value:'PRIVATE_HOST_CONTACT'},{type:'OTHER',value:'PRIVATE_JOIN_INSTRUCTIONS'}]);
 const row=api.mock.state().rows.find(x=>x.id===saved.id);assert(!JSON.stringify(row).includes('PRIVATE_'));
 const reopened=page('publish',{id:saved.id});await reopened.load();assert.equal(reopened.data.accessOptions.find(x=>x.value==='OTHER').content,'PRIVATE_JOIN_INSTRUCTIONS');
 reopened.methodsChange({detail:{value:['OTHER']}});const payload=require('../miniprogram/lib/forms').payload('event',reopened.data.form);assert.equal(payload.access.methods.length,1);assert.equal(payload.access.methods[0].type,'OTHER');assert(!JSON.stringify(payload).includes('PRIVATE_HOST_CONTACT'));
 p.onUnload();reopened.onUnload();
});

test('participation values are required before continuing, while empty early drafts remain saveable',async()=>{
 const forms=require('../miniprogram/lib/forms'),base={title:'活动',description:'介绍',city:'shanghai',space_id:'demo-space',starts_at:'2099-01-01T00:00:00Z',ends_at:'2099-01-01T02:00:00Z'};
 for(const type of ['GROUP_QR','ORGANIZER_WECHAT','OTHER'])assert(forms.validate('event',{...base,join_methods:[type],access_values:{}},{step:2}).join_methods);
 assert.equal(forms.validate('event',{...base,join_methods:['OTHER'],access_values:{OTHER:'到场后在入口集合'}},{step:2}).join_methods,undefined);
 assert.equal(forms.payload('event',{...base,join_methods:[]}).access,undefined);
 const soon=require('../miniprogram/lib/soon');soon.setSession({id:'guard-test',token:'TEST_ONLY'});await assert.rejects(soon.call('write',{op:'saveEvent',params:{access:{methods:[{type:'OTHER',value:'私密说明'}]}}}),/ACCESS_METHOD_NOT_SUPPORTED/);soon.setSession(null);
});


test('WeChat event shares use the cover and profile shares use the avatar with public destinations',()=>{
 const event=page('event',{id:'event / 中文'});event.setData({record:{id:'event / 中文',title:'一起看电影',cover_url:'https://assets.example/event-cover.png',avatar_url:'https://assets.example/host.png'}});
 assert.deepEqual(event.onShareAppMessage(),{title:'一起看电影',path:'/pages/event/index?id='+encodeURIComponent('event / 中文'),imageUrl:'https://assets.example/event-cover.png'});
 const member=page('member',{id:'member-7'});member.setData({record:{owner:'member-7',display_name:'林叶',avatar_url:'https://assets.example/avatar.png',cover_url:'https://assets.example/other-cover.png'}});
 assert.deepEqual(member.onShareAppMessage(),{title:'林叶',path:'/pages/member/index?id=member-7',imageUrl:'https://assets.example/avatar.png'});
 const me=page('me');me.setData({currentUser:'self-9',record:{display_name:'禾舟',avatar_url:'https://assets.example/me.png'}});
 assert.deepEqual(me.onShareAppMessage(),{title:'禾舟',path:'/pages/member/index?id=self-9',imageUrl:'https://assets.example/me.png'});
 event.setData({record:{title:'无封面活动',media:[{type:'image',url:'https://assets.example/first-image.png'}]}});assert.equal(event.onShareAppMessage().imageUrl,'https://assets.example/first-image.png');
 member.setData({record:{owner:'member-7',display_name:'无头像用户'}});assert.equal('imageUrl' in member.onShareAppMessage(),false);
 for(const p of [event,member,me])p.onUnload();
});


test('submission card opens a read-only snapshot of the current unsaved draft without sharing private access',async()=>{
 const editor=page('publish');await editor.load();editor.updateFields({step:3,form:{...editor.data.form,title:'未提交的活动',summary:'简介',description:'当前完整介绍',media:[{type:'image',url:'/assets/demo/cover-1.png'}],join_methods:['OTHER'],access_values:{OTHER:'PRIVATE_ACCESS_ONLY'}}});
 const before=api.mock.state().rows.filter(r=>r.type==='event').length;
 await editor.uiInteraction({detail:{handler:'previewDraft'}});const url=navigation.at(-1);assert.match(url,/activity-preview\/index\?snapshot=/);const snapshot=new URL('https://test'+url).searchParams.get('snapshot');
 const preview=page('activity-preview',{snapshot});await preview.load();assert.equal(preview.data.record.title,'未提交的活动');assert.equal(preview.data.record.description,'当前完整介绍');assert.deepEqual(preview.data.record.galleryUrls,['/assets/demo/cover-1.png']);assert(!JSON.stringify(preview.data.record).includes('PRIVATE_ACCESS_ONLY'));assert.equal(api.mock.state().rows.filter(r=>r.type==='event').length,before);
 await editor.load();assert.equal(editor.data.step,3);assert.equal(editor.data.form.description,'当前完整介绍');assert.equal(editor.data.form.access_values.OTHER,'PRIVATE_ACCESS_ONLY');
 api.mock.configure({persona:'demo-host'});const other=page('activity-preview',{snapshot});await other.load();assert.equal(other.data.record,null);assert(other.data.error);
 for(const p of [editor,preview,other])p.onUnload();
});


test('unlimited capacity is explicit in previews and remains null in the saved payload',()=>{
 const forms=require('../miniprogram/lib/forms'),editor=page('publish');editor.updateFields({form:{...editor.data.form,capacity:''}});
 assert.equal(editor.data.previewEvent.capacityDisplay,'0 / 不限');assert.equal(forms.payload('event',editor.data.form).capacity,null);
 editor.updateFields({form:{...editor.data.form,capacity:'20'}});assert.equal(editor.data.previewEvent.capacityDisplay,'0/20');assert.equal(forms.payload('event',editor.data.form).capacity,20);editor.onUnload();
});

test('campaign submission opens the complete current public preview and linked event previews without publishing',async()=>{
 const editor=page('campaign-create');await editor.load();const selected=editor.data.eventOptions[0];assert(selected);
 const option={...selected,access:{value:'PRIVATE_EVENT_CONTACT'},organizer_note:'PRIVATE_REVIEW_NOTE'};
 editor.updateFields({step:3,eventOptions:[option],form:{...editor.data.form,title:'未提交专题',kicker:'城市联动',introduction:'完整专题介绍\n第二段',media:[{type:'image',url:'/assets/demo/cover-2.png'}],event_ids:[selected.id],resource_links:'PRIVATE_RESOURCE',contact:'PRIVATE_FORM_CONTACT'}});
 const before=api.mock.state().rows.filter(row=>row.type==='campaign').length;
 editor.previewSeries();const url=navigation.at(-1);assert.match(url,/campaign\/index\?snapshot=/);const snapshot=new URL('https://test'+url).searchParams.get('snapshot');
 const preview=page('campaign',{snapshot});await preview.load();assert.equal(preview.data.localPreview,true);assert.equal(preview.data.record.title,'未提交专题');assert.equal(preview.data.record.kicker,'城市联动');assert.equal(preview.data.record.introduction,'完整专题介绍\n第二段');assert.equal(preview.data.items.length,1);assert.equal(preview.data.items[0].id,selected.id);assert.deepEqual(preview.data.record.galleryUrls,['/assets/demo/cover-2.png']);assert(!JSON.stringify(preview.data.record).includes('PRIVATE_'));assert.equal(preview.onShareAppMessage().path,'/pages/feed/index');
 preview.openEvent({currentTarget:{dataset:{id:selected.id}}});const childUrl=navigation.at(-1);assert.match(childUrl,/activity-preview\/index\?snapshot=/);const child=page('activity-preview',{snapshot:new URL('https://test'+childUrl).searchParams.get('snapshot')});await child.load();assert.equal(child.data.record.title,selected.title);assert(!JSON.stringify(child.data.record).includes('PRIVATE_'));
 await editor.load();assert.equal(editor.data.step,3);assert.equal(editor.data.form.introduction,'完整专题介绍\n第二段');assert.equal(editor.data.form.resource_links,'PRIVATE_RESOURCE');assert.equal(api.mock.state().rows.filter(row=>row.type==='campaign').length,before);
 const malformed=page('campaign',{snapshot:'not-the-token'});await malformed.load();assert.equal(malformed.data.record,null);assert(malformed.data.error);
 api.mock.configure({persona:'demo-host'});const other=page('campaign',{snapshot});await other.load();assert.equal(other.data.record,null);assert(other.data.error);
 for(const p of [editor,preview,child,malformed,other])p.onUnload();
});
