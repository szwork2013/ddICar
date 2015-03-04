###c_api项目结构说明文档
*	根目录 settings.js文件 存放项目中所使用的主要存放数据库配置信息
*	useConfig.js/config.js/config_dev.js文件用于存放微信接口配置信息
*	common.js用处存放一些公共帮助方法和枚举值来标准返回和录入的信息
*	type.txt用于存放冬瓜电台类型键值
*	views文件夹所有文件为服务器端后台页面，模板引擎为ejs
*	tests文件夹用于存放测试代码，测试库位mocha
*	public用于存放静态文件（特别注明手机注册用户注册完添加一条默认头像，头像文件为public根目录下default_pic.png文件）
*	routes文件夹用于存放路由规则代码及逻辑代码（个文件意义下文详述）
*	models文件夹用于存放对象模型和数据的链接（个文件意义下文详述）


###routes
* admins.js 后台管理功能
* auth.js 实现微信接口及后续微博的接口
* CarInfo.js 车机功能
* DaliyPaper.js 日报的接口功能实现
* DaliyPaperType.js 日报类型的接口功能实现
* favorite.js 收藏及展示收藏接口功能实现
* hxMiddleWare.js 环信接口的功能实现（备注：环信SDK已被放弃）
* index.js 所有冬瓜的接口路由文件
* odbErrorCode.js OBD故障码功能实现，与B_API层有功能重叠
* ODBWarning.js 开发此接口用于车机平台发送警报在手机客户端响应
* room.js 聊天室接口功能实现
* signs.js 地图标记接口功能实现
* users.js 用户功能接口功能实现
* YourVoice.js 你的声音接口功能实现
* YourVoiceType.js 你的声音类型接口功能实现

###models （备注：在此补充逻辑代码中没有出现的代码文件）
* DaliyPaperSubType.js 日报二级类型（二级类型已被舍弃）
* db.js MongoDB连接文件
* odbErrorRecord.js 被引用在routes/ODBWarning.js 存放故障历史信息
* feedback.js 用户反馈 被引用在routes/users.js
* Zan.js 保存赞关系