/**
 * Created by amberglasses on 14-8-11.
 */
var DaliyPaper = require('../models/DaliyPaper');
var fs = require('fs');
var uuid = require('node-uuid');

exports.add = function(req, res){
    var title = req.body.title;
    var author = req.body.author;
    var pic = req.files["pic"].name;
    var type = req.body.type;
    var audio = req.files["audio"].name;

    console.log(req.files["audio"]);

    switch(req.files["pic"].type){
        case "image/png":
            pic = uuid.v1() + ".png";
    }

    switch(req.files["audio"].type){
        case "audio/mp3":
            audio = uuid.v1() + ".mp3";
    }

    var newDaliyPaper = new DaliyPaper({
        title:title,
        author:author,
        pic:pic,
        type:type,
        audio:audio
    });

    newDaliyPaper.save(function(err, daliyPaper){
        if(err){
            req.flash('error', "添加该日报失败！");
            return res.redirect('/admins/daliyPaper/content/showAll');
        }

        var pic_target_path = './public/images/' + pic;
        // 使用同步方式重命名一个文件
        fs.renameSync(req.files["pic"].path, pic_target_path);

        var audio_target_path = './public/audio/daliyPaper/' + audio;
        // 使用同步方式重命名一个文件
        fs.renameSync(req.files["audio"].path, audio_target_path);

        req.flash('success', "添加该日报成功！");
        res.redirect('/admins/daliyPaper/content/showAll');
    });
};

exports.update = function(req, res){
    console.log(req.body);
    var id = req.body.id;
    var title = req.body.title;
    var author = req.body.author;
    var pic = req.files["pic"].name;

    switch(req.files["pic"].type){
        case "image/png":
            pic = uuid.v1() + ".png";
    }

    DaliyPaper.getOne(id, function(err, daliyPaper){
        if(err){
            req.flash("error",err);
        }
        if(!daliyPaper){
            req.flash("error","此日报不存在！");
        }

        daliyPaper.title = title;
        daliyPaper.author = author;
        if(pic != daliyPaper.pic){
            fs.unlink('./public/images/' + daliyPaper.pic, function(err){
                if(!err){
                    daliyPaper.pic = pic;

                    DaliyPaper.update(daliyPaper,function(err){
                        if(err){
                            req.flash("error",err);
                            return res.redirect("/admins/daliyPaper/content/showAll");
                        }

                        fs.renameSync(req.files["pic"].path, './public/images/'+daliyPaper.pic);

                        req.flash("success", "修改成功！");
                        res.redirect("/admins/daliyPaper/content/showAll");
                    });
                }
            });
        }
    });
};

exports.showAll = function(req, res){
    DaliyPaper.getAll(function(err, daliyPapers){
        res.render('daliyPaper_content_showAll', {
            title:"东东电台管理后台",
            success:req.flash('success'),
            error:req.flash('error'),
            admin:req.session.admin,
            daliyPapers:daliyPapers
        });
    });
};

exports.delete = function(req, res){
    var id = req.params["id"];

    DaliyPaper.getOne(id, function(err, daliyPaper){
        if(err){
            req.flash('error', "该日报不存在！");
        }

        DaliyPaper.delete(id, function(err){
            if(err){
                req.flash('error', "删除该类型失败！");
                return res.redirect('/admins/daliyPaper/content/showAll');
            }

            fs.unlink('./public/images/'+daliyPaper.pic,function(err){
                req.flash('success', "删除该类型成功！");
                res.redirect('/admins/daliyPaper/content/showAll');
            });
        });
    });
};

exports.getAll = function(req, res){
    DaliyPaper.getAll(function(err,daliyPapers){
        if(err){
            return res.json(400,err);
        }

        res.json(200, daliyPapers);
    });
};
