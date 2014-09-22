/**
 * Created by amberglasses on 14-8-14.
 */
var mongodbPool = require('./db');
var ObjectId = require('mongodb').ObjectID;

function Favorite(Favorite){
    this.user_id = Favorite.user_id;
    this.post_id = Favorite.post_id;
}

module.exports = Favorite;

Favorite.prototype.save = function(callback){
    var favorite = {
        user_id:this.user_id,
        post_id:this.post_id
    };

    mongodbPool.acquire(function(err, db){
        if(err){
            return callback(err);
        }

        db.collection('favorite', function(err, collection){
            if(err){
                mongodbPool.release(db);
                return callback(err);
            }

            collection.insert(favorite,{w:1},function(err, doc){
                mongodbPool.release(db);
                if(err){
                    return callback(err);
                }

                callback(null,doc[0]);
            })
        });
    });
};

Favorite.getOne = function(id, callback){
    mongodbPool.acquire(function(err, db){
        if(err){
            return callback(err);
        }

        db.collection('favorite', function(err, collection){
            if(err){
                mongodbPool.release(db);
                return callback(err);
            }
            collection.findOne({'_id': ObjectId(id)},function(err,doc){
                mongodbPool.release(db);
                if(err){
                    return callback(err);
                }

                return callback(null, doc);
            });
        });
    });
};

Favorite.getByUserAndPostId = function(user_id,post_id,callback){
    mongodbPool.acquire(function(err, db){
        if(err){
            return callback(err);
        }

        db.collection('favorite', function(err, collection){
            if(err){
                mongodbPool.release(db);
                return callback(err);
            }
            collection.findOne({'user_id': user_id,'post_id':post_id},function(err,doc){
                mongodbPool.release(db);
                if(err){
                    return callback(err);
                }

                return callback(null, doc);
            });
        });
    });
};

Favorite.getAll = function(user_id, callback){
    mongodbPool.acquire(function(err,db){
        if(err){
            return callback(err);
        }

        db.collection('favorite',function(err,collection){
            if(err){
                mongodbPool.release(db);
                return callback(err);
            }

            collection.find({user_id: user_id}).sort().toArray(function(err,doc){
                if(err){
                    return callback(err);
                }

                callback(err,doc);
            });
        });
    });
};

Favorite.delete = function(user_id,post_id, callback){
    mongodbPool.acquire(function(err, db){
        if(err){
            return callback(err);
        }

        db.collection('favorite', function(err, collection){
            if(err){
                mongodbPool.release(db);
                return callback(err);
            }

            collection.remove({"user_id": user_id, "post_id": post_id}, function(err){
                mongodbPool.release(db);
                if(err){
                    return callback(err);
                }
                callback(null);
            });
        });
    });
};