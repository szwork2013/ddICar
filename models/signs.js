/**
 * Created by amberglasses on 15/2/27.
 */
var mongodbPool = require('./db');
var ObjectId = require('mongodb').ObjectID;

function Sign(sign) {
    this.user_id = sign.user_id;
    this.longitude = sign.longitude;
    this.latitude = sign.latitude;
    this.type = sign.type;
}

module.exports = Sign;

Sign.prototype.save = function (callback) {
    var sign = {
        user_id: this.user_id,
        longitude: this.longitude,
        latitude: this.latitude,
        type: this.type
    };

    mongodbPool.acquire(function (err, db) {
        if (err) {
            return callback(err);
        }

        db.collection('Signs', function (err, collection) {
            if (err) {
                mongodbPool.release(db);
                return callback(err);
            }

            collection.insert(sign, function (err, doc) {
                mongodbPool.release(db);
                if (err) {
                    return callback(err);
                }

                callback(null, doc);
            });
        });
    });
};

Sign.getQuery = function (query, callback) {
    mongodbPool.acquire(function (err, db) {
        if (err) {
            return callback(err);
        }

        db.collection('Signs', function (err, collection) {
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