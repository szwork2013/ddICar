/**
 * Created by amberglasses on 15/2/27.
 */
var mongodbPool = require('./db');
var ObjectId = require('mongodb').ObjectID;

function FeedBack(feedBack) {
    this.user_id = feedBack.user_id;
    this.content = feedBack.content;
}

module.exports = FeedBack;

FeedBack.prototype.save = function (callback) {
    var feedBack = {
        user_id: this.user_id,
        content: this.content
    };

    
    mongodbPool.acquire(function (err, db) {
        if (err) {
            return callback(err);
        }

        db.collection('FeedBack', function (err, collection) {
            if (err) {
                mongodbPool.release(db);
                return callback(err);
            }

            collection.insert(feedBack, function (err, doc) {
                mongodbPool.release(db);
                if (err) {
                    return callback(err);
                }

                callback(null, doc);
            });
        });
    });
};