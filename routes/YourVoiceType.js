/**
 * Created by amberglasses on 14-8-19.
 */
var YourVoiceType = require('../models/YourVoiceType');

var backpage = '/admins/yourVoice/type/showAll';

exports.add = function(req, res){

    console.log(req.body);
    var name = req.body.name;

    var newYourVoiceType = new YourVoiceType({
        name:name
    });

    newYourVoiceType.save(function(err, yourVoiceType){
        if(err){
            req.flash('error', "添加该类型失败！");
            return res.redirect(level1_backpage);
        }

        req.flash('success', "添加该类型成功！");
        res.redirect(backpage);
    });
};

exports.delete = function(req, res){
    var id = req.params["id"];

    YourVoiceType.delete(id, function(err){
        if(err){
            req.flash('error', "删除该类型失败！");
            return res.redirect(backpage);
        }

        req.flash('success', "删除该类型成功！");
        res.redirect(backpage);
    });
};

exports.update = function(req, res){
    var id = req.body.id;
    var name = req.body.name;

    YourVoiceType.getOne(id, function(err, yourVoiceType){
        if(err){
            req.flash('error', "此类型不存在！");
            return res.redirect(level1_backpage);
        }

        yourVoiceType.name = name;

        YourVoiceType.update(yourVoiceType, function(err){
            if(err){
                req.flash('error', "修改失败！");
                return res.redirect(backpage);
            }

            req.flash('success', "修改成功！");
            res.redirect(backpage);
        });
    });
};

exports.showAll = function(req, res){
    YourVoiceType.getAll(function(err, yourVoiceTypes){
        res.render('yourVoice_type_showAll', {
            title:"东东电台管理后台",
            success:req.flash('success'),
            error:req.flash('error'),
            admin:req.session.admin,
            yourVoiceTypes:yourVoiceTypes
        });
    });
};

/////////////////////  iOS //////////////////////
exports.getType = function(req, res){
    YourVoiceType.getAll(function(err, youVoiceTypes){
        if(err){
            return res.json({flag:'fail',content:1001});
        }

        res.json({flag:'success',content:youVoiceTypes});
    })
};



