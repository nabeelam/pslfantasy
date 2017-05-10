$(() => {
	const socketio = io()
	url = window.location.href
	player = url.slice(-8).substring(0, 3)
	socketio.emit('player_info_is_up', player)
	socketio.on('redirect', function(destination) {
	    window.location.href = destination;
	});	
	socketio.on('player_info', data => {
		d = data.split(':')	
		for (let j = 0; j < d.length; j++) {
			$('#information').append('<hr/>' + d[j])
		}
	})	
	socketio.on('could not buy', data => {
		$('#information').append('<hr/>' + data)
	})
	$('#PersonalInfo').click(() => {
		socketio.emit('view-info', '')
	});	
	$('#BuyingPortal').click(() => {
		socketio.emit('buying_portal', '')
	});		
	$('#FixRes').click(() => {
		socketio.emit('fixtures_and_results', '')
	});
	$('#PointsTable').click(() => {
		socketio.emit('points_table', '')
	});	
	$('#SellingPortal').click(() => {
		socketio.emit('selling_portal', '')
	});		
	$('#Buy').click(() => {
		socketio.emit('tried_to_buy', player)
	})
})