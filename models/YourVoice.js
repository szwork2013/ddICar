/**
 * Created by amberglasses on 14-8-6.
 */
var mongodbPool = require('./db');
var ObjectID = require('mongodb').ObjectID;

function YourVoice(yourVoice){
    this.audioFileId = yourVoice.audioFileId;
    this.type = yourVoice.type;
    this.content = yourVoice.content;
    this.uploadDate = yourVoice.uploadDate;
}

module.exports = YourVoice;

YourVoice.prototype.save = function(callback){
    var yourVoice = {
        audioFileId:this.audioFileId,
        type:this.type,
        content:this.content,
        uploadDate:this.uploadDate
    };
    mongodbPool.acquire(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection('YourVoice',function(err,collection){
            if(err){
                mongodbPool.release(db);
                return callback(err);
            }
            collection.insert(yourVoice,{w:1},function(err,yourVoice){
                mongodbPool.release(db);
                if(err){
                    return callback(err);
                }
                callback(null,yourVoice[0]);
            });
        });
    });
};

YourVoice.update = function(yourVoice, callback){
    mongodbPool.acquire(function(err, db){
        if(err){
            return callback(err);
        }

        db.collection('YourVoice',function(err, collection){
            if(err){
                mongodbPool.release(db);
                return callback(err);
            }

            collection.update({'_id':YourVoice._id},{$set:YourVoice},{safe:true},function(err){
                mongodbPool.release(db);
                if(err){
                    return callback(err);
                }

                callback(null);
            });
        });
    });
};

YourVoice.getAll = function(callback){
    mongodbPool.acquire(function(err, db){
        if(err){
            return callback(err);
        }

        db.collection('YourVoice', function(err, collection){
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

YourVoice.getByType = function(type,callback){
    mongodbPool.acquire(function(err, db){
        if(err){
            return callback(err);
        }

        db.collection('YourVoice', function(err, collection){
            if(err){
                mongodbPool.release(db);
                return callback(err);
            }

            var query = {
                type:type
            };

            collection.find(query).sort().toArray(function(err, docs){
                mongodbPool.release(db);
                if(err){
                    return callback(err);
                }

                callback(null, docs);
            });
        });
    });
};

YourVoice.getOne = function(id, callback){
    mongodbPool.acquire(function(err, db){
        if(err){
            return callback(err);
        }

        db.collection('YourVoice', function(err, collection){
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

YourVoice.delete = function(id, callback){
  mongodbPool.acquire(function(err, db){
      if(err){
          return callback(err);
      }

      db.collection('YourVoice', function(err, collection){
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

YourVoice.getQuery = function(query,callback){
    mongodbPool.acquire(function(err,db){
        if(err){
            return callback(err);
        }

        db.collection('YourVoice',function(err,collection){
            if(err){
                mongodbPool.release(db);
                return callback(err);
            }

            collection.find(query).sort().toArray(function(err,docs){
                mongodbPool.release(db);
                if(err){
                    return callback(err);
                }

                callback(err,docs);
            });
        });
    });
};