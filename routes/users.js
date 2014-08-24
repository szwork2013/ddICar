var crypto = require('crypto');
var fs = require('fs');
var User = require('../models/users.js');
var SingleLogin = require('../models/SingleLogin.js');

exports.putUser = function(req, res){
    var user = req.body.user;
    var checkKey = req.body.checkKey;
    var salt = "ce23dc8d7a345337836211f829f0c05d";
    var userStr = JSON.stringify(user);
    var md5 = crypto.createHash('sha256');
    var newCheckKey = md5.update(userStr+salt).digest('hex');

    if(checkKey == newCheckKey){
        User.update(user, function(err){
            if(err){
                return res.json({flag:"fail",content:1001});
            }

            res.json({flag:"success",content:"修改成功"});
        });
    }else{
        return res.json({flag:"fail",content:2007});
    }
};

exports.postPic = function(req, res){
    var phone = req.body.phone;

    User.getOne(phone,function(err, user){
        if(err){
            return res.json({flag:"fail",content:1001});
        }

        if(!req.files){
            return res.json({flag:"fail",content:2010});//没有图片文件
        }

        user.info.pic = req.files["file1"].name;

        User.update(user, function(err){
            if(err){
                return res.json({flag:"fail",content:1001});
            }

            var target_path = './public/images/' + req.files["file1"].name;
            // 使用同步方式重命名一个文件
            fs.renameSync(req.files["file1"].path, target_path);

            res.json({flag:"success",content:"上传成功"});
        });
    });
};

exports.getUser = function(req, res){
    var userId = req.params["id"];
    User.getOne(userId, function(err,user){
        if(err){
            return res.json({flag:"fail",content:1001});
        }
        return res.json({flag:"success",content:user});
    });
};

exports.logout = function(req, res){
    req.session.destroy(function(err){
        if(err){
            return res.json({flag:"fail",content:2004});//登出失败
        }
        return res.json({flag:"success",content:3002});//登出成功
    });
};

exports.reg = function(req, res) {
    var phone = req.body.phone,
        password = req.body.password

    var md5 = crypto.createHash('sha256');
    password = md5.update(password).digest('hex');

    var newUser = new User({
        phone: phone,
        password: password
    });

    User.getByPhone(phone, function(err, user){
        if(user){
            return res.json({flag:"fail",content:2001});//用户已存在
        }

        newUser.save(function(err, user){
            if(err){
                return res.json({flag:"fail",content:1001}); //sysErr
            }

            req.session.user = user;
            var newUserLogin = new SingleLogin({
                userID: user._id,
                sessionID: req.sessionID
            });

            newUserLogin.save(function(err) {
                if(err){
                    return res.json({flag:"fail",content:1001}); //sysErr
                }else{
                    return res.json({flag:"success",content:user});
                }
            });
        });
    });
};

exports.login = function(req, res){
    var md5 = crypto.createHash('sha256'),
        password = md5.update(req.body.password).digest('hex');

    // 查询是否有此用户
    User.getByPhone(req.body.phone, function(err, user){

        if(!user){
            return res.json({flag:"fail",content:2000});//用户不存在
        }

        // 检查密码是否一致
        if(user.info.password != password){
            return res.json({flag:"fail",content:2008});//密码错误
        }

        req.session.user = user;
        return res.json({flag:"success",content:user});
    });
};

exports.resetPassword = function(req, res){
    var oldPassword = req.body.oldpassword;
    var newPassword = req.body.newpassword;
    var phone = req.body.phone;

    var md5 = crypto.createHash('sha256'),
        oldPassword = md5.update(oldPassword).digest('hex');

    User.getByPhone(phone, function(err, user){
        if(err){ return res.json({flag:"fail",content:1001}) }
        if(!user){
            return res.json({flag:"fail",content:2000});//用户不存在
        }

        if(user.info.password != oldPassword){
            return res.json({flag:"fail",content:2008})//旧密码输入错误
        }

        var _md5 = crypto.createHash('sha256');
        newPassword = _md5.update(newPassword).digest('hex');

        user.info.password = newPassword;

        User.update(user, function(err){
            if(err){
                return res.json({flag:"fail",content:1001});
            }

            return res.json({flag:"success",content:3001});//修改成功
        });
    });
};


exports.setDaliyPaperSettings = function(req, res){
    var user_id = req.body.id;
    var DaliyPaperSettings = req.body.DaliyPaperSettings;
    var checkKey = req.body.checkKey;
    var salt = "ce23dc8d7a345337836211f829f0c05d";
    var daliyPaperSettingsStr = JSON.stringify(DaliyPaperSettings);
    var md5 = crypto.createHash('sha256');
    var newCheckKey = md5.update(daliyPaperSettingsStr+salt).digest('hex');

    if(checkKey == newCheckKey){
        User.getOne(user_id, function(err, user){
            if(err){
                return res.json({flag:"fail",content:1001});
            }

            user.daliy_paper = DaliyPaperSettings;

            User.update(user, function(err){
                if(err){
                    return res.json({flag:"fail",content:1001});
                }

                res.json({flag:"success",content:"修改成功"});//修改成功
            });
        });
    }else{
        return res.json({flag:"fail",content:2007});//年轻人，你这可不是一条可持续发展的道路啊！看你这么感兴趣，来我们公司吧！要不做点什么，相信不久你就可以升职加薪，出任总经理，担任CEO迎娶白富美走上人生巅峰
    }
};

exports.getDaliyPaperSettings = function(req, res){
    var user_id = req.body.id;

    User.getOne(user_id, function(err, user){
        if(err){
            return res.json({flag:"fail",content:1001});
        }

        res.json({flag:"success",content:user.daliy_paper});
    });
};

exports.setAppSettings = function(req, res){
    var user_id = req.body.id;
    var AppSettings = req.body.AppSettings;
    var checkKey = req.body.checkKey;
    var salt = "ce23dc8d7a345337836211f829f0c05d";
    var appSettingsStr = JSON.stringify(AppSettings);
    var md5 = crypto.createHash('sha256');
    var newCheckKey = md5.update(appSettingsStr+salt).digest('hex');

    if(checkKey == newCheckKey){
        User.getOne(user_id, function(err, user){
            if(err){
                return res.json({flag:"fail",content:1001});
            }

            user.settings = appSettingsStr;

            User.update(user, function(err){
                if(err){
                    return res.json({flag:"fail",content:1001});
                }

                res.json({flag:"success",content:"修改成功"});//修改成功
            });
        });
    }else{
        return res.json({flag:"fail",content:2007});//年轻人，你这可不是一条可持续发展的道路啊！看你这么感兴趣，来我们公司吧！要不做点什么，相信不久你就可以升职加薪，出任总经理，担任CEO迎娶白富美走上人生巅峰
    }
};

exports.getAppSettings = function(req, res){
    var user_id = req.body.id;

    User.getOne(user_id, function(err, user){
        if(err){
            return res.json({flag:"fail",content:1001});
        }

        res.json({flag:"success",content:user.settings});
    });
};

exports.getYourVoice = function(req, res){
    var user_id = req.body.id;
    var type = req.body.type;

    User.getOne(user_id, function(err, user){
        if(err){
            return res.json({flag:"fail",content:1001});
        }

        res.json({flag:"success",content:user.settings});
    });
};

exports.checkLogin = function(req, res, next){
    if(!req.session.user){
        return res.json({flag:"fail",content:2006});//您已登录
    }

    next();
};

exports.checkNotLogin = function(req, res, next){
    if(req.session.user){
        return res.json({flag:"fail",content:2005});//您未登录
    }

    next();
};