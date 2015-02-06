/**
 * Created by amberglasses on 15/2/6.
 */
var Room = require('../models/room'),
    then = require('thenjs'),
    Common = require('../common');

exports.save = function (req, res) {
    var roomname = req.params['roomname'];

    then(function (defer) {
        var newRoom = new Room({name: roomname});
        newRoom.save(defer);
    }).then(function (defer, result) {
        res.json(Common.success());
    }).fail(function (defer, err) {
        res.json(Common.fail(Common.commonEnum.SYSTEM_ERROR, "系统错误"))
    })
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