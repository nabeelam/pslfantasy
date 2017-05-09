const PORT = 12000
const fs = require('fs')
const http = require('http')
const jade = require('jade')
var mongo = require('mongodb')
var assert = require('assert')
const url = 'mongodb://localhost:27017/10000'

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

function modify_in_db(coll, query, change, callback) {
	mongo.connect(url, function(err, db) {
		assert.equal(null, err)
		db.collection(coll).findAndModify(query, [], change, {'new':'true'}, function(err, object) {
			assert.equal(null, err)
			db.close()
			callback();
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
	points = 0
	if(BP != 0)
		points += RS * (RS/BP)
	if(BD != 0)
		points = points - (RC/(2*BD)) + 15 * W
	points = points.toFixed(1)
	return points
}
function create_user(handle, np) {
	this.points = 0
	this.plyrs = 0
	this.handle = handle
	this.np = np
}
user_list = {}
function update_stats_users() {
	users = []
	index = 0
	function temp(i, up) {
		new_item = {
			player : up.player
		}
		find_one_in_db('Player', new_item, function(doc) {		
			users[i].points += Number(doc.points)
			users[i].plyrs++
			if(users[i].plyrs == users[i].np) {
				change = {$inc: {points: users[i].points}}
				
				for (var entry of user_list.entries()) {
				    var key = entry[0],
				        value = entry[1];
				        if(value.handle === users[i].handle) {
				        	user_list[key].points += users[i].points
				        }
				}
				uitem = {
					handle : users[i].handle
				}
				modify_in_db('User', uitem, change, () => {})
			}
		})
	}
	find_all_in_db('User', {}, {},  function(doc) {
		item = {
			user : doc.handle
		}
		users.push(new create_user(doc.handle, doc.num_players))
		partial = temp.bind(null, index)
		index++				
		find_all_in_db('User-Player', item, {},  partial, function() {})
	}, function() {})	
}

function update_stats_player(data) {
	ops_completed = 0
	console.log(data.length)
	function callback() {
		ops_completed++
		if(ops_completed ==  data.length) {
			update_stats_users()
		}
	}
	for(i = 0; i < data.length; i++) {
		info = data[i].split(':')
		item = {
			player : info[0]
		}
		p = get_points(Number(info[1]), Number(info[2]), Number(info[3]), Number(info[4]), Number(info[5]))
		change = {$inc: {
			runs_scored : Number(info[1]), 
			balls_played : Number(info[2]),
			balls_played : Number(info[3]),
			balls_delivered : Number(info[4]),
			wickets : Number(info[5]),
			},
			$set : {
				points : p
			}
		}	
		modify_in_db('Player', item, change, callback)	
	}
}
populate_teams()

const server = http.createServer((request, response) => {
	if(request.url.slice(-4) === '.css') {
        fs.readFile(request.url.slice(1), 'utf-8', (err, data) => response.end(data))		
    } else if (request.url === '/signup.js') {
        fs.readFile('signup.js', 'utf-8', (err, data) => response.end(data))
    } if (request.url === '/login.js') {
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
	}  else if (request.url === '/app.js') {
        fs.readFile('app.js', 'utf-8', (err, data) => response.end(data))    	 
	} else if(request.url === '/view_info.jade') {
        fs.readFile('view_info.jade', 'utf-8', (err, data) => {
            response.end(jade.compile(data)())
        })    	
    } else if(request.url === '/buying_portal.jade') {
        // fs.readFile('buying_portal.jade', 'utf-8', (err, data) => {
        //     response.end(jade.compile(data)())
        // })
        fs.readFile('buy.html', 'utf-8', (err, data) => response.end(data))    	
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
    } else if(request.url === '/commentary.jade') {
        fs.readFile('commentary.jade', 'utf-8', (err, data) => {
            response.end(jade.compile(data)())
        })
    } else if(request.url === '/signup.html') {
        fs.readFile('signup.html', 'utf-8', (err, data) => response.end(data))    	
    } else if(request.url === '/favicon.ico') {}
    else {
        // fs.readFile('login.jade', 'utf-8', (err, data) => {
        //     response.end(jade.compile(data)())
        // })
        fs.readFile('mainpage.html', 'utf-8', (err, data) => response.end(data))    	
    }
})

const io = require('socket.io')(server)
server.listen(PORT, () => {
	console.log("Server listening on ", PORT)
})
match_in_progress = false
match_info = ''
function check(socket) {			
	if(user_list[socket] === undefined) {
    	socket.emit('redirect', '/')	
    	return true	
	}
	return false
}
io.sockets.on('connection', socket => {
	socket.on('player_match_data', function (data) {
		data = data.split('@')
		m = Number(data[0]) + 1
		console.log(m)
		res = data[1]
		item = {
			match_id : m
		}
		change = {$set: {Result : res}}
		modify_in_db('Matches', item, change, () => {})
		update_stats_player(data[2].split('\n'))
		match_in_progress = false
	});
	socket.on('data_parser_connecting', function (data) {
		data = ''
		item = {}
		srt = {
			'match_id' : 1
		}
		find_all_in_db('Matches', item, srt,  function(doc) {
			if(doc.match_id === undefined)
				return
			mid = Number(doc.match_id) - 1
			data += mid + '@' + doc.date + '\n'
		}, function() {
    		socket.emit('sending_match_data', data)
		})	
	});

	socket.on('sign_in', data => {
		console.log(data)
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
				console.log(user.points + ' are the points')
				socket.emit('redirect', '/view_info.jade')
			}
		})	
	})
	socket.on('trying_to_sign_up', data => {
		socket.emit('redirect', '/signup.html')
	})
	socket.on('sign_up', data => {
		arr = data.split(',')
		console.log(data)
		if(arr[0].length < 5 || arr[1].length < 5 || arr[2].length < 5 || arr[3].length < 5) {
			socket.emit('signup_error', 'all four fields are required and must be at least 5 characters')	
			return
		}
		var item = {
			handle : arr[0],
			password : arr[1],
		}
		find_one_in_db('User', item, function(user) {
			if(user !== null) {
				socket.emit('signup_error', 'username already taken')	
			} else {	
				var item = {
					handle : arr[0],
					password : arr[1],
					Budget : 15000,
					num_players : 0, 
					points : 0
				}
				insert_in_db('User', item)
				user_list[socket] = item		
				socket.emit('redirect', '/view_info.jade')	
			}
		})	
	})	
	socket.on('commentary_is_up', data => {
		socket.emit('commentary', match_info)
	})
	socket.on('view-info', data => {
		if(check(socket))
			return
		socket.emit('redirect', '/view_info.jade')	
	})
	socket.on('buying_portal', data => {
		if(check(socket))
			return
		socket.emit('redirect', '/buying_portal.jade')	
	})
	socket.on('selling_portal', data => {
		if(check(socket))
			return
		socket.emit('redirect', '/selling_portal.jade')	
	})
	socket.on('player_info', data => {
		if(check(socket))
			return	
		socket.emit('redirect', '/player_info_' + data + '.jade')	
	})
	socket.on('fixtures_and_results', data => {
		if(check(socket))
			return	
		socket.emit('redirect', '/fixtures_and_results.jade')	
	})	
	socket.on('points_table', data => {
		if(check(socket))
			return
		socket.emit('redirect', '/points_table.jade')	
	})		
	socket.on('view_info_is_up', data => {
		if(check(socket))
			return	
		data = ''
		data += 'handle is ' + user_list[socket].handle + ':'
		data += 'Budget is ' + user_list[socket].Budget + ':'
		data += 'Points are ' + user_list[socket].points.toFixed(1) + ':'
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
		if(check(socket))
			return
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
		if(check(socket))
			return
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
		if(check(socket))
			return
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
				econ = econ.toFixed(1);
			}
			strike_rate = 0.00
			if(Number(doc.balls_played) > 0) {
				strike_rate = Number(doc.runs_scored)/Number(doc.balls_played)
				strike_rate = strike_rate.toFixed(1);
			}
			strike_rate = strike_rate * 100
			data = p.name + ':price ' +	doc.price + ':wickets taken ' + doc.wickets
			data += ':Economy rate '+ econ + ':runs conceded ' + doc.runs_conceded
			data += ':runs scored ' + doc.runs_scored + ':strike_rate ' + strike_rate
			data += ':points earned in last match played ' + doc.points
			socket.emit('player_info', data)
		})	
	}) 		
	socket.on('fixtures_and_results_is_up', data => { 
		if(check(socket))
			return
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
	socket.on('points_table_is_up', data => { 
		if(check(socket))
			return
		data = ''
		item = {}
		srt = {
			points : -1
		}
		find_all_in_db('User', item, srt, function(doc) {
			data += 'User ' + doc.handle + ' '
			data += doc.points.toFixed(1) + '|'
		}, function() {
			socket.emit('points_table', data)
		})		
	}) 		
	socket.on('tried_to_buy', data => {
		if(check(socket))
			return
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
				modify_in_db('User', item, change, () => {})
				change = {$inc: {num_players: 1}}
				modify_in_db('User', item, change, () => {})
				socket.emit('redirect', '/view_info.jade')
			} else if(price > budget) {
				socket.emit('could not buy', 'price less than budget')
			} else {
				socket.emit('could not buy', 'you already own this player')				
			}
		})
	})
	socket.on('tried_to_sell', data => {
		if(check(socket))
			return
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
				modify_in_db('User', item, change, () => {})
				change = {$inc: {num_players: -1}}
				modify_in_db('User', item, change, () => {})
				socket.emit('Sold', data)
			}
		})
	})
})