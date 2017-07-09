const React = require('react');
const ReactDOM = require('react-dom');
const WayIn = require('./WayIn');

const RcE = React.createElement;

const WayInSwitcher = React.createClass({
	getInitialState: function() {
		return { kindOfGame: 'neither',
				 showing: false
				};
	},
	displayName: 'WayInSwitcher',
	render: function() {
		if( !this.state.showing ) {
			return RcE('div',{}, 'Please sign in.' );
		}
		return RcE('div',{},
			RcE(WayIn, { 	id: 'defyw-new',
							wayInKey : 'new',
							showMessage : 'Create a New Game',
							goMessage : 'Go! ->',
							showing : (this.state.kindOfGame === 'new' ),
							userSwitchesStartMode : this.userSwitchesStartMode } ),
			RcE('h2', { id: 'defyw-or'}, '- OR -' ),
			RcE(WayIn, { 	id: 'defyw-old',
							wayInKey : 'old',
							showMessage : 'Join an Existing One',
							goMessage : 'Go! ->',
							showing : (this.state.kindOfGame === 'old' ),
							userSwitchesStartMode : this.userSwitchesStartMode } )
		);
	},
	userSwitchesStartMode: function(newMode) {
		console.log(newMode,'game');
		this.setState({kindOfGame : newMode});
	}
});

module.exports = WayInSwitcher;
