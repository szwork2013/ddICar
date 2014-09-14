var express = require('express');
var router = express.Router();
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var User = require('./users');
var Favorite = require('./favorite');
var DaliyPaper = require('./DaliyPaper');
var DaliyPaperType = require('./DaliyPaperType');
var YourVoice = require('./YourVoice');

/* GET home page. */

router.post('/users/reg', User.reg); // 用户注册
router.post('/users/login',User.checkNotLogin, User.login);// 用户登录
router.get('/users/logout',User.checkLogin, User.logout);// 用户登出

router.get('/users/getUser/:id',User.checkLogin, User.getUser);// 获取用户信息
router.post('/users/putUser',User.checkLogin, User.putUser);// 保存用户信息
router.post('/users/postPic',User.checkLogin, multipartMiddleware, User.postPic);// 保存用户头像
router.post('/users/resetPassword',User.checkLogin, User.resetPassword);// 用户重置密码
router.post('/users/setDaliyPaperSettings',User.checkLogin, User.setDaliyPaperSettings); // 设置日报设置
router.get('/users/getDaliyPaperSettings/:id',User.checkLogin, User.getDaliyPaperSettings); // 获取日报设置
router.post('/users/setAppSettings',User.checkLogin, User.setAppSettings); // 设置app设置
router.get('/users/getAppSettings/:id',User.checkLogin, User.getAppSettings); // 获取日报设置
router.post('/users/favorite/showAll',User.checkLogin, Favorite.getAll);// 我的收藏
router.post('/users/favorite',User.checkLogin, Favorite.favorite); // 收藏
router.post('/users/unfavorite',User.checkLogin, Favorite.unfavorite);// 取消收藏
router.get('/users/daliyPaper/showAll',User.checkLogin, DaliyPaper.getAll);// 获取日报

router.get('/daliyPaper/getLevel1Type',User.checkLogin, DaliyPaperType.level1_type);  // 获取日报一级类型
router.get('/daliyPaper/getLevel2Type',User.checkLogin, DaliyPaperType.level2_type);  // 获取日报二级类型

router.get('/yourVoice/getByType',User.checkLogin, YourVoice.getByType);  // 获取你的声音列表

module.exports = router;
