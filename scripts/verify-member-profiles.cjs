const assert=require('node:assert/strict'),store=new Map();
global.wx={getStorageSync:k=>store.get(k),setStorageSync:(k,v)=>store.set(k,structuredClone(v)),removeStorageSync:k=>store.delete(k),showToast(){},setTabBarItem(){},setNavigationBarTitle(){},hideTabBar(){},showTabBar(){},request(){throw Error('UNEXPECTED_NETWORK')}};
const mock=require('../miniprogram/lib/mock'),api=require('../miniprogram/lib/api'),factory=require('../miniprogram/lib/page');
const read=(op,params)=>api.call('read',{op,params});
(async()=>{
 mock.reset();const s=mock.state();s.memberReviewRevision='old';const campaign=s.rows.find(r=>r.id==='demo-campaign');campaign.status='IN_REVIEW';campaign.cover_url='/assets/demo/cover-2.png';const before=JSON.stringify(campaign);const roles=JSON.stringify(s.rows.filter(r=>r.type==='role'));store.set('706.form.draft', {title:'preserve'});mock.configure(s);assert.equal(JSON.stringify(mock.state().rows.find(r=>r.id===campaign.id)),before);assert.equal(JSON.stringify(mock.state().rows.filter(r=>r.type==='role')),roles);assert.deepEqual(store.get('706.form.draft'),{title:'preserve'});
 for(const p of require('../miniprogram/lib/mock/prototype').people){const m=await read('member',{id:p.id});assert.deepEqual(m.frequent_entities.map(x=>x.id),['demo-product-org','demo-space']);assert.equal(m.frequent_entities[0].contribution,'参与产品共创');assert.equal(m.frequent_entities[1].participation_count,6);assert.equal(m.public_links.length,4);assert.equal(m.bio,p.bio);assert.deepEqual(m.items.map(x=>x.id).sort(),['demo-film','demo-workshop']);}
 const c=factory('member');c.data=structuredClone(c.data);c.setData=v=>Object.assign(c.data,v);c.onLoad({id:'demo-host'});await c.load();assert.deepEqual(c.data.memberLinks.map(x=>x.kind),['work','social']);assert.equal(c.data.record.public_links.length,4);assert.equal(c.onShareAppMessage().path,'/pages/member/index?id=demo-host');
 let clip;wx.setClipboardData=({data})=>clip=data;c.copy({currentTarget:{dataset:{value:c.data.memberLinks[0].url}}});assert.equal(clip,'https://example.com/demo/qiao/portfolio');
 let target;wx.navigateTo=({url})=>target=url;c.navigate({currentTarget:{dataset:{route:'relations',id:'demo-host',extra:{mode:'followers'}}}});assert.match(target,/id=demo-host/);assert.match(target,/mode=followers/);
 const initial=mock.state();const edit=fn=>{const d=structuredClone(initial);fn(d);mock.configure(d);};
 edit(d=>d.rows.find(r=>r.id==='history-demo-host-0').status='CANCELLED');assert.equal((await read('member',{id:'demo-host'})).frequent_entities[1].participation_count,5);
 edit(d=>d.rows.push({...d.rows.find(r=>r.id==='history-demo-host-0'),id:'duplicate'}));assert.equal((await read('member',{id:'demo-host'})).frequent_entities[1].participation_count,6);
 edit(d=>d.rows.find(r=>r.id==='profile-history-0').visibility='UNLISTED');assert.equal((await read('member',{id:'demo-host'})).frequent_entities[1].participation_count,5);
 edit(d=>d.rows.find(r=>r.id==='profile-demo-host').share_activity=false);assert.equal((await read('member',{id:'demo-host'})).frequent_entities[1].participation_count,null);
 edit(d=>d.rows.find(r=>r.id==='member-product-demo-host').status='INACTIVE');assert.deepEqual((await read('member',{id:'demo-host'})).frequent_entities.map(x=>x.id),['demo-space']);
 edit(d=>d.rows.find(r=>r.id==='demo-space').status='INACTIVE');assert.deepEqual((await read('member',{id:'demo-host'})).frequent_entities.map(x=>x.id),['demo-product-org']);
 mock.reset();await api.call('write',{op:'profile',params:{bio:'本人新保存的简介'},key:'member-bio-check'});assert.equal((await read('member',{id:'demo-member'})).bio,'本人新保存的简介');
 console.log('Member profiles: 8 record-derived affiliations/counts; migration preservation, privacy/cancellation/deduplication, first links, visitor navigation/share passed; networkCalls=0');
})().catch(e=>{console.error(e);process.exitCode=1});
