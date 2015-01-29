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
    AUTH_ERROR_CODE: -90000, // 授权出错
    AUTH_PLATFORM_ERROR_CODE: -90001, // 授权出错,未知平台
    AUTH_STATE_ERROR_CODE: -90002, // 授权出错，STATE值不对应
    AUTH_FAIL_ERROR_CODE: -90003, // 授权失败
    AUTH_FAIL_FREEZE_ERROR_CODE: -90004, // 授权失败,封号
    NOLOG_ERROR_CODE: -80000, // 未登录
    PARAM_ERROR_CODE: -70000, // 参数错误
    DATA_ERROR_CODE: -60000, // 数据操作失败
    OTHER_ERROR_CODE: -10000, // 其他错误
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

exports.success = success;
exports.fail = fail;
exports.commonEnum = commonEnum;
exports.platform = platform;