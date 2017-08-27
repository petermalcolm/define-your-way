const React = require('react');
const ReactDOM = require('react-dom');
const RcE = React.createElement;

const YourName = React.createClass({
	displayName: 'YourName',
	render: function() {
		if(document.cookie.indexOf('define-jwt') > -1){
			const userName = this.readMyName('define-jwt');
			return RcE('div',{ className: 'defyw-your-name', key: 'defyw-your-name'} , 'Hi, ' + userName );
		} else {
			return RcE('div',{ className: 'defyw-your-name', key: 'defyw-your-name'} , '' );
		}
	},
	readMyName: function(cookieName) {
		const cookie = this.readCookie(cookieName);
		const errMsg = 'there was an error identifying you...'
		if( null===cookie ){
			return errMsg;
		}
		const payload = cookie.split('.');
		if( 3!==payload.length ) {
			return errMsg;
		} 
		const payDecode = this.base64Decode(payload[1]);
		var payParsed = {};
		try {
	        payParsed = JSON.parse(payDecode);
	    } catch(e) {
			return errMsg;
	    }
	    if( !payParsed.data || !payParsed.data.name ) {
	    	return errMsg;
	    } else {
			return payParsed.data.name;
		}
	},
	base64Decode: function(str) {
	    return decodeURIComponent(atob(str).split('').map(function(c) {
	        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
	    }).join(''));
	},
	readCookie: function(name) {
		const nameEQ = name + "=";
		const ca = document.cookie.split(';');
		for(var i=0;i < ca.length;i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1,c.length);
			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
		}
		return null;
	}
});

module.exports = YourName;