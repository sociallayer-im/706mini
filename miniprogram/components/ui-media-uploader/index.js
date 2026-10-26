const theme=require('../../lib/theme'),illustrations=require('../../lib/illustrations');
Component({options:{virtualHost:true,styleIsolation:'isolated'},data:{theme:theme.style(),illustrations},properties:{media:{type:Array,value:[]},mediaCoverIndex:{type:Number,value:-1},dragIndex:{type:Number,value:-1},dragTarget:{type:Number,value:-1},dragX:Number,dragY:Number,busy:Boolean,locale:String,route:String,formKind:String,t:{type:Object,value:{}}},methods:{
 emit(e,handler,extra){const source=e.currentTarget?.dataset||{},dataset={...source};delete dataset.handler;this.triggerEvent('interaction',{handler:handler||source.handler,dataset,detail:e.detail||{},touches:e.touches||[],changedTouches:e.changedTouches||[],...extra});},
 dispatch(e){const handler=e.currentTarget.dataset.handler;if(this.properties.busy&&['upload','mediaLink','mediaRemove','mediaTouchStart','mediaDragStart'].includes(handler))return;this.emit(e,handler);},
 move(e){this.emit(e,'mediaDragMove');},end(e){this.emit(e,'mediaDragEnd');},cancel(e){this.emit(e,'mediaDragCancel');},keyboard(e){this.emit(e,'keyboardChange');},
 ignore(e){this.emit(e,'mediaIgnoreDrag');},
 dragStart(e){if(this.properties.busy)return;this.createSelectorQuery().selectAll('.media-tile').boundingClientRect(rects=>{if(this.properties.busy)return;this.emit(e,'mediaDragStart',{mediaRects:rects||[]});}).exec();}
}});
