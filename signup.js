$(() => {
	const socketio = io()
	socketio.on('redirect', function(destination) {
	    window.location.href = destination;
	});
	socketio.on('signup_error', function(data) {
		console.log(data)
		$('#status').html(data + '</br>')
	});
	$('#signUp').click(() => {
		socketio.emit('sign_up', $('#username').val() + ',' + $('#pass').val())
	});
})
