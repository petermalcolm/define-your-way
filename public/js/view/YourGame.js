const React = require('react');
const ReactDOM = require('react-dom');
const RcE = React.createElement;

const YourGame = React.createClass({
	displayName: 'YourGame',
	render: function() {
		if(location.href.match(/game/)){
			return RcE('div',{ className: 'defyw-game', key: 'defyw-game'} , 'in a game' );
		} else {
			return RcE('div',{ className: 'defyw-game', key: 'defyw-game'} , 'not in a game' );
		}
	}
});

module.exports = YourGame;