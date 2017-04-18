var React = require('../../../node_modules/react');
var ReactDOM = require('../../../node_modules/react-dom');

const RcE = React.createElement;
const dgetID = document.getElementById.bind( document );

const DefineGrid = React.createClass({
	propTypes: {
		
	},
	getInitialState: function() {
		return null;
	},
	addCell: function() {

	},
	render: function() {	
		return RcE('div',{ className: 'defyw-grid'} , 'grid' /* no real child-el's for now... */);
	}
});

const DefineWord = React.createClass({
	getInitialState: function() {
		return null;
	},
	render: function() {	
		return RcE('div',{ className: 'defyw-grid'} /* no child-el's for now... */);
	}	
});

ReactDOM.render(
	RcE('div', { id: 'defyw' }, 
		RcE('h3', { id: 'defyw-title' }, 'Define Your Way'),
		RcE('div', { id: 'defyw-intro'}, 'Introductory info here ... ' ),
		RcE(DefineGrid, {} ),
		RcE('p', { id: 'defyw-word' }, 'WORD' )
	),
	dgetID('root')
);    

/////////////////////
// class Hello extends React.Component {
//   render() {
//     return React.createElement('div', null, `Hello ${this.props.toWhat}`);
//   }
// }

// ReactDOM.render(
//   RcE(Hello, {toWhat: 'World'}, null),
//   dgetID('hello')
// );