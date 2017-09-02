const React = require('react');
const ReactDOM = require('react-dom');

const RcE = React.createElement;

const SignInSwitcher = React.createClass({
	displayName: 'SignInSwitcher',
	getInitialState: function() {
		return { kindOfSignIn: document.cookie.indexOf('define-jwt') > -1 ? 'loggedin' : 'login' };
	},
	render: function() {
		return RcE('div',{},
			RcE('form',{
						style: { display: (this.state.kindOfSignIn==='login'?'':'none') }, 
						action: '/login',
						method: 'post' },
				RcE('h2',{},'Log In'),
				RcE('button',{ 
					className: 'defyw-im-new-btn defyw-small-btn',
					onClick: this.userClicksImNew },'Wait, I\'m New Here'),
				RcE('label',{},'Email'),
				RcE('input',{name:'email'}),
				RcE('label',{},'Password'),
				RcE('input',{	type:'password',
								name:'password'}),
				RcE('input',{ type:'submit',
							  value:'Log In'})
			   ),
			RcE('form',{
						style: { display: (this.state.kindOfSignIn==='signup'?'':'none') },
						action: '/signup',
						method: 'post' },
				RcE('h2',{},'Create an Account'),
				RcE('button',{ 
					className: 'defyw-im-old-btn defyw-small-btn defyw-btn',
					onClick: this.userClicksImOld },'Wait, I Already Have an Account'),
				RcE('label',{},'Email'),
				RcE('input',{name:'email'}),
				RcE('label',{},'Name'),
				RcE('input',{name:'name'}),
				RcE('label',{},'Avatar Picture'),
				RcE('input',{name:'avatar'}),
				RcE('label',{},'Password'),
				RcE('input',{	type:'password',
								name:'password'}),
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