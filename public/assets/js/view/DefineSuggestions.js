const React = require('react');
const ReactDOM = require('react-dom');
const RcE = React.createElement;

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

module.exports = DefineSuggestions;