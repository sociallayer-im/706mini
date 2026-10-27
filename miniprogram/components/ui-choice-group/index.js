const theme = require('../../lib/theme');
Component({
 options:{virtualHost:true,styleIsolation:'isolated'},
 properties:{
  options:{type:Array,value:[]}, value:{type:Array,value:[]},
  mode:{type:String,value:'multiple'}, layout:{type:String,value:'list'},
  valueKey:{type:String,value:'value'}, labelKey:{type:String,value:'label'},
  max:{type:Number,value:0}, disabled:Boolean, label:String, eventDetails:Boolean, appearance:{type:String,value:'form'}
 },
 data:{theme:theme.style(),ink:theme.tokens.ink,items:[]},
 observers:{'options,value,mode,max,disabled,valueKey,labelKey':function(){this.sync();}},
 lifetimes:{attached(){this.sync();}},
 methods:{
  sync(){
   const p=this.properties, selected=p.value||[], full=p.mode!=='single'&&p.max>0&&selected.length>=p.max;
   this.setData({items:(p.options||[]).map(o=>{const value=String(o[p.valueKey]),checked=selected.includes(value);return {...o,eventMeta:require('../../lib/display-metadata').join(o.dateLabel,o.cityLabel||o.city,o.venue_display),value,label:o[p.labelKey],checked,unavailable:!!(p.disabled||o.disabled||full&&!checked)};})});
  },
  filterPress(e){const p=this.properties,v=String(e.currentTarget.dataset.value),item=this.data.items.find(x=>x.value===v);if(p.disabled||!item||item.unavailable)return;if(p.mode==='single'&&(p.value||[]).includes(v))return;this.change({detail:{value:p.mode==='single'?v:(p.value||[]).includes(v)?p.value.filter(x=>x!==v):[...(p.value||[]),v]}});},
  change(e){
   const p=this.properties, raw=p.mode==='single'?[e.detail.value]:e.detail.value;
   const selected=new Set(raw),before=new Set(p.value||[]);
   // Disabled values cannot be changed by native events; preserve hidden selections in filtered lists.
   const visible=new Set(this.data.items.map(o=>o.value));
   const next=(p.value||[]).filter(v=>!visible.has(v));
   for(const o of this.data.items){if(o.unavailable?before.has(o.value):selected.has(o.value))next.push(o.value);}
   if(p.mode==='single')next.splice(0,next.length,...raw.filter(v=>this.data.items.some(o=>o.value===v&&!o.unavailable)).slice(0,1));
   if(p.disabled||p.max>0&&next.length>p.max)return this.sync();
   this.triggerEvent('change',{value:next});
  }
 }
});
