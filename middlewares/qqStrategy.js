var TqqStrategy = require('passport-tqq').Strategy,
    then = require('thenjs'),
    moment = require('moment'),
    crypto = require('crypto'),
    uuid = require('node-uuid'),
    config = require('../config'),
    qq = config.platform.qq;
//    userDao = require('../dao/user');

module.exports = new TqqStrategy({
        clientID: config.qq.appKey,
        clientSecret: config.qq.appSecret,
        callbackURL: config.qq.callbackURL,
        passReqToCallback: true
    },
    function (req, accessToken, refreshToken, profile, done) {
        process.nextTick(function () {
            then(function (defer) {
                userDao.findUser(profile.id, qq, defer);
            }).then(function (defer, user) {
                var gender;
                if (profile.gender === '男') {
                    gender = 'm';
                } else if (profile.gender === '女') {
                    gender = 'f';
                } else {
                    gender = 'n';
                }
                if (!user) { // 创建新用户
                    var newUser = {
                        nick_name: profile.nickname,
                        auth_token: crypto.createHash('sha1').update(uuid.v4()).digest('hex'),
                        description: '',
                        gender: gender,
                        create_at: moment().format('YYYY-MM-DD HH:mm:ss'),
                        platform: qq,
                        qq: {
                            uid: profile.id,
                            nick_name: profile.nickname,
                            vip: profile.vip === 1
                        },
                        avatar: profile.figureurl_qq_1
                    };
                    userDao.saveUser(newUser, defer);
                } else {
                    if (user.isDel) {
                        defer({message: '已封号'}, null);
                    } else {
                        defer(null, user);
                    }
                }
            }).then(function (defer, user) {
                req.session.uid = user._id;
                req.session.authToken = user.auth_token;
                req.session.platform = qq;
                return done(null, user);
            }).fail(function (defer, err) {
                return done(err);
            });
        });
    });