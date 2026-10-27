const api = require('./lib/api');
// These modules are required by pages. Load them with the app so a dev
// compile cannot leave the page require pointing at an unregistered file.
require('./lib/profile-rules');
require('./lib/account-flow');
require('./lib/preview-records');
require('./lib/event-content');
require('./lib/status-tone');
require('./lib/legal-documents');
require('./lib/wechat-subscription');
App({onHide() { api.close(); }});
