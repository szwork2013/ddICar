var pkg = require('./package.json'),
    config, ossURI = [];


config = {
    wx: {
        appid: 'wxfac56e93388fd4a0',
        secret: 'c9c1a7662202fcd9183fa5774ac1eaa6',
        tokenUrl: 'https://api.weixin.qq.com/sns/oauth2/access_token?',
        userInfoUrl: 'https://api.weixin.qq.com/sns/userinfo?'
    }
};

module.exports = config;