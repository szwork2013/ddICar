/**
 * Created by amberglasses on 15/2/6.
 */
var Room = require('../models/room'),
    then = require('thenjs'),
    Common = require('../common');

exports.save = function (req, res) {
    var roomname = req.body.roomname;
    // 接口请求实例
    // https://voichannel.aichat.com.cn:8443/respApi/room?method=createRoom&appKey=123&type=0&devAccount=123&devPwd=123
    request(
        { method: 'GET',
            uri: settings.qjtx_URI + '/room?method=createRoom&appKey=bcd28d42-eeb7-455f-b030-aa3805510f39&type=0&devAccount=ops@ddicar.com&devPwd=ly19900415',
            headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token},
            body: {}
        }
        , function (error, response, body) {
            if (body) {
                console.log("环信：" + body);
                then(function (defer) {
                    var newRoom = new Room({name: roomname, roomId: body.roomId});
                    newRoom.save(defer);
                }).then(function (defer, result) {
                    res.json(Common.success({roomId: result.roomId}));
                }).fail(function (defer, err) {
                    res.json(Common.fail(Common.commonEnum.SYSTEM_ERROR, "系统错误"))
                })
            }
        }
    );
};

exports.getRoomByName = function (req, res) {
    var roomname = req.params['roomname'];

    then(function (defer) {
        var query = {name: { $regex: roomname, $options: 'i' } };
        Room.getQuery(query, defer);
    }).then(function (defer, result) {
        res.json(Common.success(result));
    }).fail(function (defer, err) {
        res.json(Common.fail(Common.commonEnum.SYSTEM_ERROR, "系统错误"));
    });
};

exports.getRoomList = function (req, res) {
    then(function (defer) {
        var query = {};
        Room.getQuery(query, defer);
    }).then(function (defer, result) {
        res.json(Common.success(result));
    }).fail(function (defer, err) {
        res.json(Common.fail(Common.commonEnum.SYSTEM_ERROR, "系统错误"));
    });
};