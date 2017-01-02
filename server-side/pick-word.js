// better, curl-like promises using axios
var axios = require('axios');

var Picker = function(demo) {
	// this.demo = demo;
	// this.printDemo = function() {
	// 	console.log('demo: ' + this.demo);
	// }

	// TODO:
	// require curl
	// make an curl call to: http://www.setgetgo.com/randomword/get.php
	// look up the word here:
	//  http://www.dictionaryapi.com/api/v1/references/collegiate/xml/longimetry?key=f72d7c46-4995-4b2d-a09d-4eb4e403c030
	// extract the definition
	// ... or, if there is no definition, choose the first alternative, look that up
	// Display the definition of the word to the user

	this.getWord = function() {
		console.log('What is axios?',axios);
	}

};

module.exports = Picker;