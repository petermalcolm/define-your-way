const React = require('react');
const ReactDOM = require('react-dom');
const request = require('ajax-request');
const R = require('ramda');
const DefineSuggestions = require('./DefineSuggestions');
const RcE = React.createElement;

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

module.exports = DefineDefinition;