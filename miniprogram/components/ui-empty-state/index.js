const theme=require('../../lib/theme');
Component({options:{virtualHost:true,styleIsolation:'isolated',multipleSlots:true},data:{theme:theme.style()},properties:{title:String,description:String,icon:String,action:String,disabled:Boolean,},methods:{press(e){if(!this.data.disabled&&!this.data.loading)this.triggerEvent('press',e.detail||{});},}});
