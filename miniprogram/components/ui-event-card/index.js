const theme=require('../../lib/theme');
const illustrations=require('../../lib/illustrations');
Component({
 options:{virtualHost:true,styleIsolation:'isolated'},
 data:{theme:theme.style()},
 properties:{e:{type:Object,value:{}},t:{type:Object,value:{}},illustrations:{type:Object,value:illustrations},large:Boolean,interactiveTitle:Boolean,previewOnly:Boolean,modalOpen:Boolean,cardRoute:{type:String,value:'event'}},
 methods:{
  interaction(handler,dataset,detail={}){this.triggerEvent('interaction',{handler,dataset,detail});},
  open(){if(this.properties.previewOnly){this.interaction('previewDraft',{});return;}this.interaction('openEvent',{id:this.properties.e.id,route:this.properties.cardRoute||'event'});},
  titleOpen(){this.open();},
  preview(){if(this.properties.previewOnly)return this.open();if(this.properties.e.cover_url)this.interaction('previewImage',{url:this.properties.e.cover_url});},
  coverError(){this.interaction('coverError',{id:this.properties.e.id});}
 }
});
