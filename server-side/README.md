# Define Your Way - Data structure

If you are digging into this directory, you are probably a developer.  Welcome!
Here is the underlying data JSON data structure for a Define Your Way game:
```
{
	"name": "sample-game",
	"players": ["player0", "player1", "player2"],
	"turns": [{
		"word": "bereft",
		"definitions": [{
			"owner": "player0",
			"definition": "deprived of or lacking something",
			"fromDictionary": true
		}, {
			"owner": "player1",
			"definition": "being somewhere between 'left' and 'right'",
			"fromDictionary": false
		}, {
			"owner": "player2",
			"definition": "brief",
			"fromDictionary": false
		}],
		"votes": [{
			"owner": "player0",
			"creative": "player1",
			"accurate": "player2"
		}, {
			"owner": "player1",
			"creative": "player2",
			"accurate": "player0"
		}, {
			"owner": "player2",
			"creative": "player0",
			"accurate": "player1"
		}]
	}]
}
```