/**
 * Created by amberglasses on 14-8-19.
 */
var mongodbPool = require('./db');
var ObjectId = require('mongodb').ObjectID;

function YourVoiceType(yourVoiceType){
    this.name = yourVoiceType.name;
}

module.exports = YourVoiceType;

YourVoiceType.prototype.save = function(callback){
    var yourVoiceType = {
        name:this.name
    };

    mongodbPool.acquire(function(err,db){
        if(err){
            return callback(err);
        }

        db.collection('YourVoiceType', function(err, collection){
            if(err){
                mongodbPool.release(db);
                return callback(err);
            }

            collection.insert(yourVoiceType,function(err,doc){
                mongodbPool.release(db);
                if(err){
                    return callback(err);
                }

                callback(null, doc);
            });
        });
    });
};

YourVoiceType.getAll = function(callback){
    mongodbPool.acquire(function(err, db){
        if(err){
            return callback(err);
        }

        db.collection('YourVoiceType', function(err, collection){
            if(err){
                mongodbPool.release(db);
                return callback(err);
            }

            collection.find().sort().toArray(function(err, docs){
                mongodbPool.release(db);
                if(err){
                    return callback(err);
                }

                callback(null, docs);
            });
        });
    });
};

YourVoiceType.getOne = function(id, callback){
    mongodbPool.acquire(function(err,db){
        if(err){
            return callback(err);
        }

        db.collection('YourVoiceType',function(err,collection){
            if(err){
                mongodbPool.release(db);
                return callback(err);
            }

            collection.findOne({_id:ObjectId(id)}, function(err,doc){
                mongodbPool.release(db);
                if(err){
                    return callback(err);
                }

                callback(null, doc);
            });
        });
    });
};

YourVoiceType.delete = function(id, callback){
    mongodbPool.acquire(function(err, db){
        if(err){
            return callback(err);
        }

        db.collection('YourVoiceType', function(err, collection){
            if(err){
                mongodbPool.release(db);
                return callback(err);
            }

            collection.remove({_id:ObjectId(id)}, function(err){
                mongodbPool.release(db);
                if(err){
                    callback(err);
                }

                callback(null);
            });
        });
    });
};

YourVoiceType.update = function(yourVoiceType, callback){
    mongodbPool.acquire(function(err,db){
        if(err){
            return callback(err);
        }

        db.collection('YourVoiceType',function(err,collection){
            if(err){
                mongodbPool.release(db);
                return callback(err);
            }

            collection.update({_id:ObjectId(yourVoiceType._id)},{$set:yourVoiceType},{safe:true}, function(err){
                mongodbPool.release(db);
                if(err){
                    return callback(err);
                }

                callback(null);
            });
        });
    });
};