$(() => {
	const socketio = io()
	socketio.emit('view_info_is_up')	
	socketio.on('redirect', function(destination) {
	    window.location.href = destination;
	});
	socketio.on('user-info', data => {
		arr = data.split(':')
		$('#handle').html(arr[0])
		$('#budget').html(arr[1])
		$('#points').html(arr[2])
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