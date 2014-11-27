var Common = require('../common'),
    config = require('../useConfig'),
    commonEnum = Common.commonEnum,
    success = Common.success,
    fail = Common.fail,
    request = require('request'),
    then = require('thenjs'),
    User = require('../models/users');

/**
 * 微信授权
 *
 */
exports.wxAuth = function (req, res) {

    var wxCode = req.params["wxCode"],
        wxresJSON, wxUsrInfoJSON, wxAccessToken, wxRefreshToken, wxOpenid;

    if (!wxCode) {
        return res.json(fail('code', 'msg'));
    }

    then(function (defer) { // 通过code获取 openid access_token

        request.get(
            config.wx.tokenUrl,
            {
                qs: {
                    appid: config.wx.appid,
                    secret: config.wx.secret,
                    code: wxCode,
                    grant_type: 'authorization_code'
                }
            },
            defer
        );
    }).then(function (defer, wxres) {

        wxresJSON = JSON.parse(wxres.body);

        console.log(wxresJSON);

        if (wxresJSON.errcode) {
            return res.json(fail(Common.commonEnum.SYSTEM_ERROR, '服务器故障'));
        } else {

            wxAccessToken = wxresJSON.access_token;
            wxRefreshToken = wxresJSON.refresh_token;
            wxOpenid = wxresJSON.openid;

            userDao.findOneByOption({'wx.openid': wxOpenid}, defer);
        }
    }).then(function (defer, userDoc) {

        if (userDoc) { // 存在该用户,允许登录


        } else { // 不存在该用户,创建新用户 并登录

            then(function (defer1) { // 根据 openid access_token获得用户信息

                request.get(
                    config.wx.userInfoUrl,
                    {
                        qs: {
                            access_token: wxAccessToken,
                            openid: wxOpenid
                        }
                    },
                    defer1
                );
            }).then(function (defer1, usrInfoRes) { // 创建新用户

                wxUsrInfoJSON = JSON.parse(usrInfoRes.body);

                // todo save
                var newUser = new User(null, wxUsrInfoJSON);
                newUser.save(defer1);
            }).then(function (defer1, user) {

                defer(null, user);
            }).fail(function (defer1, err) {
                defer(err);
            });
        }
    }).then(function (defer, userDoc) {
        req.session.uid = userDoc._id;

        res.header('uid', userDoc._id);
        res.header('secret', userDoc.secret);
        res.json(success(null));
    }).fail(function (defer, err) {

        res.json(fail(err.errCode, '服务器异常'));
    });
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