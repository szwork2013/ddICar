/**
 * Created by amberglasses on 14-8-22.
 */
var YourVoice = require('../models/YourVoice');
var uuid = require('node-uuid');
var fs = require('fs');
var YourVoiceType = require('../models/YourVoiceType');
var backpage = "/admins/yourVoice/content/showAll";

exports.uploadSysVoice = function(req, res){
    var type = req.body.type;
    var content = req.body.content;
    var audioFileId = req.files["audio"].name;

    if(!req.files){
        return res.json(301,{"error":"没有图片文件！"});
    }

    switch(req.files["audio"].type){
        case "audio/mpeg":
        case "audio/mp3":
            audioFileId = uuid.v1() + ".mp3";
            break;
    }

    var newYourVoice = new YourVoice({
        audioFileId:audioFileId,
        type:type,
        content:content,
        uploadDate:new Date()
    });

    newYourVoice.save(function(err){
        if(err){
            return res.json(400,err);
        }

        var target_path = './public/audio/yourVoice/' + audioFileId;
        // 使用同步方式重命名一个文件
        fs.renameSync(req.files["audio"].path, target_path);

        res.redirect(backpage);
    });
};

exports.delete = function(req, res){
    var id = req.params["id"];
    YourVoice.getOne(id, function(err, yourVoice){
        YourVoice.delete(id, function(err){
            var target_path = './public/audio/yourVoice/' + yourVoice.audioFileId;

            fs.unlink(target_path, function(err){
                if(err){
                    req.flash("error", "删除失败！");
                    return res.redirect(backpage);
                }

                req.flash('success', "删除成功！");
                res.redirect(backpage);
            });
        });
    });
};

exports.showAll = function(req, res){
    YourVoiceType.getAll(function(err, yourVoiceTypes){
        YourVoice.getAll(function(err, yourVoices){
            res.render('yourVoice_content_showAll', {
                title:"东东电台管理后台",
                success:req.flash('success'),
                error:req.flash('error'),
                admin:req.session.admin,
                yourVoices:yourVoices,
                yourVoiceTypes:yourVoiceTypes
            });
        });
    })
};

exports.getByType = function(req, res){
    var type = req.params['type'];
    YourVoice.getByType(type,function(err, yourVoices){
        if(err){
            return res.json({flag:"fail",content:1001});
        }

        res.json({flag:"success",content:yourVoices});
    });
};


////////////////  iOS ////////////////
exports.uploadMyVoice = function(req, res){
    var content = req.body.content;
    var audio = req.files["audio"].name;

    if(req.files["audio"]){
        switch(req.files["audio"].type){
            case "audio/mp3":
                audio = uuid.v1() + ".mp3";
        }
    }

    var newYourVoice = new YourVoice({
        audioFileId:audio,
        type:'myVoice',
        content:content,
        uploadDate:new Date()
    });

    newYourVoice.save(function(err){
        if(err){
            return res.json({flag:"fail",content:1001});
        }

        var target_path = './public/audio/yourVoice/' + audio;
        // 使用同步方式重命名一个文件
        fs.renameSync(req.files["audio"].path, target_path);

        res.json({flag:"success",content:3001});
    });
};