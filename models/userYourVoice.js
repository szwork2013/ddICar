/**
 * Created by amberglasses on 14-10-9.
 */
var mongodbPool = require('./db');
var ObjectID = require('mongodb').ObjectID;

function UserYourVoice(userYourVoice){
    this.user_id = userYourVoice.user_id;
    this.your_voice_id = userYourVoice.your_voice_id;
}

module.exports = UserYourVoice;

UserYourVoice.prototype.save = function(callback){
    var userYourVoice = {
        user_id:this.user_id,
        your_voice_id:this.your_voice_id
    };

    mongodbPool.acquire(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection('userYourVoice',function(err,collection){
            if(err){
                mongodbPool.release(db);
                return callback(err);
            }
            collection.insert(userYourVoice,{w:1},function(err,userYourVoice){
                mongodbPool.release(db);
                if(err){
                    return callback(err);
                }
                callback(null,userYourVoice);
            });
        });
    });
};

UserYourVoice.getAll = function(callback){
    mongodbPool.acquire(function(err, db){
        if(err){
            return callback(err);
        }

        db.collection('userYourVoice', function(err, collection){
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

UserYourVoice.getAllByUserId = function(user_id,callback){
    mongodbPool.acquire(function(err, db){
        if(err){
            return callback(err);
        }

        db.collection('userYourVoice', function(err, collection){
            if(err){
                mongodbPool.release(db);
                return callback(err);
            }

            collection.find({user_id:user_id}).sort().toArray(function(err, docs){
                mongodbPool.release(db);
                if(err){
                    return callback(err);
                }

                callback(null, docs);
            });
        });
    });
};

UserYourVoice.getOne = function(id, callback){
    mongodbPool.acquire(function(err, db){
        if(err){
            return callback(err);
        }

        db.collection('userYourVoice', function(err, collection){
            if(err){
                mongodbPool.release(db);
                return callback(err);
            }

            collection.findOne({_id:ObjectID(id)}, function(err, doc){
                mongodbPool.release(db);
                if(err){
                    return callback(err);
                }

                callback(null, doc);
            });
        });
    });
};

UserYourVoice.delete = function(id, callback){
    mongodbPool.acquire(function(err, db){
        if(err){
            return callback(err);
        }

        db.collection('userYourVoice', function(err, collection){
            if(err){
                mongodbPool.release(db);
                return callback(err);
            }

            collection.remove({_id:ObjectID(id)}, function(err){
                mongodbPool.release(db);
                if(err){
                    return callback(err);
                }

                callback(err);
            });
        });
    });
};
