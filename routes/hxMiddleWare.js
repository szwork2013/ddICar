/**
 * Created by amberglasses on 14-9-19.
 */
var settings = require('../settings');
var request = require('request');

exports.getToken = function (req, res, next) {
    if (req.session.access_token) {
        next();
    }

    request(
        { method: 'POST',
            uri: settings.hxURI + '/token',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"grant_type": "client_credentials", "client_id": "YXA6feANIDc0EeSaK6PzQWBvmA", "client_secret": "YXA6LijimVeXvLvRAghrCAv8zIm9EUw"})
        }
        , function (error, response, body) {
            req.session.access_token = JSON.parse(body).access_token;
            next();
        }
    );
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

exports.register = function(user){
    // 注册环信用户
    request(
        { method: 'POST',
            uri: settings.hxURI + '/users',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"username": user.info.phone, "password": user.info.password}
            )
        }
        , function (error, response, body) {
            if (body) {
                console.log("环信：" + body);
            }
        }
    );
};