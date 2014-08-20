var mongodbPool = require('./db');

function User(user){
	this.info = {
		phone: user.phone,
		email: user.email,
		password: user.password,
		name: "None"
	}
	this.like = {};
};

module.exports = User;

User.prototype.save = function(callback){
	var user = {
		info: this.info,
		like: this.like
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

			collection.ensureIndex('info.phone', function(err, user) {});
			collection.ensureIndex('info.email', function(err, user) {})
			collection.insert(user,{w:1},function(err, doc){
				mongodbPool.release(db);
				if(err){
					return callback(err);
				}

				callback(null,doc[0]);
			})
		});
	});
}

User.update = function(user, callback){
	
}

User.getOne = function(phone, callback){
	mongodbPool.acquire(function(err, db){
		if(err){
			return callback(err);
		}

		db.collection('users', function(err, collection){
			if(err){
				mongodbPool.release(db);
				return callback(err);
			}
			collection.findOne({'info.phone': phone},function(err,doc){
				mongodbPool.release(db);
				if(err){
					return callback(err);
				}

				return callback(null, doc);
			});
		});
	});
}