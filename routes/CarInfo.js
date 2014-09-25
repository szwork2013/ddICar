/**
 * Created by amberglasses on 14-9-23.
 */
var mysql = require('../models/db_mySql');
var request = require('request');
var settings = require('../settings');
var User = require('../models/users');

function getCarStatus(deviceSN,callback){
    mysql.getConnection(function(err,connection){
        connection.query('select * from `obd_db_test`.`obd_data_luo_lastshow` where `deviceSN` = '+deviceSN+' limit 0,1000',function(err,rows){
            callback(err,rows[0]);
        });
    });
}

exports.getStatus = function(req, res){
    User.getOne(req.params['id'],function(err,user){
        getCarStatus(user.info.deviceSN, function(err, status){
            console.log(status);
            res.json(status);
        })
    })
};