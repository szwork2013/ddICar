// 请求成功后的响应
var success = function (data, str) {
    return {
        state: {
            success: true,
            code: 1,
            msg: str
        },
        data: data
    };
};

// 请求失败后的响应
var fail = function (code, str) {
    return {
        state: {
            success: false,
            code: code,
            msg: str
        }
    };
};

var platform = {
    wx: 'wx',
    phone: 'phone'
};

var commonEnum = {
    NOT_FOUND: 'NOT FOUND',
    PAGE_NUM: 12,
    SYSTEM_ERROR: 1001,
    USER_NOT_EXISTS: 2000,
    WRONG_PASSWORD: 2008,
    USER_IS_EXISTS: 2001,
    USER_NOT_LOGIN: 2006,
    USER_IS_LOGIN: 2005,
    NO_PIC: 2010
};

var returnUserInfo = function (user) {
    var userInfo = {};
    userInfo._id = user._id;
    userInfo.phone = user.info.phone;
    userInfo.name = user.info.name;
    userInfo.pic = user.info.pic;
    userInfo.deviceSN = user.info.deviceSN;
    return userInfo;
};

exports.success = success;
exports.fail = fail;
exports.commonEnum = commonEnum;
exports.platform = platform;
exports.returnUserInfo = returnUserInfo;