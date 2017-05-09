$(() => {
	const socketio = io()
	socketio.emit('fixtures_and_results_is_up')
	socketio.on('redirect', function(destination) {
	    window.location.href = destination;
	});	
	socketio.on('fixtures_and_results', data => {
		console.log(data)
		arr = data.split('|')
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
	$('#SellingPortal').click(() => {
		socketio.emit('selling_portal', '')
	});		
	$('#PointsTable').click(() => {
		socketio.emit('points_table', '')
	});		
})
