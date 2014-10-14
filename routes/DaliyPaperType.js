/**
 * Created by amberglasses on 14-8-18.
 */
var DaliyPaperType = require('../models/DaliyPaperType');
var DaliyPaperSubType = require('../models/DaliyPaperSubType');
var uuid = require('node-uuid');
var fs = require('fs');

var level1_backpage = '/admins/daliyPaper/type/level1/showAll';
var level2_backpage = '/admins/daliyPaper/type/level2/showAll';

exports.level1_add = function(req, res){
    var name = req.body.name;
    var pic = req.files["pic"].name;

    switch(req.files["pic"].type){
        case "image/png":
            pic = uuid.v1() + ".png";
    }

    var newDaliyPaperType = new DaliyPaperType({
        name:name,
        pic:pic
    });

    newDaliyPaperType.save(function(err, daliyPaperType){
        if(err){
            req.flash('error', "添加该类型失败！");
            return res.redirect(level1_backpage);
        }

        var pic_target_path = './public/images/' + pic;
        // 使用同步方式重命名一个文件
        fs.renameSync(req.files["pic"].path, pic_target_path);

        req.flash('success', "添加该类型成功！");
        res.redirect(level1_backpage);
    });
};

exports.level1_delete = function(req, res){
    var id = req.params["id"];
    DaliyPaperType.getOne(id,function(err, daliyPaperType){
        DaliyPaperType.delete(id, function(err){
            if(err){
                req.flash('error', "删除该类型失败！");
                return res.redirect(level1_backpage);
            }

            fs.unlink('./public/images/'+daliyPaperType.pic,function(err){
                req.flash('success', "删除该类型成功！");
                res.redirect(level1_backpage);
            });
        });
    });
};

exports.level1_update = function(req, res){
    var id = req.body.id;
    var name = req.body.name;
    var pic = req.files["pic"].name;

    switch(req.files["pic"].type){
        case "image/png":
            pic = uuid.v1() + ".png";
    }

    DaliyPaperType.getOne(id, function(err, daliyPaperType){
        if(err){
            req.flash('error', "此类型不存在！");
            return res.redirect(level1_backpage);
        }

        fs.unlink('./public/images/'+daliyPaperType.pic,function(err){});

        daliyPaperType.name = name;
        daliyPaperType.pic = pic;

        DaliyPaperType.update(daliyPaperType, function(err){
            if(err){
                req.flash('error', "修改失败！");
                return res.redirect(level1_backpage);
            }

            var pic_target_path = './public/images/' + pic;
            // 使用同步方式重命名一个文件
            fs.renameSync(req.files["pic"].path, pic_target_path);

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
    var parentTypeId = req.body.parentTypeId;
    var name = req.body.name;
    var pic = req.files["pic"].name;
    var picSelected = req.files["picSelected"].name;

    switch(req.files["pic"].type){
        case "image/png":
            pic = uuid.v1() + ".png";
    }

    switch(req.files["picSelected"].type){
        case "image/png":
            picSelected = uuid.v1() + ".png";
    }

    var newDaliyPaperSubType = new DaliyPaperSubType({
        name:name,
        parentTypeId:parentTypeId,
        pic:pic,
        picSelected:picSelected
    });

    newDaliyPaperSubType.save(function(err, daliyPaperSubType){
        if(err){
            req.flash('error', "添加该类型失败！");
            return res.redirect(level2_backpage);
        }

        var pic_target_path = './public/images/' + pic;
        // 使用同步方式重命名一个文件
        fs.renameSync(req.files["pic"].path, pic_target_path);

        var picSelected_target_path = './public/images/' + picSelected;
        // 使用同步方式重命名一个文件
        fs.renameSync(req.files["picSelected"].path, picSelected_target_path);

        req.flash('success', "添加该类型成功！");
        res.redirect(level2_backpage);
    });
};

exports.level2_delete = function(req, res){
    var id = req.params["id"];

    DaliyPaperSubType.getOne(id,function(err,daliyPaperSubType){
        DaliyPaperSubType.delete(id, function(err){
            if(err){
                req.flash('error', "删除该类型失败！");
                return res.redirect(level2_backpage);
            }

            fs.unlink('./public/images/'+daliyPaperSubType.pic,function(err){});
            fs.unlink('./public/images/'+daliyPaperSubType.picSelected,function(err){});

            req.flash('success', "删除该类型成功！");
            res.redirect(level2_backpage);
        });
    });
};

exports.level2_update = function(req, res){
    var id = req.body.id;
    var name = req.body.name;
    var parentTypeId = req.body.parentTypeId;
    var pic = req.files["pic"].name;
    var picSelected = req.files["picSelected"].name;

    switch(req.files["pic"].type){
        case "image/png":
            pic = uuid.v1() + ".png";
    }

    switch(req.files["picSelected"].type){
        case "image/png":
            picSelected = uuid.v1() + ".png";
    }

    DaliyPaperSubType.getOne(id, function(err, daliyPaperSubType){
        if(err){
            req.flash('error', "此类型不存在！");
            return res.redirect(level2_backpage);
        }

        fs.unlink('./public/images/'+daliyPaperSubType.pic,function(err){});
        fs.unlink('./public/images/'+daliyPaperSubType.picSelected,function(err){});

        daliyPaperSubType.name = name;
        daliyPaperSubType.parentTypeId = parentTypeId;
        daliyPaperSubType.pic = pic;
        daliyPaperSubType.picSelected = picSelected;

        DaliyPaperSubType.update(daliyPaperSubType, function(err){
            if(err){
                req.flash('error', "修改失败！");
                return res.redirect(level2_backpage);
            }

            var pic_target_path = './public/images/' + pic;
            // 使用同步方式重命名一个文件
            fs.renameSync(req.files["pic"].path, pic_target_path);

            var picSelected_target_path = './public/images/' + picSelected;
            // 使用同步方式重命名一个文件
            fs.renameSync(req.files["pic"].path, picSelected_target_path);

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



////////////// iOS ///////////////

exports.level1_type = function(req, res){
    DaliyPaperType.getAll(function(err, daliyPaperTypes){
        if(err){
            return res.json({flag:"fail",content:1001});
        }
        res.json({flag:"success",content:daliyPaperTypes});
    });
};

exports.level2_type = function(req, res){
    var level1_type = req.params["type"];
    DaliyPaperSubType.getIdByParentTypeId(level1_type, function(err, daliyPaperSubTypes){
        if(err){
            return res.json({flag:"fail",content:1001});
        }
        if(daliyPaperSubTypes){
            res.json({flag:"success",content:daliyPaperSubTypes});
        }else{
            res.json({flag:"empty"});
        }
    });
};



exports.getDaliyPeperDefaultSettings = function(){
    DaliyPaperType.getAll(function (err, daliyPaperTypes) {
        if (err) {
            return callback(err);
        }

        var ids = [];
        daliyPaperTypes.forEach(function (e) {
            var item = {
                id: e._id,
                percent:"0",
                child:[]
            };
            ids.push(item);
        });

        callback(err, ids);
    });
};
