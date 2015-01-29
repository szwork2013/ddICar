/**
 * Created by amberglasses on 14-8-22.
 */
var YourVoice = require('../models/YourVoice');
var uuid = require('node-uuid');
var fs = require('fs');
var YourVoiceType = require('../models/YourVoiceType');
var userYourVoice = require('../models/userYourVoice');
var backpage = "/admins/yourVoice/content/showAll";
var zip = require("node-native-zip");
var Common = require('../common');

exports.uploadSysVoice = function (req, res) {
    console.log(req.files);
    var type = req.body.type;
    var content = req.body.content;
    var audioFileId = req.files["audio"].name;

    if (!req.files) {
        return res.json(301, {"error": "没有图片文件！"});
    }

    console.log(req.files["audio"].type);

    switch (req.files["audio"].type) {
        case "audio/x-m4a":
            audioFileId = uuid.v1() + ".m4a";
            break;
        case "audio/mpeg":
            audioFileId = uuid.v1() + ".mp3";
            break;
    }

    var newYourVoice = new YourVoice({
        audioFileId: audioFileId,
        type: type,
        content: content,
        uploadDate: new Date()
    });

    newYourVoice.save(function (err) {
        if (err) {
            return res.json(400, err);
        }

        var target_path = './public/audio/yourVoice/' + audioFileId;
        // 使用同步方式重命名一个文件
        fs.renameSync(req.files["audio"].path, target_path);

        res.redirect(backpage);
    });
};

exports.delete = function (req, res) {
    var id = req.params["id"];
    YourVoice.getOne(id, function (err, yourVoice) {
        YourVoice.delete(id, function (err) {
            var target_path = './public/audio/yourVoice/' + yourVoice.audioFileId;

            fs.unlink(target_path, function (err) {
                if (err) {
                    req.flash("error", "删除失败！");
                    return res.redirect(backpage);
                }

                req.flash('success', "删除成功！");
                res.redirect(backpage);
            });
        });
    });
};

exports.showAll = function (req, res) {
    YourVoiceType.getAll(function (err, yourVoiceTypes) {
        YourVoice.getAll(function (err, yourVoices) {
            res.render('yourVoice_content_showAll', {
                title: "东东电台管理后台",
                success: req.flash('success'),
                error: req.flash('error'),
                admin: req.session.admin,
                yourVoices: yourVoices,
                yourVoiceTypes: yourVoiceTypes
            });
        });
    })
};

exports.getByType = function (req, res) {
    var type = req.params['type'];

    YourVoice.getByType(type, function (err, yourVoices) {
        if (err) {
            return res.json(Common.fail(Common.commonEnum.SYSTEM_ERROR, '服务器故障'));
        }

        res.json(Common.success(yourVoices));
    });
};


////////////////  iOS ////////////////
exports.uploadMyVoice = function (req, res) {
    var audio = req.files["audio"].name;
    var voice_id = req.body.voice_id;

    if (req.files["audio"]) {
        switch (req.files["audio"].type) {
            case "audio/mp3":
                audio = uuid.v1() + ".mp3";
                break;
            case "audio/AMR":
                audio = uuid.v1() + ".amr";
                break;
            case "audio/wav":
                audio = uuid.v1() + ".wav";
                break;
        }
    }

    // 获取定制声音
    YourVoice.getOne(voice_id, function (err, youVoice) {
        if (err) {
            return res.json(Common.fail(Common.commonEnum.SYSTEM_ERROR, '服务器故障'));
        }

        var target_path = './public/audio/yourVoice/' + audio;
        // 使用同步方式重命名一个文件
        fs.renameSync(req.files["audio"].path, target_path);

        youVoice.audioFileId = audio;


        YourVoice.update(youVoice, function (err) {
            if (err) {
                return json(Common.fail(Common.commonEnum.SYSTEM_ERROR, '服务器故障'));
            }

            res.json(Common.success(youVoice));
        });
    });
};

exports.getIdsByType = function (type, user_id, callback) {
    YourVoice.getByType(user_id, function (err, yourVoices) {
        if (err) {
            return callback(err);
        }

        var ids = [];
        yourVoices.forEach(function (e) {
            ids.push(e._id);
        });

        callback(err, ids);
    });
};

exports.getQuery = function (query, callback) {
    YourVoice.getQuery(query, function (err, yourVoices) {
        if (err) {
            callback(err);
        }

        callback(null, yourVoices);
    });
};

exports.cloneToMyVoice = function (type, user_id, callback) {
    YourVoice.getByType(type, function (err, yourVoices) {
        if (err) {
            return callback(err);
        }

        var ids = [];
        yourVoices.forEach(function (e) {
            var newYouVoice = new YourVoice({
                audioFileId: e.audioFileId,
                type: user_id,
                content: e.content,
                uploadDate: new Date()
            });

            newYouVoice.save(function (err, youVoice) {
                ids.push(youVoice._id);
            });
        });

        callback(err, ids);
    });
};

exports.download = function (req, res) {
    var type = req.params["type"];

    YourVoice.getByType(type, function (err, yourVoices) {
        var files = [];
        yourVoices.forEach(function (e) {
            var file = {name: e.audioFileId, path: "./public/audio/yourVoice/" + e.audioFileId}
            files.push(file);
        });

        var archive = new zip();

        console.log(files);
        archive.addFiles(files,
            function (err) {
                if (err) return console.log("err while adding files", err);

                var buff = archive.toBuffer();

                if (fs.existsSync("./public/audio/yourVoice/" + type + ".zip") === true) fs.unlinkSync("./public/audio/yourVoice/" + type + ".zip");

                fs.writeFile("./public/audio/yourVoice/" + type + ".zip", buff, function (err) {
                    console.log("Finished");
                    res.json(Common.success("http://182.92.160.208:3000/audio/yourVoice/" + type + ".zip"));
                });
            }
        )
        ;
    });
};