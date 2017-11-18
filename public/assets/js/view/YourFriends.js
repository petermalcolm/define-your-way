/**
 * Relies heavily on websockets to communicate with other people
 */
const React = require('react');
const ReactDOM = require('react-dom');
const RcE = React.createElement;
const dgetID = document.getElementById.bind( document );

const YourFriends = React.createClass({
	displayName: 'YourFriends',
	getInitialState: function() {
		return {
			connection: {},
		};
	},
	componentWillMount: function(){
		var nickname = prompt("Choose a nickname");
		if (nickname) {
			var connection = new WebSocket("ws://localhost:5123"); // TODO: configure this!
			connection.onopen = function () {
				console.log("Connection opened");
				connection.send(nickname);
			}
			connection.onclose = function () {
				console.log("Connection closed")
			}
			connection.onerror = function () {
				console.error("Connection error")
			}
			connection.onmessage = function (event) {
				var div = document.createElement("div")
				div.textContent = event.data
				dgetID('defyw-friends-chat').appendChild(div)
			}
			this.setState({ connection });
		}
	},
	render: function() {
		// <form id="form">
		// Message: <input size="50" id="msg"> <input type="submit" value="Submit">
		// </form>
		return RcE('div',
			{ className: 'defyw-friends', key: 'defyw-friends'}, 
			RcE('form',
				{ id: 'defyw-friends-form', key: 'defyw-friends-form', onSubmit: this.shoutItOut },
				RcE('input',{ type: 'text', size: '50', id: 'defyw-friends-msg' }
				),
				RcE('input',{ type: 'submit', value: 'Submit', id: 'defyw-friends-form-submit' }
				)
			),
			RcE('div',
				{ id: 'defyw-friends-chat', key: 'defyw-friends-chat' }
			)
		);
	},
	shoutItOut: function(e) {
		var msg = dgetID('defyw-friends-msg');
		if (msg.value) {
			this.state.connection.send(msg.value);
		}
		msg.value = "";
		e.preventDefault();
	}
});

module.exports = YourFriends;