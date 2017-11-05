const Games = function(db) {
	const that = this;
	this.dbPrefix = 'game-';
	// create a game
	// return a Promise
	const create = function(gameName,userEmail) {
		gameName = gameName.replace(/[^\w-]/g,''); // can never sanitize too much
		return db.get(that.dbPrefix+gameName).then(
		function alreadyExists (data) {
			var alreadyThereErr = new Error('Game already exists');
			alreadyThereErr.type = 'GameExistsError';
			return alreadyThereErr;
		}).catch(
		function createIt( err ) {
			console.log( 'Creating game',gameName,'- good news',err,'trying to find it in DB.');
			return db.put(that.dbPrefix+gameName,JSON.stringify({
				name: gameName,
				players: [userEmail],
				turns: []
			}));
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
					return sadErr;					
				}
			}
			// TODO: modify game so that this user becomes a player
			return gameName;
		}).catch(
		function gameJoinFail( err ){
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