/**
 * Created by amberglasses on 14-9-16.
 */
var mysql = require('../models/db_mySql');
var request = require('request');
var settings = require('../settings');
var User = require('../models/users');

exports.sendWarning = function (req, res) {
    var deviceSN = req.body.deviceSN;
    var faultcodelist = req.body.faultcodelist;

    getWarnings(function(err, warnings){
        warnings.forEach(function(e){

            User.getBydeviceSN(deviceSN,function(err, user){
                request(
                    { method: 'POST',
                        uri: settings.hxURI + '/messages',
                        headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + settings["HX_access_token"]},
                        body: JSON.stringify({
                            "target_type": "users", //or chatgroups
                            "target": [user.info.phone], //注意这里需要用数组, 即使只有一个用户, 也要用数组 ['u1']
                            "msg": {
                                "type": "txt",
                                "msg": faultcodelist //消息内容，参考[聊天记录](http://developer.easemob.com/docs/emchat/rest/chatmessage.html)里的bodies内容
                            },
                            "from": "admin" //表示这个消息是谁发出来的, 可以没有这个属性, 那么就会显示是admin, 如果有的话, 则会显示是这个用户发出的
                        })
                    }
                    , function (error, response, body) {
                        console.log(body);
                    }
                );
            });
        });
    });
};

exports.getWarningList = function(req, res){
    User.getOne(req.params['id'],function(err, user){
        if(err){
            return res.json({flag:'fail', content:1001});
        }

        getWarningsBySN(user.info.deviceSN, function(err,rows){
            if(err){
                return res.json({flag:'fail', content:1001});
            }

            var warnings = [];
            rows.forEach(function(e){
                var warning = {};
                if(e["obd_faultcodelist"] == 'P0211'){
                    warning['title'] = "喷油器电路异常";
                    warnings.push(warning);
                }
            });

            res.json({flag:'success', content:warnings})
        });
    })
};

exports.getWarningCount = function(req, res){
    User.getOne(req.param['id'], function(err, user){
        if(err){
            return res.json({flag:'fail', content:1001});
        }

        getWarningCountBySN(user.info.deviceSN, function(err, result){
            if(err){
                return res.json({flag:'fail', content:1001});
            }

            return res.json({flag:'success', content:result});
        })
    })
};


function getWarnings(callback) {
    mysql.getConnection(function (err, connection) {
        connection.query('select * from `obd_db_test`.`obd_data_luo_faultcode`  limit 0,1000', function (err, rows) {
            if (err){
                callback(err);
            }

            callback(err,rows);
        });
    });
}

function getWarningsBySN(deviceSN, callback) {
    mysql.getConnection(function (err, connection) {
        connection.query('select * from `obd_db_test`.`obd_data_luo_faultcode` where `deviceSN` = '+deviceSN+' limit 0,1000', function (err, rows) {
            if (err){
                callback(err);
            }

            callback(err,rows);
        });
    });
}

function getWarningCountBySN(deviceSN, callback){
    mysql.getConnection(function (err, connection) {
        connection.query('select count(*) from `obd_db_test`.`obd_data_luo_faultcode` where `deviceSN` = '+deviceSN+' limit 0,1000', function (err, result) {
            if (err){
                callback(err);
            }

            callback(err,result);
        });
    });
}
