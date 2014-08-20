var mongodbPool = require('./db');
var ObjectID = require('mongodb');

function Admin(admin){
    this.name = admin.name;
    this.email = admin.email;
    this.password = admin.password;
    this.isSuperAdmin = admin.isSuperAdmin;
}

module.exports = Admin;

Admin.prototype.save = function(callback){
    var admin = {
        name:this.name,
        email:this.email,
        password:this.password,
        isSuperAdmin:this.isSuperAdmin
    };

    // 获取连接
    mongodbPool.acquire(function(err,db){
        if(err){
            return callback(err);
        }

        // 获取集合
        db.collection('admins',function(err,collection){
            if(err){
                mongodbPool.release(db);
                return callback(err);
            }

            collection.insert(admin,{w:1},function(err,doc){
                mongodbPool.release(db);
                if(err){
                    return callback(err);
                }

                callback(null,doc[0]);
            });
        });
    });
};

Admin.delete = function(email, callback){
    mongodbPool.acquire(function(err, db){
        if(err){
            return callback(err);
        }

        db.collection('admins', function(err, collection){
            if(err){
                mongodbPool.release(db);
                return callback(err);
            }

            collection.remove({"email": email}, function(err){
                mongodbPool.release(db);
                if(err){
                    return callback(err);
                }
                callback(null);
            });
        });
    });
};

Admin.getOne = function(email,callback){
    mongodbPool.acquire(function(err, db){
        if(err){
            return callback(err);
        }

        db.collection('admins', function(err,collection){
            if(err){
                mongodbPool.release(db);
                return callback(err);
            }

            collection.findOne({email:email},function(err,doc){
                mongodbPool.release(db);
                if(err){
                    return callback(err);
                }

                callback(err,doc);
            });
        });
    });
};

Admin.getAll = function(callback){
    mongodbPool.acquire(function(err,db){
        if(err){
            return callback(err);
        }

        db.collection('admins',function(err,collection){
            if(err){
                mongodbPool.release(db);
                return callback(err);
            }

            collection.find().toArray(function(err,docs){
                mongodbPool.release(db);
                if(err){
                    return callback(err);
                }

                callback(err,docs);
            });
        });
    });
};

Admin.update = function(admin, callback){
    mongodbPool.acquire(function(err, db){
        if(err){
            return callback(err);
        }

        db.collection('admins', function(err,collection){
            if(err){
                mongodbPool.release(db);
                return callback(err);
            }

            collection.update({'_id':admin._id},{$set:admin},{safe:true},function(err){
                mongodbPool.release(db);
                if(err){
                    return callback(err);
                }

                callback(null);
            });
        });
    });
};