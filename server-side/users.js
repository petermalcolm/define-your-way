const md5 = require('md5');
try {
    var salt = require('../_salt.js');
} catch (e) {
    if (e.code == 'MODULE_NOT_FOUND') {
    	console.log('Oh no!  You need a site-wide salt for your users\' passwords.');
    	console.log('Just create a file called: \n');
    	console.log('_salt.js\n');
    	console.log('at the root level directory (next to server.js).');
    	console.log('In case your feeling lazy, use this as the content of that file:\n');
    	console.log('module.exports = \''+Math.random().toString(36).substring(2)+'\';\n');
    	console.log('That salt was just created randomly, just for you.  Feel free to change it.');
        process.exit();
    }
}

const Users = function(db) {
	const create = function(userInfo,callback) {
		userInfo.password = md5(userInfo.password + salt);
		db.put(userInfo.email,JSON.stringify(userInfo),function(err) {
			return callback(err);
		});
	};

	const authenticate = function(email,password,callback) {
		db.get(email,function(err,data) {
			if( null !== err ) {
				return callback(err,null); // NotFoundError
			}
			if( !JSON.parse(data).password ) {
				var aaak = new Error('Aaak! Programmer error.');
				aaak.type = 'BadDataError';
				return callback(aaak,data);
			}
			const givenHash = md5(password + salt);
			if( givenHash !== JSON.parse(data).password ) {
				var bad = new Error('Please try again.');
				bad.type = 'BadPasswordError';
				return callback(bad,null);
			}
			return callback(null,data);
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