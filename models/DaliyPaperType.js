/**
 * Created by amberglasses on 14-8-7.
 */
var mongodbPool = require('./db');
var ObjectId = require('mongodb').ObjectID;

function DaliyPaperType(daliyPaperType){
    this.name = daliyPaperType.name;
    this.pic = daliyPaperType.pic;
}

module.exports = DaliyPaperType;

DaliyPaperType.prototype.save = function(callback){
    var DaliyPaperType = {
        name:this.name,
        pic:this.pic
    };

    mongodbPool.acquire(function(err,db){
        if(err){
            return callback(err);
        }

        db.collection('DaliyPaperType', function(err, collection){
            if(err){
                mongodbPool.release(db);
                return callback(err);
            }

            collection.insert(DaliyPaperType,function(err,doc){
                mongodbPool.release(db);
                if(err){
                    return callback(err);
                }

                callback(null, doc);
            });
        });
    });
};

DaliyPaperType.getAll = function(callback){
    mongodbPool.acquire(function(err, db){
        if(err){
            return callback(err);
        }

        db.collection('DaliyPaperType', function(err, collection){
            if(err){
                mongodbPool.release(db);
                return callback(err);
            }

            collection.find().sort().toArray(function(err, daliyPaperTypes){
                mongodbPool.release(db);
                if(err){
                    return callback(err);
                }

                callback(null, daliyPaperTypes);
            });
        });
    });
};

DaliyPaperType.getOne = function(id, callback){
    mongodbPool.acquire(function(err,db){
        if(err){
            return callback(err);
        }

        db.collection('DaliyPaperType',function(err,collection){
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

DaliyPaperType.delete = function(id, callback){
    mongodbPool.acquire(function(err, db){
        if(err){
            return callback(err);
        }

        db.collection('DaliyPaperType', function(err, collection){
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

DaliyPaperType.update = function(DaliyPaperType, callback){
    mongodbPool.acquire(function(err,db){
        if(err){
            return callback(err);
        }

        db.collection('DaliyPaperType',function(err,collection){
            if(err){
                mongodbPool.release(db);
                return callback(err);
            }

            collection.update({_id:ObjectId(DaliyPaperType._id)},{$set:DaliyPaperType},{safe:true}, function(err){
                mongodbPool.release(db);
                if(err){
                    return callback(err);
                }

                callback(null);
            });
        });
    });
};

DaliyPaperType.geSome = function(ids, callback){
    mongodbPool.acquire(function(err, db){
        if(err){
            return callback(err);
        }

        db.collection('DaliyPaperType', function(err, collection){
            if(err){
                mongodbPool.release(db);
                return callback(err);
            }

            collection.find().sort().toArray(function(err, daliyPaperTypes){
                mongodbPool.release(db);
                if(err){
                    return callback(err);
                }

                var result = [];
                daliyPaperTypes.forEach(function(e){
                    var _t;
                    ids.forEach(function(_e){
                        if(!_e){
                            _t={
                                "_id" : e._id,
                                "name" : e.name,
                                "pic" : e.pic,
                                "percent": "0"
                            }
                        }else{
                            if(e._id == _e.id){
                                _t={
                                    "_id" : e._id,
                                    "name" : e.name,
                                    "pic" : e.pic,
                                    "percent": _e.percent
                                }
                            }else{
                                _t={
                                    "_id" : e._id,
                                    "name" : e.name,
                                    "pic" : e.pic,
                                    "percent": "0"
                                }
                            }
                        }

                        result.push(_t);
                    });
                });

                callback(null, result);
            });
        });
    });
};