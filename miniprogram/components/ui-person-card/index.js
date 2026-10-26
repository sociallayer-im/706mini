const theme=require('../../lib/theme');
Component({
 options:{virtualHost:true,styleIsolation:'isolated'},data:{theme:theme.style()},
 properties:{person:{type:Object,value:{}},t:{type:Object,value:{}},locale:String,reason:String,disabled:Boolean},
 methods:{
  stop(){},
  open(){this.triggerEvent('interaction',{handler:'navigate',dataset:{route:'member',id:this.properties.person.owner},detail:{}});},
  follow(){if(!this.properties.disabled)this.triggerEvent('interaction',{handler:'personFollow',dataset:{id:this.properties.person.owner,enabled:!this.properties.person.following},detail:{}});}
 }
});
