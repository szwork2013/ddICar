/**
 * Created by amberglasses on 14/11/1.
 */
var mongodbPool = require('./db');
var ObjectId = require('mongodb').ObjectID;

function Zan(zan) {
    this.user_id = zan.user_id;
    this.post_id = zan.post_id;
}

module.exports = Zan;

Zan.prototype.save = function (callback) {
    var zan = {
        user_id: this.user_id,
        post_id: this.post_id
    };

    mongodbPool.acquire(function (err, db) {
        if (err) {
            return callback(err);
        }

        db.collection('Zan', function (err, collection) {
            if (err) {
                mongodbPool.release(db);
                return callback(err);
            }

            collection.insert(zan, {w: 1}, function (err, doc) {
                mongodbPool.release(db);
                if (err) {
                    return callback(err);
                }

                callback(null, doc[0]);
            })
        });
    });
};

Zan.getByUserAndPostId = function (zan, callback) {
    mongodbPool.acquire(function (err, db) {
        if (err) {
            return callback(err);
        }

        db.collection('Zan', function (err, collection) {
            if (err) {
                mongodbPool.release(db);
                return callback(err);
            }
            collection.findOne({'user_id': zan.user_id, 'post_id': zan.post_id}, function (err, doc) {
                mongodbPool.release(db);
                if (err) {
                    return callback(err);
                }

                return callback(null, doc);
            });
        });
    });
};


Zan.delete = function (zan, callback) {
    mongodbPool.acquire(function (err, db) {
        if (err) {
            return callback(err);
        }

        db.collection('Zan', function (err, collection) {
            if (err) {
                mongodbPool.release(db);
                return callback(err);
            }

            collection.remove({"user_id": zan.user_id, "post_id": zan.post_id}, function (err) {
                mongodbPool.release(db);
                if (err) {
                    return callback(err);
                }
                callback(null);
            });
        });
    });
};