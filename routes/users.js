var crypto = require('crypto');
var fs = require('fs');
var User = require('../models/users.js');
var SingleLogin = require('../models/SingleLogin.js');
var uuid = require('node-uuid');
var DaliyPaperType = require('../models/DaliyPaperType');
var DaliyPaperSubType = require('../models/DaliyPaperSubType');
var DaliyPaper = require('../models/DaliyPaper');
var YourVoice = require('./YourVoice');
var DaliyPaperTypeBLL = require('./DaliyPaperType');
var HX = require('./hxMiddleWare');
var Common = require('../common');
var settings = require('../settings');

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
            sex: -1,
            pic: 'http://182.92.160.208:3000/default_pic.png',
            platform: Common.platform.phone,
            password: password,
            wx: {"openid": '',
                "nickname": '',
                "sex": '',
                "province": '',
                "city": '',
                "country": '',
                "headimgurl": '',
                "privilege": '',
                "unionid": ''}
        }
    );

// 检验是否重复注册
    User.getByPhone(phone, function (err, user) {
        if (err) {
            return res.json(Common.fail(Common.commonEnum.SYSTEM_ERROR, '服务器故障'));
        }

        if (user) {
            return res.json(Common.fail(Common.commonEnum.USER_IS_EXISTS, '用户已存在'));//用户已存在
        }

        // 校验完成，该用户没有注册过。完成注册
        newUser.save(function (err, user) {
            if (err) {
                return res.json(Common.fail(Common.commonEnum.SYSTEM_ERROR, '服务器故障')); //sysErr
            }

            // 保存session信息
            req.session.user = user;
            req.session.user_id = user._id;

            // 设置用户信息默认值 第一步设置你的声音默认值
            YourVoice.cloneToMyVoice("nanshen", user._id.toString(), function (err, ids) {
                if (err) {
                    return res.json(Common.fail(Common.commonEnum.SYSTEM_ERROR, '服务器故障'));
                }

                user.your_voice = {type: "MyVoice", ids: ids};

                // 执行保存操作
                User.update(user, function (err) {
                    if (err) {
                        return res.json(Common.fail(Common.commonEnum.SYSTEM_ERROR, '服务器故障'));
                    }

                    // 注册环信用户
                    HX.register(user);

                    // 保存设备与用户关系
                    var newUserLogin = new SingleLogin({
                        userID: user._id,
                        sessionID: req.sessionID
                    });

                    newUserLogin.save(function (err) {
                        if (err) {
                            return res.json(Common.fail(Common.commonEnum.SYSTEM_ERROR, '服务器故障')); //sysErr
                        }

                        res.json(Common.success(Common.returnUserInfo(user)));
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
            return res.json(Common.fail(Common.commonEnum.SYSTEM_ERROR, '服务器故障'));
        }

        if (!user) {
            return res.json(Common.fail(Common.commonEnum.USER_NOT_EXISTS, '用户不存在'));
        }

        // 检查密码是否一致
        if (user.info.password != password) {
            return res.json(Common.fail(Common.commonEnum.WRONG_PASSWORD, '密码错误'));
        }

        req.session.user = user;
        req.session.user_id = user._id;

        res.json(Common.success(Common.returnUserInfo(user)));
    });
};

/* 登出 */
exports.logout = function (req, res) {
    req.session.destroy(function (err) {
        if (err) {
            return res.json(Common.fail(Common.commonEnum.SYSTEM_ERROR, '服务器故障'));//登出失败
        }

        res.json(Common.success());//登出成功
    });
};

/* 获取用户信息 */
exports.getUser = function (req, res) {
    var user_id = req.params["id"];

    User.getOne(user_id, function (err, user) {
        if (err) {
            return res.json(Common.fail(Common.commonEnum.SYSTEM_ERROR, '服务器故障'));
        }

        res.json(Common.success(Common.returnUserInfo(user)));
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
            return res.json(Common.fail(Common.commonEnum.SYSTEM_ERROR, '服务器故障'));
        }

        user.info.name = name;
        user.info.sex = sex;
        user.info.intro = intro;
        user.info.deviceSN = deviceSN;

        User.update(user, function (err) {
            if (err) {
                return res.json(Common.fail(Common.commonEnum.SYSTEM_ERROR, '服务器故障'));
            }

            res.json(Common.success());
        });
    });
};

/* 保存用户头像 */
exports.postPic = function (req, res) {
    var user_id = req.body.user_id;
    var pic = req.files["pic"].name;

    console.log(req.files);

    switch (req.files["pic"].type) {
        case "image/png":
            pic = uuid.v1() + ".png";
        case "image/jpg":
            pic = uuid.v1() + ".jpg";
    }

    User.getOne(user_id, function (err, user) {
        if (err) {
            return res.json(Common.fail(Common.commonEnum.SYSTEM_ERROR, '服务器故障'));
        }

        if (!req.files) {
            return res.json(Common.fail(Common.commonEnum.NO_PIC, '没有图片文件'));
        }

        user.info.pic = "http://182.92.160.208:3000/images/" + pic;

        console.log(user.info.pic);
        User.update(user, function (err) {
            if (err) {
                return res.json(Common.fail(Common.commonEnum.SYSTEM_ERROR, '服务器故障'));
            }

            var target_path = './public/images/' + pic;
            // 使用同步方式重命名一个文件
            fs.renameSync(req.files["pic"].path, target_path);

            res.json(Common.success());
        });
    });
};

/* 重置用户密码 */
exports.resetPassword = function (req, res) {
    var newPassword = req.body.newpassword;
    var phone = req.body.phone;

    User.getByPhone(phone, function (err, user) {
        if (err) {
            return res.json(Common.fail(Common.commonEnum.SYSTEM_ERROR, '服务器故障'))
        }

        if (!user) {
            return res.json(Common.fail(Common.commonEnum.USER_NOT_EXISTS, '用户不存在'));//
        }

        var _md5 = crypto.createHash('sha256');
        newPassword = _md5.update(newPassword).digest('hex');

        user.info.password = newPassword;

        User.update(user, function (err) {
            if (err) {
                return res.json(Common.fail(Common.commonEnum.SYSTEM_ERROR, '服务器故障'));
            }

            return res.json(Common.success());//
        });
    });
};

/* 获取用户好友关系 */
exports.getFriends = function (req, res) {
    var friendlist = req.body.friendslist;

    var query = {"info.phone": {'$in': friendlist}};
    User.getQuery(query, function (err, users) {
        if (err) {
            return res.json(Common.fail(Common.commonEnum.SYSTEM_ERROR, '服务器故障'));
        }

        return res.json(Common.success(users));
    })
};

/* 保存一级日报设置 */
exports.setDaliyPaperSettings = function (req, res) {
    var user_id = req.body.user_id;
    var DaliyPaperSettings = req.body.DaliyPaperSettings;

    User.getOne(user_id, function (err, user) {
        if (err) {
            return res.json(Common.fail(Common.commonEnum.SYSTEM_ERROR, '服务器故障'));
        }

        user.daliy_paper = DaliyPaperSettings;

        User.update(user, function (err) {
            if (err) {
                return res.json(Common.fail(Common.commonEnum.SYSTEM_ERROR, '服务器故障'));
            }

            res.json(Common.success());//修改成功
        });
    });
};

/* 获取一级日报设置 */
exports.getDaliyPaperSettings = function (req, res) {
    var user_id = req.params["id"];

    User.getOne(user_id, function (err, user) {
        if (err) {
            return res.json(Common.fail(Common.commonEnum.SYSTEM_ERROR, '服务器故障'));
        }

        DaliyPaperType.getAll(function (err, daliyPaperTypes) {
            if (err) {
                return res.json(Common.fail(Common.commonEnum.SYSTEM_ERROR, '服务器故障'));
            }

            var result = [];
            daliyPaperTypes.forEach(function (e) {
                var item = {
                    "_id": e._id,
                    "name": e.name,
                    "selected": false
                };
                for (var i = 0; i < user.daliy_paper.length; i++) {

                    if (e._id == user.daliy_paper[i]) {
                        item = {
                            "_id": e._id,
                            "name": e.name,
                            "selected": true
                        };
                        break;
                    }
                }

                result.push(item);
            });

            res.json(Common.success(result));
        });
    });
};

exports.getDaliyPaperAll = function (req, res) {
    var user_id = req.params["id"];
    var pageindex = req.params["pageindex"];
    console.log(req.params);

    User.getOne(user_id, function (err, user) {
        if (err) {
            return res.json(Common.fail(Common.commonEnum.SYSTEM_ERROR, '服务器故障'));
        }

        var query = {typeId: {'$in': user.daliy_paper}};
        console.log("query:" + query);
        DaliyPaper.getAll(pageindex, query, function (err, daliyPapers, total) {
            if (err) {
                return res.json(Common.fail(Common.commonEnum.SYSTEM_ERROR, '服务器故障'));
            }

            daliyPapers.totalPage = parseInt(total / 10) + 1;
            console.log(daliyPapers);
            res.json(Common.success(daliyPapers));
        });
    });
};

exports.getDaliyPaperSubTypeSettings = function (req, res) {
    var user_id = req.params["user_id"],
        type_id = req.params["type_id"];

    User.getOne(user_id, function (err, user) {
        if (err) {
            return res.json(Common.fail(Common.commonEnum.SYSTEM_ERROR, '服务器故障'));
        }

        // 这个判断在加入默认值后可删除
        if (user.daliy_paper != 0) {
            user.daliy_paper.forEach(function (e) {

                if (type_id == e.id) {
                    var result = [];
                    DaliyPaperSubType.getIdByParentTypeId(type_id, function (err, daliyPaperSubTypes) {
                        if (err) {
                            return res.json(Common.fail(Common.commonEnum.SYSTEM_ERROR, '服务器故障'));
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

                        res.json(Common.success(result));
                    })
                }
            });
        } else {
            var result = [];
            DaliyPaperSubType.getIdByParentTypeId(type_id, function (err, daliyPaperSubTypes) {
                if (err) {
                    return res.json(Common.fail(Common.commonEnum.SYSTEM_ERROR, '服务器故障'));
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

                res.json(Common.success(result));
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
            return res.json(Common.fail(Common.commonEnum.SYSTEM_ERROR, '服务器故障'));
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
                return res.json(Common.fail(Common.commonEnum.SYSTEM_ERROR, '服务器故障'));
            }

            res.json(Common.success());//修改成功
        });
    });
};

exports.setAppSettings = function (req, res) {
    var user_id = req.body.user_id;
    var AppSettings = req.body.AppSettings;

    User.getOne(user_id, function (err, user) {
        if (err) {
            return res.json(Common.fail(Common.commonEnum.SYSTEM_ERROR, '服务器故障'));
        }

        if (user.settings) {
            user.settings = AppSettings;
        }

        User.update(user, function (err) {
            if (err) {
                return res.json(Common.fail(Common.commonEnum.SYSTEM_ERROR, '服务器故障'));
            }

            res.json(Common.success());//修改成功
        });
    });
};

exports.getAppSettings = function (req, res) {
    var user_id = req.params["id"];

    User.getOne(user_id, function (err, user) {
        if (err) {
            return res.json(Common.fail(Common.commonEnum.SYSTEM_ERROR, '服务器故障'));
        }

        res.json(Common.success(user.settings));
    });
};

exports.getYourVoiceChooseType = function (req, res) {
    var user_id = req.body.id;

    User.getOne(user_id, function (err, user) {
        if (err) {
            return res.json(Common.fail(Common.commonEnum.SYSTEM_ERROR, '服务器故障'));
        }

        res.json(Common.success(user.your_voice.type));
    });
};

exports.setYourVoiceSettings = function (req, res) {
    var user_id = req.body.user_id;
    var type = req.body.type;

    YourVoice.getIdsByType(type, user_id, function (err, ids) {
        User.getOne(user_id, function (err, user) {
            if (err) {
                return res.json(Common.fail(Common.commonEnum.SYSTEM_ERROR, '服务器故障'));
            }

            user.your_voice = {type: type, ids: ids};

            User.update(user, function (err) {
                if (err) {
                    return res.json(Common.fail(Common.commonEnum.SYSTEM_ERROR, '服务器故障'));
                }

                res.json(Common.success());//修改成功
            });
        });
    });
};

exports.getYourVoiceSettings = function (req, res) {
    var user_id = req.params["id"];

    User.getOne(user_id, function (err, user) {
        if (err) {
            return res.json(Common.fail(Common.commonEnum.SYSTEM_ERROR, '服务器故障'));
        }

        var query = {_id: {'$in': user.your_voice.ids}};

        YourVoice.getQuery(query, function (err, youVoices) {
            if (err) {
                return res.json(Common.fail(Common.commonEnum.SYSTEM_ERROR, '服务器故障'));
            }

            console.log(youVoices);

            res.json(Common.success(youVoices));
        });
    });
};

exports.checkLogin = function (req, res, next) {
    if (!req.session.user) {
        return res.json(Common.fail(Common.commonEnum.USER_NOT_LOGIN, '您未登录'));//
    }

    next();
};

exports.checkNotLogin = function (req, res, next) {
    if (req.session.user) {
        return res.json(Common.fail(Common.commonEnum.USER_IS_LOGIN, '您已登录'));//
    }

    next();
};