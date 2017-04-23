var mongo = require('mongodb')
var assert = require('assert')
const url = 'mongodb://localhost:27017/the-fantasy-league'
const lineReader = require('line-reader');


function insert_in_db(coll, item) {
	mongo.connect(url, function(err, db) {
		assert.equal(null, err)
		db.collection(coll).insertOne(item, function() {
			assert.equal(null, err)
			db.close()
		})
	});
}


lineReader.eachLine('player-teams.txt', function(line, last) {
	var arr = line.split(":")
	if(arr[0] == 'Team ') {
		team = arr[1]
	} else if(arr[0] == 'player ') {
		var item = {
			Team : team,
			player : arr[1]
		}
		insert_in_db('Team-Player', item)
		item = {
			player : arr[1],
			price :arr[2]
		}
		insert_in_db('Player', item)
	}
});