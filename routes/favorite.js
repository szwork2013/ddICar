/**
 * Created by amberglasses on 14-8-14.
 */
var Favorite = require('../models/favorite');
var DaliyPaper = require('../models/DaliyPaper');
var ObjectId = require('mongodb').ObjectID;
var Common = require('../common');

exports.getAll = function(req, res){
    Favorite.getAll(req.params['id'], function(err, favorites){
        if(err){
            return res.json(Common.fail(Common.commonEnum.SYSTEM_ERROR, '服务器故障'));
        }

        var post_ids = [];
        favorites.forEach(function(e){
            post_ids.push(ObjectId(e.post_id));
        });

        DaliyPaper.getSome(post_ids, function(err, daliyPapers){

            if(err){
                return res.json(Common.fail(Common.commonEnum.SYSTEM_ERROR, '服务器故障'));
            }
            return res.json(Common.success(daliyPapers));
        });
    });
};

exports.favorite = function(req, res){
    var user_id = req.body.user_id;
    var post_id = req.body.post_id;

    Favorite.getByUserAndPostId(user_id,post_id,function(err,favorite){
        if(!favorite){
            var newFavorite = new Favorite({
                user_id:user_id,
                post_id:post_id
            });

            newFavorite.save(function(err, favorite){
                if(err){
                    return res.json(Common.fail(Common.commonEnum.SYSTEM_ERROR, '服务器故障'));
                }

                DaliyPaper.setFavorite(post_id, function(err){
                    if(err){
                        return res.json(Common.fail(Common.commonEnum.SYSTEM_ERROR, '服务器故障'));
                    }

                    res.json(Common.success());
                });
            });
        }else{
            res.json(Common.success());
        }
    });
};

exports.unfavorite = function(req, res){
    var user_id = req.body.user_id;
    var post_id = req.body.post_id;

    Favorite.delete(user_id,post_id,function(err){
        if(err){
            return res.json(Common.fail(Common.commonEnum.SYSTEM_ERROR, '服务器故障'));
        }

        DaliyPaper.setUnFavorite(post_id, function(err){
            if(err){
                return res.json(Common.fail(Common.commonEnum.SYSTEM_ERROR, '服务器故障'));
            }

            res.json(Common.success());
        });
    });
};

