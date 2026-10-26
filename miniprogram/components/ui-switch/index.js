const theme=require('../../lib/theme');
Component({options:{virtualHost:true,styleIsolation:'isolated'},data:{theme:theme.style(),accent:theme.tokens.accent},properties:{checked:Boolean,label:String,color:String,disabled:Boolean},methods:{change(e){this.triggerEvent('change',e.detail);}}});
