const theme=require('../../lib/theme');
Component({
 options:{virtualHost:true,styleIsolation:'isolated'},data:{theme:theme.style()},
 properties:{item:{type:Object,value:{}},t:{type:Object,value:{}},currentUser:String,locale:String,busy:Boolean,surface:{type:String,value:'detail'}},
 methods:{
  member(){const item=this.properties.item;this.triggerEvent('interaction',{handler:'navigate',dataset:{route:'member',id:item.owner||item.author?.owner},detail:{}});},
  reply(){this.triggerEvent('interaction',{handler:'sheet',dataset:{kind:'comment',reply:this.properties.item.id},detail:{}});},
  remove(){if(!this.properties.busy&&this.properties.item.owner===this.properties.currentUser)this.triggerEvent('interaction',{handler:'action',dataset:{op:'deleteComment',id:this.properties.item.id},detail:{}});},
  removeReply(e){const id=e.currentTarget.dataset.id;if(!this.properties.busy&&id)this.triggerEvent('interaction',{handler:'action',dataset:{op:'deleteComment',id},detail:{}});}
 }
});
