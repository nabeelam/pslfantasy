$(() => {
	const socketio = io()
	socketio.on('redirect', function(destination) {
	    window.location.href = destination;
	});
	socketio.on('login_error', function(data) {
		$('#status').html(data + '</br>')
	});	
	$('#signIn').click(() => {
		socketio.emit('sign_in', $('#username').val() + ',' + $('#pass').val())
	});
	$('#signUp').click(() => {
		socketio.emit('trying_to_sign_up', '')
	});
})

