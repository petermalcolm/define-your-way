const React = require('react');
const ReactDOM = require('react-dom');
const RcE = React.createElement;

const YourGrid = React.createClass({
	displayName: 'YourGrid',
	propTypes: {
		
	},
	getInitialState: function() {
		return null;
	},
	addCell: function() {

	},
	render: function() {	
		return RcE('div',{ className: 'defyw-grid', key: 'defyw-grid'} , 'grid' /* no real child-el's for now... */);
	}
});

module.exports = YourGrid;