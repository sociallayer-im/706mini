const theme=require('../../lib/theme');
Component({
 options:{virtualHost:true,styleIsolation:'isolated',multipleSlots:true},data:{theme:theme.style()},
 properties:{item:{type:Object,value:{}},locale:String,interactive:{type:Boolean,value:true},disabled:Boolean,custom:Boolean,variant:{type:String,value:'cover'}},
 methods:{press(e){if(this.properties.interactive&&!this.properties.disabled)this.triggerEvent('press',e.detail||{});},stop(){}}
});
