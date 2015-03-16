/**
 * Created by amberglasses on 15/2/27.
 */
var sign = require('../models/signs'),
    then = require('thenjs'),
    Common = require('../common');

exports.save = function (req, res) {
    var user_id = req.body.user_id;
    var longitude = req.body.longitude;
    var latitude = req.body.latitude;
    var type = req.body.type;
    console.log(req.body);

    then(function (defer) {
        console.log(1);

        var newSign = new sign({user_id:user_id,longitude: longitude, latitude: latitude, type: type});
        console.log(2);
        newSign.save(defer);
    }).then(function (defer, result) {
        console.log(3);

        res.json(Common.success());
    }).fail(function (defer, err) {
        console.log(err);
        res.json(Common.fail(Common.commonEnum.SYSTEM_ERROR, "系统错误"))
    })
};

exports.getByPosition = function (req, res) {
    var user_id = req.body.user_id;
    var longitude = req.body.longitude;
    var latitude = req.body.latitude;

    res.json(Common.success({signs: [
        {latitude: 39.908420, longitude: 116.397475},
        {latitude: 39.907653, longitude: 116.391775}
    ]}));

//    then(function (defer) {
//        var query = {name: { $regex: roomname, $options: 'i' } };
//        Room.getQuery(query, defer);
//    }).then(function (defer, result) {
//        res.json(Common.success(result));
//    }).fail(function (defer, err) {
//        res.json(Common.fail(Common.commonEnum.SYSTEM_ERROR, "系统错误"));
//    });
};