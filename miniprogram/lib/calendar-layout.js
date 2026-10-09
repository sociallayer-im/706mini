const dates=require('./dates');
const DAY=86400000,MINUTE=60000;
// All columns use the same hour scale. Split across local midnights before
// assigning overlap lanes so overnight events remain reachable on both days.
function timeline(events,dayKeys){
 const days=dayKeys.map(date=>{const start=Date.parse(date+'T00:00:00+08:00'),end=start+DAY;return {date,events:events.filter(e=>Date.parse(e.starts_at)<end&&Date.parse(e.ends_at)>start).map(e=>({...e,startMinute:Math.max(0,(Date.parse(e.starts_at)-start)/MINUTE),endMinute:Math.min(1440,(Date.parse(e.ends_at)-start)/MINUTE),continuesBefore:Date.parse(e.starts_at)<start,continuesAfter:Date.parse(e.ends_at)>end})).sort((a,b)=>a.startMinute-b.startMinute||b.endMinute-a.endMinute)};});
 const all=days.flatMap(d=>d.events);const firstHour=Math.min(9,...all.map(e=>Math.floor(e.startMinute/60))),lastHour=Math.max(22,...all.map(e=>Math.ceil(e.endMinute/60)));
 const hourHeight=120,hours=Array.from({length:lastHour-firstHour+1},(_,i)=>({label:String(i+firstHour).padStart(2,'0')+':00',top:i*hourHeight}));
 for(const day of days){let cluster=[],clusterEnd=-1;const finish=()=>{if(!cluster.length)return;const lanes=[];for(const e of cluster){let lane=lanes.findIndex(end=>end<=e.startMinute);if(lane<0)lane=lanes.length;lanes[lane]=e.endMinute;e.lane=lane;}for(const e of cluster){e.top=(e.startMinute-firstHour*60)*hourHeight/60;e.height=(e.endMinute-e.startMinute)*hourHeight/60;e.left=e.lane*100/lanes.length;e.width=100/lanes.length;e.compact=e.height<100;e.range=dates.format(e.starts_at).slice(11,16)+'–'+dates.format(e.ends_at).slice(11,16);}cluster=[];};for(const e of day.events){if(e.startMinute>=clusterEnd)finish();cluster.push(e);clusterEnd=Math.max(clusterEnd,e.endMinute);}finish();}
 return {days,hours,height:(lastHour-firstHour)*hourHeight,firstHour,lastHour};
}
module.exports={timeline};
