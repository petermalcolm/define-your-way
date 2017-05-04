var React = require('../../../node_modules/react');
var ReactDOM = require('../../../node_modules/react-dom');
var request = require('ajax-request');

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
		return { word: 'WORRD' };
	},
	componentWillMount: function(){
		this.dataSource();
	},
	dataSource: function(props){
		props = props || this.props;
		request({
			url: 'http://localhost:5411/word', // TODO: make this config!
			method: 'GET'
		}, function gotWord(err, res, body) {
			this.setState({ word: body });
		}.bind(this));
		// return $.ajax({
		// 	type: "get",
		// 	dataType: 'json',
		// 	url: '/products?page=' + props.page + "&pageSize=" + props.pageSize
		// }).done(function(result){
		// 	this.setState({ data: result });
		// }.bind(this));

	},
	render: function() {	
		return RcE('div',{ className: 'defyw-word'},  `WORD: ${this.state.word}`);
	}	
});

ReactDOM.render(
	RcE('div', { id: 'defyw' }, 
		RcE('h3', { id: 'defyw-title' }, 'Define Your Way'),
		RcE('div', { id: 'defyw-intro'}, 'Introductory info here ... ' ),
		RcE(DefineGrid, {} ),
		RcE(DefineWord, {} ) 
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