var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var fs = require('fs');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var User = require('../models/users.js');
var SingleLogin = require('../models/SingleLogin.js');
var Favorite = require('./favorite');
var DaliyPaper = require('./DaliyPaper');

router.get('/postPic', function(req, res){
    res.render('postPic',{
        title:"这里是大东车慧运营管理平台网站客户端！"
    });
});

router.post('/checkUserVersion', checkLogin);
router.post('/checkUserVersion', function(req, res){
    var user = req.body.user;

    User.getByTime(user, function(err, todo){
        if(err){
            return res.json(400,err);
        }

        if(todo == "upload"){
            res.json(201,{"info":'need to upload device data'});
        }else if(todo == "download"){
            res.json(202,{"info":'need to download the newest data'});
        }
    });
});

router.post('/putUser',checkLogin);
router.post('/putUser', function(req, res){
    var user = req.body.user;
    var checkKey = req.body.checkKey;
    var salt = "ce23dc8d7a345337836211f829f0c05d";
    var userStr = JSON.stringify(user);
    var md5 = crypto.createHash('sha256');
    var newCheckKey = md5.update(userStr+salt).digest('hex');

    if(checkKey == newCheckKey){
        User.update(user, function(err){
            if(err){
                return res.json(200,err);
            }

            res.json(200, {info:"putUser success!"});
        });
    }else{
        return res.json(333,{err:"年轻人，你这可不是一条可持续发展的道路啊！看你这么感兴趣，来我们公司吧！要不做点什么，相信不久你就可以升职加薪，出任总经理，担任CEO迎娶白富美走上人生巅峰！"});
    }
});



router.post('/postPic', multipartMiddleware, function(req, res){
    var phone = req.body.phone;

    User.getOne(phone,function(err, user){
        if(err){
            return res.json(400,err);
        }

        if(!req.files){
            return res.json(301,{"error":"没有图片文件！"});
        }

        user.info.pic = req.files["file1"].name;

        User.update(user, function(err){
            if(err){
                return res.json(400,err);
            }

            var target_path = './public/images/' + req.files["file1"].name;
            // 使用同步方式重命名一个文件
            fs.renameSync(req.files["file1"].path, target_path);

            res.json(200,"上传成功！");
        });
    });
});

router.get('/getUser', checkLogin);
router.get('/getUser', function(req, res){
    User.getOne(req.session.user, function(err,user){
        if(err){
            return res.json(400, err);
        }
        return res.json(200, user);
    });
});

router.post('/logout', checkLogin);
router.post('/logout', function(req, res){
	req.session.destroy(function(err){
        if(err){
            return res.json(400,{'error':'登出失败！'});
        }
        return res.json(200,{'info':'登出成功！'});
    });
});

router.post('/reg', function(req, res) {
	var phone = req.body.phone,
		email = req.body.email,
		password = req.body.password,
		password_re = req.body.password_repeat;

	//  校验密码是否一致
	if(password != password_re){
		return res.json(200,{error: '密码不一致！'});
	}

	var md5 = crypto.createHash('sha256');
	password = md5.update(password).digest('hex');

	var newUser = new User({
		phone: phone,
		email: email,
		password: password
	});

	User.getOne(phone, function(err, user){
		if(user){
			return res.json(401,{error: "用户已存在！"});
		}

		newUser.save(function(err, user){
			if(err){
				return res.json(300,err);
			}

			req.session.user = user;
			var newUserLogin = new SingleLogin({
				userID: user._id,
				sessionID: req.sessionID
			});

			newUserLogin.save(function(err) {
				if(err){
					return res.json(400,err);
				}else{
					return res.json(200,user);
				}
			});
		});
	});
});

router.post('/login', checkNotLogin);
router.post('/login', function(req, res){
	var md5 = crypto.createHash('sha256'),
	password = md5.update(req.body.password).digest('hex');

	// 查询是否有此用户
	User.getOne(req.body.phone, function(err, user){

		if(!user){
			return res.json(401, {error:"用户不存在！"});
		}

		// 检查密码是否一致
		if(user.info.password != password){
			return res.json(402, {error:"密码错误！"});
		}

		req.session.user = user;
		return res.json(200, user);
	});
});

router.post('/resetPassword', checkLogin);
router.post('/resetPassword', function(req, res){
	var oldPassword = req.body.oldpassword;
	var newPassword = req.body.newpassword;
	var newPassword_re = req.body.newpassword_repeat;
	var phone = req.body.phone;

    if(newPassword != newPassword_re){
        return res.json(400, {error:"新密码不一致！"})
    }

	var md5 = crypto.createHash('sha256'),
	oldPassword = md5.update(oldPassword).digest('hex');

	User.getOne(phone, function(err, user){
		if(err){ return res.json(400,err) }
		if(!user){
			return res.json(400, {error:"用户不存在！"});
		}

		if(user.info.password != oldPassword){
			return res.json(400, {error:"旧密码输入错误！"})
		}

        var _md5 = crypto.createHash('sha256');
		newPassword = _md5.update(newPassword).digest('hex');

		user.info.password = newPassword;

		User.update(user, function(err){
            if(err){
                return res.json(400,err);
            }

            return res.json(200,{"info":"修改成功！"});
		});
	});
});

router.post('/setDaliyPaperSettings', function(req, res){
    var user = req.body.user;
    var checkKey = req.body.checkKey;
    var salt = "ce23dc8d7a345337836211f829f0c05d";
    var userStr = JSON.stringify(user);
    var md5 = crypto.createHash('sha256');
    var newCheckKey = md5.update(userStr+salt).digest('hex');

    if(checkKey == newCheckKey){
        User.update(user, function(err){
            if(err){
                return res.json(200,err);
            }

            res.json(200, {info:"putUser success!"});
        });
    }else{
        return res.json(333,{err:"年轻人，你这可不是一条可持续发展的道路啊！看你这么感兴趣，来我们公司吧！要不做点什么，相信不久你就可以升职加薪，出任总经理，担任CEO迎娶白富美走上人生巅峰！"});
    }
});

router.get('/favorite/showAll', Favorite.getAll);
router.post('/favorite', Favorite.favorite);
router.post('/unfavorite', Favorite.unfavorite);

router.get('/daliyPaper/showAll', DaliyPaper.getAll);

function checkLogin(req, res, next){
    if(!req.session.user){
        return res.json(302, {error:"您已登录！"});
    }

    next();
}

function checkNotLogin(req, res, next){
    if(req.session.user){
        return res.json(302, {error:"您未登录！"});
    }

    next();
}

module.exports = router;
