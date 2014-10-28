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

exports.success = success;
exports.fail = fail;