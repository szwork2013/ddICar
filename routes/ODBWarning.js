/**
 * Created by amberglasses on 14-9-16.
 */
var mysql = require('../models/db_mySql');
var User = require('../models/users');
var ODBErrorCode = require('../models/odbErrorCode');
var ODBErrorRecord = require('../models/odbErrorRecord');
var HX = require('./hxMiddleWare');

exports.sendWarning = function (req, res) {
    var deviceSN = req.body.deviceSN;
    var faultcodelist = req.body.faultcodelist;
    var warning_Id = req.body.infoid;

    User.getBydeviceSN(deviceSN, function (err, user) {
        ODBErrorCode.getOneByCode(faultcodelist, function (err, odbErrorCode) {
            HX.sendMessage(req.session.access_token, user.info.phone, {type: "warning", content: odbErrorCode.mean});

            getWarningById(warning_Id, function (err, warning) {
                if (err) {
                    return res.json({flag: 'fail', content: 1001});
                }

                var query = {
                    deviceSN: warning["deviceSN"],
                    obd_faultcodelist: warning["obd_faultcodelist"],
                    gps_date: warning["gps_date"],
                    gps_Longitude: warning["gps_Longitude"],
                    gps_Latitude: warning["gps_Latitude"],
                    update_time: warning["update_time"]};

                ODBErrorRecord.getQuery(query, function (err, record) {

                    if (record.length == 0) {
                        var odbErrorRecord = new ODBErrorRecord(query);

                        odbErrorRecord.save(function (err, doc) {
                        });
                    }

                    res.json({flag: 'success', content: 3001});
                });
            });
        });
    });
};

exports.getWarningsList = function (req, res) {
    User.getOne(req.params['id'], function (err, user) {
        if (err) {
            return res.json({flag: 'fail', content: 1001});
        }

        ODBErrorRecord.getQuery({deviceSN: user.info.deviceSN}, function (err, records) {
            var codes = [];
            records.forEach(function (e) {
                codes.push(e.obd_faultcodelist);
            });
            ODBErrorCode.getOneByCodes(codes, function (err, odbErrorCodes) {
                getWarningsBySN(user.info.deviceSN, function (err, rows) {
                    if (err) {
                        return res.json({flag: 'fail', content: 1001});
                    }

                    var result = [];
                    records.forEach(function (e) {
                        var item = {};
                        odbErrorCodes.forEach(function (c) {
                            if (e.obd_faultcodelist == c.code) {
                                item = {
                                    code: c.code,
                                    mean: c.mean,
                                    status: "true"
                                };
                            }
                        });

                        rows.forEach(function (_e) {
                            if (e.deviceSN == _e.deviceSN
                                && e.obd_faultcodelist == _e.obd_faultcodelist
                                && e.gps_date == _e.gps_date
                                && e.gps_Longitude == _e.gps_Longitude
                                && e.gps_Latitude == _e.gps_Latitude) {
                                odbErrorCodes.forEach(function (c) {
                                    if (e.obd_faultcodelist == c.code) {
                                        item.status = "false"
                                    }
                                });
                            }
                        });

                        result.push(item);
                    });

                    res.json({flag: 'success', content: result});
                });
            });
        });
    })
};

exports.getWarningCount = function (req, res) {
    User.getOne(req.param['id'], function (err, user) {
        if (err) {
            return res.json({flag: 'fail', content: 1001});
        }

        getWarningCountBySN(user.info.deviceSN, function (err, result) {
            if (err) {
                return res.json({flag: 'fail', content: 1001});
            }

            return res.json({flag: 'success', content: result});
        })
    })
};

function getWarnings(callback) {
    mysql.getConnection(function (err, connection) {
        connection.query('select * from `obd_db_test`.`obd_data_luo_faultcode`  limit 0,1000', function (err, rows) {
            if (err) {
                callback(err);
            }

            callback(err, rows);
        });
    });
}

function getWarningsBySN(deviceSN, callback) {
    mysql.getConnection(function (err, connection) {
        connection.query('select * from `obd_db_test`.`obd_data_luo_faultcode` where `deviceSN` = ' + deviceSN + ' limit 0,1000', function (err, rows) {
            if (err) {
                callback(err);
            }

            callback(err, rows);
        });
    });
}

function getWarningById(id, callback) {
    mysql.getConnection(function (err, connection) {
        connection.query('select * from `obd_db_test`.`obd_data_luo_faultcode` where `infoid` = ' + id + ' limit 0,1000', function (err, rows) {
            if (err) {
                callback(err);
            }

            callback(err, rows[0]);
        });
    });
}

function getWarningCountBySN(deviceSN, callback) {
    mysql.getConnection(function (err, connection) {
        connection.query('select count(*) from `obd_db_test`.`obd_data_luo_faultcode` where `deviceSN` = ' + deviceSN + ' limit 0,1000', function (err, result) {
            if (err) {
                callback(err);
            }

            callback(err, result);
        });
    });
}

