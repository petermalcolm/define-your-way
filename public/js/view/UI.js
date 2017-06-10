var React = require('react');
var ReactDOM = require('react-dom');
var request = require('ajax-request');
var R = require('ramda');

const RcE = React.createElement;
const dgetID = document.getElementById.bind( document );

const DefineGrid = React.createClass({
	displayName: 'DefineGrid',
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
	displayName: 'DefineDefinition',
	getDefaultProps: function() {
		return { 
			word: '', 
			userChoosesWord: undefined // passed in from DefineWord
		}
	},
	getInitialState: function() {
		return { definition: { friendly: 'Looking it up' }, suggestions : [] }
	},
	shouldComponentUpdate(nextProps, nextState) {
		return 	this.props.word !== nextProps.word || 
				JSON.stringify(this.state.definition) !== JSON.stringify(nextState.definition);
	},
	componentWillUpdate: function(nextProps, nextState){
		this.definitionSource(nextProps);
	},
	definitionSource: function(nextProps){
		request({
			url: 'http://localhost:5411/define/'+nextProps.word, // TODO: make this config!
			method: 'GET'
		}, function gotWord(err, res, body) {
			this.setState({ definition: this.parseResponse(body) });
		}.bind(this));
	},
	parseResponse: function(responseString) {
		var parser = new DOMParser();
		var xmlDoc = parser.parseFromString(responseString,"text/xml");
		var suggestions = xmlDoc.getElementsByTagName("suggestion");
		var xmlDef = xmlDoc.getElementsByTagName("def")[0];
		if( suggestions.length ){
			var newSuggestions = [];
			for (var suggestion of suggestions) {
				newSuggestions.push(suggestion.innerHTML);
			}
			this.setState({ suggestions: newSuggestions });
			return {
				partOfSpeech: '',
				pronunciation: '',
				date: '',
				variations: [],
				friendly: '^^^ Here are some alternatives. Please choose one.'
			};
		} else if( xmlDef ) {
			var variations = xmlDef.getElementsByTagName('dt')
			var newVariations = [];
			for (var variation of variations) {
				newVariations.push(variation.innerHTML);
			}
			this.setState({ suggestions: [] });			
			return {
				partOfSpeech: xinner0(xmlDoc,'fl'),
				pronunciation: xinner0(xmlDoc,'pr'),
				date: xinner0(xmlDoc,'date'),
				variations: newVariations,
				friendly: ''
			};
		} else {
			return {
				partOfSpeech: '',
				pronunciation: '',
				date: '',
				variations: [],
				friendly: 'I got nuthin'
			};
		}
	},
	render: function() {
		return RcE('div',{ className: 'defyw-def', 
						 key: 'defyw-def' },
			RcE(DefineSuggestions, 
				 	{suggestions: this.state.suggestions,
				 	 userChoosesWord: this.props.userChoosesWord }),
			RcE('div',
					{className: 'defyw-def-details',
					 key: 'defyw-def-details'},
					 RcE('p',null,R.pathOr('',['state','definition','partOfSpeech'],this)),
					 RcE('p',null,R.pathOr('',['state','definition','pronunciation'],this)),
					 RcE('p',null,R.pathOr('',['state','definition','date'],this)),
					 RcE('ol',null,
						 R.pathOr([],['state','definition','variations'],this).map(function(val){
						 	return RcE('li',{key:val.hashCode()},val.stripXML());
						 })
					 )
			),
			RcE('p',null, R.pathOr('',['state','definition','friendly'],this))
		);
	}
});

const DefineSuggestions = React.createClass({
	displayName: 'DefineSuggestions',
	getInitialProps: function() {
		return {
			suggestions: [],
			userChoosesWord: undefined
		};
	},
	render: function() {
		return RcE('ul', 
				{className: 'defyw-def-suggestions',
				 key: 'defyw-def-suggestions',
				 onClick: this.props.userChoosesWord }, 
				 this.props.suggestions.map(function(val){
					return RcE('li',{key:val},val) ;
				 })
		);
	}
});

const DefineWord = React.createClass({
	displayName: 'DefineWord',
	getInitialState: function() {
		return {
			word: '...',
		};
	},
	getInitialProps: function() {
		return {
			// userChoosesWord : this.userChoosesWord.bind(this)
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
	userChoosesWord: function(e) {
		console.log( e.target.innerHTML );
		this.setState({word: e.target.innerHTML});
	},
	shouldComponentUpdate(nextProps, nextState){
		return 	this.state.word !== nextState.word;
	},
	componentDidUpdate: function(prevProps,prevState) {

	},
	render: function() {	
		return RcE('div',{ className: 'defyw-word-def', key: 'defyw-word-def' },
			[
				RcE('p',{ className: 'defyw-word', key: 'defyw-word' }, `WORD: ${this.state.word}`),
				RcE(DefineDefinition, { className: 'defyw-def-wrapper',
										key: 'defyw-def-wrapper',
										word: this.state.word,
										userChoosesWord: this.userChoosesWord } ),
				RcE('button',{ className:'defyw-new-word-btn',
							   key: 'defyw-new-word-btn',
							   onClick: this.wordSource }, 
							   'pick a different word' )
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

////////////// HELPERS /////////////////
const xinner0 = function (xmlDoc,tagName) {
	if( xmlDoc.getElementsByTagName(tagName).length ) {
		return xmlDoc.getElementsByTagName(tagName)[0].innerHTML;
	} else {
		return '';
	}
}

String.prototype.hashCode = function(){
	var hash = 0;
	if (this.length == 0) return hash;
	for (var i = 0; i < this.length; i++) {
		char = this.charCodeAt(i);
		hash = ((hash<<5)-hash)+char;
	}
	return hash.toString(16);
}

String.prototype.spanify = function(){ // TODO: something not vulnerable to XSS
	return this.replace(/<(?=[^\/])/ig,"<span class='")
				.replaceAll(">","'>")
				.replace(/<\/([^>]+>)/ig,"</span>");
}

String.prototype.stripXML = function(){
	return this.replace(/<[^>]+>/ig,'');
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};