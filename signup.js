$(() => {
	const socketio = io()
	socketio.on('redirect', function(destination) {
	    window.location.href = destination;
	});
	socketio.on('signup_error', function(data) {
		console.log(data)
		$('#status').html('<hr/>' + data)
	});
	$('#signUp').click(() => {
		socketio.emit('sign_up', $('#username').val() + ',' + $('#pass').val())
	});
})
