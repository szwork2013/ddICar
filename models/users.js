var mongodbPool = require('./db');
var ObjectId = require('mongodb').ObjectID;

function User(user){
	this.info = {
		phone: user.phone,
		password: user.password,
		name: "None",
        pic:"None",
        sex:"None",
        intro:"",
        lastUpDateTime:new Date()
	};
	this.daliy_paper = {};
    this.you_voice = {};
    this.settings = {};
}

module.exports = User;

User.prototype.save = function(callback){
	var user = {
		info: this.info
	};

	mongodbPool.acquire(function(err, db){
		if(err){
			return callback(err);
		}

		db.collection('users', function(err, collection){
			if(err){
				mongodbPool.release(db);
				return callback(err);
			}

			collection.ensureIndex('info.phone', function(err, user) {});
			collection.insert(user,{w:1},function(err, doc){
				mongodbPool.release(db);
				if(err){
					return callback(err);
				}

				callback(null,doc[0]);
			})
		});
	});
};

User.update = function(user, callback){
	mongodbPool.acquire(function(err, db){
        if(err){
            return callback(err);
        }

        db.collection('users',function(err, collection){
            if(err){
                mongodbPool.release(db);
                return callback(err);
            }

            collection.update({'_id':user._id},{$set:user},{safe:true},function(err){
                mongodbPool.release(db);
                if(err){
                    return callback(err);
                }

                callback(null);
            });
        });
    });
};

User.getOne = function(id, callback){
	mongodbPool.acquire(function(err, db){
		if(err){
			return callback(err);
		}

		db.collection('users', function(err, collection){
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

User.getByPhone = function(phone, callback){
    mongodbPool.acquire(function(err, db){
        if(err){
            return callback(err);
        }

        db.collection('users', function(err, collection){
            if(err){
                mongodbPool.release(db);
                return callback(err);
            }
            collection.findOne({'info.phone':phone},function(err,doc){
                mongodbPool.release(db);
                if(err){
                    return callback(err);
                }

                return callback(null, doc);
            });
        });
    });
};

User.getByTime = function(user,callback){
    mongodbPool.acquire(function(err,db){
        if(err){
            return callback(err);
        }

        db.collection('users', function(err, collection){
            if(err){
                mongodbPool.release(db);
                return callback(err);
            }
            var date = new Date(user.info.lastUpDateTime);
            var query = {
                "info.phone":user.info.phone,
                "info.lastUpDateTime":date
            };
            collection.findOne(query,function(err,doc){
                mongodbPool.release(db);
                if(err){
                    return callback(err);
                }
                if(doc){
                    return callback(err, "download");
                }else {
                    return callback(err, "upload");
                }
            });
        });
    });
};

User.getAll = function(callback){
    mongodbPool.acquire(function(err,db){
        if(err){
            return callback(err);
        }

        db.collection('users',function(err,collection){
            if(err){
                mongodbPool.release(db);
                return callback(err);
            }

            collection.find().toArray(function(err,doc){
                if(err){
                    return callback(err);
                }

                callback(err,doc);
            });
        });
    });
};