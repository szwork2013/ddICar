var validator = require('validator'),
    moment = require('moment'),
    then = require('thenjs'),
    crypto = require('crypto'),
    uuid = require('node-uuid'),
    config = require('../config'),
    mobile = config.platform.mobile,
    common = require('../common'),
    commonEnum = common.commonEnum,
    success = common.success,
    fail = common.fail,
    userDao = require('../dao/user');

module.exports = function (req) {
    var mobileNum = req.query.mobileNum,
        checkCode = req.query.checkCode,
        checkResult = validator.matches(mobileNum, /^0?(13[0-9]|15[012356789]|18[0-9]|14[57])[0-9]{8}$/);

    return then(function (defer) { // 校验手机号和验证码
        if (checkResult) {
            if (checkCode === req.session.mobileAuthCode) {
                userDao.findUser(mobileNum, mobile, defer);
            } else {
                defer(fail, null);
            }
        } else {
            defer(fail, null);
        }
    }).then(function (defer, user) {
        if (!user) { // 查看是否已授权该用户
            userDao.saveUser({
                nick_name: mobileNum.replace(new RegExp(mobileNum.substr(3, 4)), '****'),
                auth_token: crypto.createHash('sha1').update(uuid.v4()).digest('hex'),
                platform: mobile,
                create_at: moment().format('YYYY-MM-DD HH:mm:ss'),
                mobile: {
                    uid: mobileNum
                }
            }, defer);
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
        req.session.platform = mobile;
        defer(null, user);
    }).fail(function (defer, err) {
        defer(err, err);
    });
};