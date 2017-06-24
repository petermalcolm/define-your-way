const React = require('react');
const ReactDOM = require('react-dom');
const WayIn = require('./WayIn');

const RcE = React.createElement;
const dgetID = document.getElementById.bind( document );

ReactDOM.render(
	RcE('div', { id: 'defyw' }, 
		RcE('h1', { id: 'defyw-title' }, 'Define Your Way'),
		RcE('div', { id: 'defyw-intro'}, 'Introductory info here ... ' ),
		RcE(WayIn, { 	id: 'defyw-new',
						wayInKey : 'new',
						showMessage : 'Create a New Game',
						goMessage : 'Go!' } ),
		RcE('h2', { id: 'defyw-or'}, '- OR -' ),
		RcE(WayIn, { 	id: 'defyw-old',
						wayInKey : 'old',
						showMessage : 'Join an Existing One',
						goMessage : 'Go!' } )
	),
	dgetID('root')
);