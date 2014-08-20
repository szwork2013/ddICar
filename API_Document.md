#冬瓜电台 RESTful API Doc

-------
##用户注册

```
POST /reg
```
######JSON Format:
```
requset: {'phone':'xxxxx',
			'email':'xxxx',
			'password':'xxxxxx',
			'password_repeat':'xxxxx'}
response: 200, {core user object}
          400, {error:'some mongodb err'}
          401, {error:'用户已存在！'}
          300, {error: core err object}
          302, {error:'您已登录！'}
```
######NOTE: 
- *phone*/*email* at least one key has the value
- not login required

##用户登录
```
POST /login
```
######JSON Format:
```
request: {'phone':'xxxxx','email':'xxxx','password':'xxxxxx','UUID':'xxxxx'}
response: 200, {core user object}
          400, {error:'some mongodb err'}
          401, {error:'用户不存在！'}
          402, {error:'密码错误！'}
          302, {error:'您已登录！'}
```
######NOTE: 
- *phone*/*email* at least one key has the value.

##用户登出
```
GET /logout
```
######JSON Format:
```
request: None
response: 200,{info:'登出成功！'}
          302,{error:'您已登出！'}
          400，{error:'登出失败！'}
```
######Note:
- login required

##检测用户数据版本
```
POST /checkUserVersion
```
######JSON Format:
```
request: {core user object}
response:201,{'info':'need to upload device data'}
         202,{'info':'need to download the newest data'}
         302,{'error':'您未登录！'}
```
######Note:
- login required

##获取用户
```
GET /getUser
```
######JSON Format:
```
request: None
response:200,{core user object}
         400,{'error':'mongodb err'}
```
######Note:
- login required

##更新用户
```
POST /putUser
```
######JSON Format:
```
request: {userDate:core user object, checkKey:string}
response:200,{'info':'putUser success!'}
         400,{'error':'mongodb error'}
         333,{'error':'年轻人，你这可不是一条可持续发展的道路啊！看你这么感兴趣，来我们公司吧！要不做点什么，相信不久你就可以升职加薪，出任总经理，担任CEO迎娶白富美走上人生巅峰！'}
         302,{'error':'您未登出！'}
```
######Note:
- login required
