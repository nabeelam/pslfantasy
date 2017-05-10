$(() => {
	const socketio = io()
	socketio.emit('view_info_is_up')	
	socketio.on('redirect', function(destination) {
	    window.location.href = destination;
	});
	socketio.on('user-info', data => {
		arr = data.split(':')
		$('#handle').html('<i class="fa fa-user fa gap"></i> Username: @' + arr[0])
		$('#budget').html('<i class="fa fa-trophy fa gap"></i> Budget: ' + arr[1])
		$('#points').html('<i class="fa fa-trophy fa gap"></i> Points: ' + arr[2])
		for(i = 3; i < arr.length; i++) {
			console.log(arr[i])
			$('#players').append(arr[i] + '</br>')
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
