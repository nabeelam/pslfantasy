$(() => {
	const socketio = io()
	socketio.on('to_client', data => $('#chatlog').append('<hr/>' + data))
	socketio.on('redirect', function(destination) {
	    window.location.href = destination;
	});
	$('#sendit').click(() => socketio.emit('to_server', $('#username').val() + ',' + $('#password').val()))
})

