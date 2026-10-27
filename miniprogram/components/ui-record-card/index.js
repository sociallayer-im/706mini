const theme=require('../../lib/theme');
Component({
 options:{virtualHost:true,styleIsolation:'isolated',multipleSlots:true},data:{theme:theme.style()},
 properties:{actionRail:Boolean,cover:String,eyebrow:String,prose:Boolean,status:String,title:String,description:String,meta:String,interactive:Boolean,disabled:Boolean,loading:Boolean,custom:Boolean,tone:{type:String,value:'neutral'}},
 methods:{press(e){if(this.properties.interactive&&!this.properties.disabled&&!this.properties.loading)this.triggerEvent('press',e.detail||{});},stop(){}}
});
