const React = require('react');
const ReactDOM = require('react-dom');
const RcE = React.createElement;

const YourName = React.createClass({
	displayName: 'YourName',
	render: function() {
		if(document.cookie.indexOf('define-jwt') > -1){
			const userName = this.readMyField('define-jwt','name');
			const userAvatar = this.readMyField('define-jwt','avatar');
			return RcE('div',{className:'defyw-your-user',className:'defyw-your-user'},
				RcE('div',{ className: 'defyw-your-name', key: 'defyw-your-name'} , 'Hi, ' + userName ),
				RcE('img',{ className: 'defyw-your-avatar', key: 'defyw-your-avatar', src: userAvatar } ),
				RcE('button',{ className: 'defyw-sign-out', className: 'defyw-sign-out', onClick: this.userSignsOut}, 'Sign Out' )
				);
		} else {
			return RcE('div',{ className: 'defyw-your-name', key: 'defyw-your-name'} , '' );
		}
	},
	readMyField: function(cookieName,fieldName) {
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
	    if( !payParsed.data || !payParsed.data[fieldName] ) {
	    	return errMsg;
	    } else {
			return payParsed.data[fieldName];
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
	},
	userSignsOut: function(e) {
		document.cookie = 'define-jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
		window.location.href = '/';
	}
});

module.exports = YourName;