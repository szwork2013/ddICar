var mongodbPool = require('./db');

function SingleLogin(loginInfo){
	this.userID = loginInfo.userID;
	this.sessionID = loginInfo.sessionID;
}

module.exports = SingleLogin;

SingleLogin.prototype.save = function(callback){
	var loginInfo = {
		userID: this.userID,
		sessionID: this.sessionID
	};
    
	mongodbPool.acquire(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection('SingleLogin',function(err,collection){
            if(err){
                mongodbPool.release(db);
                return callback(err);
            }
            collection.ensureIndex('userID',function(err,doc){});
            collection.insert(loginInfo,{w:1},function(err){
                mongodbPool.release(db);
                if(err){
                    return callback(err);
                }

                return callback(null);
            });

        });
    });
};