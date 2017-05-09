$(() => {
	const socketio = io()
	socketio.emit('buying_portal_is_up')
	socketio.on('redirect', function(destination) {
	    window.location.href = destination;
	});	
	teams = []
	players = []
	team_id = 0
	socketio.on('Buying_portal', data => {
		d = data.split(':')
		for (let i = 0; i < 5; i++) {
			teams.push(d[12 * i])
			move((i + 1).toString(), d[12 * i])  
			team = []
			for (let j = 1; j <= 11; j++) {
				console.log(d[i * 12 + j])
				team.push(d[i * 12 + j])
			}
			players.push(team)
		}
		change_names()
		for (let i = 1; i <= 5; i++) {
			a = '#' + i
			$(a).click(() => {
				console.log('clicked ' + i)
				team_id = i - 1
				change_names()
			})			
		}
		for (let j = 6; j <= 16; j++) {
			a = '#' + j
			$(a).click(() => {
				console.log('clicked ' + j)
				socketio.emit('player_info', team_id + '_' + (j - 6))
			})
		}
	})
	$('#PersonalInfo').click(() => {
		socketio.emit('view-info', '')
	});	
	$('#SellingPortal').click(() => {
		socketio.emit('selling_portal', '')
	});		
	$('#FixRes').click(() => {
		socketio.emit('fixtures_and_results', '')
	});		
	$('#PointsTable').click(() => {
		socketio.emit('points_table', '')
	});	
	$('#BuyingPortal').click(() => {
		socketio.emit('buying_portal', '')
	});	
	function move(i, x) {
		document.getElementById(i).innerHTML = x
	}	
	function change_names() {
		for(let i = 0; i < 11; i++) {
			move(i + 6, players[team_id][i])
		}

	}
})
