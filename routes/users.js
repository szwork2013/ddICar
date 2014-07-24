var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var uuid = require('node-uuid');
var User = require('../models/users.js');
var SingleLogin = require('../models/SingleLogin.js');

/* GET users listing. */
router.get('/:phone', function(req, res) {
	var phone = req.params.phone;
	User.get(phone, function(err, user){
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
		password: password,
	});

	User.get(phone, function(err, user){
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
	User.get(req.body.phone, function(err, doc){
		if(!doc){
			return res.json(400, {error:"用户不存在！"});
		}

		// 检查密码是否一致
		if(doc.user.info.password != password){
			return res.json(400, {error:"密码错误！"});
		}

		req.session.user = doc.user;
		return res.json(200, doc);
	});
});



module.exports = router;
