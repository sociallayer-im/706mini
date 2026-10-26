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
 const feed=page('feed');await feed.load();assert(!feed.data.accountOpen);assert(feed.data.people.length);await feed.follow({currentTarget:{dataset:{id:'demo-peer-0',enabled:true}}});assert.equal(feed.data.accountStage,'login');assert.equal(feed.data.accountOpen,true);assert.equal(flow.pending().action,'follow');feed.loginConsent({detail:{value:['yes']}});await feed.wechatLogin();assert.equal(feed.data.accountStage,'phone');assert.equal(feed.data.accountForm.display_name,'');feed.onUnload();
 lab.labNewUserJourney();const fresh=page('feed');await fresh.load();await fresh.navigate({currentTarget:{dataset:{route:'publish'}}});assert.equal(fresh.data.accountStage,'login');assert.equal(flow.pending().route,'publish');fresh.onUnload();
 const unchanged=api.mock.state();api.setMode('soon');const liveLab=page('review-lab');const count=navigation.length;liveLab.labNewUserJourney();assert.equal(navigation.length,count);assert.deepEqual(api.mock.state(),unchanged);
});
test('guest signs in over the original page, finishes setup, previews own profile and resumes registration explicitly',async()=>{
 await api.logout();const event=page('event',{id:'demo-film'});await event.load();assert(event.data.record);
 await event.sheet({currentTarget:{dataset:{kind:'register'}}});assert.equal(event.data.accountOpen,true);assert.equal(event.data.accountStage,'login');assert.equal(api.session(),null);assert.equal(navigation.length,0);
 event.browseAccount();assert.equal(event.data.accountOpen,false);assert.equal(event.data.record.id,'demo-film');await event.sheet({currentTarget:{dataset:{kind:'register'}}});
 event.loginConsent({detail:{value:['yes']}});await event.wechatLogin();assert.equal(navigation.length,0);const identity=api.session().id;
 const setup=event;assert.equal(setup.data.accountStage,'phone');
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
 editor.setData({'form.bio':'我'.repeat(31)});await editor.saveForm();assert(editor.data.formErrors.bio);assert.notEqual((await api.call('read',{op:'me'})).profile.bio,'我'.repeat(31));
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
 const rules=require('../miniprogram/lib/profile-rules');assert.equal(rules.length('🌿'),1);assert.equal(rules.validate({bio:'🌿'.repeat(30),introduction:'我'.repeat(300)}),'');
 await assert.rejects(api.call('write',{op:'profile',params:{bio:'我'.repeat(31)},key:'long-signature'}),/SIGNATURE_TOO_LONG/);
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
