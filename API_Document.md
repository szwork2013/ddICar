#冬瓜电台 RESTful API Doc

##API路径
```
http://182.92.160.208:3000/
```
##图片路径
```
http://182.92.160.208:3000/images
```

-------
##错误码
```
var commonEnum = {
    SYSTEM_ERROR: 1001,
    USER_NOT_EXISTS: 2000,
    WRONG_PASSWORD: 2008,
    USER_IS_EXISTS: 2001,
    USER_NOT_LOGIN: 2006,
    USER_IS_LOGIN: 2005,
    NO_PIC: 2010
}
```
##用户对象
```
	this.info = {
        phone: info.phone,
        password: info.password,
        name: info.name,
        pic: info.pic,
        sex: info.sex,
        intro: "这个人还没有写简介，懒死了",
        platform: info.platform,
        deviceSN: "",
        wx: {
            "openid": info.wx.openid,
            "nickname": info.wx.nickname,
            "sex": info.wx.sex,
            "province": info.wx.province,
            "city": info.wx.city,
            "country": info.wx.country,
            "headimgurl": info.wx.headimgurl,
            "privilege": info.wx.privilege,
            "unionid": info.wx.unionid}
    };
    this.daliy_paper = [];
    this.your_voice = {
        type: "",
        ids: []
    };
    this.settings = {};
```
##日报对象
```
	this.title = daliyPaper.title;
    this.author = daliyPaper.author;
    this.pic = daliyPaper.pic;
    this.typeId = daliyPaper.typeId;
    this.contentType = daliyPaper.contentType;
    this.content = daliyPaper.content;
    this.favorites = 0;
    this.createAt = new Date();
    this.zan = 0;
```
##用户注册

```
POST /users/reg
```
######JSON Format:
```
requset: {'phone':'xxxxx',
			'password':'xxxxxx'}
response: 成功, {
				state:{
            		success: true,
	            	code: 1,
            		msg: str
        		},
        		data: {user object}
        		}
          失败, {state:{
            		success: false,
	            	code: errorCode,
            		msg: str
        		}}
```
######NOTE: 

##用户登录
```
POST /users/login
```
######JSON Format:
```
request: {'phone':'xxxxx','password':'xxxxxx'}
response: 成功, {
				state:{
            		success: true,
	            	code: 1,
            		msg: str
        		},
        		data: {user object}
        		}
          失败, {state:{
            		success: false,
	            	code: errorCode,
            		msg: str
        		}}
```
######NOTE: 

##微信授权登录
```
GET /users/wxauth/:wxCode
```
######JSON Format:
```
request: None
response: 成功, {
				state:{
            		success: true,
	            	code: 1,
            		msg: str
        		},
        		data: {user object}
        		}
          失败, {state:{
            		success: false,
	            	code: errorCode,
            		msg: str
        		}}
```
######NOTE: 

##用户登出
```
GET /users/logout
```
######JSON Format:
```
request: None
response: 成功, {
				state:{
            		success: true,
	            	code: 1,
            		msg: str
        		},
        		data: null
        		}
          失败, {state:{
            		success: false,
	            	code: errorCode,
            		msg: str
        		}}
```
######Note:

##获取用户
```
GET /users/getUser/:id
```
######JSON Format:
```
request: None
response: 成功, {
				state:{
            		success: true,
	            	code: 1,
            		msg: str
        		},
        		data: {user object}
        		}
          失败, {state:{
            		success: false,
	            	code: errorCode,
            		msg: str
        		}}
```
######Note:

##更新用户
```
POST /users/putUser
```
######JSON Format:
```
request: {'user_id':'xxxxx',
			'sex':'xxxxx',
			'intro':'xxxxx',
			'name':'xxxxx',
			'deviceSN':'xxxxxx'}
response:成功, {
				state:{
            		success: true,
	            	code: 1,
            		msg: str
        		},
        		data: null
        		}
          失败, {state:{
            		success: false,
	            	code: errorCode,
            		msg: str
        		}}
```
######Note:
##保存用户头像
```
POST /users/postPic
```
######JSON Format:
```
request: {'user_id':'xxxxx',
			'pic':{file object}
response:成功, {
				state:{
            		success: true,
	            	code: 1,
            		msg: str
        		},
        		data: null
        		}
          失败, {state:{
            		success: false,
	            	code: errorCode,
            		msg: str
        		}}
```
######Note:
##用户重置密码（这个方法有问题呢待更新）
```
POST /users/resetPassword
```
######JSON Format:
```
request: {'user_id':'xxxxx',
			'DaliyPaperSettings':{DaliyPaperSettings object}
response: 成功, {
				state:{
            		success: true,
	            	code: 1,
            		msg: str
        		},
        		data: null
        		}
          失败, {state:{
            		success: false,
	            	code: errorCode,
            		msg: str
        		}}
```        		
##保存日报设置
```
POST /users/setDaliyPaperSubTypeSettings
```
######JSON Format:
```
request: {'user_id':'xxxxx',
			'DaliyPaperSettings':{DaliyPaperSettings object}
response: 成功, {
				state:{
            		success: true,
	            	code: 1,
            		msg: str
        		},
        		data: null
        		}
          失败, {state:{
            		success: false,
	            	code: errorCode,
            		msg: str
        		}}
```
######Note:
##获取日报设置
```
GET /users/getDaliyPaperSettings/:id
```
######JSON Format:
```
request: None
response: 成功, {
				state:{
            		success: true,
	            	code: 1,
            		msg: str
        		},
        		data: {DaliyPaperSettings object}
        		}
          失败, {state:{
            		success: false,
	            	code: errorCode,
            		msg: str
        		}}
```
######Note:
##获取我的收藏
```
GET /users/favorite/showAll/:id
```
######JSON Format:
```
request: None
response: 成功, {
				state:{
            		success: true,
	            	code: 1,
            		msg: str
        		},
        		data: [daliyPapers]
        		}
          失败, {state:{
            		success: false,
	            	code: errorCode,
            		msg: str
        		}}
```
######Note:
##收藏日报
```
POST /users/favorite
```
######JSON Format:
```
request: {'user_id':'xxxxx',
			'post_id':'xxxxx'
response: 成功, {
				state:{
            		success: true,
	            	code: 1,
            		msg: str
        		},
        		data: null
        		}
          失败, {state:{
            		success: false,
	            	code: errorCode,
            		msg: str
        		}}
```
######Note:
##取消收藏日报
```
POST /users/unfavorite
```
######JSON Format:
```
request: {'user_id':'xxxxx',
			'post_id':'xxxxx'
response: 成功, {
				state:{
            		success: true,
	            	code: 1,
            		msg: str
        		},
        		data: null
        		}
          失败, {state:{
            		success: false,
	            	code: errorCode,
            		msg: str
        		}}
```
######Note:
##获取我的声音提醒
```
GET /yourVoice/getByType
```
######JSON Format:
```
request: None
response:成功, {
				state:{
            		success: true,
	            	code: 1,
            		msg: str
        		},
        		data: [YourVoices]
        		}
          失败, {state:{
            		success: false,
	            	code: errorCode,
            		msg: str
        		}}
```
######Note:
##上传我的定制声音
```
POST /yourVoice/uploadMyVoice
```
######JSON Format:
```
request: {'content':'xxxxx',
			'audio':{audio file}
response: 成功, {
				state:{
            		success: true,
	            	code: 1,
            		msg: str
        		},
        		data: null
        		}
          失败, {state:{
            		success: false,
	            	code: errorCode,
            		msg: str
        		}}
```
######Note:
##获取故障列表(这个接口要重新实现)
```
GET /users/getWarnings/:id
```
######JSON Format:
```
request: None
response: 成功, {
				state:{
            		success: true,
	            	code: 1,
            		msg: str
        		},
        		data: [warnings]
        		}
          失败, {state:{
            		success: false,
	            	code: errorCode,
            		msg: str
        		}}
```
######Note:
##获取车况（这个接口要重新实现）
```
GET /users/getCarStatus/:id
```
######JSON Format:
```
request: None
response: 成功, {
				state:{
            		success: true,
	            	code: 1,
            		msg: str
        		},
        		data: [status]
        		}
          失败, {state:{
            		success: false,
	            	code: errorCode,
            		msg: str
        		}}
```
######Note:
##获取所有房间的列表
```
GET /room/getList
```
######JSON Format:
```
request: None
response: 成功, {
				state:{
            		success: true,
	            	code: 1,
            		msg: str
        		},
        		data: [rooms]
        		}
          失败, {state:{
            		success: false,
	            	code: errorCode,
            		msg: str
        		}}
```
######Note:
##创建聊天室
```
POST /room/save
```
######JSON Format:
```
request: None
response: 成功, {
				state:{
            		success: true,
	            	code: 1,
            		msg: str
        		},
        		data: null
        		}
          失败, {state:{
            		success: false,
	            	code: errorCode,
            		msg: str
        		}}
```
######Note:
##获取故障列表(这个接口要重新实现)
```
GET /room/getByName/:roomname
```
######JSON Format:
```
request: None
response: 成功, {
				state:{
            		success: true,
	            	code: 1,
            		msg: str
        		},
        		data: [warnings]
        		}
          失败, {state:{
            		success: false,
	            	code: errorCode,
            		msg: str
        		}}
```
######Note: