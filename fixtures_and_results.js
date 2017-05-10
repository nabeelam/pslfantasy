$(() => {
	const socketio = io()
	socketio.emit('fixtures_and_results_is_up')
	socketio.on('redirect', function(destination) {
	    window.location.href = destination;
	});	
	x = 0
	socketio.on('fixtures_and_results', data => {
		arr = data.split('|')
		console.log('got data' + x)
		x++
		for(i = 0; i < arr.length; i++) {
			$('#f_and_r').append('<hr/>' + arr[i])
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
