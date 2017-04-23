const PORT = 12000
const fs = require('fs')
const http = require('http')
const jade = require('jade')
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

function find_all_in_db(coll, item, callback1, callback2) {
	mongo.connect(url, function(err, db) {
		assert.equal(null, err)
		var cursor = db.collection(coll).find(item)
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
			Budget : 5000
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
	socket.on('view_info_is_up', data => {
		data = ''
		data += 'handle is ' + user_list[socket].handle + ':'
		data += 'Budget is ' + user_list[socket].Budget + ':'
		data += ':owned players are :'
		item = {
			user : user_list[socket].handle
		}
		find_all_in_db('User-Player', item, function(doc) {
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
		item = {
			user : user_list[socket].handle
		}
		find_all_in_db('User-Player', item, function(doc) {
			data += doc.player + ':'
		}, function() {
			socket.emit('Selling_portal', data)
		})
	}) 	
	socket.on('tried_to_buy', data => {
		arr = data.split(':')
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
				socket.emit('Bought', data)
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