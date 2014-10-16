/**
 * Created by amberglasses on 14-9-27.
 */
var OBDErrorCode = require('../models/odbErrorCode');
var backpage = "/admins/OBDErrorCode/showAll";

exports.add = function(req, res){
    var code = req.body.code;
    var mean = req.body.mean;

    var newOBDErrorCode = new OBDErrorCode({
        code:code,
        mean:mean
    });

    newOBDErrorCode.save(function(err, daliyPaperType){
        if(err){
            req.flash('error', "添加该类型失败！");
            return res.redirect(backpage);
        }

        req.flash('success', "添加该类型成功！");
        res.redirect(backpage);
    });
};

exports.delete = function(req, res){
    var id = req.params["id"];
    OBDErrorCode.getOne(id,function(err, obdErrorCode){
        OBDErrorCode.delete(id, function(err){
            if(err){
                req.flash('error', "删除该类型失败！");
                return res.redirect(backpage);
            }

            req.flash('success', "删除该类型成功！");
            res.redirect(backpage);
        });
    });
};

exports.update = function(req, res){
    var id = req.body.id;
    var code = req.body.code;
    var mean = req.body.mean;

    OBDErrorCode.getOne(id, function(err, obdErrorCode){
        if(err){
            req.flash('error', "此类型不存在！");
            return res.redirect(backpage);
        }

        obdErrorCode.code = code;
        obdErrorCode.mean = mean;

        OBDErrorCode.update(obdErrorCode, function(err){
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
    OBDErrorCode.getAll(function(err,odbErrorCode){
        res.render('OBDErrorCode', {
            title:"东东电台管理后台",
            success:req.flash('success'),
            error:req.flash('error'),
            admin:req.session.admin,
            OBDErrorCode:odbErrorCode
        });
    });
};