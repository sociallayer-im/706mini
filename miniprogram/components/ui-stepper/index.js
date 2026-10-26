const theme=require('../../lib/theme');
Component({options:{virtualHost:true,styleIsolation:'isolated',multipleSlots:true},data:{theme:theme.style()},properties:{items:Array,current:Number,},methods:{press(e){if(!this.data.disabled&&!this.data.loading)this.triggerEvent('press',e.detail||{});},}});
