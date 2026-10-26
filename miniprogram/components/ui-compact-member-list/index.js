const theme=require('../../lib/theme');
Component({
 options:{virtualHost:true,styleIsolation:'isolated'},
 data:{theme:theme.style()},
 properties:{people:{type:Array,value:[]}},
 methods:{
  open(e){
   const id=e.currentTarget.dataset.id;
   if(id)this.triggerEvent('interaction',{handler:'navigate',dataset:{route:'member',id}});
  }
 }
});
