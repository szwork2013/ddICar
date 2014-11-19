var pkg = require('./package.json'),
    config, ossURI = [];


config = {
    wx: {
        appKey: '2114675498',
        appSecret: 'e9f661eb7844cff78f31e1871f9f48e7',
        tokenUrl: 'https://api.weixin.qq.com/sns/oauth2/access_token?',
        userInfoUrl: 'https://api.weixin.qq.com/sns/userinfo?'
    }
};

module.exports = config;