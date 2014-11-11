var passport = require('passport'),
    crypto = require('crypto'),
    request = require('request'),
    validator = require('validator'),

    common = require('../common'),
    config = require('../useConfig'),
//    logger = require('../middlewares/logger').logger,
//    userDao = require('../dao/user'),
    mobileStrategy = require('../middlewares/mobileStrategy'),
    then = require('thenjs'),
    commonEnum = common.commonEnum,
    success = common.success,
    fail = common.fail,
    weibo = config.platform.weibo,
    qq = config.platform.qq,
    mobile = config.platform.mobile,
    local = config.platform.local;

// 开始授权
exports.authorize = function (req, res, next) {
    var platform = req.params.platform,
        authState;

    if (!platform) {
        logger.warn('授权出错,未知平台 --file: %s --platform: %s', __filename, platform);
        return res.json(fail(commonEnum.AUTH_PLATFORM_ERROR_CODE, '授权出错,未知平台'));
    }

    authState = crypto.createHash('sha1').update(-(new Date()) + '').digest('hex');
    req.session.authState = authState;

    switch (platform) {
        case weibo :
            passport.authenticate('sina', { 'state': req.session.authState })(req, res, next);
            break;
        // case qq :
        //     passport.authenticate('qq', { 'state': req.session.authState })(req, res, next);
        //     break;
        case mobile:
            res.render('mobileAuthenticate', {state: authState});
            break;
        case local:
            res.render('admin/login', {state: authState});
            break;
        default :
            logger.warn('授权出错,未知平台 --file: %s --platform: %s', __filename, platform);
            res.render('unknowauth', {state: authState});
            // return res.json(fail(commonEnum.AUTH_PLATFORM_ERROR_CODE, '授权出错,未知平台'));
    }
};

// 向手机发送验证码
exports.mobileAuthCode = function (req, res, next) {
    var originalString = '0123456789', // 随机数seed
        authState = req.query.state, // 授权码
        mobileNum = req.query.mobileNum, // 手机号码
        tmpCode = [],// 临时数组,用于存取随机数字
        randomNum; // 随机数

    // 验证authState
    if (!authState) {
        logger.warn('手机登陆获取authState出错,未填写authState');
        return res.json(fail(commonEnum.PARAM_ERROR_CODE, '参数缺失'));
    }
    if (authState !== req.session.authState) {
        logger.warn('手机登陆获取authState出错,authState不对应');
        return res.json(fail(commonEnum.PARAM_ERROR_CODE, 'authState参数错误'));
    }

    // 验证手机号码
    if (!mobileNum) {
        logger.warn('获取手机号码出错,未填写号码');
        return res.json(fail(commonEnum.PARAM_ERROR_CODE, '参数缺失'));
    }

    if (!validator.matches(mobileNum, /^0?(13[0-9]|15[012356789]|18[0-9]|14[57])[0-9]{8}$/)) {
        return res.json(fail(commonEnum.PARAM_ERROR_CODE, '手机号码格式不正确'));
    }

    // 生成6位随机数字
    for (var i = 0; i < 6; i++) {
        var stringLength = Math.random() * originalString.length;
        tmpCode.push(originalString.charAt(Math.ceil(stringLength) % originalString.length));
    }
    randomNum = tmpCode.join('');

    // 在session中添加该随机数
    req.session.mobileAuthCode = randomNum;

    // 发送随机数到客户手机
    request.post(config.mobile.url, {
            form: {
                Uid: config.mobile.uid,
                Key: config.mobile.key,
                smsMob: mobileNum,
                smsText: '验证码 [' + tmpCode.join('') + '] 来自'
            }
        },
        function (err, res, body) {
            if (body !== '1') {
                logger.error('发送短信失败 --code: %s --mobile: %s', body, mobileNum);
            }
        }
    );
    return res.json(success(null, '发送验证码成功'));
};

// 授权回调
exports.callback = function (req, res, next) {
    var platform = req.params.platform;

    if (!platform) {
        logger.warn('授权出错,未知平台 --file: %s --platform: %s', __filename, platform);
        res.json(fail(commonEnum.AUTH_PLATFORM_ERROR_CODE, '授权出错,未知平台'));
        return;
    }

    // 校验state继续授权
    if (req.session && req.session.authState
        && req.session.authState === req.query.state) {
        switch (platform) {
            case weibo :
                passport.authenticate('sina', {failureRedirect: '/auth/callback/fail'})(req, res, next);
                break;
            case qq :
                passport.authenticate('qq', {failureRedirect: '/auth/callback/fail'})(req, res, next);
                break;
            case mobile :
                mobileStrategy(req).then(function (defer, user) {
                    return next();
                }).fail(function (defer, err) {
                    return res.redirect('/auth/callback/fail');
                });
                break;
            case local :
                passport.authenticate('local', {failureRedirect: '/auth/callback/fail'})(req, res, next);
                break;
            default :
                return res.json(fail(commonEnum.AUTH_PLATFORM_ERROR_CODE, '授权出错,未知平台'));
        }
    } else {
        logger.warn('授权出错,STATE值不对应 --file: %s --platform: %s', __filename, platform);
        res.json(fail(commonEnum.AUTH_STATE_ERROR_CODE, '授权出错,STATE值不对应'));
    }
};

// 客户端使用uid 和authToken认证
exports.signIn = function (req, res) {
    var uid = req.body.uid,
        authToken = req.body.authToken;

    if (!uid || !authToken) {
        return res.json(fail(commonEnum.AUTH_FAIL_ERROR_CODE, '授权失败'));
    }

    then(function (defer) {
        userDao.findUserByIdAndToken(uid, authToken, defer);
    }).then(function (defer, user) {
        if (user) {
            if (user.isDel) {
                defer({message: '您的账号已被冻结'}, null);
            } else {
                req.session.uid = user._id;
                return res.json(success(null, '授权成功'));
            }
        } else {
            defer({message: '登陆失败'}, null);
        }
    }).fail(function (defer, err) {
        return res.json(fail(commonEnum.AUTH_FAIL_ERROR_CODE, '授权失败'));
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