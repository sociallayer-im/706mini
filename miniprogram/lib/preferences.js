const defaults = {city:'shanghai',locale:'zh-CN'};
function get() { return {...defaults, ...wx.getStorageSync('706.preferences')}; }
function set(values) { const next = {...get(),...values}; wx.setStorageSync('706.preferences',next); return next; }
module.exports = {get,set};
