const React = require('react');
const ReactDOM = require('react-dom');
const WayInSwitcher = require('./WayInSwitcher');

const RcE = React.createElement;
const dgetID = document.getElementById.bind( document );

ReactDOM.render(
	RcE('div', { id: 'defyw' }, 
		RcE('h1', { id: 'defyw-title' }, 'Define Your Way'),
		RcE('div', { id: 'defyw-intro'}, 'Introductory info here ... ' ),
		RcE(WayInSwitcher, { id: 'defyw-switcher',
							 key: 'defyw-switcher' }
		)
	),
	dgetID('root')
);