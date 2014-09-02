/**
 * Created by amberglasses on 14-8-6.
 */
var mongodbPool = require('./db');
var ObjectId = require('mongodb').ObjectID;

function DaliyPaperSubType(daliyPaperSubType){
    this.name = daliyPaperSubType.name;
    this.daliyPaperType = daliyPaperSubType.daliyPaperType;
}

module.exports = DaliyPaperSubType;

DaliyPaperSubType.prototype.save = function(callback){
    var DaliyPaperSubType = {
        name:this.name,
        daliyPaperType:this.daliyPaperType
    };

    mongodbPool.acquire(function(err,db){
        if(err){
            return callback(err);
        }

        db.collection('DaliyPaperSubType', function(err, collection){
            if(err){
                mongodbPool.release(db);
                return callback(err);
            }

            collection.insert(DaliyPaperSubType,function(err,doc){
                mongodbPool.release(db);
                if(err){
                    return callback(err);
                }

                callback(null, doc);
            });
        });
    });
};

DaliyPaperSubType.getAll = function(callback){
    mongodbPool.acquire(function(err, db){
        if(err){
            return callback(err);
        }

        db.collection('DaliyPaperSubType', function(err, collection){
            if(err){
                mongodbPool.release(db);
                return callback(err);
            }

            collection.find().sort().toArray(function(err, daliyPaperSubTypes){
                mongodbPool.release(db);
                if(err){
                    return callback(err);
                }

                callback(null, daliyPaperSubTypes);
            });
        });
    });
};

DaliyPaperSubType.getOne = function(id, callback){
    mongodbPool.acquire(function(err,db){
        if(err){
            return callback(err);
        }

        db.collection('DaliyPaperSubType',function(err,collection){
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

DaliyPaperSubType.getIdByType = function(name,daliyPaperType, callback){
    mongodbPool.acquire(function(err,db){
        if(err){
            return callback(err);
        }

        db.collection('DaliyPaperSubType',function(err,collection){
            if(err){
                mongodbPool.release(db);
                return callback(err);
            }

            collection.findOne({name:name,daliyPaperType:daliyPaperType}, function(err,doc){
                mongodbPool.release(db);
                if(err){
                    return callback(err);
                }

                callback(null, doc);
            });
        });
    });
};

DaliyPaperSubType.delete = function(id, callback){
    mongodbPool.acquire(function(err, db){
        if(err){
            return callback(err);
        }

        db.collection('DaliyPaperSubType', function(err, collection){
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

DaliyPaperSubType.update = function(DaliyPaperSubType, callback){
    mongodbPool.acquire(function(err,db){
        if(err){
            return callback(err);
        }

        db.collection('DaliyPaperSubType',function(err,collection){
            if(err){
                mongodbPool.release(db);
                return callback(err);
            }

            collection.update({_id:ObjectId(DaliyPaperSubType._id)},{$set:DaliyPaperSubType},{safe:true}, function(err){
                mongodbPool.release(db);
                if(err){
                    return callback(err);
                }

                callback(null);
            });
        });
    });
};