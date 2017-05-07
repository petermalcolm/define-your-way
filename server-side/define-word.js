// curl-like promises using axios
var axios = require('axios');

var Definition = function(word = '') {
	var that = this;
	this.word = word;
	this.axiosOptions = {
		method: 'GET',
		urlPrefix: 'http://www.dictionaryapi.com/api/v1/references/collegiate/xml/',
		urlSuffix: '?key=f72d7c46-4995-4b2d-a09d-4eb4e403c030',
		headers: { Accept: 'text/html' }
	};

	this.getDefinition = function( callback ) {
		console.log('getting a definition');
		that.axiosOptions.url = that.axiosOptions.urlPrefix + that.word + that.axiosOptions.urlSuffix;
		axios(that.axiosOptions)
		.then(function (response) {
			console.log('successfully got a definition: ',response.data);
			callback(null,response.data);
		})
		.catch(function (err) {
			console.log('get-definition-for-word failed:');
			console.log(err);
			callback(err,null);
		});
	};
}

module.exports = Definition;