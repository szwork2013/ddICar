var mongodbPool = require('./db');

function User(user){
	this.user = {
		info:{
			phone: user.phone,
			password: user.password,
			name: "None"
		},
		like:[]
	}
};

module.exports = User;

User.prototype.save = function(callback){
	var user = {
		user: this.user
	};

	mongodbPool.acquire(function(err, db){
		if(err){
			return callback(err);
		}

		db.collection('users', function(err, collection){
			if(err){
				mongodbPool.release(db);
				return callback(err);
			}

			collection.ensureIndex('user.info.phone',function(err, user) {});
			collection.insert(user,{w:1},function(err, user){
				mongodbPool.release(db);
				if(err){
					return callback(err);
				}

				callback(null,user[0]);
			})
		});
	});
}

User.get = function(phone, callback){
	mongodbPool.acquire(function(err, db){
		if(err){
			return callback(err);
		}

		db.collection('users', function(err, collection){
			if(err){
				mongodbPool.release(db);
				return callback(err);
			}
			collection.findOne({'user.info.phone': phone},function(err,user){
				mongodbPool.release(db);
				if(err){
					return callback(err);
				}

				return callback(null, user);
			});
		});
	});
}