/**
 * Created by amberglasses on 14-8-22.
 */
var YourVoice = require('../models/audio');

exports.getByType = function(req, res){
    YourVoice.getByType(type,function(err, yourVoices){
        if(err){
            return res.json({flag:"fail",content:err});
        }

        res.json({flag:"success",content:yourVoices});
    });
};