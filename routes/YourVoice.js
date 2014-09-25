/**
 * Created by amberglasses on 14-8-22.
 */
var YourVoice = require('../models/audio');
var uuid = require('node-uuid');

exports.getByType = function(req, res){
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

    var newAudio = new Audio({
        audioFileId:audio,
        type:'myVoice',
        content:content,
        uploadDate:new Date()
    });

    newAudio.save(function(err){
        if(err){
            return res.json({flag:"fail",content:1001});
        }

        var target_path = './public/audio/yourVoice/' + audio;
        // 使用同步方式重命名一个文件
        fs.renameSync(req.files["voice"].path, target_path);

        res.json({flag:"success",content:3001});
    });
};