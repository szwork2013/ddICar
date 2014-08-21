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
response: 注册成功, {success:{core user object},error:null}
          注册失败, {success:null,error: {core err object}}
          注册失败, {success:null,error: "您已登录"}
          注册失败, {success:null,error: "用户已存在"}
```
######NOTE: 


##用户登录
```
POST /login
```
######JSON Format:
```
request: {'phone':'xxxxx','email':'xxxx','password':'xxxxxx'}
response: 登录成功, {success:{core user object},error:null}
          登录失败, {success:null,error: {core err object}}
          登录失败, {success:null,error: "您已登录"}
          登录失败, {success:null,error: "密码错误"}
          登录失败, {success:null,error: "用户不存在"}
```
######NOTE: 

##用户登出
```
GET /logout
```
######JSON Format:
```
request: None
response: 登出成功, {success:"登出成功",error: null}
          登出失败, {success:null,error: "您已登出"}
          登出失败, {success:null,error: "登出失败"}
```
######Note:

##检测用户数据版本
```
POST /checkUserVersion
```
######JSON Format:
```
request: {core user object}
response:检测成功, {success:"need to upload device data",error: null}
         检测成功, {success:"need to download the newest data",error: null}
         检测失败, {success:null,error: "您未登录"}
```
######Note:

##获取用户
```
GET /getUser
```
######JSON Format:
```
request: None
response:获取成功, {success:{core user object},error: null}
         获取失败, {success:null,error: {core err object}}
```
######Note:

##更新用户
```
POST /putUser
```
######JSON Format:
```
request: {userDate:core user object, checkKey:string}
response:更新成功, {success:"putUser success",error: null}
         更新失败, {success:null,error: "年轻人，你这可不是一条可持续发展的道路啊！看你这么感兴趣，来我们公司吧！要不做点什么，相信不久你就可以升职加薪，出任总经理，担任CEO迎娶白富美走上人生巅峰"}
         更新失败, {success:null,error: {core err object}
         更新失败, {success:null,error: "您未登出"}
```
######Note:
