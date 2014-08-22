/**
 * Created by amberglasses on 14-8-11.
 */
var mongodbPool = require('./db');
var ObjectId = require('mongodb').ObjectID;

function DaliyPaper(daliyPaper){
    this.title = daliyPaper.title;
    this.author = daliyPaper.author;
    this.pic = daliyPaper.pic;
    this.type = daliyPaper.type;
    this.audio = daliyPaper.audio;
    this.favorites = 0;
}

module.exports = DaliyPaper;

DaliyPaper.prototype.save = function(callback){
    var daliyPaper = {
        title:this.title,
        author:this.author,
        pic:this.pic,
        type:this.type,
        audio:this.audio
    };

    mongodbPool.acquire(function(err, db){
        if(err){
            return callback(err);
        }

        db.collection('DaliyPaper', function(err, collection){
            if(err){
                mongodbPool.release(db);
                return callback(err);
            }

            collection.insert(daliyPaper, function(err, doc){
                mongodbPool.release(db);
                if(err){
                    return callback(err);
                }

                callback(null, doc);
            });
        });
    });
};

DaliyPaper.getAll = function(callback){
    mongodbPool.acquire(function(err,db){
        if(err){
            return callback(err);
        }

        db.collection('DaliyPaper',function(err,collection){
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

DaliyPaper.getSome = function(ids, callback){
    mongodbPool.acquire(function(err,db){
        if(err){
            return callback(err);
        }

        db.collection('DaliyPaper',function(err,collection){
            if(err){
                mongodbPool.release(db);
                return callback(err);
            }

            collection.find({id:{'$in':ids}}).sort().toArray(function(err,docs){
                mongodbPool.release(db);
                if(err){
                    return callback(err);
                }

                callback(err,docs);
            });
        });
    });
};

DaliyPaper.getOne = function(id, callback){
    mongodbPool.acquire(function(err,db){
        if(err){
            return callback(err);
        }

        db.collection('DaliyPaper',function(err,collection){
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

DaliyPaper.delete = function(id, callback){
    mongodbPool.acquire(function(err, db){
        if(err){
            return callback(err);
        }

        db.collection('DaliyPaper', function(err, collection){
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

DaliyPaper.update = function(daliyPaper, callback){
    mongodbPool.acquire(function(err,db){
        if(err){
            return callback(err);
        }

        db.collection('DaliyPaper',function(err,collection){
            if(err){
                mongodbPool.release(db);
                return callback(err);
            }

            collection.update({'_id':ObjectId(daliyPaper._id)},{$set:daliyPaper},{safe:true}, function(err){
                mongodbPool.release(db);
                if(err){
                    return callback(err);
                }

                callback(null);
            });
        });
    });
};

DaliyPaper.setFavorite = function(id, callback){
    mongodbPool.acquire(function(err,db){
        if(err){
            return callback(err);
        }

        db.collection('DaliyPaper',function(err,collection){
            if(err){
                mongodbPool.release(db);
                return callback(err);
            }

            collection.update({'_id':ObjectId(id)},{
                $inc: {"favorites": 1}
            }, function(err){
                mongodbPool.release(db);
                if(err){
                    return callback(err);
                }

                callback(null);
            });
        });
    });
};

DaliyPaper.setUnFavorite = function(id, callback){
    mongodbPool.acquire(function(err,db){
        if(err){
            return callback(err);
        }

        db.collection('DaliyPaper',function(err,collection){
            if(err){
                mongodbPool.release(db);
                return callback(err);
            }

            collection.update({'_id':ObjectId(id)},{
                $inc: {"favorites": -1}
            }, function(err){
                mongodbPool.release(db);
                if(err){
                    return callback(err);
                }

                callback(null);
            });
        });
    });
};