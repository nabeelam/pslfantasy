$(() => {
	const socketio = io()
	socketio.emit('view_info_is_up')	
	socketio.on('redirect', function(destination) {
	    window.location.href = destination;
	});
	socketio.on('user-info', data => {
		console.log(data)
		arr = data.split(':')
		for(i = 0; i < arr.length; i++) {
			$('#info').append('<hr/>' + arr[i])
		}
	});	
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