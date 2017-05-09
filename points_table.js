$(() => {
	const socketio = io()
	socketio.emit('points_table_is_up')
	socketio.on('redirect', function(destination) {
	    window.location.href = destination;
	});	
	socketio.on('points_table', data => {
		console.log(data)
		arr = data.split('|')
		for(i = 0; i < arr.length; i++) {
			$('#pt').append('<hr/>' + arr[i])
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
	$('#FixRes').click(() => {
		socketio.emit('fixtures_and_results', '')
	});			
})
