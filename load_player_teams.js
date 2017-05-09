var mongo = require('mongodb')
var assert = require('assert')
const url = 'mongodb://localhost:27017/200'
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
			price :arr[2],
			wickets : 0,
			balls_delivered : 0,
			runs_conceded : 0,
			runs_scored : 0,
			balls_played : 0
		}
		insert_in_db('Player', item)
	}
});

lineReader.eachLine('matches.txt', function(line, last) {
	var arr = line.split(":")
	item = {
		match_id : Number(arr[0]),
		detail : arr[1],
		date : arr[2],
		Result : 'not played yet',
		points : 0,
		last_bought : -1,
		team_last_match : 0
	}
	insert_in_db('Matches', item)
});