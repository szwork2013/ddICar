var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
	res.render('admin',{
		title:"这里是大东车慧运营管理平台网站客户端！"
	});
});

module.exports = router;