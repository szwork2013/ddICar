/**
 * Created by amberglasses on 14-8-11.
 */
var DaliyPaper = require('../models/DaliyPaper');
var DaliyPaperType = require('../models/DaliyPaperType');
var DaliyPaperSubType = require('../models/DaliyPaperSubType');
var fs = require('fs');
var uuid = require('node-uuid');
var Common = require('../common');
var Zan = require('../models/Zan');
var backpage = '/admins/daliyPaper/content/showAll/1';

exports.add = function (req, res) {
    var title = req.body.title;
    var author = req.body.author;
    var pic = req.files["pic"].name;
    var typeId = req.body.daliyPaperType;
    var contentType = req.body.contentType;
    var audio = req.files["audio"].name;
    var txt = req.body.txt;

    switch (req.files["pic"].type) {
        case "image/png":
            pic = uuid.v1() + ".png";
            break;
        case "image/jpeg":
            pic = uuid.v1() + ".jpg";
            break;
    }

    var content;
    switch (contentType) {
        case "audio":
            switch (req.files["audio"].type) {
                case "audio/mpeg":
                case "audio/mp3":
                    audio = uuid.v1() + ".mp3";
                    break;
            }
            content = audio;
            break;
        case "text":
            content = txt;
            break;
    }

    var newDaliyPaper = new DaliyPaper({
        title: title,
        author: author,
        pic: pic,
        typeId: typeId,
        contentType: contentType,
        content: content
    });

    newDaliyPaper.save(function (err, daliyPaper) {
        if (err) {
            req.flash('error', "添加该日报失败！");
            return res.redirect(backpage);
        }

        var pic_target_path = './public/images/' + pic;
        // 使用同步方式重命名一个文件
        fs.renameSync(req.files["pic"].path, pic_target_path);

        if (req.files["audio"].name) {
            var audio_target_path = './public/audio/daliyPaper/' + audio;
            // 使用同步方式重命名一个文件
            fs.renameSync(req.files["audio"].path, audio_target_path);
        }

        req.flash('success', "添加该日报成功！");
        res.redirect(backpage);
    });
};

exports.update = function (req, res) {
    var id = req.body.id;
    var title = req.body.title;
    var author = req.body.author;
    var pic = req.files["pic"].name;
    var typeId = req.body.daliyPaperType;
    var audio;

    if (req.files["pic"].name != "") {
        switch (req.files["pic"].type) {
            case "image/png":
                pic = uuid.v1() + ".png";
                break;
            case "image/jpeg":
                pic = uuid.v1() + ".jpg";
                break;
        }
    }

    DaliyPaper.getOne(id, function (err, daliyPaper) {
        if (err) {
            req.flash("error", err);
        }
        if (!daliyPaper) {
            req.flash("error", "此日报不存在！");
        }

        var content;
        switch (daliyPaper.contentType) {
            case "audio":
                switch (req.files["audio"].type) {
                    case "audio/mpeg":
                    case "audio/mp3":
                        audio = uuid.v1() + ".mp3";
                        break;
                }
                content = audio;
                break;
            case "text":
                content = req.body.txt;
                break;
        }

        daliyPaper.title = title;
        daliyPaper.author = author;
        daliyPaper.typeId = typeId;
        if (req.files["pic"].name != "")
            daliyPaper.pic = pic;
        daliyPaper.content = content;

        if (pic != daliyPaper.pic) {
            fs.unlink('./public/images/' + daliyPaper.pic, function (err) {
                if (!err) {
                    daliyPaper.pic = pic;

                    DaliyPaper.update(daliyPaper, function (err) {
                        if (err) {
                            req.flash("error", err);
                            return res.redirect(backpage);
                        }

                        fs.renameSync(req.files["pic"].path, './public/images/' + daliyPaper.pic);

                        if (req.files["audio"].name) {
                            var audio_target_path = './public/audio/daliyPaper/' + audio;
                            // 使用同步方式重命名一个文件
                            fs.renameSync(req.files["audio"].path, audio_target_path);
                        }

                        req.flash("success", "修改成功！");
                        res.redirect(backpage);
                    });
                }
            });
        }
    });
};

exports.showAll = function (req, res) {
    var pageIndex = req.params["pageindex"];

    DaliyPaperType.getAll(function (err, daliyPaperTypes) {
        DaliyPaperSubType.getAll(function (err, daliyPaperSubTypes) {
            DaliyPaper.getAll(pageIndex, function (err, daliyPapers, total) {
//                console.log(daliyPapers);
                daliyPapers.totalPage = parseInt(total / 10) + 1;
                console.log(daliyPapers.totalPage);

                var nextPageIndex = parseInt(pageIndex) + 1;
                var lastPageIndex = parseInt(pageIndex) - 1;
                res.render('daliyPaper_content_showAll', {
                    title: "东东电台管理后台",
                    success: req.flash('success'),
                    error: req.flash('error'),
                    admin: req.session.admin,
                    pageIndex: pageIndex,
                    nextPageIndex: nextPageIndex,
                    lastPageIndex: lastPageIndex,
                    daliyPapers: daliyPapers,
                    daliyPaperTypes: daliyPaperTypes,
                    daliyPaperSubTypes: daliyPaperSubTypes
                });
            });
        });
    });
};

exports.delete = function (req, res) {
    var id = req.params["id"];

    DaliyPaper.getOne(id, function (err, daliyPaper) {
        if (err) {
            req.flash('error', "该日报不存在！");
        }

        DaliyPaper.delete(id, function (err) {
            if (err) {
                req.flash('error', "删除该类型失败！");
                return res.redirect(backpage);
            }

            fs.unlink('./public/images/' + daliyPaper.pic, function (err) {
                req.flash('success', "删除该类型成功！");
                res.redirect(backpage);
            });
        });
    });
};

exports.getAll = function (req, res) {
    var user_id = req.params["id"];
    var pageindex = req.params["pageindex"];



    DaliyPaper.getAll(pageindex, function (err, daliyPapers, total) {
        if (err) {
            return res.json({flag: "fail", content: 1001});
        }

        daliyPapers.totalPage = parseInt(total / 10) + 1;

        res.json({flag: "success", content: daliyPapers});
    });
};

exports.getAllNum = function (req, res) {
    var start = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);  //前一天var nextDate = new
    var end = new Date();
    var query = {"createAt": {"$gte": start, "$lt": end}};
    DaliyPaper.getQuery(query, function (err, daliyPapers) {
        if (err) {
            return res.json(Common.fail(Common.commonEnum.SYSTEM_ERROR, '服务器错误'));
        }

        res.json(Common.success(daliyPapers.length, null));
    });
};

exports.setZan = function (req, res) {
    var zan = {
        user_id: req.body.user_id,
        post_id: req.body.post_id
    };

    Zan.getByUserAndPostId(zan, function (err, zan) {
        if (err) {
            return res.json(Common.fail(Common.commonEnum.SYSTEM_ERROR, '服务器错误'));
        }

        if (!zan) {
            var newZan = new Zan(zan);

            newZan.save(function (err, _zan) {
                if (err) {
                    return res.json(Common.fail(Common.commonEnum.SYSTEM_ERROR, '服务器错误'));
                }

                DaliyPaper.setZan(_zan.post_id, function (err) {
                    if (err) {
                        return res.json(Common.fail(Common.commonEnum.SYSTEM_ERROR, '服务器错误'));
                    }

                    res.json(Common.success(_zan, null));
                });
            });
        } else {
            res.json(Common.success(_zan, null));
        }
    });
};