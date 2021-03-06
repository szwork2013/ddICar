/**
 * Created by amberglasses on 14-8-11.
 */
var mongodbPool = require('./db');
var ObjectId = require('mongodb').ObjectID;

function DaliyPaper(daliyPaper) {
    this.title = daliyPaper.title;
    this.author = daliyPaper.author;
    this.pic = daliyPaper.pic;
    this.typeId = daliyPaper.typeId;
    this.contentType = daliyPaper.contentType;
    this.content = daliyPaper.content;
    this.favorites = 0;
    this.createAt = new Date();
    this.zan = 0;
}

module.exports = DaliyPaper;

DaliyPaper.prototype.save = function (callback) {
    var daliyPaper = {
        title: this.title,
        author: this.author,
        pic: this.pic,
        typeId: this.typeId,
        contentType: this.contentType,
        content: this.content,
        favorites:0
    };

    mongodbPool.acquire(function (err, db) {
        if (err) {
            return callback(err);
        }

        db.collection('DaliyPaper', function (err, collection) {
            if (err) {
                mongodbPool.release(db);
                return callback(err);
            }

            collection.insert(daliyPaper, function (err, doc) {
                mongodbPool.release(db);
                if (err) {
                    return callback(err);
                }

                callback(null, doc);
            });
        });
    });
};

DaliyPaper.getAll = function (pageindex, query, callback) {
    mongodbPool.acquire(function (err, db) {
        if (err) {
            return callback(err);
        }

        db.collection('DaliyPaper', function (err, collection) {
            if (err) {
                mongodbPool.release(db);
                return callback(err);
            }

            //根据 query 对象查询，并跳过前 (page-1)*10 个结果，返回之后的 10 个结果

            collection.count(query, function (err, total) {
                if (err) {
                    console.log(1);
                    return callback(err);
                }

                collection.find(query, {
                    skip: (pageindex - 1) * 10,
                    limit: 10
                }).sort({_id: -1}).toArray(function (err, docs) {
                    mongodbPool.release(db);
                    if (err) {
                        console.log(2);
                        return callback(err);
                    }

                    callback(null, docs, total);
                });
            });
        });
    });
};

DaliyPaper.getSome = function (ids, callback) {
    mongodbPool.acquire(function (err, db) {
        if (err) {
            return callback(err);
        }

        db.collection('DaliyPaper', function (err, collection) {
            if (err) {
                mongodbPool.release(db);
                return callback(err);
            }

            collection.find({_id: {'$in': ids}}).sort().toArray(function (err, docs) {
                mongodbPool.release(db);
                if (err) {
                    return callback(err);
                }

                callback(err, docs);
            });
        });
    });
};

DaliyPaper.getQuery = function (query, callback) {
    mongodbPool.acquire(function (err, db) {
        if (err) {
            return callback(err);
        }

        db.collection('DaliyPaper', function (err, collection) {
            if (err) {
                mongodbPool.release(db);
                return callback(err);
            }

            collection.find(query).sort().toArray(function (err, docs) {
                mongodbPool.release(db);
                if (err) {
                    return callback(err);
                }

                callback(err, docs);
            });
        });
    });
};

DaliyPaper.getOne = function (id, callback) {
    mongodbPool.acquire(function (err, db) {
        if (err) {
            return callback(err);
        }

        db.collection('DaliyPaper', function (err, collection) {
            if (err) {
                mongodbPool.release(db);
                return callback(err);
            }

            collection.findOne({_id: ObjectId(id)}, function (err, doc) {
                mongodbPool.release(db);
                if (err) {
                    return callback(err);
                }

                callback(null, doc);
            });
        });
    });
};

DaliyPaper.delete = function (id, callback) {
    mongodbPool.acquire(function (err, db) {
        if (err) {
            return callback(err);
        }

        db.collection('DaliyPaper', function (err, collection) {
            if (err) {
                mongodbPool.release(db);
                return callback(err);
            }

            collection.remove({"_id": ObjectId(id)}, function (err) {
                mongodbPool.release(db);
                if (err) {
                    return callback(err);
                }
                callback(null);
            });
        });
    });
};

DaliyPaper.update = function (daliyPaper, callback) {
    mongodbPool.acquire(function (err, db) {
        if (err) {
            return callback(err);
        }

        db.collection('DaliyPaper', function (err, collection) {
            if (err) {
                mongodbPool.release(db);
                return callback(err);
            }

            collection.update({'_id': ObjectId(daliyPaper._id)}, {$set: daliyPaper}, {safe: true}, function (err) {
                mongodbPool.release(db);
                if (err) {
                    return callback(err);
                }

                callback(null);
            });
        });
    });
};

DaliyPaper.setFavorite = function (id, callback) {
    mongodbPool.acquire(function (err, db) {
        if (err) {
            return callback(err);
        }

        db.collection('DaliyPaper', function (err, collection) {
            if (err) {
                mongodbPool.release(db);
                return callback(err);
            }

            collection.update({'_id': ObjectId(id)}, {
                $inc: {"favorites": 1}
            }, function (err) {
                mongodbPool.release(db);
                if (err) {
                    return callback(err);
                }

                callback(null);
            });
        });
    });
};

DaliyPaper.setUnFavorite = function (id, callback) {
    mongodbPool.acquire(function (err, db) {
        if (err) {
            return callback(err);
        }

        db.collection('DaliyPaper', function (err, collection) {
            if (err) {
                mongodbPool.release(db);
                return callback(err);
            }

            collection.update({'_id': ObjectId(id)}, {
                $inc: {"favorites": -1}
            }, function (err) {
                mongodbPool.release(db);
                if (err) {
                    return callback(err);
                }

                callback(null);
            });
        });
    });
};

DaliyPaper.setZan = function (id, callback) {
    mongodbPool.acquire(function (err, db) {
        if (err) {
            return callback(err);
        }

        db.collection('DaliyPaper', function (err, collection) {
            if (err) {
                mongodbPool.release(db);
                return callback(err);
            }

            collection.update({'_id': ObjectId(id)}, {
                $inc: {"zan": 1}
            }, function (err) {
                mongodbPool.release(db);
                if (err) {
                    return callback(err);
                }

                callback(null);
            });
        });
    });
};

DaliyPaper.setZan = function (id, callback) {
    mongodbPool.acquire(function (err, db) {
        if (err) {
            return callback(err);
        }

        db.collection('DaliyPaper', function (err, collection) {
            if (err) {
                mongodbPool.release(db);
                return callback(err);
            }

            collection.update({'_id': ObjectId(id)}, {
                $inc: {"zan": -1}
            }, function (err) {
                mongodbPool.release(db);
                if (err) {
                    return callback(err);
                }

                callback(null);
            });
        });
    });
};