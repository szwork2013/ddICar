/**
 * Created by amberglasses on 14-8-14.
 */
var Favorite = require('../models/favorite');
var DaliyPaper = require('../models/DaliyPaper');
var ObjectId = require('mongodb').ObjectID;

exports.getAll = function(req, res){
    Favorite.getAll(req.body.user_id, function(err, favorites){
        if(err){
            return res.json({flag:"fail",content:1001});
        }

        var post_ids = [];
        favorites.forEach(function(e){
            post_ids.push(ObjectId(e.post_id));
        });

        console.log(post_ids);

        DaliyPaper.getSome(post_ids, function(err, daliyPapers){

            if(err){
                return res.json({flag:"fail",content:1001});
            }
            return res.json({flag:"success",content:daliyPapers});
        });
    });
};

exports.favorite = function(req, res){
    var user_id = req.body.user_id;
    var post_id = req.body.post_id;

    var newFavorite = new Favorite({
        user_id:user_id,
        post_id:post_id
    });

    newFavorite.save(function(err, favorite){
        if(err){
            return res.json({flag:"fail",content:1001});
        }

        DaliyPaper.setFavorite(post_id, function(err){
            if(err){
                return res.json({flag:"fail",content:1001});
            }

            res.json({flag:"success",content:"收藏成功"});
        });
    });
};

exports.unfavorite = function(req, res){
    var user_id = req.body.user_id;
    var post_id = req.body.post_id;

    Favorite.delete(user_id,post_id,function(err){
        if(err){
            return res.json({flag:"fail",content:1001});
        }

        DaliyPaper.setUnFavorite(post_id, function(err){
            if(err){
                return res.json({flag:"fail",content:1001});
            }

            res.json({flag:"success",content:"取消收藏"});
        });
    });
};

