const theme=require('../../lib/theme');
Component({
 options:{virtualHost:true,styleIsolation:'isolated',multipleSlots:true},
 data:{theme:theme.style()},
 properties:{icon:String,label:String,disabled:Boolean,loading:Boolean},
 methods:{press(e){if(!this.properties.disabled&&!this.properties.loading)this.triggerEvent('press',e.detail||{});}}
});
