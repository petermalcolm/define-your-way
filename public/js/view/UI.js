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
		return RcE('div',{ className: 'defyw-grid', key: 'defyw-grid'} , 'grid' /* no real child-el's for now... */);
	}
});

/** DefineDefinition
 * NOT A
 * Stateless Component — Only props, no state. There's not much going on besides the render() function and all their logic revolves around the props they receive.
 */
const DefineDefinition = React.createClass({
	getDefaultProps: function() {
		return { word: '' }
	},
	getInitialState: function() {
		return { definition: '.....', suggestions : [] }
	},
	componentWillUpdate: function(){
		this.definitionSource(this.props);
	},
	definitionSource: function(props){
		props = props || this.props;
		request({
			url: 'http://localhost:5411/define/'+this.props.word, // TODO: make this config!
			method: 'GET'
		}, function gotWord(err, res, body) {
			this.setState({ definition: this.parseResponse(body) });
		}.bind(this));
	},
	parseResponse: function(responseString) {
		var parser = new DOMParser();
		var xmlDoc = parser.parseFromString(responseString,"text/xml");
		var suggestions = xmlDoc.getElementsByTagName("suggestion");
		var xmlDef = xmlDoc.getElementsByTagName("def");
		if( suggestions.length ){
			var newSuggestions = [];
			for (var suggestion of suggestions) {
				newSuggestions.push(suggestion);
			}
			this.setState({ suggestions: newSuggestions });
			return 'Did you mean ' + suggestions[0].innerHTML + '?';
		} else if( xmlDef.length ) {
			this.setState({ definition: xmlDef.innerHTML });
		}
	},
	render: function() {
		return RcE('p',{ className: 'defyw-def', 
						 key: 'defyw-def', 
						 children: React.createElement(DefineSuggestions, 
						 	{className: 'defyw-def-suggestions',
						 	 key: 'defyw-def-suggestions',
						 	 suggestions: this.state.suggestions})},
			`${this.state.definition}`
		);
	}
});

const DefineSuggestions = React.createClass({
	render: function() {
		return 'Or: ' + this.props.suggestions.join(', ');
	}
});

const DefineWord = React.createClass({
	getInitialState: function() {
		return { word: '...',
				};
	},
	componentWillMount: function(){
		this.wordSource();
	},
	wordSource: function(props){
		props = props || this.props;
		request({
			url: 'http://localhost:5411/word', // TODO: make this config!
			method: 'GET'
		}, function gotWord(err, res, body) {
			this.setState({ word: body });
		}.bind(this));
	},
	componentDidUpdate: function(prevProps,prevState) {

	},
	render: function() {	
		return RcE('div',{ className: 'defyw-word-def', key: 'defyw-word-def' },
			[
				RcE('p',{ className: 'defyw-word', key: 'defyw-word' }, `WORD: ${this.state.word}`),
				RcE(DefineDefinition, { className: 'defyw-def-wrapper',
										key: 'defyw-def-wrapper',
										word: this.state.word } )
			]
		);
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