$(() => {
	const socketio = io()
	socketio.emit('points_table_is_up')
	socketio.on('redirect', function(destination) {
	    window.location.href = destination;
	});	
	socketio.on('points_table', data => {
		console.log(data)
		arr = data.split('|')
		for(i = 0; i < arr.length - 1; i++) {
			cur = arr[i].split(':')
			$('#pt').append('<tr><td>' + cur[0] + '</td><td>' + cur[1] + '</td>')
		}
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
})
