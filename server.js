const PORT = 12000
const fs = require('fs')
const http = require('http')
const jade = require('jade')
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


function find_one_in_db(coll, item, callback) {
	mongo.connect(url, function(err, db) {
		assert.equal(null, err)
		db.collection(coll).findOne(item, function(err, doc) {
			assert.equal(null, err)
			db.close()
			callback(doc)
		})
	});
}

function find_all_in_db(coll, item, srt, callback1, callback2) {
	mongo.connect(url, function(err, db) {
		assert.equal(null, err)
		console.log(srt)
		var cursor = db.collection(coll).find(item)
		cursor.sort(srt)
		cursor.forEach(function(doc, err) {
			assert.equal(null, err)
			callback1(doc)
		}, function() {
			db.close()
			callback2()
		})		
	});	
}

function remove_from_db(coll, item) {
	mongo.connect(url, function(err, db) {
		assert.equal(null, err)
		db.collection(coll).remove(item, function(err, result) {
			assert.equal(null, err)
			db.close()
  		});
	});
}

function modify_in_db(coll, query, change) {
	mongo.connect(url, function(err, db) {
		assert.equal(null, err)
		db.collection(coll).findAndModify(query, [], change, {'new':'true'}, function(err, object) {
			assert.equal(null, err)
			db.close()
  		});
	});
}
function create_player(name, price) {
	this.name = name
	this.price = price
}

function create_team(name) {
	this.name = name
	this.players = []
}

function find_in_teams(ls, s) {
	for(i = 0; i < ls.length; i++) {
		if(ls[i].name == s)
			return i
	}
	return -1
}

function find_player_in_teams(ls, s) {
	for(i = 0; i < ls.length; i++) {
		for(j = 0; j < ls[i].players.length; j++) {
			if(ls[i].players[j].name == s)
				return ls[i].players[j]
		}
	}
	return null
}
teams = []
function populate_teams() {
	mongo.connect(url, function(err, db) {
		assert.equal(null, err)
		var cursor = db.collection('Team-Player').find();
		cursor.forEach(function(doc, err) {
			assert.equal(null, err)
			team = doc.Team
			player = doc.player
			index = find_in_teams(teams, team)
			if(index < 0) {
				teams.push(new create_team(team))
				index = teams.length - 1
			}
			item = {
				player : player
			}
			function temp(i, doc) {
				teams[i].players.push(new create_player(doc.player, doc.price))
			}
			partial = temp.bind(null, index)
			find_one_in_db('Player', item, partial)
		}, function() {
			db.close()
		})
	});	
}
function dbg_stats(p, rs, bp, rc, bd, w) {
	console.log('set player ' + p + ' runsS to ' + rs + ' ballP to ' + bp + ' runsC to ' + rc + ' ballD to ' + bd + ' wicks to ' + w)
}
function get_points(RS, BP, RC, BD, W) {
	return RS * (RS/BP) - RC * (RC/(2*BD)) + 15 * W
}
// function update_stats_users() {
// 	find_all_in_db('User', {}, {},  function(doc) {
// 		item = {
// 			user : doc.handle
// 		}
// 		points = 0
// 		find_all_in_db('User-Player', item, srt,  function(doc) {
// 			new_item = {
// 				player : doc.player
// 			}
// 			find_one_in_db('Player', new_item, function(doc) {
// 				points += doc.points
// 			})
// 		}, function() {})	
// 	}, function() {
// 		change = {$inc : {points : points}}
// 		modify_in_db('Player', item, change)		
// 	})	
// }

function update_stats_player(data) {
	for(i = 0; i < data.length; i++) {
		info = data[i].split(':')
		item = {
			player : info[0]
		}
		change = {$inc: {runs_scored : Number(info[1])}}
		modify_in_db('Player', item, change)	
		change = {$inc: {balls_played : Number(info[2])}}
		modify_in_db('Player', item, change)
		change = {$inc: {runs_conceded : Number(info[3])}}
		modify_in_db('Player', item, change)
		change = {$inc: {balls_delivered : Number(info[4])}}
		modify_in_db('Player', item, change)
		change = {$inc: {wickets : Number(info[5])}}
		modify_in_db('Player', item, change)
		p = get_points(Number(info[1]), Number(info[2]), Number(info[3]), Number(info[4]), Number(info[5]))
		change = {$inc : {points : p}}
		modify_in_db('Player', item, change)
	}
}

populate_teams()

const server = http.createServer((request, response) => {
    if (request.url === '/login.js') {
        fs.readFile('login.js', 'utf-8', (err, data) => response.end(data))
    } else if(request.url === '/view_info.js') {
        fs.readFile('view_info.js', 'utf-8', (err, data) => response.end(data))    	
    } else if (request.url === '/buying_portal.js') {
        fs.readFile('buying_portal.js', 'utf-8', (err, data) => response.end(data))
    } else if (request.url === '/selling_portal.js') {
        fs.readFile('selling_portal.js', 'utf-8', (err, data) => response.end(data))
    } else if (request.url === '/player_info.js') {
        fs.readFile('player_info.js', 'utf-8', (err, data) => response.end(data))
    } else if (request.url === '/fixtures_and_results.js') {
        fs.readFile('fixtures_and_results.js', 'utf-8', (err, data) => response.end(data))
    } else if (request.url === '/points_table.js') {
        fs.readFile('points_table.js', 'utf-8', (err, data) => response.end(data))    	 
	} else if(request.url === '/view_info.jade') {
        fs.readFile('view_info.jade', 'utf-8', (err, data) => {
            response.end(jade.compile(data)())
        })    	
    } else if(request.url === '/buying_portal.jade') {
        fs.readFile('buying_portal.jade', 'utf-8', (err, data) => {
            response.end(jade.compile(data)())
        })
    } else if(request.url === '/selling_portal.jade') {
        fs.readFile('selling_portal.jade', 'utf-8', (err, data) => {
            response.end(jade.compile(data)())
        })
    } else if(request.url.substring(0, 13) === '/player_info_') {
        fs.readFile('player_info.jade', 'utf-8', (err, data) => {
            response.end(jade.compile(data)())		
		})
    } else if(request.url === '/fixtures_and_results.jade') {
    	console.log('Sent fixtures_and_results')
        fs.readFile('fixtures_and_results.jade', 'utf-8', (err, data) => {
            response.end(jade.compile(data)())
        })
    } else if(request.url === '/points_table.jade') {
    	console.log('Sent points_table')
        fs.readFile('points_table.jade', 'utf-8', (err, data) => {
            response.end(jade.compile(data)())
        })
    } else if(request.url === '/favicon.ico') {}
    else {
        fs.readFile('login.jade', 'utf-8', (err, data) => {
            response.end(jade.compile(data)())
        })
    }
})

const io = require('socket.io')(server)
server.listen(PORT, () => {
	console.log("Server listening on ", PORT)
})
user_list = {}
io.sockets.on('connection', socket => {

	socket.on('player_match_data', function (data) {
		update_stats_player(data)
	});
	socket.on('data_parser_connecting', function (data) {
		data = ''
		item = {}
		srt = {
			'match_id' : 1
		}
		find_all_in_db('Matches', item, srt,  function(doc) {
			data += doc.match_id + '@' + doc.date + '\n'
		}, function() {
    		socket.emit('sending_match_data', data)
		})	
	});

	socket.on('sign_in', data => {
		arr = data.split(',')
		var item = {
			handle : arr[0],
			password : arr[1],
		}
		find_one_in_db('User', item, function(user) {
			if(user === null) {
				socket.emit('redirect', '/-')	
			} else {	
				user_list[socket] = user
				socket.emit('redirect', '/view_info.jade')
			}
		})	
	})
	socket.on('sign_up', data => {
		arr = data.split(',')
		var item = {
			handle : arr[0],
			password : arr[1],
			Budget : 15000, 
			points : 0
		}
		insert_in_db('User', item)
		user_list[socket] = item		
		socket.emit('redirect', '/view_info.jade')	
	})	

	socket.on('view-info', data => {
		socket.emit('redirect', '/view_info.jade')	
	})
	socket.on('buying_portal', data => {
		socket.emit('redirect', '/buying_portal.jade')	
	})
	socket.on('selling_portal', data => {
		socket.emit('redirect', '/selling_portal.jade')	
	})
	socket.on('player_info', data => {
		socket.emit('redirect', '/player_info_' + data + '.jade')	
	})
	socket.on('fixtures_and_results', data => {
		socket.emit('redirect', '/fixtures_and_results.jade')	
	})	
	socket.on('points_table', data => {
		socket.emit('redirect', '/points_table.jade')	
	})		
	socket.on('view_info_is_up', data => {
		data = ''
		data += 'handle is ' + user_list[socket].handle + ':'
		data += 'Budget is ' + user_list[socket].Budget + ':'
		data += ':owned players are :'
		item = {
			user : user_list[socket].handle
		}
		find_all_in_db('User-Player', item, {}, function(doc) {
			data += doc.player + ':'
		}, function() {
			socket.emit('user-info', data)
		})
	}) 	
	socket.on('buying_portal_is_up', data => { 
		data = ''
		for(i = 0; i < teams.length; i++) {
			data += teams[i].name
			data += ':'
			for(j = 0; j < teams[i].players.length; j++) {
				data += teams[i].players[j].name
				data += '\n(' + teams[i].players[j].price + ')'
				data += ':'
			}
		}
		socket.emit('Buying_portal', data)	
	}) 
	socket.on('selling_portal_is_up', data => { 
		data = ''
		data += user_list[socket].handle + ':'
		console.log('selling_portal')
		item = {
			user : user_list[socket].handle
		}
		find_all_in_db('User-Player', item, {}, function(doc) {
			console.log(doc.player)
			data += doc.player + ':'
		}, function() {
			socket.emit('selling_portal', data)
		})
	}) 
	socket.on('player_info_is_up', data => { 
		arr = data.split('_')
		console.log(arr)
		team = teams[Number(arr[0])]
		console.log(team.name)
		p = team.players[Number(arr[1])]
		item = {
			player : p.name
		}
		find_one_in_db('Player', item, function(doc) {
			econ = 0.00
			if(Number(doc.balls_delivered) > 0) {
				econ = Number(doc.runs_conceded)/Number(doc.balls_delivered)
				econ = econ * 6
			}
			strike_rate = Number(doc.runs_scored)/Number(doc.balls_played)
			strike_rate = strike_rate * 100
			data = p.name + ':price ' +	doc.price + ':wickets taken ' + doc.wickets
			data += ':Economy rate '+ econ + ':runs conceded ' + doc.runs_conceded
			data += ':runs scored ' + doc.runs_scored + ':strike_rate ' + strike_rate
			socket.emit('player_info', data)
		})	
	}) 	
	socket.on('fixtures_and_results_is_up', data => { 
		data = ''
		item = {}
		srt = {
			match_id : 1
		}
		find_all_in_db('Matches', item, srt, function(doc) {
			data += 'Match ' + doc.match_id + ' : '
			data += doc.date + ' '
			data += doc.detail + ' '
			data += doc.Result + '|'
		}, function() {
			socket.emit('fixtures_and_results', data)
		})		
	}) 		
	socket.on('fixtures_and_results_is_up', data => { 
		data = ''
		item = {}
		srt = {
			match_id : 1
		}
		find_all_in_db('Matches', item, srt, function(doc) {
			data += 'Match ' + doc.match_id + ' : '
			data += doc.date + ' '
			data += doc.detail + ' '
			data += doc.Result + '|'
		}, function() {
			socket.emit('fixtures_and_results', data)
		})		
	}) 	
	socket.on('tried_to_buy', data => {
		arr = data.split('_')
		team = teams[Number(arr[0])]
		p = team.players[Number(arr[1])]
		player = p.name
		price = Number(p.price)
		budget = user_list[socket].Budget
		item = {
			user : user_list[socket].handle,
			player : player
		}
		find_one_in_db('User-Player', item, function(usp) {
			if(usp === null && price <= budget) {
				insert_in_db('User-Player', item)
				item = {
					handle : user_list[socket].handle
				}
				user_list[socket].Budget -= price					
				change = {$inc: {Budget: -price}}
				modify_in_db('User', item, change)
				socket.emit('redirect', '/view_info.jade')
			} else if(price > budget) {
				socket.emit('could not buy', 'price less than budget')
			} else {
				socket.emit('could not buy', 'you already own this player')				
			}
		})
	})
	socket.on('tried_to_sell', data => {
		p = find_player_in_teams(teams, data)
		if(p === null)
			return
		player = data
		price = Number(p.price)
		budget = user_list[socket].Budget
		item = {
			user : user_list[socket].handle,
			player : player
		}
		find_one_in_db('User-Player', item, function(usp) {
			if(usp !== null) {
				remove_from_db('User-Player', item)
				item = {
					handle : user_list[socket].handle
				}
				user_list[socket].Budget += price					
				change = {$inc: {Budget: price}}
				modify_in_db('User', item, change)
				socket.emit('Sold', data)
			}
		})
	})
})