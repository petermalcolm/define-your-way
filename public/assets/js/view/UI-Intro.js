const React = require('react');
const ReactDOM = require('react-dom');

const RcE = React.createElement;
const dgetID = document.getElementById.bind( document );

ReactDOM.render(
	RcE('div', { id: 'defyw' }, 
		RcE('h1', { id: 'defyw-title' }, 'Define Your Way'),
		RcE('div', { id: 'defyw-intro'}, 'Introductory info here ... ' ),
		RcE('h2', { id: 'defyw-new'}, 'Create a New Game' ),
		RcE('h2', { id: 'defyw-or'}, '- OR -' ),
		RcE('h2', { id: 'defyw-old'}, 'Join an Existing One' )
	),
	dgetID('root')
);