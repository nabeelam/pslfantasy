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
	$('#BuyingPortal').click(() => {
		socketio.emit('buying_portal', '')
	});	
	$('#SellingPortal').click(() => {
		socketio.emit('selling_portal', '')
	});		
})