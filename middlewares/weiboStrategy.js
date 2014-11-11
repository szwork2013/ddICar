var SinaStrategy = require('passport-sina').Strategy,
    moment = require('moment'),
    then = require('thenjs'),
    crypto = require('crypto'),
    uuid = require('node-uuid'),
    config = require('../config'),
    weibo = config.platform.weibo;
//    userDao = require('../dao/user');

module.exports = new SinaStrategy({
        clientID: config.weibo.appKey,
        clientSecret: config.weibo.appSecret,
        callbackURL: config.weibo.callbackURL,
        passReqToCallback: true
    },
    function (req, accessToken, refreshToken, profile, done) {
        process.nextTick(function () {
            then(function (defer) { // 查找是否已授权过该用户
                userDao.findUser(profile.id, weibo, defer);
            }).then(function (defer, user) {
                if (!user) { // 创建新用户
                    var newUser = {
                        nick_name: profile.screen_name,
                        auth_token: crypto.createHash('sha1').update(uuid.v4()).digest('hex'),
                        description: profile.description,
                        gender: profile.gender,
                        create_at: moment().format('YYYY-MM-DD HH:mm:ss'),
                        platform: weibo,
                        weibo: {
                            uid: profile.id,
                            nick_name: profile.nick_name,
                            create: profile.created_at,
                            verified: profile.verified,
                            bi_followers_count: profile.bi_followers_count
                        },
                        avatar: profile.avatar_large
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
                req.session.platform = weibo;
                return done(null, user);
            }).fail(function (defer, err) {
                return done(err);
            });
        });
    });