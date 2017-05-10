$(() => {
	const socketio = io()
	url = window.location.href
	player = url.slice(-8).substring(0, 3)
	socketio.emit('player_info_is_up', player)
	socketio.on('redirect', function(destination) {
	    window.location.href = destination;
	});	
	// socketio.on('player_info', data => {
	// 	d = data.split(':')	
	// 	for (let j = 0; j < d.length; j++) {
	// 		$('#information').append('</br>' + d[j])
	// 	}
	// })
	socketio.on('player_info', data => {
	arr = data.split(':')
	$('#playername').html(arr[0])
	$('#playerprice').html(arr[1])
	$('#playerwickets').html(arr[2])
	$('#playerecon').html(arr[3])
	$('#playerrunsconceded').html(arr[4])
	$('#playerrunsscored').html(arr[5])
	$('#playerstrike').html(arr[6])
	$('#playerlastpoints').html(arr[7])
	})	
	socketio.on('could not buy', data => {
		$('#status').html('<hr/>' + data)
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
