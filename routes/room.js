/**
 * Created by amberglasses on 15/2/6.
 */
var Room = require('../models/room'),
    then = require('thenjs'),
    Common = require('../common'),
    request = require('request'),
    settings = require('../settings');

exports.save = function (req, res) {
    var roomname = req.body.roomname;
    // 接口请求实例
    // https://voichannel.aichat.com.cn:8443/respApi/room?method=createRoom&appKey=123&type=0&devAccount=123&devPwd=123
    console.log(settings.qjtx_URI + '/room?method=createRoom&appKey=bcd28d42-eeb7-455f-b030-aa3805510f39&type=0&devAccount=ops@ddicar.com&devPwd=ly19900415');

    request({
        uri: settings.qjtx_URI + '/room?method=createRoom&appKey=bcd28d42-eeb7-455f-b030-aa3805510f39&type=0&devAccount=ops@ddicar.com&devPwd=ly19900415',
        method: 'POST', port: 443
    }, function (error, response, body) {
        console.log("body：" + JSON.parse(body).roomId);
        console.log("response：" + response);
        console.log("error：" + error);
        then(function (defer) {
            var newRoom = new Room({name: roomname, roomId: JSON.parse(body).roomId});
            newRoom.save(defer);
        }).then(function (defer, result) {
            res.json(Common.success({roomId: result.roomId}));
        }).fail(function (defer, err) {
            res.json(Common.fail(Common.commonEnum.SYSTEM_ERROR, "系统错误"))
        })
    })
};

exports.getRoomByName = function (req, res) {
    var roomname = req.params['roomname'];

    then(function (defer) {
        var query = {name: {$regex: roomname, $options: 'i'}};
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