/**
 * Created by amberglasses on 14-9-16.
 */
var mysql = require('../models/db_mySql');
var request = require('request');
var settings = require('../settings');

exports.getToken = function (req, res, next) {
    if (req.session.access_token) {
        next();
    }

    request(
        { method: 'POST',
            uri: settings.hxURI+'/token',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"grant_type": "client_credentials", "client_id": "YXA6feANIDc0EeSaK6PzQWBvmA", "client_secret": "YXA6LijimVeXvLvRAghrCAv8zIm9EUw"})
        }
        , function (error, response, body) {
            console.log('error: ' + response.statusCode);
            console.log(body);
            req.session.access_token = JSON.parse(body).access_token;
            next();
        }
    );
};

exports.sendWarning = function (req, res) {
    console.log("begin");
    request(
        { method: 'POST',
            uri: settings.hxURI+'/messages',
            headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + req.session.access_token},
            body: JSON.stringify({
                "target_type": "users", //or chatgroups
                "target": ['18681949674'], //注意这里需要用数组, 即使只有一个用户, 也要用数组 ['u1']
                "msg": {
                    "type": "txt",
                    "msg": "P0211" //消息内容，参考[聊天记录](http://developer.easemob.com/docs/emchat/rest/chatmessage.html)里的bodies内容
                },
                "from": "admin" //表示这个消息是谁发出来的, 可以没有这个属性, 那么就会显示是admin, 如果有的话, 则会显示是这个用户发出的
            })
        }
        , function (error, response, body) {
            console.log('error: ' + response.statusCode);
            console.log(body);
            console.log("end");
        }
    );
};


/*exports.getWarning = function (req, res) {

 mysql.getConnection(function (err, connection) {
 connection.query('select * from `obd_db_test`.`obd_data_luo_faultcode`  limit 0,1000', function (err, rows) {
 if (err) throw err;

 console.log('The deviceSN is: ', rows[0]);
 });
 });
 };*/


