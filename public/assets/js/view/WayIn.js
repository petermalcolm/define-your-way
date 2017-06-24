const React = require('react');
const ReactDOM = require('react-dom');
const request = require('ajax-request');
const RcE = React.createElement;

const WayIn = React.createClass({
	displayName: 'WayIn',
	getInitialProps: function() {
		return {
			wayInKey : 'default',
			showMessage : 'Start or Join',
			goMessage : 'Go! ->'
		};
	},
	render: function() {
		const { wayInKey, showMessage, goMessage } = this.props; 
		return RcE('form',{ className: 'defyw-way-in', key: 'defyw-way-in' },
			[
				RcE('button',{ className:'defyw-way-in-'+this.props.wayInKey+'-show-btn',
							   key: 'defyw-way-in-'+this.props.wayInKey+'-show-btn',
							   onClick: this.showSlugField }, 
							   this.props.showMessage ),
				RcE('input',{  className:'defyw-way-in-'+this.props.wayInKey+'-slug',
							   key: 'defyw-way-in-'+this.props.wayInKey+'-slug',
							   id: 'defyw-way-in-'+this.props.wayInKey+'-slug',
							   type: 'text',
							   style: { display:'none' } }),
				RcE('button',{ className:'defyw-way-in-'+this.props.wayInKey+'-go-btn',
							   key: 'defyw-way-in-'+this.props.wayInKey+'-go-btn',
							   id: 'defyw-way-in-'+this.props.wayInKey+'-go-btn',
							   style: { display:'none' },
							   onClick: this.showSlugField }, 
							   this.props.goMessage )
			]
		);
	},
	showSlugField: function(e) { // this a very jQuery way - TODO: make it Reactive!
		e.preventDefault();
		var slugField = document.getElementById('defyw-way-in-'+this.props.wayInKey+'-slug');
		slugField.style.display = '';
		slugField.focus();
		var goField = document.getElementById('defyw-way-in-'+this.props.wayInKey+'-go-btn');
		goField.style.display = '';
	}
});

module.exports = WayIn;
