var React = require('../../../node_modules/react');
var ReactDOM = require('../../../node_modules/react-dom');

const RcE = React.createElement;

ReactDOM.render(
  RcE('div', null, 'Hello World, indeed! This is React'),
  document.getElementById('root')
);    
