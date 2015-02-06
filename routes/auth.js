var Common = require('../common'),
    config = require('../useConfig'),
    commonEnum = Common.commonEnum,
    success = Common.success,
    fail = Common.fail,
    request = require('request'),
    then = require('thenjs'),
    crypto = require('crypto'),
    uuid = require('node-uuid'),
    User = require('../models/users'),
    HX = require('./hxMiddleWare'),
    YourVoice = require('./YourVoice');

/**
 * 微信授权
 *
 */
exports.wxAuth = function (req, res) {

    var wxAccessToken = req.params["wxAccessToken"],
        wxOpenId = req.params["wxOpenId"];
//        wxresJSON, wxUserInfoJSON, wxRefreshToken, wxOpenid;
//    var wxCode = req.params["wxCode"],
//        wxresJSON, wxUserInfoJSON, wxAccessToken, wxRefreshToken, wxOpenid;

//    if (!wxCode) {
//        return res.json(fail('code', 'msg'));
//    }

    then(function (_defer) { // 根据 openid access_token获得用户信息
        request.get(
            config.wx.userInfoUrl,
            {
                qs: {
                    access_token: wxAccessToken,
                    openid: wxOpenId
                }
            },
            _defer
        );
    }).then(function (_defer, userInfoRes) { // 创建新用户
        wxUserInfoJSON = JSON.parse(userInfoRes.body);
        var info = {
            phone: '',
            password: crypto.createHash('sha256').update(uuid.v4()).digest('hex'),
            name: wxUserInfoJSON.nickname,
            pic: wxUserInfoJSON.headimgurl,
            sex: wxUserInfoJSON.sex,
            platform: Common.platform.wx,
            wx: wxUserInfoJSON
        };
        // todo save
        var newUser = new User(info);
        newUser.save(_defer);
    }).then(function (_defer, user) {

        // 注册环信用户
        HX.register(user);
        _defer(null, user);
    }).then(function (_defer, userDoc) {
        req.session.user = userDoc;
        req.session.user_id = userDoc._id;

        res.json(success(Common.returnUserInfo(userDoc)));
    }).fail(function (defer, err) {
        console.log(err);
        res.json(fail(err.errCode, '服务器异常'));
    });

//    then(function (defer) { // 通过code获取 openid access_token
//        request.get(
//            config.wx.tokenUrl,
//            {
//                qs: {
//                    appid: config.wx.appid,
//                    secret: config.wx.secret,
//                    code: wxCode,
//                    grant_type: 'authorization_code'
//                }
//            },
//            defer
//        );
//    }).then(function (defer, wxres) {
//        wxresJSON = JSON.parse(wxres.body);
//        if (wxresJSON.errcode) {
//            return res.json(fail(Common.commonEnum.SYSTEM_ERROR, '服务器故障'));
//        } else {
//            wxAccessToken = wxresJSON.access_token;
//            wxRefreshToken = wxresJSON.refresh_token;
//            wxOpenid = wxresJSON.openid;
//
//            User.getQuery({'info.wx.openid': wxOpenid}, defer);
//        }
//    }).then(function (defer, userDoc) {
//        if (userDoc[0]) { // 存在该用户,允许登录
//            console.log(userDoc[0]);
//            defer(null, userDoc[0]);
//        } else { // 不存在该用户,创建新用户 并登录
//            then(function (_defer) { // 根据 openid access_token获得用户信息
//                request.get(
//                    config.wx.userInfoUrl,
//                    {
//                        qs: {
//                            access_token: wxAccessToken,
//                            openid: wxOpenid
//                        }
//                    },
//                    _defer
//                );
//            }).then(function (_defer, userInfoRes) { // 创建新用户
//                wxUserInfoJSON = JSON.parse(userInfoRes.body);
//                var info = {
//                    phone: '',
//                    password: crypto.createHash('sha256').update(uuid.v4()).digest('hex'),
//                    name: wxUserInfoJSON.nickname,
//                    pic: wxUserInfoJSON.headimgurl,
//                    sex: wxUserInfoJSON.sex,
//                    platform: Common.platform.wx,
//                    wx: wxUserInfoJSON
//                };
//                // todo save
//                var newUser = new User(info);
//                newUser.save(_defer);
//            }).then(function (_defer, user) {
//
//                // 注册环信用户
//                HX.register(user);
//                _defer(null,user);
//            }).then(function (_defer,user) {
//                YourVoice.cloneToMyVoice("nanshen", user._id.toString(), _defer);
//                defer(null, user);
//            }).fail(function (_defer, err) {
//                defer(err);
//            });
//        }
//    }).then(function (defer, userDoc) {
//        req.session.user = userDoc;
//        req.session.user_id = userDoc._id;
//
//        res.json(success(Common.returnUserInfo(userDoc)));
//    }).fail(function (defer, err) {
//        console.log(err);
//        res.json(fail(err.errCode, '服务器异常'));
//    });
};

// 授权失败
exports.authFailure = function (req, res) {
    res.json(fail(commonEnum.AUTH_FAIL_ERROR_CODE, '授权失败'));
};

// 授权成功
exports.authSuccess = function (req, res) {
    if (req.session.uid) {
        res.header('uid', req.session.uid);
        res.header('authToken', req.session.authToken);
        res.header('platform', req.session.platform);
        res.json(success(null, '授权成功'));
    } else {
        res.json(fail(commonEnum.AUTH_FAIL_ERROR_CODE, '授权失败'));
    }
};