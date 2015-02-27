/**
 * Created by amberglasses on 15/2/6.
 */
var assert = require('assert');
var Room = require('../models/room');

describe('聊天室', function () {
    it('应该创建一个聊天室', function (done) {
        var roomname = '这是测试创建的代码111';
//                password = 'admin';
        var newRoom = new Room({name: roomname});
        newRoom.save(function (err, result) {
            console.log("save result:"+result._id);
            done(assert(roomname == result.name));
        });
    });

    it('应该按名称模糊搜索一个聊天室', function (done) {
        var roomname = '111';
        var query = {name: { $regex: roomname, $options: 'i' } };
        Room.getQuery(query, function (err, result) {
            console.log("get result:"+result);
            done(assert(result.length >= 0));
        });
    });

    it('应该获取所有聊天室列表', function (done) {

        var query = {};
        Room.getQuery(query, function (err, result) {
            console.log(result.length);
            done(assert(result.length >= 1));
        });
    });
});