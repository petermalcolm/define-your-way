# Define Your Way - Data structure

If you are digging into this directory, you are probably a developer.  Welcome!
Here is the underlying data JSON data structure for a Define Your Way game:
```
{
	"name": "sample-game",
	"players": ["player0@example.com", "player1@example.com", "player2@example.com"],
	"turns": [{
		"word": "bereft",
		"definitions": [{
			"owner": "player0@example.com",
			"definition": "deprived of or lacking something",
			"fromDictionary": true
		}, {
			"owner": "player1@example.com",
			"definition": "being somewhere between 'left' and 'right'",
			"fromDictionary": false
		}, {
			"owner": "player2@example.com",
			"definition": "brief",
			"fromDictionary": false
		}],
		"votes": [{
			"owner": "player0@example.com",
			"creative": "player1@example.com",
			"accurate": "player2@example.com"
		}, {
			"owner": "player1@example.com",
			"creative": "player2@example.com",
			"accurate": "player0@example.com"
		}, {
			"owner": "player2@example.com",
			"creative": "player0@example.com",
			"accurate": "player1@example.com"
		}]
	}]
}
```

And here is the data structure for a user:
```
{
	"name": "Example Person",
	"email": "person@example.com",
	"password": "hashOfPassword",
	"avatar" : "https://example.com/avatar.png"
	"permissions": "play" | "admin"
}
```