var express = require('express');
var crypto = require('crypto');
var fs = require('fs');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var uuid = require('node-uuid');
var Admin = require('../models/admins');
var User = require('../models/users');
var DaliyPaperType = require('./DaliyPaperType');
var YourVoice = require('./YourVoice');
var DaliyPaper = require('./DaliyPaper');
var YourVoiceType = require('./YourVoiceType');
var OBDErrorCode = require('./OBDErrorCode');

var router = express.Router();

router.get('/', function(req, res){
	res.render('admin_login',{
		title:"这里是大东车慧运营管理平台网站客户端！"
	});
});

router.get('/showAll', function(req, res){
    Admin.getAll(function(err, admins){
        if(err){
            req.flash('error',err);
        }

        res.render('admin_showAll',{
            title:"东东电台管理后台",
            success:req.flash('success'),
            error:req.flash('error'),
            admin:req.session.admin,
            admins:admins
        });
    });
});

router.get('/users/showAll', function(req, res){
    User.getAll(function(err,users){
        console.log(users);
        res.render('user_showAll',{
            title:"东东电台管理后台",
            success:req.flash('success'),
            error:req.flash('error'),
            admin:req.session.admin,
            users:users
        });
    });
});

router.post("/changePassword", function(req, res){
    var oldPassword = req.body.oldPassword,
        newPassword = req.body.newPassword,
        newPassword_re = req.body.newPassword_repeat;

    if(newPassword != newPassword_re){
        req.flash('error',"新密码不匹配！");
        return res.redirect('/admins/dashboard');
    }

    Admin.getOne(req.session.admin.email, function(err, admin){
        var md5 = crypto.createHash('sha256');
        oldPassword = md5.update(oldPassword).digest('hex');

        if(oldPassword != admin.password){
            req.flash('error',"旧密码不匹配！");
            return res.redirect('/admins/dashboard');
        }

        var _md5 = crypto.createHash('sha256');
        newPassword = _md5.update(newPassword).digest('hex');

        admin.password = newPassword;

        Admin.update(admin,function(err){
            if(err){
                req.flash('error',"密码修改失败！\n"+err);
            }

            res.redirect('/admins/dashboard');
        });
    });
});

router.get('/delete/:email', function(req, res){
    Admin.delete(req.params.email, function(err){
        if(err){
            req.flash('error',err);
        }

        req.flash('success', "管理员删除成功！");
        res.redirect('/admins/showAll');
    });
});

router.get('/dashboard',function(req, res){
    res.render('dashboard', {
        title:"东东电台管理后台",
        success:req.flash('success'),
        error:req.flash('error'),
        admin:req.session.admin
    });
});

router.post('/login',function(req, res){
    var email = req.body.email;
    var password = req.body.password;

    var md5 = crypto.createHash('sha256'),
        password = md5.update(password).digest('hex');

    Admin.getOne(email, function(err,admin){
        if(err){
            req.flash('error',"登录失败，此管理员不存在！");
            return res.redirect('/admins');
        }

        if(!admin){
            req.flash('error',"登录失败，此管理员不存在！");
            return res.redirect('/admins');
        }

        if(admin.password != password){
            req.flash('error',"登录失败，密码不匹配！");
            return res.redirect('/admins');
        }

        req.session.admin = admin;
        req.flash('success',"登录成功！");
        res.redirect('/admins/dashboard');
    });
});

router.post('/add', function(req,res){
    var name = req.body.name,
        email = req.body.email,
        password = req.body.password,
        isSuperAdmin = req.body.isSuperAdmin;

    var md5 = crypto.createHash('sha256');
    password = md5.update(password).digest('hex');

    var nweAdmin = new Admin({
        name:name,
        email:email,
        password:password,
        isSuperAdmin:isSuperAdmin
    });

    Admin.getOne(email,function(err,admin){
        if(err){
            return res.json(400,err);
        }
        // admin存在说明已有此管理员
        if(admin){
            return res.json(400,{error:"此管理员已存在！"});
        }

        nweAdmin.save(function(err,admin){
            if(err){
                return res.json(400,err);
            }

            req.flash('success',"管理员添加成功！")
            res.redirect('/admins/showAll');
        });
    });
});

router.post('/resetAdmin', function(req, res){
    var email = req.body.email;

    Admin.getOne(email, function(err, admin){
        if(err){
            return res.json(400, err);
        }

        var md5 = crypto.createHash('sha256');
        var password = md5.update('ddicar1234').digest('hex');
        admin.password = password;

        Admin.update(admin, function(err){
            if(err){
                return res.json(400,err);
            }

            res.json(200,{info:"重置成功！"});
        });
    });
});

router.post('/logout', checkLogin);
router.post('/logout', function(req, res){
    req.session.destroy(function(err){
        if(err){
            return res.json(400,{'info':'登出失败！'});
        }
        return res.json(200,{'info':'登出成功！'});
    });
});

router.get('/daliyPaper/type/level1/showAll', DaliyPaperType.level1_showAll);

router.post('/daliyPaper/type/level1/add', multipartMiddleware, DaliyPaperType.level1_add);

router.get('/daliyPaper/type/level1/delete/:id', DaliyPaperType.level1_delete);

router.post('/daliyPaper/type/level1/update', multipartMiddleware, DaliyPaperType.level1_update);

router.get('/daliyPaper/type/level2/showAll', DaliyPaperType.level2_showAll);

router.post('/daliyPaper/type/level2/add', multipartMiddleware, DaliyPaperType.level2_add);

router.get('/daliyPaper/type/level2/delete/:id', DaliyPaperType.level2_delete);

router.post('/daliyPaper/type/level2/update', multipartMiddleware, DaliyPaperType.level2_update);

router.get('/daliyPaper/content/showAll', DaliyPaper.showAll);

router.post('/daliyPaper/content/add', multipartMiddleware, DaliyPaper.add);

router.post('/daliyPaper/content/update', multipartMiddleware, DaliyPaper.update);

router.get('/daliyPaper/content/delete/:id', DaliyPaper.delete);

router.get('/yourVoice/type/showAll', YourVoiceType.showAll);

router.post('/yourVoice/type/add', YourVoiceType.add);

router.get('/yourVoice/type/delete/:id', YourVoiceType.delete);

router.post('/yourVoice/type/update', YourVoiceType.update);

router.get('/yourVoice/content/showAll', YourVoice.showAll);

router.post('/yourVoice/content/add', multipartMiddleware, YourVoice.uploadSysVoice);

router.get('/yourVoice/content/delete/:id', YourVoice.delete);

router.post('/OBDErrorCode/update', OBDErrorCode.update);

router.get('/OBDErrorCode/showAll', OBDErrorCode.showAll);

router.post('/OBDErrorCode/add', OBDErrorCode.add);

router.get('/OBDErrorCode/delete/:id', OBDErrorCode.delete);


function checkLogin(req, res, next){
    if(!req.session.admin){
        return res.json(400,{error:"用户已登录！"});
    }

    next();
}

function checkNotLogin(req, res, next){
    if(req.session.admin){
        return res.json(400, {error:"用户未登录！"});
    }

    next();
}

module.exports = router;