/**
 * Created by amberglasses on 15/2/27.
 */
var settings = require('../settings');
var request = require('request');

exports.getToken = function (callback) {
    var currentDate = new Date();
    var expiresDate = new Date().setDate(settings["expiresDate"]);

    // 比较是否过期，没过期直接返回token
    if (currentDate >= expiresDate) {
        request(
            { method: 'POST',
                uri: settings.hxURI + '/token',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({"grant_type": "client_credentials", "client_id": "YXA6feANIDc0EeSaK6PzQWBvmA", "client_secret": "YXA6LijimVeXvLvRAghrCAv8zIm9EUw"})
            }
            , function (error, response, body) {
                // 记录token值
                settings["HX_access_token"] = JSON.parse(body).access_token;
                // 记录下一次过期时间点
                settings["expiresDate"] = new Date().getMilliseconds() + JSON.parse(body).expires_in;
//                req.session.access_token = JSON.parse(body).access_token;
//                next();

                return callback(settings["HX_access_token"]);
            }
        );
    } else {
        return callback(settings["HX_access_token"]);
    }
};

exports.getAccessToken = function (next) {
    request(
        { method: 'POST',
            uri: settings.hxURI + '/token',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"grant_type": "client_credentials", "client_id": "YXA6feANIDc0EeSaK6PzQWBvmA", "client_secret": "YXA6LijimVeXvLvRAghrCAv8zIm9EUw"})
        }
        , function (error, response, body) {
            settings["HX_access_token"] = JSON.parse(body).access_token;
            next();
        }
    );
};

exports.sendMessage = function (token, contact, msg) {
    request(
        { method: 'POST',
            uri: settings.hxURI + '/messages',
            headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token},
            body: JSON.stringify({
                "target_type": "users", //or chatgroups
                "target": [contact], //注意这里需要用数组, 即使只有一个用户, 也要用数组 ['u1']
                "msg": {
                    "type": "txt",
                    "msg": JSON.stringify(msg) //消息内容，参考[聊天记录](http://developer.easemob.com/docs/emchat/rest/chatmessage.html)里的bodies内容
                },
                "from": "admin" //表示这个消息是谁发出来的, 可以没有这个属性, 那么就会显示是admin, 如果有的话, 则会显示是这个用户发出的
            })
        }
        , function (error, response, body) {
            if (body) {
                console.log("环信：" + body);
            }
        }
    );
};

exports.register = function (user) {
    // 注册环信用户
    request(
        { method: 'POST',
            uri: settings.hxURI + '/users',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"username": user._id, "password": "123456"}
            )
        }
        , function (error, response, body) {
            if (body) {
                console.log("环信：" + body);
            }
        }
    );
};