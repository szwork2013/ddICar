var common = require('../common'),
    fail = common.fail,
    commonEnum = common.commonEnum;

// 用户登录校验
exports.userRequired = function (req, res, next) {
    if (req.method === 'GET') {
        if (/^\/{1}$|^\/search|^\/categories|^\/themes|^\/auth|^\/loadindex|^\/shearchPage|^\/cards|^\/users\/(cards)|^\/users\/(\d|[a-z]){24}$/.test(req.path)) {
            next();
        } else {
            if (/^(?!\/admin).*$/.test(req.path)) {
                if (!req.session || !req.session.uid) {
                    return res.json(fail(commonEnum.NOLOG_ERROR_CODE, '未登录'));
                }
                next();
            } else {
                if (!req.session || !req.session.uid || !req.session.role) {
                    return res.json(fail(commonEnum.NOLOG_ERROR_CODE, '未登录'));
                }
                next();
            }
        }
    } else {
        if (/^(\/auth)/.test(req.path)) {
            next();
        } else {
            if (/^(?!\/admin).*$/.test(req.path)) {
                if (!req.session || !req.session.uid) {
                    return res.json(fail(commonEnum.NOLOG_ERROR_CODE, '未登录'));
                }
                next();
            } else {
                if (!req.session || !req.session.uid || !req.session.role) {
                    return res.json(fail(commonEnum.NOLOG_ERROR_CODE, '未登录'));
                }
                next();
            }
        }
    }
};