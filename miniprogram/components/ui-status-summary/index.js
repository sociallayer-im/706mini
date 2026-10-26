const theme=require('../../lib/theme');
Component({options:{virtualHost:true,styleIsolation:'isolated',multipleSlots:true},data:{theme:theme.style()},properties:{title:String,icon:String,description:String,custom:{type:Boolean,value:true},actions:Boolean}});
