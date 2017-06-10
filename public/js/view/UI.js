const React = require('react');
const ReactDOM = require('react-dom');
const YourGrid = require('./YourGrid');
const DefineWord = require('./DefineWord');

const RcE = React.createElement;
const dgetID = document.getElementById.bind( document );

ReactDOM.render(
	RcE('div', { id: 'defyw' }, 
		RcE('h3', { id: 'defyw-title' }, 'Define Your Way'),
		RcE('div', { id: 'defyw-intro'}, 'Introductory info here ... ' ),
		RcE(YourGrid, {} ),
		RcE(DefineWord, {} ) 
	),
	dgetID('root')
);