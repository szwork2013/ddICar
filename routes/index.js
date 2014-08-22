var express = require('express');
var router = express.Router();
var User = require('./users');
var Favorite = require('./favorite');
var DaliyPaper = require('./DaliyPaper');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

/* GET home page. */

router.post('/users/reg', User.reg); // 用户注册
router.post('/users/login',User.checkNotLogin, User.login);// 用户登录
router.get('/users/logout',User.checkLogin, User.logout);// 用户登出
router.get('/users/getUser',User.checkLogin, User.getUser);// 获取用户信息
router.post('/users/putUser',User.checkLogin, User.putUser);// 保存用户信息
router.post('/users/postPic',User.checkLogin, multipartMiddleware, User.postPic);// 保存用户头像
router.post('/users/resetPassword', User.resetPassword);// 用户重置密码

router.get('/users/favorite/showAll', Favorite.getAll);
router.post('/users/favorite', Favorite.favorite);
router.post('/users/unfavorite', Favorite.unfavorite);
router.get('/users/daliyPaper/showAll', DaliyPaper.getAll);

module.exports = router;
