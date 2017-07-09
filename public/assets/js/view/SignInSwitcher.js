const React = require('react');
const ReactDOM = require('react-dom');

const RcE = React.createElement;

const SignInSwitcher = React.createClass({
	displayName: 'SignInSwitcher',
	getInitialState: function() {
		return { kindOfSignIn: 'login' };
	},
	render: function() {
		return RcE('div',{},
			RcE('form',{},
				RcE('h2',{},'Log In'),
				RcE('button',{ onClick: this.userClicksImNew },'I\'m New to This'),
				RcE('input')
			   ),
			RcE('form',{},RcE('h2',{},'Create An Account'),
				RcE('input'))
		);
	},
	userClicksImNew: function(e) {
		e.preventDefault();
	}
});

module.exports = SignInSwitcher;