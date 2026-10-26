const theme=require('../../lib/theme');
Component({
 options:{virtualHost:true,styleIsolation:'isolated'},data:{theme:theme.style(),indicatorColor:theme.tokens.line,indicatorActiveColor:theme.tokens.ink},
 properties:{cards:{type:Array,value:[]},isNodes:Boolean,current:Number,city:String,locale:String,demo:Boolean,illustrations:Object},
 methods:{
  change(e){this.triggerEvent('interaction',{handler:this.properties.isNodes?'nodeChange':'bannerChange',dataset:{},detail:e.detail});},
  open(e){this.triggerEvent('interaction',{handler:'navigate',dataset:e.currentTarget.dataset,detail:{}});}
 }
});
