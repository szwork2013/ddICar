/**
 * Created by amberglasses on 14-9-27.
 */
var mongodbPool = require('./db');
var ObjectId = require('mongodb').ObjectID;

function OBDErrorCode(obdErrorCode){
    this.code = obdErrorCode.code;
    this.mean = obdErrorCode.mean;
}

module.exports = OBDErrorCode;

OBDErrorCode.prototype.save = function(callback){
    var OBDErrorCode = {
        code:this.code,
        mean:this.mean
    };

    mongodbPool.acquire(function(err, db){
        if(err){
            return callback(err);
        }

        db.collection('OBDErrorCode', function(err, collection){
            if(err){
                mongodbPool.release(db);
                return callback(err);
            }

            collection.insert(OBDErrorCode,{w:1},function(err, doc){
                mongodbPool.release(db);
                if(err){
                    return callback(err);
                }

                callback(null,doc[0]);
            })
        });
    });
};

OBDErrorCode.getOne = function(id, callback){
    mongodbPool.acquire(function(err, db){
        if(err){
            return callback(err);
        }

        db.collection('OBDErrorCode', function(err, collection){
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

OBDErrorCode.getOneByCode = function(code, callback){
    mongodbPool.acquire(function(err, db){
        if(err){
            return callback(err);
        }

        db.collection('OBDErrorCode', function(err, collection){
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

OBDErrorCode.getOneByCodes = function(codes, callback){
    mongodbPool.acquire(function(err,db){
        if(err){
            return callback(err);
        }

        db.collection('OBDErrorCode',function(err,collection){
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

OBDErrorCode.getAll = function(callback){

    mongodbPool.acquire(function(err,db){
        if(err){
            return callback(err);
        }

        db.collection('OBDErrorCode',function(err,collection){
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

OBDErrorCode.delete = function(id, callback){
    mongodbPool.acquire(function(err, db){
        if(err){
            return callback(err);
        }

        db.collection('OBDErrorCode', function(err, collection){
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

OBDErrorCode.update = function(OBDErrorCode, callback){
    mongodbPool.acquire(function(err,db){
        if(err){
            return callback(err);
        }

        db.collection('OBDErrorCode',function(err,collection){
            if(err){
                mongodbPool.release(db);
                return callback(err);
            }

            collection.update({_id:ObjectId(OBDErrorCode._id)},{$set:OBDErrorCode},{safe:true}, function(err){
                mongodbPool.release(db);
                if(err){
                    return callback(err);
                }

                callback(null);
            });
        });
    });
};