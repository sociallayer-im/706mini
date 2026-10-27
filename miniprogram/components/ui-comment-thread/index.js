const theme=require('../../lib/theme');
Component({
 options:{virtualHost:true,styleIsolation:'isolated'},data:{theme:theme.style(),expanded:false,visibleReplies:[],hiddenReplyCount:0},
 properties:{item:{type:Object,value:{}},t:{type:Object,value:{}},currentUser:String,locale:String,busy:Boolean,surface:{type:String,value:'detail'}},
 observers:{item(){this.syncReplies(this.replyParentId===this.properties.item.id&&this.data.expanded);}},
 methods:{
  syncReplies(expanded=false){const item=this.properties.item||{},replies=(item.replies||[]).map((reply,index)=>({reply,index,time:Date.parse(reply.created_at)})).sort((a,b)=>Number.isFinite(a.time)&&Number.isFinite(b.time)?a.time-b.time||a.index-b.index:a.index-b.index).map(x=>x.reply);this.replyParentId=item.id;this.setData({expanded:!!expanded,visibleReplies:expanded?replies:replies.slice(0,2),hiddenReplyCount:Math.max(0,replies.length-2)});},
  toggleReplies(){this.syncReplies(!this.data.expanded);},
  member(){const item=this.properties.item;this.triggerEvent('interaction',{handler:'navigate',dataset:{route:'member',id:item.owner||item.author?.owner},detail:{}});},
  reply(){this.triggerEvent('interaction',{handler:'sheet',dataset:{kind:'comment',reply:this.properties.item.id},detail:{}});},
  remove(){if(!this.properties.busy&&this.properties.item.owner===this.properties.currentUser)this.triggerEvent('interaction',{handler:'action',dataset:{op:'deleteComment',id:this.properties.item.id},detail:{}});},
  removeReply(e){const id=e.currentTarget.dataset.id,reply=(this.properties.item.replies||[]).find(x=>x.id===id);if(!this.properties.busy&&reply?.owner===this.properties.currentUser)this.triggerEvent('interaction',{handler:'action',dataset:{op:'deleteComment',id},detail:{}});}
 }
});
