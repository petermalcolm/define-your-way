const md5 = require('md5');

const Users = function(db) {
	const create = function(userInfo,callback) {
		userInfo.password = md5(userInfo.password);
		db.put(userInfo.email,JSON.stringify(userInfo),function(err) {
			return callback(err);
		});
	};

	const authenticate = function(email,password,callback) {
		db.get(email,function(err,data) {
			return callback(err,data);
		});
	};
	// interface
	var _handle = {
		create,
		authenticate
	}
	return _handle;

}

module.exports = Users;