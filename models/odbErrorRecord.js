/**
 * Created by amberglasses on 14/10/16.
 */
var mongodbPool = require('./db');
var ObjectId = require('mongodb').ObjectID;
var YourVoice = require('./YourVoice');

function ODBErrorRecord(odbErrorRecord) {
    this.deviceSN = odbErrorRecord.deviceSN;
    this.obd_faultcodelist = odbErrorRecord.obd_faultcodelist;
    this.gps_date = odbErrorRecord.gps_date;
    this.gps_Longitude = odbErrorRecord.gps_Longitude;
    this.gps_Latitude = odbErrorRecord.gps_Latitude;
    this.update_time = odbErrorRecord.update_time;
}

module.exports = ODBErrorRecord;

ODBErrorRecord.prototype.save = function (callback) {
    var odbErrorRecord = {
        deviceSN: this.deviceSN,
        obd_faultcodelist: this.obd_faultcodelist,
        gps_date: this.gps_date,
        gps_Longitude: this.gps_Longitude,
        gps_Latitude: this.gps_Latitude,
        update_time: this.update_time
    };

    mongodbPool.acquire(function (err, db) {
        if (err) {
            return callback(err);
        }

        db.collection('ODBErrorRecord', function (err, collection) {
            if (err) {
                mongodbPool.release(db);
                return callback(err);
            }

            collection.insert(odbErrorRecord, {w: 1}, function (err, doc) {
                mongodbPool.release(db);
                if (err) {
                    return callback(err);
                }

                callback(null, doc[0]);

            })
        });
    });
};

ODBErrorRecord.update = function (odbErrorRecord, callback) {
    mongodbPool.acquire(function (err, db) {
        if (err) {
            return callback(err);
        }

        db.collection('ODBErrorRecord', function (err, collection) {
            if (err) {
                mongodbPool.release(db);
                return callback(err);
            }

            collection.update({'_id': odbErrorRecord._id}, {$set: odbErrorRecord}, {safe: true}, function (err) {
                mongodbPool.release(db);
                if (err) {
                    return callback(err);
                }

                callback(null);
            });
        });
    });
};

ODBErrorRecord.getOne = function (id, callback) {
    mongodbPool.acquire(function (err, db) {
        if (err) {
            return callback(err);
        }

        db.collection('ODBErrorRecord', function (err, collection) {
            if (err) {
                mongodbPool.release(db);
                return callback(err);
            }
            collection.findOne({'_id': ObjectId(id)}, function (err, doc) {
                mongodbPool.release(db);
                if (err) {
                    return callback(err);
                }

                return callback(null, doc);
            });
        });
    });
};

ODBErrorRecord.getAll = function (callback) {
    mongodbPool.acquire(function (err, db) {
        if (err) {
            return callback(err);
        }

        db.collection('ODBErrorRecord', function (err, collection) {
            if (err) {
                mongodbPool.release(db);
                return callback(err);
            }

            collection.find().sort().toArray(function (err, docs) {
                if (err) {
                    return callback(err);
                }

                callback(err, docs);
            });
        });
    });
};

ODBErrorRecord.getQuery = function (query, callback) {
    mongodbPool.acquire(function (err, db) {
        if (err) {
            return callback(err);
        }

        db.collection('ODBErrorRecord', function (err, collection) {
            if (err) {
                mongodbPool.release(db);
                return callback(err);
            }

            collection.find(query).sort().toArray(function (err, docs) {
                mongodbPool.release(db);
                if (err) {
                    return callback(err);
                }

                callback(err, docs);
            });
        });
    });
};