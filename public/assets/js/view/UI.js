const React = require('react');
const ReactDOM = require('react-dom');
const { createStore } = require('redux');
const YourName = require('./YourName');
const YourFriends = require('./YourFriends');
const YourGame = require('./YourGame');
const YourGrid = require('./YourGrid');
const DefineWord = require('./DefineWord');

const RcE = React.createElement;
const dgetID = document.getElementById.bind( document );
// let store = createStore( /* reducer */ );
let store = {};

ReactDOM.render(
	RcE('div', { id: 'defyw', store }, 
		RcE('h3', { id: 'defyw-title' }, 'Define Your Way'),
		RcE('div', { id: 'defyw-intro'}, 'Introductory info here ... ' ),
		RcE(YourName, {} ),
		RcE(YourGame, {} ),
		RcE(YourFriends, {} ),
		RcE(YourGrid, {} ),
		RcE(DefineWord, {} ) 
	),
	dgetID('root')
);