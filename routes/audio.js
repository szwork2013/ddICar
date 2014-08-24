/**
 * Created by amberglasses on 14-8-6.
 */
var mongo = require('mongodb');
var mongodbPool = require('../models/db.js');
var Grid = require('mongodb').Grid;
var Gridform = require('gridform');
var fs = require('fs');
var uploadErrorLogfile = fs.createWriteStream('uploadError.log',{flags:'a'});
var Audio = require('../models/audio');
var YourVoiceType = require('../models/YourVoiceType');

exports.uploadErrorLogfile = uploadErrorLogfile;

exports.upload = function (req,res) {
    mongodbPool.acquire(function(err,db){
        if(err){
            return res.josn(400,{'err':'acquire db failed'});
        }

        Gridform.db = db;
        Gridform.mongo = mongo;
        var form = Gridform();
        form.parse(req, function (err, fields, files) {
            if(err){
                mongodbPool.release(db);
                return res.json(400,err);
            }
            if(files.userVoiceMessage === undefined || fields.user_id === undefined){
                var grid = new Grid(db, 'fs');
                for(var key in files){
                    grid.delete(files[key].id, function(err, result){
                        if(err){
                            //the useless file data can not be delete, its id need to record in error log
                            uploadErrorLogfile.write('file need to delete: '+files[key].id);
                        }
                    });
                }
                mongodbPool.release(db);
                return res.json(400,{'err':'wrong format'});
            }
            var audio = new Audio({
                audioFileId: files.userVoiceMessage.id,
                user_id: fields.user_id,
                uploadDate: new Date()
            });
            audio.save(function(err,doc){
                if(err){
                    var grid = new Grid(db, 'fs');
                    for(var key in files){
                        grid.delete(files[key].id, function(err,result){
                            if(err){
                                //the useless file data can not be delete, its id need to record in error log
                                uploadErrorLogfile.write('file need to delete: '+files.starVoiceMessage.id);
                            }
                        });
                    }
                    mongodbPool.release(db);
                    return res.json(400,err);
                }

                return res.json(200,{'info':'upload success'});
            });
        });
    });
};

exports.uploadSysVoice = function(req, res){
    var type = req.body.type;
    var content = req.body.content;
    var audioFileId = req.files["voice"].name;

    if(!req.files){
        return res.json(301,{"error":"没有图片文件！"});
    }

    var newAudio = new Audio({
        audioFileId:audioFileId,
        type:type,
        content:content,
        uploadDate:new Date()
    });

    newAudio.save(function(err){
        if(err){
            return res.json(400,err);
        }

        var target_path = './public/audio/' + req.files["voice"].name;
        // 使用同步方式重命名一个文件
        fs.renameSync(req.files["voice"].path, target_path);

        res.redirect('/admins/yourVoice/showAll');
    });
};

exports.delete = function(req, res){
    var id = req.params["id"];
    Audio.getOne(id, function(err, audio){
        Audio.delete(id, function(err){
            var target_path = './public/audio/' + audio.audioFileId;

            fs.unlink(target_path, function(err){
                if(err){
                    req.flash("error", "删除失败！");
                    return res.redirect('/admins/yourVoice/showAll');
                }

                req.flash('success', "删除成功！");
                res.redirect('/admins/yourVoice/showAll');
            });
        });
    });
};

exports.showAll = function(req, res){
YourVoiceType.getAll(function(err, yourVoiceTypes){
    Audio.getAll(function(err, audios){
        res.render('yourVoice_content_showAll', {
            title:"东东电台管理后台",
            success:req.flash('success'),
            error:req.flash('error'),
            admin:req.session.admin,
            audios:audios,
            yourVoiceTypes:yourVoiceTypes
        });
    });
})
};

///////////////// iOS /////////////////

