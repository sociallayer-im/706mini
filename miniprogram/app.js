const api = require('./lib/montana');
App({onHide() { api.close(); }});
