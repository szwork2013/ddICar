#冬瓜电台 RESTful API Doc

-------
##用户注册

```
POST /users/reg
```
######JSON Format:
```
requset: {'phone':'xxxxx',
			'password':'xxxxxx'}
response: 注册成功, {flag:'success',content:{user object}
          注册失败, {flag:'fail',content: 2001}
          注册失败, {flag:'fail',content: 1001}
```
######NOTE: 


##用户登录
```
POST /users/login
```
######JSON Format:
```
request: {'phone':'xxxxx','password':'xxxxxx'}
response: 登录成功, {flag:'success',content:{user object}
          登录失败, {flag:'fail',content: 2000}
          登录失败, {flag:'fail',content: 2008}
```
######NOTE: 

##用户登出
```
GET /users/logout
```
######JSON Format:
```
request: None
response: 登出成功, {flag:'success',content: 3002}
          登出失败, {flag:'fail',content: 2004}
```
######Note:

##获取用户
```
GET /users/getUser/:id
```
######JSON Format:
```
request: None
response:获取成功, {flag:'success',content: {user object}}
         获取失败, {flag:'fail',content: 1001}
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
response:更新成功, {flag:'success',content: 3001}
         更新失败, {flag:'fail',content: 1001}
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
response:保存成功, {flag:'success',content: 3003}
         保存失败, {flag:'fail',content: 2010}
         保存失败, {flag:'fail',content: 1001}
```
######Note:
##保存日报设置
```
POST /users/setDaliyPaperSettings
```
######JSON Format:
```
request: {'user_id':'xxxxx',
			'DaliyPaperSettings':{DaliyPaperSettings object}
response:保存成功, {flag:'success',content: 3001}
         保存失败, {flag:'fail',content: 1001}
```
######Note:
##获取用户
```
GET /users/getDaliyPaperSettings/:id
```
######JSON Format:
```
request: None
response:获取成功, {flag:'success',content: {user.daliy_paper object}}
         获取失败, {flag:'fail',content: 1001}
         获取失败, {flag:'empty'}
```
######Note:
##保存日报设置
```
POST /users/setAppSettings
```
######JSON Format:
```
request: {'user_id':'xxxxx',
			'AppSettings':{AppSettings object}
response:保存成功, {flag:'success',content: 3001}
         保存失败, {flag:'fail',content: 1001}
```
######Note:
##获取用户
```
GET /users/getAppSettings/:id
```
######JSON Format:
```
request: None
response:获取成功, {flag:'success',content: {user.settings object}}
         获取失败, {flag:'fail',content: 1001}
         获取失败, {flag:'empty'}
```
######Note:
##获取我的收藏
```
GET /users/favorite/showAll/:id
```
######JSON Format:
```
request: None
response:获取成功, {flag:'success',content: {daliyPapers object}}
         获取失败, {flag:'fail',content: 1001}
         获取失败, {flag:'empty'}
```
######Note:
##保存日报设置
```
POST /users/setAppSettings
```
######JSON Format:
```
request: {'user_id':'xxxxx',
			'AppSettings':{AppSettings object}
response:保存成功, {flag:'success',content: 3001}
         保存失败, {flag:'fail',content: 1001}
```
######Note: