// Preserve the prototype's business copy and counts; keep demo-only additions separate.
const source=require('./prototype');
module.exports=function restore(rows,add,at){
 const find=id=>rows.find(r=>r.id===id);
 const primary=source.people;
 primary.forEach(p=>Object.assign(find('profile-'+p.id),{display_name:p.name,bio:p.bio,city:p.city==='杭州'?'hangzhou':'shanghai',introduction:p.source_id==='jiang'?'关注城市里的公共生活，也喜欢组织桌游和陌生人晚餐。':'喜欢把陌生人聚到一张桌子边，聊一些没有标准答案的问题。',source_id:p.source_id,share_activity:true,visibility:'PUBLIC',interests:['城市观察','纪录片','社区空间'],public_links:[{label:'作品与项目',url:'https://example.com/demo/'+p.source_id+'/works'},{label:'社交媒体',url:'https://example.com/demo/'+p.source_id+'/social'}],frequent_spaces:['demo-space','demo-sola-space']}));
 Object.assign(find('demo-space'),{name:'706 青年空间',introduction:'一个欢迎活动、讨论和偶遇发生的共享空间。',address:'静安区愚园路 1088 号',opening_hours:'每日 10:00–22:00',public_contact:'DEMO_SPACE_CONTACT',allow_event_requests:true});
 Object.assign(find('demo-space-hz'),{name:'杭州 706 客厅',introduction:'从一部电影、一顿晚餐或一次散步开始，讨论居住、迁徙与社区。'});
 Object.assign(find('demo-org'),{name:'Sola 放映组',introduction:'用电影打开现实里的讨论，也认识一起看电影的人。'});
 [['demo-product-org','ORGANIZATION','706 产品小组','参与社区产品共创'],['demo-frisbee-org','ORGANIZATION','飞盘散人局','零基础友好的飞盘活动'],['demo-m50','SPACE','M50 创意园门口','苏州河慢走集合点'],['demo-riverside','SPACE','徐汇滨江草坪','傍晚飞盘集合点'],['demo-sola-space','SPACE','Sola 共创空间','社区共创与交流']].forEach(([id,kind,name,introduction])=>add('entity',id,{kind,name,introduction,city:'shanghai',cover_url:'/assets/demo/cover-1.png'}));
 // Additional old regression scenarios stay distinct from the four original events.
 const paymentEvent={...find('demo-film'),id:'demo-payment-film',review_fixture:true};rows.push(paymentEvent);
 const approvalEvent={...find('demo-workshop'),id:'demo-approval-workshop',review_fixture:true};rows.push(approvalEvent);
 find('demo-reg-payment').parent=paymentEvent.id;find('demo-reg-requested').parent=approvalEvent.id;
 for(const [original,copy] of [['demo-film',paymentEvent.id],['demo-workshop',approvalEvent.id]]){const secret=rows.find(r=>r.type==='eventSecret'&&r.parent===original);if(secret)add('eventSecret','access-'+copy,{parent:copy,access:JSON.parse(JSON.stringify(secret.access))});}
 const day0=new Date(at(0));const local=new Date(day0.getTime()+8*3600000);const untilSaturday=(6-local.getUTCDay()+7)%7||7;
 const elapsed=[0,1,4,7],spaces=['demo-space','demo-m50','demo-space','demo-riverside'],orgs=['demo-org','','demo-product-org','demo-frisbee-org'];
 source.events.forEach((e,i)=>{
  const target=find('demo-'+e.id),host=primary.find(p=>p.name===e.host);const [start,end]=e.time.split('–');
  const time=(s)=>{const [h,m]=s.split(':').map(Number);return new Date(Date.parse(at(untilSaturday+elapsed[i],h))+m*60000).toISOString();};
  Object.assign(target,{title:e.title,summary:e.summary,description:e.summary,fit_description:e.fit,source_id:e.id,source_date:e.source_date+' '+e.source_day+' '+e.time,owner:host.id,host_display:e.host+' & '+e.org,organization_name:e.org,organization_id:orgs[i],space_id:spaces[i],venue_display:e.venue,address:e.address,starts_at:time(start),ends_at:time(end),capacity:e.joined+e.spots,price_minor:e.price*100,approval_required:e.approval,registration_deadline_minutes:120,tags:['城市','轻松交流','新朋友友好'],filter_tags:i===0?['screening']:i===2?[]:['outdoor']});
  const confirmed=rows.filter(r=>r.type==='registration'&&r.parent===target.id&&r.status==='CONFIRMED');
  for(let n=confirmed.length;n<e.joined;n++){
   const owner=n===0&&e.id==='walk'?'demo-member':'demo-attendee-'+n;
   if(!find('profile-'+owner))add('profile','profile-'+owner,{owner,display_name:'同行者 '+(n+1),bio:'社区参与者',city:'shanghai',visibility:'PUBLIC',share_activity:true,suggested:false,avatar_url:'/assets/demo/avatar-'+n%4+'.png'});
   add('registration','prototype-'+e.id+'-'+n,{owner,parent:target.id,status:'CONFIRMED',display_name:find('profile-'+owner).display_name,approval_status:'APPROVED',contact_share_consent:false});
  }
 });
 for(const [original,copy] of [['demo-film',paymentEvent],['demo-workshop',approvalEvent]])Object.assign(copy,{...find(original),id:copy.id,review_fixture:true});
 Object.assign(find('demo-draft'),{title:'周末共读：我们如何一起生活',summary:'选一篇不长的文章，一起读完再聊。',description:'我们会提前一天把文章发到群里。不要求提前读完，也欢迎只带着问题来。',capacity:16,price_minor:0,approval_required:true,starts_at:at(9,14),ends_at:new Date(Date.parse(at(9,16))+1800000).toISOString(),source_date:'2026-10-04 14:00–16:30'});
 Object.assign(find('access-draft'),{access:{type:'GROUP_QR',value:'706-media:demo-access-image'}});
 const c=find('demo-campaign');Object.assign(c,{title:source.campaign.title,kicker:source.campaign.kicker,introduction:source.campaign.summary,banner_description:source.campaign.cities.slice(0,4).join(' · ')+' 等城市同步发生',cities:source.campaign.cities,event_ids:['demo-film','demo-hz-dialog','demo-workshop'],resource_links:['https://example.com/demo/dialog-kit'],resource_description:'统一主题说明、讨论问题和视觉素材'});
 add('event','demo-hz-dialog',{...find('demo-workshop'),id:'demo-hz-dialog',owner:'demo-peer-1',title:'客厅对话：迁徙之后',city:'hangzhou',space_id:'demo-space-hz',venue_display:'杭州 706 客厅',host_display:'夏枝 & 706 客厅对话',capacity:15,price_minor:0,starts_at:at(untilSaturday+6,19),ends_at:at(untilSaturday+6,21),source_date:'10月2日 19:00–21:00'});
 for(let n=0;n<9;n++)add('registration','prototype-hz-'+n,{owner:'demo-attendee-'+n,parent:'demo-hz-dialog',status:'CONFIRMED',approval_status:'APPROVED'});
 add('campaign','demo-open-living-room',{title:'把客厅打开',kicker:'8 城联动 · 社区行动月',introduction:'从一次邻里晚餐开始认识附近的人',cities:['上海','杭州','北京','广州','成都'],event_ids:[],cover_url:'/assets/demo/cover-3.png',visibility:'PUBLIC',status:'PUBLISHED'});
 Object.assign(find('demo-campaign-draft'),{title:'城市里的共同生活',kicker:'6 城共同发起',introduction:'从放映、散步和共读开始，记录人们如何在城市里建立新的连接。',event_ids:['demo-film','demo-workshop'],resource_links:['https://example.com/demo/common-life']});
 find('demo-comment').owner='demo-member';find('demo-comment').text='很想听听大家怎么理解“留下来”。';find('demo-comment').badge='已报名';
 find('demo-reply').text='映后会留出大约 45 分钟讨论，欢迎带着问题来。';
 add('comment','prototype-comment-2',{owner:'demo-admin',parent:'demo-film',text:'朋友推荐了这部片，第一次来 706。',badge:'已推荐'});
 const relations=['你们共同参加过 2 场活动','TA 关注了你','你们都关注 706 青年空间','你们推荐过同一场活动','你们参加过同一场活动','你们都关注社区厨房','你们都喜欢城市漫游','你们都关注线下共读'];primary.forEach((p,i)=>Object.assign(find('profile-'+p.id),{source_bio:p.bio,source_reason:relations[i]}));
 const recommendation=find('demo-rec-0');Object.assign(recommendation,{owner:'demo-host',text:'“周六晚上一起看一部关于城市与漂泊的电影，映后想聊聊我们为什么留在这里。”',display_time:'18 分钟前',source_priority:1});
 // Preserve original preview data separately from additional regression fixtures.
 const originalIds=new Set(source.events.map(e=>'demo-'+e.id));for(const e of rows.filter(r=>r.type==='event'))if(!originalIds.has(e.id)&&e.id!=='demo-hz-dialog')e.review_fixture=true;
 for(const p of primary){const pr=find('profile-'+p.id);pr.public_links=[{kind:'work',label:'作品与项目',url:'https://example.com/demo/'+p.source_id+'/portfolio'},{kind:'work',label:'作品与项目',url:'https://example.com/demo/'+p.source_id+'/projects'},{kind:'social',label:'社交媒体',url:'https://example.com/demo/'+p.source_id+'/social-1'},{kind:'social',label:'社交媒体',url:'https://example.com/demo/'+p.source_id+'/social-2'}];}
 find('profile-demo-member').bio='城市研究 / 社区产品';
 // The prototype detail and comment sheet are independent examples, kept as separate records.
 for(const id of ['demo-comment','demo-reply','prototype-comment-2'])find(id).source_surface='detail';
 add('recommendation','film-discussion-recommendation',{owner:'demo-admin',parent:'demo-film',text:find('prototype-comment-2').text});
 find('prototype-comment-2').recommendation_id='film-discussion-recommendation';
 add('comment','film-sheet-question',{owner:'demo-member',parent:'demo-film',text:'很想听听大家怎么理解“留下来”。映后讨论大概会持续多久？',display_time:'12 分钟前',source_surface:'sheet'});
 add('comment','film-sheet-reply',{owner:'demo-host',parent:'demo-film',reply_to:'film-sheet-question',text:'会留出大约 45 分钟，也欢迎只听不发言。',source_surface:'sheet'});
 add('comment','film-sheet-arrival',{owner:'demo-admin',parent:'demo-film',text:'第一次来 706，需要提前多久到？',display_time:'8 分钟前',source_surface:'sheet'});
 const dinner=find('demo-review');Object.assign(dinner,{title:'城市里的陌生人晚餐',summary:'6 位第一次见面的人，一起做饭、吃饭，再聊一个今晚才揭晓的问题。',description:'6 位第一次见面的人，一起做饭、吃饭，再聊一个今晚才揭晓的问题。',owner:'demo-peer-1',host_display:'夏枝',organization_id:'',venue_display:'706 青年空间',venue_note:'申请使用厨房和公共区域',capacity:6,price_minor:0,approval_required:true,starts_at:at(11,19),ends_at:at(11,22),source_date:'2026-10-06 19:00–22:00',organizer_note:'需要使用厨房的基础厨具，会在结束后完成清洁。希望提前半小时进入布置。'});
 Object.assign(find('demo-review-0'),{scope:'SPACE',entity_id:'demo-space',owner:dinner.owner,title:dinner.title});Object.assign(find('demo-review-1'),{scope:'PLATFORM',owner:dinner.owner,title:dinner.title,status:'APPROVED',decided_by:'demo-host',note:'禾舟 · 今天 10:16'});Object.assign(find('demo-review-2'),{status:'SUPERSEDED'});
 const writing=add('event','demo-writing-review',{...dinner,id:'demo-writing-review',title:'女性写作共读会',owner:'demo-peer-0',host_display:'云汀',summary:'已按意见调整人数',description:'女性写作共读会',capacity:12,starts_at:new Date(Date.parse(at(13,19))+1800000).toISOString(),ends_at:at(13,22),source_date:'2026-10-08 19:30',round:1});add('review','demo-writing-task',{parent:writing.id,owner:writing.owner,title:writing.title,scope:'SPACE',entity_id:'demo-space',subject_type:'event',round:1,status:'PENDING',note:'已按意见调整人数'});
 const progress=add('event','demo-reading-review',{...find('demo-draft'),id:'demo-reading-review',status:'IN_REVIEW',round:1,submitted_display:'今天 10:48'});add('review','demo-reading-platform',{parent:progress.id,owner:progress.owner,title:progress.title,scope:'PLATFORM',subject_type:'event',round:1,status:'APPROVED',decided_by:'demo-host',note:'禾舟 · 已通过'});add('review','demo-reading-space',{parent:progress.id,owner:progress.owner,title:progress.title,scope:'SPACE',entity_id:'demo-space',subject_type:'event',round:1,status:'PENDING',note:'等待星桥审核'});
 Object.assign(find('demo-campaign-review'),{title:'把客厅打开',kicker:'8 城联动 · 社区行动月',introduction:'邀请不同城市的成员打开自家客厅、社区厨房或共享空间，用一顿饭、一场放映或一次闲聊，让附近的人有机会真正认识彼此。',event_ids:['demo-film','demo-walk','demo-workshop','demo-frisbee'],organization_id:'',resource_description:'主题说明、视觉素材和组织建议'});
 for(const review of rows.filter(r=>r.type==='review'&&r.parent==='demo-campaign-review')){review.title='把客厅打开';if(review.scope!=='PLATFORM')review.status='APPROVED';}
 for(const form of rows.filter(r=>['demo-draft','demo-campaign-draft'].includes(r.id)))form.media=[{type:'image',url:form.cover_url,label:form.type==='event'?'活动封面.jpg':'专题封面.jpg'}];
 const access=find('access-film');access.access={type:'GROUP_QR',value:'706-media:demo-access-image',methods:[{type:'GROUP_QR',value:'706-media:demo-access-image'},{type:'ORGANIZER_WECHAT',value:'DEMO_HOST_NO_REAL_ACCOUNT'}]};find('access-demo-payment-film').access=JSON.parse(JSON.stringify(access.access));find('access-walk').access={type:'GROUP_QR',value:'706-media:demo-access-image',methods:[{type:'GROUP_QR',value:'706-media:demo-access-image'},{type:'ORGANIZER_WILL_CONTACT',value:'演示发起者稍后联系，不会发送实际消息。'}]};
 for(const r of rows.filter(r=>r.type==='notification'))r.review_fixture=true;
 const groupEvent=add('event','demo-group-film',{...find('demo-film'),id:'demo-group-film',review_fixture:true});add('eventSecret','access-demo-group-film',{parent:groupEvent.id,access:JSON.parse(JSON.stringify(access.access))});add('registration','demo-reg-group',{owner:'demo-member',parent:groupEvent.id,status:'CONFIRMED',display_name:'林叶',approval_status:'APPROVED'});
 const originalNotes=[['ADMIN','一场活动等待你审核','「城市里的陌生人晚餐」申请使用 706 青年空间。','10:22','approvals',''],['ADMIN','一个专题等待你审核','「把客厅打开」关联了 4 场活动，申请公开展示。','09:48','campaign-approval-detail','demo-campaign-task-0'],['EVENT','活动报名申请已通过','下一步：完成付款并查看活动群或组织者联系方式。','昨天','event-access','demo-reg-payment'],['SOCIAL','禾舟关注了你','你们现在互相关注，可以在动态里看到彼此的活动。','昨天','member','demo-host'],['EVENT','活动地点有更新','「苏州河慢走」集合点改为 M50 创意园 3 号门。','周四','event','demo-walk'],['ADMIN','你已成为空间管理员','现在可以管理 706 青年空间的信息与活动审核。','周一','space','demo-space']];
 for(const owner of ['demo-member','demo-host','demo-admin'])originalNotes.forEach(([category,title,description,display_time,route,id],n)=>add('notification','prototype-note-'+owner+'-'+n,{owner,category,title,description,display_time,status:n<4?'UNREAD':'READ',...(category==='SOCIAL'?{actor_id:'demo-host'}:{}),target:{route,id},source_priority:n}));
 // Original personal lists have four business states; regression cases remain reachable in the lab.
 const endedWalk=add('event','demo-ended-host-walk',{...find('demo-walk'),id:'demo-ended-host-walk',owner:'demo-host',starts_at:at(-7,15),ends_at:at(-7,18),review_fixture:true,source_mine:true,mine_order:2});
 for(let n=0;n<15;n++)add('registration','ended-walk-'+n,{owner:'demo-attendee-'+n,parent:endedWalk.id,status:'CONFIRMED',approval_status:'APPROVED'});
 for(let n=0;n<4;n++)add('comment','ended-walk-comment-'+n,{owner:primary[n].id,parent:endedWalk.id,text:'一次愉快的城市慢走。'});
 const endedFrisbee=add('event','demo-ended-frisbee',{...find('demo-frisbee'),id:'demo-ended-frisbee',starts_at:at(-8,17),ends_at:at(-8,19),review_fixture:true});
 add('registration','demo-reg-ended-frisbee',{owner:'demo-member',parent:endedFrisbee.id,status:'CONFIRMED',approval_status:'APPROVED',display_name:'林叶'});
 for(const r of rows.filter(r=>r.type==='registration'&&r.owner==='demo-member'))r.review_fixture=true;
 ['demo-reg-requested','demo-reg-payment','prototype-walk-0','demo-reg-ended-frisbee'].forEach((id,i)=>Object.assign(find(id),{source_mine:true,mine_order:i,list_note:['发起人通常会在 24 小时内处理','申请已通过，请在 30 分钟内完成付款','集合点已更新为 M50 创意园 3 号门','活动已结束，可以再次报名同类活动'][i]}));
 Object.assign(find('demo-reading-review'),{source_mine:true,mine_order:0,list_note:'等待 706 青年空间审核'});
 Object.assign(find('demo-film'),{mine_order:1});Object.assign(find('demo-draft'),{source_mine:true,mine_order:3,saved_display:'今天 16:42',edit_step:1});
 // Directory and relation totals are backed by records, never display-only numbers.
 for(const id of ['demo-m50','demo-riverside'])find(id).directory_listed=false;
 Object.assign(find('demo-space'),{district:'静安',distance_label:'1.2 km'});
 Object.assign(find('demo-sola-space'),{district:'徐汇',distance_label:'3.8 km',cover_url:'/assets/demo/cover-2.png'});
 const ensurePerson=(id,n)=>find('profile-'+id)||add('profile','profile-'+id,{owner:id,display_name:'邻里 '+(n+1),bio:'社区参与者',city:'shanghai',visibility:'PUBLIC',share_activity:true,suggested:false,avatar_url:'/assets/demo/avatar-'+n%4+'.png'});
 [['demo-space',12,2],['demo-sola-space',6,2]].forEach(([space,attendees,count])=>{
  for(let i=0;i<count;i++){
   const id='directory-'+space+'-'+i;
   add('event',id,{...find('demo-workshop'),id,title:['邻里共读与交流','周末共享餐桌'][i],space_id:space,venue_display:find(space).name,organization_id:'',host_display:'禾舟',owner:'demo-host',capacity:attendees+4,starts_at:at(2+i,14),ends_at:at(2+i,16),directory_fixture:true,review_fixture:true});
   for(let n=0;n<attendees;n++){const owner=id+'-member-'+n;ensurePerson(owner,i*attendees+n);add('registration',id+'-reg-'+n,{parent:id,owner,status:'CONFIRMED',approval_status:'APPROVED'});}
  }
 });
 const spaceFollow=find('demo-follow-2');spaceFollow.status='INACTIVE';
 const connect=(owner,parent)=>{const prior=rows.find(r=>r.type==='follow'&&r.owner===owner&&r.parent===parent);if(prior)prior.status='ACTIVE';else add('follow','source-follow-'+owner+'-'+parent,{owner,parent});};
 const others=primary.filter(p=>p.id!=='demo-member').map(p=>p.id);
 for(let n=0;n<35;n++){const id='demo-connection-'+n;ensurePerson(id,n);others.push(id);}
 others.slice(0,18).forEach(id=>connect('demo-member',id));
 others.forEach(id=>connect(id,'demo-member'));
 // Populate the original other-member totals from actual directed follow edges.
 const connectionIds=Array.from({length:128},(_,n)=>{const id='demo-connection-'+n;ensurePerson(id,n);return id;});
 for(const person of primary.filter(p=>p.id!=='demo-member')){
  const following=()=>rows.filter(r=>r.type==='follow'&&r.owner===person.id&&r.status==='ACTIVE').length;
  const followers=()=>rows.filter(r=>r.type==='follow'&&r.parent===person.id&&r.status==='ACTIVE').length;
  for(const id of connectionIds){if(following()>=32)break;connect(person.id,id);}
  for(const id of connectionIds){if(followers()>=128)break;connect(id,person.id);}
 }
 // All eight source members really participate in the two source history cards.
 for(const eventId of ['demo-film','demo-workshop']){
  const registrations=rows.filter(r=>r.type==='registration'&&r.parent===eventId&&r.status==='CONFIRMED');
  registrations.forEach((r,n)=>{const owner=n<primary.length?primary[n].id:'demo-attendee-'+(n-primary.length);Object.assign(r,{owner,display_name:find('profile-'+owner).display_name,review_fixture:true});});
 }
 // Historical participation backs the source's 16 / 23 community-activity metric.
 for(let n=0;n<23;n++)add('event','profile-history-'+n,{...find('demo-workshop'),id:'profile-history-'+n,title:'社区共创记录 '+(n+1),starts_at:at(-30-n,14),ends_at:at(-30-n,16),review_fixture:true,history_fixture:true});
 for(const person of primary){
  const existing=new Set(rows.filter(r=>r.type==='registration'&&r.owner===person.id&&r.status==='CONFIRMED'&&find(r.parent)?.status==='PUBLISHED'&&!['MEMBERS','UNLISTED'].includes(find(r.parent)?.visibility)).map(r=>r.parent));
  const target=person.id==='demo-member'?16:23;
  for(let n=0;n<target-existing.size;n++)add('registration','history-'+person.id+'-'+n,{owner:person.id,parent:'profile-history-'+n,status:'CONFIRMED',approval_status:'APPROVED',review_fixture:true});
 }
 find('demo-review').source_review=true;find('demo-writing-review').source_review=true;Object.assign(find('demo-campaign-other-owner'),{status:'PENDING',event_id:'demo-workshop',title:'工作坊发起人关联确认'});find('prototype-note-demo-member-1').target.id='demo-campaign-other-owner';
 // renderEvent and the comment sheet explicitly share the same example copy across all four events.
 // Give each event independent records; never rewrite another event's discussion on navigation.
 const discussionExamples=rows.filter(r=>r.type==='comment'&&r.parent==='demo-film');
 for(const id of ['walk','workshop','frisbee']){
  const parent='demo-'+id,ids=Object.fromEntries(discussionExamples.map(r=>[r.id,id+'-'+r.id]));
  const recommendationId=id+'-discussion-recommendation';
  add('recommendation',recommendationId,{owner:'demo-admin',parent,text:find('prototype-comment-2').text});
  for(const row of discussionExamples)add('comment',ids[row.id],{...row,id:ids[row.id],parent,reply_to:row.reply_to?ids[row.reply_to]:null,...(row.recommendation_id?{recommendation_id:recommendationId}:{})});
 }
 // Existing public history records also back the source's recent-hosted-event count.
 for(const [owner,offset,count] of [['demo-peer-0',0,4],['demo-admin',4,3]])for(let n=0;n<count;n++)Object.assign(find('profile-history-'+(offset+n)),{owner,organization_id:'',organization_name:'个人发起',host_display:find('profile-'+owner).display_name});
 // The Hangzhou row has only its own source fields; never inherit Shanghai workshop content.
 add('entity','demo-dialog-org',{kind:'ORGANIZATION',name:'706 客厅对话',introduction:'在不同城市讨论居住、迁徙与社区。',city:'hangzhou',directory_listed:false});
 Object.assign(find('demo-hz-dialog'),{source_id:'hangzhou-dialog',summary:'',description:'',fit_description:'',organization_id:'demo-dialog-org',organization_name:'706 客厅对话',address:'',tags:[],host_display:'夏枝 & 706 客厅对话'});
 // The self dashboard owns its own drafts/review records; no persona switch on menu clicks.
 add('role','self-product-admin',{owner:'demo-member',parent:'demo-product-org',scope:'ENTITY',role:'OWNER'});
 add('role','self-space-admin',{owner:'demo-member',parent:'demo-space',scope:'ENTITY',role:'ADMIN'});
 add('event','self-reading-draft',{...find('demo-draft'),id:'self-reading-draft',owner:'demo-member',source_mine:true,review_fixture:true});
 add('event','self-reading-review',{...find('demo-reading-review'),id:'self-reading-review',owner:'demo-member',source_mine:true,review_fixture:true});
 add('review','self-reading-platform',{parent:'self-reading-review',owner:'demo-member',scope:'PLATFORM',subject_type:'event',round:1,status:'PENDING'});
 add('campaign','self-campaign-review',{...find('demo-campaign-review'),id:'self-campaign-review',owner:'demo-member',event_ids:['demo-workshop'],status:'IN_REVIEW'});
 add('review','self-campaign-platform',{parent:'self-campaign-review',owner:'demo-member',scope:'PLATFORM',subject_type:'campaign',round:1,status:'PENDING'});
 find('demo-campaign').media=[{type:'image',url:find('demo-campaign').cover_url,label:'系列封面.jpg'}];
 require('./member-relations')(rows);
 return {people:primary.map(p=>({source_id:p.source_id,id:p.id}))};
};
