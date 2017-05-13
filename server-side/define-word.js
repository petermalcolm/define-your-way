// curl-like promises using axios
var axios = require('axios');

var Definition = function(db, word = '') {
	var that = this;
	this.db = db;
	this.dbPrefix = 'define-';
	this.word = word;
	this.callback = null;
	this.axiosOptions = {
		method: 'GET',
		urlPrefix: 'http://www.dictionaryapi.com/api/v1/references/collegiate/xml/',
		urlSuffix: '?key=f72d7c46-4995-4b2d-a09d-4eb4e403c030',
		headers: { Accept: 'text/html' }
	};

	this.getDefinition = function( callback ) {
		console.log('getting a definition');
		that.callback = callback;
		that.getDefinitionByDb();
	};

	this.getDefinitionByDb = function() {
		that.db.get( that.dbPrefix + that.word, function(err,data) {
			if(err) {
				that.getDefinitionByApi();
			} else {
				console.log('found definition in local db: ',data);
				that.callback(null,data);
			}
		});
	};

	this.getDefinitionByApi = function() {
		that.axiosOptions.url = that.axiosOptions.urlPrefix + that.word + that.axiosOptions.urlSuffix;
		axios(that.axiosOptions)
		.then(function (response) {
			console.log('successfully got a definition: ',response.data);
			that.db.put( that.dbPrefix + that.word, response.data );
			that.callback(null,response.data);
		})
		.catch(function (err) {
			console.log('get-definition-for-word failed:');
			console.log(err);
			that.callback(err,null);
		});

	}
}

module.exports = Definition;