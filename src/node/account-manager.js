
var stormpath = require('stormpath');

function AccountManager(apiKey, apiSecret, stormpathHREF, log) {
    var apiKey = new stormpath.ApiKey(apiKey, apiSecret);
    this.stormpathHREF = stormpathHREF;
    this.log = log;
    this.spClient = new stormpath.Client({ apiKey: apiKey });
}

AccountManager.prototype.createAccount = function(username, password, firstName, lastName, cb) {
	var self = this;
	self.log.info("createAccount is successfully called");
    var stormpathProxy = self.spClient.getApplication(self.stormpathHREF, function(err, stormpathProxy) {
        if (err) throw err;
        stormpathProxy.createAccount({
            givenName: firstName,
            surname: lastName,
            username: username,
            email: username,
            password: password,
        }, function (err, createdAccount) {
            if (err) {
            	cb(err, null);
            } else {
            	self.log.info("account successfully created", createdAccount);
            	cb(null, {isAccountCreated:true});
            }
        });
    });
}

module.exports = AccountManager;