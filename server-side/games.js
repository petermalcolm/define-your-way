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

	// join a game
	// return a Promise
	const joinIn = function(gameName,userInfo) {
		console.log('Joining',gameName,'...');
		return db.get(that.dbPrefix+gameName).then(JSON.parse).then(
		function gameExists( dataParsed ) {
			if( dataParsed.turns.length > 0 ) { // game is underway
				if( -1 === dataParsed.players.indexOf(userInfo.email) ) {
					var sadErr = new Error('Sorry. :-( This game is already underway without ' + userInfo.name);
					sadErr.type = 'SadNewsError';
					throw sadErr;					
				}
			}
			// TODO: modify game so that this user becomes a player
			return gameName;
		}).catch(function gameJoinFail( err ){
			console.log( 'FAILED WITH:',err.message );
			return err;
		});
	};

	// interface
	var _handle = {
		create,
		joinIn,
	}
	return _handle;

}

module.exports = Games;