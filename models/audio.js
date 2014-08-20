/**
 * Created by amberglasses on 14-8-6.
 */
var mongodbPool = require('./db');
var ObjectID = require('mongodb').ObjectID;

function Audio(audio){
    this.audioFileId = audio.audioFileId;
    this.type = audio.type;
    this.content = audio.content;
    this.uploadDate = audio.uploadDate;
}

module.exports = Audio;

Audio.prototype.save = function(callback){
    var audio = {
        audioFileId:this.audioFileId,
        type:this.type,
        content:this.content,
        uploadDate:this.uploadDate
    };
    mongodbPool.acquire(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection('audio',function(err,collection){
            if(err){
                mongodbPool.release(db);
                return callback(err);
            }
            collection.ensureIndex('audioFileId',function(err,audio){});
            collection.insert(audio,{w:1},function(err,audio){
                mongodbPool.release(db);
                if(err){
                    return callback(err);
                }
                callback(null,audio);
            });
        });
    });
};

Audio.getAll = function(callback){
    mongodbPool.acquire(function(err, db){
        if(err){
            return callback(err);
        }

        db.collection('audio', function(err, collection){
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

Audio.getOne = function(id, callback){
    mongodbPool.acquire(function(err, db){
        if(err){
            return callback(err);
        }

        db.collection('audio', function(err, collection){
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

Audio.delete = function(id, callback){
  mongodbPool.acquire(function(err, db){
      if(err){
          return callback(err);
      }

      db.collection('audio', function(err, collection){
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