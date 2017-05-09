$(() => {
	const socketio = io()
	socketio.on('redirect', function(destination) {
	    window.location.href = destination;
	});
	$('#signIn').click(() => {
		socketio.emit('sign_in', $('#username').val() + ',' + $('#password').val())
	});
	$('#signUp').click(() => {
		socketio.emit('trying_to_sign_up', '')
	});
})

