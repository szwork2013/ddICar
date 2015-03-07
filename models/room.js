/**
 * Created by amberglasses on 15/2/6.
 */
var mongodbPool = require('./db');
var ObjectId = require('mongodb').ObjectID;

function Room(room) {
    this.name = room.name;
    this.roomId = room.roomId
}

module.exports = Room;

Room.prototype.save = function (callback) {
    var room = {
        name: this.name,
        roomId:this.roomId
    };

    mongodbPool.acquire(function (err, db) {
        if (err) {
            return callback(err);
        }

        db.collection('room', function (err, collection) {
            if (err) {
                mongodbPool.release(db);
                return callback(err);
            }

            collection.insert(room, function (err, doc) {
                mongodbPool.release(db);
                if (err) {
                    return callback(err);
                }

                callback(null, doc[0]);
            });
        });
    });
};

Room.getQuery = function (query, callback) {
    mongodbPool.acquire(function (err, db) {
        if (err) {
            return callback(err);
        }

        db.collection('room', function (err, collection) {
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