var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var uuid = require('node-uuid');
var User = require('../models/users.js');
var SingleLogin = require('../models/SingleLogin.js');

/* GET users listing. */
router.get('/:phone', function(req, res) {
	var phone = req.params.phone;
	User.getOne(phone, function(err, user){
		if(err){
			return res.json(400, err);
		}

		return res.json(200, user);
	});
});
router.post('/logout', function(req, res){
	req.session.destroy(function(err){
        if(err){
            return res.json(400,{'info':'登出失败！'});
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
		password: password,
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
				sessionID: req.sessionID,
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

router.post('/login', function(req, res){
	var md5 = crypto.createHash('sha256'),
	password = md5.update(req.body.password).digest('hex');

	// 查询是否有此用户
	User.getOne(req.body.phone, function(err, user){
		console.log(user);

		if(!user){
			return res.json(400, {error:"用户不存在！"});
		}

		// 检查密码是否一致
		if(user.info.password != password){
			return res.json(400, {error:"密码错误！"});
		}

		req.session.user = user;
		return res.json(200, user);
	});
});

router.post('/resetpassword', function(req, res){
	var oldPassword = req.body.oldPassword;
	var newPassword = req.body.newPassword;
	var newPassword_re = req.body.newPassword_repeat;
	var phone = req.body.phone;
	var md5 = crypto.createHash('sha256'),
	oldPassword = md5.update(oldPassword).digest('hex');
	User.getOne(phone, function(err, user){
		if(err){ return res.json(400,err) }
		if(user){
			return res.json(400, {error:"用户不存在！"});
		}

		if(user.info.password != oldPassword){
			return res.json(400, {error:"旧密码输入错误！"})
		}

		if(newPassword != newPassword_repeat){
			return res.json(400, {error:"新密码不一致！"})
		}

		newPassword = md5.update(newPassword).digest('hex');
		user.info.password = newPassword;
		User.update(usr, function(err, user){

		});
	});
});



module.exports = router;
