const Games = function(db) {
	const that = this;
	this.dbPrefix = 'game-';
	const create = function(gameInfo,callback) {
		gameInfo.name = gameInfo.name.replace(/[^\w-]/g,''); // can never sanitize too much
		db.get(that.dbPrefix+gameInfo.name,function(err,data) {
			if( null !== err ) {
				// TODO: actual data structure here
				db.put(that.dbPrefix+gameInfo.name,JSON.stringify(gameInfo),function(err) {
					return callback(err);
				});	
			} else {
				var alreadyThere = new Error('Game already exists');
				alreadyThere.type = 'GameExistsError';
				return callback(alreadyThere);
			}
		});
	};

	const join = function(gameName,userInfo,callback) {
		db.get(that.dbPrefix+gameName,function(err,data) {
			if( null !== err ) {
				return callback(err,null); // NotFoundError
			}
			var dataParsed = {};
			try {
			    dataParsed = JSON.parse(data);
			} catch(e) {
				const aaak = new Error('Aaak! Programmer error.');
				aaak.type = 'BadDataError';
				return callback(aaak,data);
			}
			if( dataParsed.turns.length > 0 ) { // game is underway
				if( -1 === dataParsed.players.indexOf(userInfo.email) ) {
					var sad = new Error('Sorry. :-( This game is already underway without ' + userInfo.name);
					sad.type = 'SadNewsError';
					return callback(sad,null);					
				}
			}
			// TODO: modify game so that this user becomes a player
			return callback(null,gameName);
		});
	};
	// interface
	var _handle = {
		create,
		join,
	}
	return _handle;

}

module.exports = Games;