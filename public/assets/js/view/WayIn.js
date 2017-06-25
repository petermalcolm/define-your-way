const React = require('react');
const ReactDOM = require('react-dom');
const request = require('ajax-request');

const RcE = React.createElement;
const dgetID = document.getElementById.bind( document );

const WayIn = React.createClass({
	displayName: 'WayIn',
	getInitialState: function() {
		return { gameSlug: '#' };
	},
	getInitialProps: function() {
		return {
			wayInKey : 'default',
			showMessage : 'Start or Join',
			goMessage : 'Go! ->',
			showing : false,
			userSwitchesStartMode : undefined
		};
	},
	render: function() {
		// const { wayInKey, showMessage, goMessage } = this.props; 
		return RcE('form',{ className: 'defyw-way-in', key: 'defyw-way-in' },
			[
				RcE('button',{ className:'defyw-way-in-'+this.props.wayInKey+'-show-btn',
							   key: 'defyw-way-in-'+this.props.wayInKey+'-show-btn',
							   onClick: this.userSwitchesStartMode
							 }, 
							   this.props.showMessage ),
				RcE('input',{  className:'defyw-way-in-'+this.props.wayInKey+'-slug',
							   key: 'defyw-way-in-'+this.props.wayInKey+'-slug',
							   id: 'defyw-way-in-'+this.props.wayInKey+'-slug',
							   type: 'text',
							   style: { display: (this.props.showing?'':'none') },
							   onChange: this.userTypesSlug 
							}),
				RcE('a',{  className:'defyw-way-in-'+this.props.wayInKey+'-go-link',
						   key: 'defyw-way-in-'+this.props.wayInKey+'-go-link',
						   id: 'defyw-way-in-'+this.props.wayInKey+'-go-link',
						   href: '/game/' + this.state.gameSlug + '/',
						   style: { display: (this.props.showing?'':'none') } 
						}, 
						this.props.goMessage )
			]
		);
	},
	componentDidUpdate: function() {
		if(this.props.showing){
			dgetID('defyw-way-in-'+this.props.wayInKey+'-slug').focus();
		}
	},
	userSwitchesStartMode: function(e) {
		e.preventDefault();
		this.props.userSwitchesStartMode( this.props.wayInKey );
	},
	userTypesSlug: function(e) {
		// TODO: sanitize - live errors if bad (ajax to see if game exists is on-clicking Go!)
		this.setState({ gameSlug: e.target.value })
	}
});

module.exports = WayIn;
