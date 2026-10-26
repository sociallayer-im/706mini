const theme=require('../../lib/theme');
Component({options:{virtualHost:true,styleIsolation:'isolated'},data:{theme:theme.style()},properties:{src:String,name:String,locale:String,disabled:Boolean},methods:{choose(e){if(!this.data.disabled&&e.detail.avatarUrl)this.triggerEvent('chooseavatar',e.detail);}}});
