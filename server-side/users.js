const Users = function(db) {
	const create = function(userInfo,callback) {

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