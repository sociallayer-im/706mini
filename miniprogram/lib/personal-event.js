const dates=require('./dates');
// Personal progress is separate from the public event's booking state.
module.exports=function personalEvent(item,mode,locale,t){
 const en=locale==='en',event=item.event||item,phase=item.phase||item.status,draft=mode==='drafts'||phase==='DRAFT',actions=[];
 const add=(label,route,variant='secondary',op)=>actions.push({label,route,variant,op,id:item.id});
 let state=draft?(en?'Draft · Step ':'草稿 · 第 ')+(item.edit_step||1)+(en?'':' 步'):item.phaseLabel||item.statusLabel;
 let note='';
 if(mode==='registrations'){
  note=en?(phase==='REQUESTED'?'Waiting for the organizer to review your application.':phase==='APPROVED_AWAITING_PAYMENT'?'Complete payment to secure your place.':item.statusLabel):(item.list_note||item.statusLabel);
  add(phase==='APPROVED_AWAITING_PAYMENT'?(en?'Complete payment':'去付款'):(en?'Registration details':'查看报名详情'),'event-access',phase==='APPROVED_AWAITING_PAYMENT'?'primary':'secondary');
 }else if(draft||phase==='CHANGES_REQUESTED'){
  note=phase==='CHANGES_REQUESTED'?item.list_note||'':'';
  add(draft?(en?'Continue editing':'继续编辑'):t.edit,'publish','primary');
  if(draft)add(en?'Delete draft':'删除草稿','','danger','deleteDraft');
 }else if(phase==='IN_REVIEW'){
  note=item.list_note||t.progress;add(t.progress,'approval-progress');add(t.edit,'publish','secondary');
 }else{
  note=[event.registered!=null?event.registered+' '+t.registered:'',phase==='PUBLISHED'&&event.remaining!=null?event.remaining+' '+t.remaining:'',phase==='ENDED'&&event.comment_count!=null?event.comment_count+' '+t.comments:''].filter(Boolean).join(' · ');
  add(en?'View event':'查看活动','event');
  if(phase==='PUBLISHED'){add(t.edit,'publish');add(t.attendees,'attendees');}
  if(phase==='ENDED')add(t.clone,'','secondary','clone');
 }
 const saved=dates.format(item.saved_display||item.updated_at,locale);
 return {event,state,note,actions,stamp:draft&&saved?(en?'Saved ':'保存于 ')+saved:'',target:mode==='registrations'?'event':draft||phase==='CHANGES_REQUESTED'?'activity-preview':'event',date:event.dateLine||(en?'Time to be confirmed':'时间待定'),venue:event.venue_display||event.venue_name||(en?'Location to be confirmed':'地点待定'),host:event.hostLine||event.host_display,fee:event.feeLabel};
};
