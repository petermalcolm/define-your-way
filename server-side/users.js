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
	const create = function(userInfo) {
		return db.get(that.dbPrefix+userInfo.email)
		.then(function itsADuplicate(data) {
			var alreadyThere = new Error('User already exists');
			alreadyThere.type = 'UserExistsError';
			throw alreadyThere;			
		}, function itsOriginal(err) {  // counterintuitive - get() fails means success
			userInfo.password = md5(userInfo.password + salt);
			userInfo.permissions = "play"; // default
			return db.put(that.dbPrefix+userInfo.email,JSON.stringify(userInfo));	
		}).then(function createdAndHereYouGo(putResult){
			return tokenFor(userInfo);
		}).catch(function creationSnafu(err){
			// console.log('User creation failed with',err);
			return err;
		});
	};

	const authenticate = function(email,password) {
		return db.get(that.dbPrefix+email).then(JSON.parse)
		.then( function checkHash(data) {
			const givenHash = md5(password + salt);
			if( givenHash !== data.password ) {
				var bad = new Error('Please try again.');
				bad.type = 'BadPasswordError';
				throw bad;
			} else {
				return data;
			}
		}).then(tokenFor)
		.catch( function couldNotAuth(err){
			console.log(err);
		});
	};

	const validateToken = function( givenToken ) {
		return new Promise(function(resolve, reject) {
			try {
				resolve(jwt.verify(givenToken, salt));
			} catch(err) {
				reject(Error('Bad token, cannot validtate:',givenToken));
			}			
		});
	}

	const extractEmailFromToken = ( token ) => {
		return new Promise(function(resolve,reject) {
			try {
				resolve(jwt.decode(token).email);
			} catch(err){
				reject(Error('Bad token, cannot extract email:',token));
			}
		});
	}

	// private fn
	const tokenFor = function( userData ){
		const data = {
			email: userData.email.slice(that.dbPrefix.length),
			name: userData.name,
			avatar: userData.avatar,
			permissions: userData.permissions
		};
		return jwt.sign({
		  data: data
		}, salt, { expiresIn: 86400 }); // one day
	}

	// interface
	var _handle = {
		create,
		authenticate,
		validateToken,
		extractEmailFromToken
	}
	return _handle;

}

module.exports = Users;