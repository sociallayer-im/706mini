// Align application controls with WeChat's real menu capsule. Dimensions are
// CSS pixels, not rpx; the right-hand exclusion area must survive device changes.
module.exports=function navigationLayout(runtime){
 let windowInfo={},menu;
 try{windowInfo=runtime.getWindowInfo?runtime.getWindowInfo():{};}catch(e){}
 const width=windowInfo.windowWidth||375,statusBar=windowInfo.statusBarHeight||20;
 try{menu=runtime.getMenuButtonBoundingClientRect?.();}catch(e){}
 if(!menu||!Number.isFinite(menu.top)||menu.height<=0||menu.left<=0){
  menu={top:statusBar+8,height:32,left:width-104};
 }
 // A menu capsule is visual chrome, not the height of our interactive controls.
 const navigationHeight=Math.max(menu.height,parseFloat(require('./theme').tokens.touchTarget)),navigationTop=Math.max(statusBar,menu.top-(navigationHeight-menu.height)/2);
 return {navigationTop,navigationHeight,menuTop:menu.top,menuHeight:menu.height,menuRightInset:Math.max(104,width-menu.left+12),headerHeight:navigationTop+navigationHeight+24};
};
