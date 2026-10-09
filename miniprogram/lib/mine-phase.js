// One display phase for personal lists, derived from lifecycle and event dates.
module.exports=function minePhase(item){
 const event=item.event||item,ended=event.ends_at&&Date.parse(event.ends_at)<Date.now();
 if(item.type==='registration')return item.status==='CONFIRMED'?(ended?'ENDED':'UPCOMING'):item.status;
 return item.status==='PUBLISHED'&&ended?'ENDED':item.status;
};
