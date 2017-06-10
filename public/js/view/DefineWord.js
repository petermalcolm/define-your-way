const React = require('react');
const ReactDOM = require('react-dom');
const request = require('ajax-request');
const DefineDefinition = require('./DefineDefinition');
const RcE = React.createElement;


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

module.exports = DefineWord;
