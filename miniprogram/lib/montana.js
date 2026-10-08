const config = require('../config');
let socket, opening, seq = 0;
const pending = new Map();
const key = '706.session';
function error(code, message) { return Object.assign(new Error(message || code), {code}); }
function request(path, data, method = 'POST') {
  return new Promise((resolve, reject) => wx.request({
    url: config.apiURI + path, method, data, timeout: 20000,
    header: {'content-type': 'application/json'},
    success(r) { if (r.statusCode >= 200 && r.statusCode < 300) resolve(r.data);
      else reject(error(r.data?.error?.code || r.data?.type || 'REQUEST_FAILED', r.data?.error?.message || r.data?.message)); },
    fail() { reject(error('NETWORK', 'NETWORK')); }
  }));
}
function session() { return wx.getStorageSync(key) || null; }
function close(closeTransport = true) {
  const old = socket; socket = null; opening = null;
  if (old && closeTransport) old.close({code:1000,fail() { /* A failed handshake may have no native task left. */ }});
  for (const p of pending.values()) { clearTimeout(p.timer); p.reject(error('NETWORK')); }
  pending.clear();
}
function send(message) {
  return new Promise((resolve, reject) => {
    const id = '706-' + Date.now() + '-' + (++seq);
    const timer = setTimeout(() => { pending.delete(id); reject(error('TIMEOUT')); }, 20000);
    pending.set(id, {resolve, reject, timer});
    socket.send({data:JSON.stringify({...message, 'client-event-id':id}), fail() {
      clearTimeout(timer); pending.delete(id); reject(error('NETWORK'));
    }});
  });
}
function connect() {
  if (opening) return opening;
  opening = new Promise((resolve, reject) => {
    const current = wx.connectSocket({url:config.websocketURI, fail(e) { close(false); reject(error(/domain|域名/i.test(e?.errMsg||'')?'DOMAIN_NOT_ALLOWED':'NETWORK')); }});
    socket = current;
    const timer = setTimeout(() => { close(); reject(error('TIMEOUT')); }, 20000);
    current.onOpen(async () => {
      try {
        const saved = session();
        const reply = await send({op:'init','app-id':config.appId,'refresh-token':saved?.refresh_token || saved?.['refresh-token']});
        if (saved && !reply.auth?.user) { wx.removeStorageSync(key); throw error('LOGIN_REQUIRED'); }
        clearTimeout(timer); resolve();
      } catch (e) { clearTimeout(timer); close(); reject(e); }
    });
    current.onMessage(({data}) => {
      try { const decoded = JSON.parse(data); const messages = Array.isArray(decoded) ? decoded : [decoded];
        messages.forEach(m => {
          const p = pending.get(m['client-event-id']); if (!p) return;
          clearTimeout(p.timer); pending.delete(m['client-event-id']);
          if (m.op === 'error') p.reject(error(m.type || 'SERVER', m.message)); else p.resolve(m);
        });
      } catch (_) { /* Ignore non-protocol frames; pending requests retain their timeout. */ }
    });
    current.onClose(() => { if (socket === current) close(false); clearTimeout(timer); reject(error('NETWORK')); });
    current.onError((e) => { if (socket === current) close(false); clearTimeout(timer); reject(error(/domain|域名/i.test(e?.errMsg||'')?'DOMAIN_NOT_ALLOWED':'NETWORK')); });
  }).catch(e => { opening = null; throw e; });
  return opening;
}
async function call(name, args = {}) {
  await connect();
  const reply = await send({op:'call-function',name:'community:' + name,args});
  const result = reply.result;
  if (result?.error) throw Object.assign(error(result.error.code), {details:result.error.details});
  return result;
}
async function login(mode, address, code) {
  const kind = mode === 'phone' ? 'phone' : 'email';
  const endpoint = mode === 'phone' ? 'phone' : 'magic';
  const body = {'app-id':config.appId,[kind]:address,...(code ? {code} : {})};
  const res = await request('/runtime/auth/' + (code ? 'verify_' : 'send_') + endpoint + '_code',body);
  if (code) { close(); wx.setStorageSync(key,res.user); }
  return res;
}
async function logout() {
  const saved = session();
  if (saved) await request('/runtime/signout',{'app-id':config.appId,'refresh-token':saved.refresh_token || saved['refresh-token']});
  wx.removeStorageSync(key); close();
}
function setSession(user){close();wx.setStorageSync(key,user);}
module.exports = {call,request,login,logout,close,session,setSession};
