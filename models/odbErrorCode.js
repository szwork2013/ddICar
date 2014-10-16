/**
 * Created by amberglasses on 14-9-27.
 */
var mongodbPool = require('./db');
var ObjectId = require('mongodb').ObjectID;

function ODBErrorCode(odbErrorCode){
    this.code = odbErrorCode.code;
    this.mean = odbErrorCode.mean;
}

module.exports = ODBErrorCode;

ODBErrorCode.prototype.save = function(callback){
    var ODBErrorCode = {
        code:this.code,
        mean:this.mean
    };

    mongodbPool.acquire(function(err, db){
        if(err){
            return callback(err);
        }

        db.collection('ODBErrorCode', function(err, collection){
            if(err){
                mongodbPool.release(db);
                return callback(err);
            }

            collection.insert(ODBErrorCode,{w:1},function(err, doc){
                mongodbPool.release(db);
                if(err){
                    return callback(err);
                }

                callback(null,doc[0]);
            })
        });
    });
};

ODBErrorCode.getOne = function(id, callback){
    mongodbPool.acquire(function(err, db){
        if(err){
            return callback(err);
        }

        db.collection('ODBErrorCode', function(err, collection){
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

ODBErrorCode.getOneByCode = function(code, callback){
    mongodbPool.acquire(function(err, db){
        if(err){
            return callback(err);
        }

        db.collection('ODBErrorCode', function(err, collection){
            if(err){
                mongodbPool.release(db);
                return callback(err);
            }
            collection.findOne({'code': code},function(err,doc){
                mongodbPool.release(db);
                if(err){
                    return callback(err);
                }

                return callback(null, doc);
            });
        });
    });
};

ODBErrorCode.getOneByCodes = function(codes, callback){
    mongodbPool.acquire(function(err,db){
        if(err){
            return callback(err);
        }

        db.collection('ODBErrorCode',function(err,collection){
            if(err){
                mongodbPool.release(db);
                return callback(err);
            }

            collection.find({code:{'$in':codes}}).sort().toArray(function(err,docs){
                mongodbPool.release(db);
                if(err){
                    return callback(err);
                }

                callback(err,docs);
            });
        });
    });
};

ODBErrorCode.getAll = function(callback){

    mongodbPool.acquire(function(err,db){
        if(err){
            return callback(err);
        }

        db.collection('ODBErrorCode',function(err,collection){
            if(err){
                mongodbPool.release(db);
                return callback(err);
            }

            collection.find().sort().toArray(function(err,docs){
                mongodbPool.release(db);
                if(err){
                    return callback(err);
                }

                callback(null,docs);
            });
        });
    });
};

ODBErrorCode.delete = function(id, callback){
    mongodbPool.acquire(function(err, db){
        if(err){
            return callback(err);
        }

        db.collection('ODBErrorCode', function(err, collection){
            if(err){
                mongodbPool.release(db);
                return callback(err);
            }

            collection.remove({"_id": ObjectId(id)}, function(err){
                mongodbPool.release(db);
                if(err){
                    return callback(err);
                }
                callback(null);
            });
        });
    });
};

ODBErrorCode.update = function(odbErrorCode, callback){
    mongodbPool.acquire(function(err,db){
        if(err){
            return callback(err);
        }

        db.collection('ODBErrorCode',function(err,collection){
            if(err){
                mongodbPool.release(db);
                return callback(err);
            }

            collection.update({_id:ObjectId(odbErrorCode._id)},{$set:odbErrorCode},{safe:true}, function(err){
                mongodbPool.release(db);
                if(err){
                    return callback(err);
                }

                callback(null);
            });
        });
    });
};