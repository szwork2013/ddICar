/**
 * Created by amberglasses on 14-9-23.
 */
var mysql = require('../models/db_mySql');

var settings = require('../settings');
var User = require('../models/users');
var OBDErrorCode = require('../models/odbErrorCode');
var YourVoice = require('./YourVoice');
var HX = require('./hxMiddleWare');

function getCarStatus(deviceSN, callback) {
    mysql.getConnection(function (err, connection) {
        connection.query('select `obd_LoadValue` as `负荷计算值`,' +
            '`obd_CoolTemper` as `发动机冷却液温度`,' +
            '`obd_EngineRPM` as `发动机转速`,' +
            '`obd_Odometer` as `里程`,' +
            '`obd_VehicleSpeed` as `车速`,' +
            '`obd_IntakeAirTemper` as `进气温度`,' +
            '`obd_AirFlowRate` as `空气流量`,' +
            '`obd_ThrottlePosition` as `节气门绝对位置`,' +
            '`obd_ModuleVol` as `控制模块电压`,' +
            '`obd_AmbientAirTemper` as `环境温度`,' +
            '`obd_LongFuelTrim` as `长期燃油修正`,' +
            '`obd_TimingAdvance` as `气缸1点火提前角`,' +
            '`obd_IntakePressure` as `进气歧管绝对压力`,' +
            '`obd_VehicleOBD` as `本车OBD标准`,' +
            '`obd_OilPerHour` as `每小时油耗`,' +
            '`obd_OilPerKM` as `100Km油耗`,' +
            '`obd_RemainOil` as `剩余油量`,' +
            '`obd_FuelPressure` as `燃油压力`,' +
            '`obd_IntakeManifoldPressure` as `进气压力`,' +
            '`obd_RunTimeSinEngineStart` as `发动机运行时间`,' +
            '`obd_BaromatricPressure` as `大气压力`,' +
            '`obd_CommandER` as `空燃比系数`,' +
            '`obd_RelativeTP` as `节气门开度`,' +
            '`obd_AccePedalPosition` as `油门踏板相对位置`,' +
            '`obd_TimeRunMILOn` as `故障后行驶时间`,' +
            '`obd_EngineOilTemp` as `机油温度`,' +
            '`obd_EngineMal_0_` as `发动机故障状态_0`,' +
            '`obd_EngineMal_1_` as `发动机故障状态_1`,' +
            '`obd_TCMMal_0_` as `变速箱故障状态_0`,' +
            '`obd_TCMMal_1_` as `变速箱故障状态_1`,' +
            '`obd_ABSMal_0_` as `刹车系统故障_0`,' +
            '`obd_ABSMal_1_` as `刹车系统故障_1`,' +
            '`obd_SRSMal_0_` as `气囊系统故障_0`,' +
            '`obd_SRSMal_1_` as `气囊系统故障_1`' +
            ' from `obd_db_test`.`obd_data_luo_lastshow` where `deviceSN` = ' + deviceSN + ' limit 0,1000', function (err, rows) {
            callback(err, rows[0]);
        });
    });
}

exports.getStatus = function (req, res) {
    User.getOne(req.params['id'], function (err, user) {
        getCarStatus(user.info.deviceSN, function (err, status) {
            console.log(status);
            res.json(status);
        })
    })
};

exports.sendStatus = function (req, res) {
    User.getBydeviceSN(req.body.deviceSN, function (err, user) {
        OBDErrorCode.getOneByCode(req.body.carStatus, function (err, obdErrorCode) {
            var query = {type: user.your_voice.type, content: obdErrorCode.mean};
            YourVoice.getQuery(query, function (err, yourVoices) {
                var msg = {type: "carStatus",
                    content: obdErrorCode.mean,
                    audio: yourVoices[0].audioFileId,
                    audioType: yourVoices[0].type
                };

                HX.sendMessage(req.session.access_token, user.info.phone, msg);

                res.json({flag: 'success', content: "success"});
            })
        });
    })
};

exports.sendDrivingBehavior = function (req, res) {
    User.getBydeviceSN(req.body.deviceSN, function (err, user) {
        var DrivingBehavior = req.body.DrivingBehavior;

        request(
            { method: 'POST',
                uri: settings.hxURI + '/messages',
                headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + req.session.access_token},
                body: JSON.stringify({
                    "target_type": "users", //or chatgroups
                    "target": [user.info.phone], //注意这里需要用数组, 即使只有一个用户, 也要用数组 ['u1']
                    "msg": {
                        "type": "txt",
                        "msg": JSON.stringify({type: "DrivingBehavior", content: DrivingBehavior}) //消息内容，参考[聊天记录](http://developer.easemob.com/docs/emchat/rest/chatmessage.html)里的bodies内容
                    },
                    "from": "admin" //表示这个消息是谁发出来的, 可以没有这个属性, 那么就会显示是admin, 如果有的话, 则会显示是这个用户发出的
                })
            }
            , function (error, response, body) {
                res.json({flag: 'success', content: "success"});
            }
        );
    })
};