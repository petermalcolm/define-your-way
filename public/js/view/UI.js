var React = require('../../../node_modules/react');
var ReactDOM = require('../../../node_modules/react-dom');

const RcE = React.createElement;
const dgetID = document.getElementById.bind( document );

ReactDOM.render(
  RcE('div', null, 'Hello World, indeed! This is really React'),
  dgetID('root')
);    
