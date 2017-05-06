$(() => {
	const socketio = io()
	socketio.emit('buying_portal_is_up')
	socketio.on('redirect', function(destination) {
	    window.location.href = destination;
	});	
	socketio.on('Buying_portal', data => {
		console.log(data)
		d = data.split(':')
		for (let i = 0; i < 5; i++) {
			for (let j = 1; j <= 11; j++) {
				move('m' + i + (j - 1), d[12*i + j])
			}
			move('m' + i, d[12*i])			
		}
		for (let i = 0; i < 5; i++) {
			for (let j = 0; j < 11; j++) {
				a = '#m' + i + j
				$(a).click(() => {
					socketio.emit('player_info', i + '_' + j)
				})
			}
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
	function move(i, x) {
		console.log(i, x)
		document.getElementById(i).innerHTML = x
	}	
})

