const api = require('./lib/api');
App({onHide() { api.close(); }});
