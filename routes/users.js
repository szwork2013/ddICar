var crypto = require('crypto');
var fs = require('fs');
var User = require('../models/users.js');
var SingleLogin = require('../models/SingleLogin.js');
var uuid = require('node-uuid');
var DaliyPaperType = require('../models/DaliyPaperType');
var DaliyPaperSubType = require('../models/DaliyPaperSubType');
var YourVoice = require('./YourVoice');
var DaliyPaperTypeBLL = require('./DaliyPaperType');
var HX = require('./hxMiddleWare');
var Common = require('../common');

/* 注册 */
exports.reg = function (req, res) {
    var phone = req.body.phone,
        password = req.body.password;

    var md5 = crypto.createHash('sha256');
    password = md5.update(password).digest('hex');

    // 新建用户
    var newUser = new User({
        name: phone.replace(new RegExp(phone.substr(3, 4)), '****'),
        phone: phone,
        password: password
    });

    // 检验是否重复注册
    User.getByPhone(phone, function (err, user) {
        if (err) {
            return res.json({flag: "fail", content: 1001});
        }

        if (user) {
            return res.json({flag: "fail", content: 2001});//用户已存在
        }

        // 校验完成，该用户没有注册过。完成注册
        newUser.save(function (err, user) {
            if (err) {
                return res.json({flag: "fail", content: 1001}); //sysErr
            }

            // 保存session信息
            req.session.user = user;
            req.session.user_id = user._id;

            // 设置用户信息默认值 第一步设置你的声音默认值
            YourVoice.cloneToMyVoice("nanshen", user._id.toString(), function (err, ids) {
                if (err) {
                    return res.json({flag: "fail", content: 1001});
                }

                // 设置定制日报一级类型默认值
                DaliyPaperTypeBLL.getDaliyPeperDefaultSettings(function (err, defaultSettings) {
                    if (err) {
                        return res.json({flag: "fail", content: 1001});
                    }

                    user.your_voice = {type: "MyVoice", ids: ids};
                    user.daliy_paper = defaultSettings;

                    // 执行保存操作
                    User.update(user, function (err) {
                        if (err) {
                            return res.json({flag: "fail", content: 1001});
                        }

                        // 注册环信用户
                        HX.register();

                        // 保存设备与用户关系
                        var newUserLogin = new SingleLogin({
                            userID: user._id,
                            sessionID: req.sessionID
                        });

                        newUserLogin.save(function (err) {
                            if (err) {
                                return res.json({flag: "fail", content: 1001}); //sysErr
                            }

                            res.json({flag: "success", content: user});
                        });
                    });
                });
            });
        });
    });
};

/* 登录 */
exports.login = function (req, res) {
    var phone = req.body.phone,
        md5 = crypto.createHash('sha256'),
        password = md5.update(req.body.password).digest('hex');

    // 查询是否有此用户
    User.getByPhone(phone, function (err, user) {
        if (err) {
            return res.json({flag: "fail", content: 1001});
        }

        if (!user) {
            return res.json({flag: "fail", content: 2000});//用户不存在
        }

        // 检查密码是否一致
        if (user.info.password != password) {
            return res.json({flag: "fail", content: 2008});//密码错误
        }

        req.session.user = user;
        console.log(user);
        res.json(Common.success(user, null));
//        res.json({flag: "success", content: user});
    });
};

/* 登出 */
exports.logout = function (req, res) {
    req.session.destroy(function (err) {
        if (err) {
            return res.json({flag: "fail", content: 2004});//登出失败
        }

        res.json({flag: "success", content: 3002});//登出成功
    });
};

/* 获取用户信息 */
exports.getUser = function (req, res) {
    var user_id = req.params["id"];

    User.getOne(user_id, function (err, user) {
        if (err) {
            return res.json({flag: "fail", content: 1001});
        }

        res.json({flag: "success", content: user});
    });
};

/* 保存用户信息 */
exports.putUser = function (req, res) {
    var user_id = req.body.user_id;
    var sex = req.body.sex;
    var intro = req.body.intro;
    var name = req.body.name;
    var deviceSN = req.body.deviceSN;

    User.getOne(user_id, function (err, user) {
        if (err) {
            return res.json({flag: "fail", content: 1001});
        }

        user.info.name = name;
        user.info.sex = sex;
        user.info.intro = intro;
        user.info.deviceSN = deviceSN;

        User.update(user, function (err) {
            if (err) {
                return res.json({flag: "fail", content: 1001});
            }

            res.json({flag: "success", content: 3001});
        });
    });
};

/* 保存用户头像 */
exports.postPic = function (req, res) {
    var user_id = req.body.user_id;
    var pic = req.files["pic"].name;

    switch (req.files["pic"].type) {
        case "image/png":
            pic = uuid.v1() + ".png";
    }

    User.getOne(user_id, function (err, user) {
        if (err) {
            return res.json({flag: "fail", content: 1001});
        }

        if (!req.files) {
            return res.json({flag: "fail", content: 2010});//没有图片文件
        }

        user.info.pic = pic;

        User.update(user, function (err) {
            if (err) {
                return res.json({flag: "fail", content: 1001});
            }

            var target_path = './public/images/' + pic;
            // 使用同步方式重命名一个文件
            fs.renameSync(req.files["pic"].path, target_path);

            res.json({flag: "success", content: 3003});
        });
    });
};

/* 重置用户密码 */
exports.resetPassword = function (req, res) {
    var oldPassword = req.body.oldpassword;
    var newPassword = req.body.newpassword;
    var phone = req.body.phone;

    var md5 = crypto.createHash('sha256'),
        oldPassword = md5.update(oldPassword).digest('hex');

    User.getByPhone(phone, function (err, user) {
        if (err) {
            return res.json({flag: "fail", content: 1001})
        }

        if (!user) {
            return res.json({flag: "fail", content: 2000});//用户不存在
        }

        if (user.info.password != oldPassword) {
            return res.json({flag: "fail", content: 2008});//旧密码输入错误
        }

        var _md5 = crypto.createHash('sha256');
        newPassword = _md5.update(newPassword).digest('hex');

        user.info.password = newPassword;

        User.update(user, function (err) {
            if (err) {
                return res.json({flag: "fail", content: 1001});
            }

            return res.json({flag: "success", content: 3001});//修改成功
        });
    });
};

/* 获取用户好友关系 */
exports.getFriends = function (req, res) {
    var friendlist = req.body.friendslist;

    var query = {"info.phone": {'$in': friendlist}};
    User.getQuery(query, function (err, users) {
        if (err) {
            return res.json({flag: "fail", content: 1001});
        }

        return res.json({flag: "success", content: users});
    })
};

/* 保存一级日报设置 */
exports.setDaliyPaperSettings = function (req, res) {
    var user_id = req.body.user_id;
    var DaliyPaperSettings = req.body.DaliyPaperSettings;

    User.getOne(user_id, function (err, user) {
        if (err) {
            return res.json({flag: "fail", content: 1001});
        }

        var daliy_papers = [];
        DaliyPaperSettings.forEach(function (e) {
            var t = JSON.parse(e);
            daliy_papers.push(t);
        });

        if (user.daliy_paper) {
            user.daliy_paper = daliy_papers;
        }

        User.update(user, function (err) {
            if (err) {
                return res.json({flag: "fail", content: 1001});
            }

            res.json({flag: "success", content: 3001});//修改成功
        });
    });
};

/* 获取一级日报设置 */
exports.getDaliyPaperSettings = function (req, res) {
    var user_id = req.params["id"];

    User.getOne(user_id, function (err, user) {
        if (err) {
            return res.json({flag: "fail", content: 1001});
        }

        var ids = [];

        if (user.daliy_paper.length != 0) {
            user.daliy_paper.forEach(function (e) {
                var _t = {
                    id: e.id,
                    percent: e.percent
                };
                ids.push(_t);
            });
        }

        DaliyPaperType.geSome(ids, function (err, result) {
            if (err) {
                return res.json({flag: "fail", content: 1001});
            }

            res.json({flag: "success", content: result});
        });
    });
};

exports.getDaliyPaperSubTypeSettings = function (req, res) {
    var user_id = req.params["user_id"],
        type_id = req.params["type_id"];

    User.getOne(user_id, function (err, user) {
        if (err) {
            return res.json({flag: "fail", content: 1001});
        }

        // 这个判断在加入默认值后可删除
        if (user.daliy_paper != 0) {
            user.daliy_paper.forEach(function (e) {

                if (type_id == e.id) {
                    var result = [];
                    DaliyPaperSubType.getIdByParentTypeId(type_id, function (err, daliyPaperSubTypes) {
                        if (err) {
                            return res.json({flag: "fail", content: 1001});
                        }

                        daliyPaperSubTypes.forEach(function (_e) {
                            var item = {
                                "_id": _e._id,
                                "name": _e.name,
                                "pic": _e.pic,
                                "selected": false
                            };
                            if (e.child) {
                                for (var i = 0; i < e.child.length; i++) {

                                    if (e.child[i] == _e._id) {
                                        item = {
                                            "_id": _e._id,
                                            "name": _e.name,
                                            "pic": _e.pic,
                                            "selected": true
                                        };
                                    }
                                }
                            }
                            result.push(item);
                        });

                        res.json({flag: "success", content: result});
                    })
                }
            });
        } else {
            var result = [];
            DaliyPaperSubType.getIdByParentTypeId(type_id, function (err, daliyPaperSubTypes) {
                if (err) {
                    return res.json({flag: "fail", content: 1001});
                }

                console.log(daliyPaperSubTypes);

                daliyPaperSubTypes.forEach(function (_e) {
                    var item = {
                        "_id": _e._id,
                        "name": _e.name,
                        "pic": _e.pic,
                        "selected": false
                    };

                    result.push(item);
                });

                res.json({flag: "success", content: result});
            })
        }
    })
};

/* 设置二级日报设置 */
exports.setDaliyPaperSubTypeSettings = function (req, res) {
    var user_id = req.body.user_id;
    var type_id = req.body.type_id;
    var DaliyPaperSubTypeSettings = req.body.DaliyPaperSubTypeSettings;

    User.getOne(user_id, function (err, user) {
        if (err) {
            return res.json({flag: "fail", content: 1001});
        }

        if (user.daliy_paper) {
            user.daliy_paper.forEach(function (e) {
                console.log(e);
                if (e.id == type_id) {
                    e.child = DaliyPaperSubTypeSettings;
                }
            });
        }

        User.update(user, function (err) {
            if (err) {
                return res.json({flag: "fail", content: 1001});
            }

            res.json({flag: "success", content: 3001});//修改成功
        });
    });
};

exports.setAppSettings = function (req, res) {
    var user_id = req.body.user_id;
    var AppSettings = req.body.AppSettings;

    User.getOne(user_id, function (err, user) {
        if (err) {
            return res.json({flag: "fail", content: 1001});
        }

        if (user.settings) {
            user.settings = AppSettings;
        }

        User.update(user, function (err) {
            if (err) {
                return res.json({flag: "fail", content: 1001});
            }

            res.json({flag: "success", content: 3001});//修改成功
        });
    });
};

exports.getAppSettings = function (req, res) {
    var user_id = req.params["id"];

    User.getOne(user_id, function (err, user) {
        if (err) {
            return res.json({flag: "fail", content: 1001});
        }

        res.json({flag: "success", content: user.settings});
    });
};

exports.getYourVoiceChooseType = function (req, res) {
    var user_id = req.body.id;

    User.getOne(user_id, function (err, user) {
        if (err) {
            return res.json({flag: "fail", content: 1001});
        }

        res.json({flag: "success", content: user.your_voice.type});
    });
};

exports.setYourVoiceSettings = function (req, res) {
    var user_id = req.body.user_id;
    var type = req.body.type;

    YourVoice.getIdsByType(type, user_id, function (err, ids) {
        User.getOne(user_id, function (err, user) {
            if (err) {
                return res.json({flag: "fail", content: 1001});
            }

            user.your_voice = {type: type, ids: ids};

            User.update(user, function (err) {
                if (err) {
                    return res.json({flag: "fail", content: 1001});
                }

                res.json({flag: "success", content: 3001});//修改成功
            });
        });
    });
};

exports.getYourVoiceSettings = function (req, res) {
    var user_id = req.params["id"];

    User.getOne(user_id, function (err, user) {
        if (err) {
            return res.json({flag: "fail", content: 1001});
        }

        var query = {_id: {'$in': user.your_voice.ids}};

        YourVoice.getQuery(query, function (err, youVoices) {
            if (err) {
                return res.json({flag: "fail", content: 1001});
            }

            console.log(youVoices);

            res.json({flag: "success", content: youVoices});
        });
    });
};

exports.checkLogin = function (req, res, next) {
    if (!req.session.user) {
        return res.json({flag: "fail", content: 2006});//您未登录
    }

    next();
};

exports.checkNotLogin = function (req, res, next) {
    if (req.session.user) {
        return res.json({flag: "fail", content: 2005});//您已登录
    }

    next();
};