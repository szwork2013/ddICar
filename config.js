var pkg = require('./package.json'),
    config, ossURI = [];


config = {
    name: pkg.name,
    description: 'yuanzi api',
    version: pkg.version,
    port: 27017,
    monPort: 3001,
    uploadDir: './upload',
    uploadSize: '100mb',
    db: [
        'mongodb://www.ddicar.com:27017/ddicar'
    ],
    reConnectTime: 30000, // 断线重连时间
    sessionSecret: 'yuanzi',
    sessionMaxAge: 24 * 60 * 60 * 1000, // SESSION 有效时长
    pageMaxAge: 3 * 24 * 60 * 60 * 1000, // 静态页面过期时间
    platform: {
        weibo: 'weibo',
        qq: 'qq',
        mobile: 'mobile',
        mail:'mail',
        local: 'local'
    },
    weibo: {
        appKey: '2114675498',
        appSecret: 'e9f661eb7844cff78f31e1871f9f48e7',
        callbackURL: 'http://www.iyuanzi.net/auth/weibo/callback'
    },
    qq: {
        appKey: '101061493',
        appSecret: '2fffa1384f4493246b598d70a7043216',
        callbackURL: 'http://www.iyuanzi.net/auth/qq/callback'
    },
    mobile: {
        uid: '千鱼元子',
        key: '7e10b324a810aa9ac82e',
        url: 'http://utf8.sms.webchinese.cn'
    },
    oss: {
        accessKeyId: 'z8n3LAZUmeJRWxSD',
        accessKeySecret: 'CpzLG2tC9oIfVqgwQWzUqKOMf0A7XJ',
        bucket: 'yuanzi-dest',
        userAvatarObject: 'userAvatar/',
        cardImgObject: 'cardImg/',
        cardMp3Object: 'cardMp3/',
        cardVideoObject: 'cardVideo/',
        cardCoverObject: 'cardCover/',
        sliderCoverObject: 'sliderCover/',
        themeCoverObject: 'themeCover/'
    },
    baidu: {
        appKey: 'OYE7nL2GFYyGhszTG3oblmIH',
        appSecret: 'qTvDdlSwazA5sE9y2BWGylz9gq7hDaRM'
    },
    appStore: {
        androidAddr: 'http://www.mumayi.com/android-660650.html',
        iosAddr: 'http://www.iyuanzi.com/d'
    }
};

ossURI.push('http://', config.oss.bucket, '.oss-cn-hangzhou.aliyuncs.com/');
config.dbURI = config.db.join(',');
config.oss.uri = ossURI.join('');

module.exports = config;