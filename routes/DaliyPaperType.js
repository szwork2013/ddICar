/**
 * Created by amberglasses on 14-8-18.
 */
var DaliyPaperType = require('../models/DaliyPaperType');
var DaliyPaperSubType = require('../models/DaliyPaperSubType');

var level1_backpage = '/admins/daliyPaper/type/level1/showAll';
var level2_backpage = '/admins/daliyPaper/type/level2/showAll';

exports.level1_add = function(req, res){
    var name = req.body.name;

    var newDaliyPaperType = new DaliyPaperType({
        name:name
    });

    newDaliyPaperType.save(function(err, daliyPaperType){
        if(err){
            req.flash('error', "添加该类型失败！");
            return res.redirect(level1_backpage);
        }

        req.flash('success', "添加该类型成功！");
        res.redirect(level1_backpage);
    });
};

exports.level1_delete = function(req, res){
    var id = req.params["id"];

    DaliyPaperType.delete(id, function(err){
        if(err){
            req.flash('error', "删除该类型失败！");
            return res.redirect(level1_backpage);
        }

        req.flash('success', "删除该类型成功！");
        res.redirect(level1_backpage);
    });
};

exports.level1_update = function(req, res){
    var id = req.body.id;
    var name = req.body.name;

    DaliyPaperType.getOne(id, function(err, daliyPaperType){
        if(err){
            req.flash('error', "此类型不存在！");
            return res.redirect(level1_backpage);
        }

        daliyPaperType.name = name;

        DaliyPaperType.update(daliyPaperType, function(err){
            if(err){
                req.flash('error', "修改失败！");
                return res.redirect(level1_backpage);
            }

            req.flash('success', "修改成功！");
            res.redirect(level1_backpage);
        });
    });
};

exports.level1_showAll = function(req, res){
    DaliyPaperType.getAll(function(err, daliyPaperTypes){
        res.render('daliyPaper_type_level1_showAll', {
            title:"东东电台管理后台",
            success:req.flash('success'),
            error:req.flash('error'),
            admin:req.session.admin,
            daliyPaperTypes:daliyPaperTypes
        });
    });
};

exports.level2_add = function(req, res){
    var daliyPaperType = req.body.daliyPaperType;
    var daliyPaperSubType = req.body.daliyPaperSubType;

    var newDaliyPaperSubType = new DaliyPaperSubType({
        name:daliyPaperSubType,
        daliyPaperType:daliyPaperType
    });

    newDaliyPaperSubType.save(function(err, daliyPaperSubType){
        if(err){
            req.flash('error', "添加该类型失败！");
            return res.redirect(level2_backpage);
        }

        req.flash('success', "添加该类型成功！");
        res.redirect(level2_backpage);
    });
};

exports.level2_delete = function(req, res){
    var id = req.params["id"];

    DaliyPaperSubType.delete(id, function(err){
        if(err){
            req.flash('error', "删除该类型失败！");
            return res.redirect(level2_backpage);
        }

        req.flash('success', "删除该类型成功！");
        res.redirect(level2_backpage);
    });
};

exports.level2_update = function(req, res){
    var id = req.body.id;
    var daliyPaperType = req.body.daliyPaperType;
    var daliyPaperSubType_name = req.body.daliyPaperSubType_name;

    DaliyPaperSubType.getOne(id, function(err, daliyPaperSubType){
        if(err){
            req.flash('error', "此类型不存在！");
            return res.redirect(level2_backpage);
        }

        daliyPaperSubType.name = daliyPaperSubType_name;
        daliyPaperSubType.daliyPaperType = daliyPaperType;

        DaliyPaperSubType.update(daliyPaperSubType, function(err){
            if(err){
                req.flash('error', "修改失败！");
                return res.redirect(level2_backpage);
            }

            req.flash('success', "修改成功！");
            res.redirect(level2_backpage);
        });
    });
};

exports.level2_showAll = function(req, res){

    DaliyPaperType.getAll(function(err, daliyPaperTypes){
        DaliyPaperSubType.getAll(function(err, daliyPaperSubTypes){
            res.render('daliyPaper_type_level2_showAll', {
                title:"东东电台管理后台",
                success:req.flash('success'),
                error:req.flash('error'),
                admin:req.session.admin,
                daliyPaperSubTypes:daliyPaperSubTypes,
                daliyPaperTypes:daliyPaperTypes
            });
        });
    });
};