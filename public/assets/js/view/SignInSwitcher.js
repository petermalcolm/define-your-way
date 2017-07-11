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
			RcE('form',{
						style: { display: (this.state.kindOfSignIn==='login'?'':'none') } },
				RcE('h2',{},'Log In'),
				RcE('button',{ 
					className: 'defyw-im-new-btn defyw-small-btn',
					onClick: this.userClicksImNew },'I\'m New Here'),
				RcE('label',{},'Email'),
				RcE('input'),
				RcE('label',{},'Password'),
				RcE('input'),
				RcE('button',{},'Log In')
			   ),
			RcE('form',{
						style: { display: (this.state.kindOfSignIn==='signup'?'':'none') } },
				RcE('h2',{},'Create an Account'),
				RcE('button',{ 
					className: 'defyw-im-old-btn defyw-small-btn defyw-btn',
					onClick: this.userClicksImOld },'I Already Have an Account'),
				RcE('label',{},'Email'),
				RcE('input'),
				RcE('label',{},'Name'),
				RcE('input'),
				RcE('label',{},'Password'),
				RcE('input'),
				RcE('button',{},'Create an Account')
			   )
		);
	},
	userClicksImNew: function(e) {
		e.preventDefault();
		this.setState( { kindOfSignIn:'signup' } );
	},
	userClicksImOld: function(e) {
		e.preventDefault();
		this.setState( { kindOfSignIn:'login' } );
	}
});

module.exports = SignInSwitcher;