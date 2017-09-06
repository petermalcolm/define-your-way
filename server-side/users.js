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
const md5 = require('md5');
// and JWTs
const jwt = require('jsonwebtoken');

const Users = function(db) {
	const that = this;
	this.dbPrefix = 'user-';
	const create = function(userInfo,callback) {
		db.get(that.dbPrefix+userInfo.email,function(err,data) {
			if( null !== err ) {
				userInfo.password = md5(userInfo.password + salt);
				userInfo.permissions = "play"; // default
				db.put(that.dbPrefix+userInfo.email,JSON.stringify(userInfo),function(err) {
					return callback(err);
				});	
			} else {
				var alreadyThere = new Error('User already exists');
				alreadyThere.type = 'UserExistsError';
				return callback(alreadyThere);
			}
		});
	};

	const authenticate = function(email,password,callback) {
		db.get(that.dbPrefix+email,function(err,data) {
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
			return callback(null,tokenFor(data));
		});
	};

	const validateToken = function( givenToken ) {
		return new Promise(function(resolve, reject) {
			try {
				resolve(jwt.verify(givenToken, salt));
			} catch(err) {
				reject(Error('Bad token.'));
			}			
		});
	}

	// private fn
	const tokenFor = function( userData ){
		const data = {
			email: JSON.parse(userData).email.slice(that.dbPrefix.length),
			name: JSON.parse(userData).name,
			avatar: JSON.parse(userData).avatar,
			permissions: JSON.parse(userData).permissions
		};
		return jwt.sign({
		  data: data
		}, salt, { expiresIn: 86400 }); // one day
	}

	// interface
	var _handle = {
		create,
		authenticate,
		validateToken
	}
	return _handle;

}

module.exports = Users;