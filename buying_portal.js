$(() => {
	const socketio = io()
	socketio.emit('buying_portal_is_up')
	socketio.on('redirect', function(destination) {
	    window.location.href = destination;
	});	
	socketio.on('Buying_portal', data => {
		console.log(data)
		d = data.split(':')
		for (let i = 0; i < 5; i++) {
			for (let j = 1; j <= 5; j++) {
				move('m' + i + (j - 1), d[6*i + j])
			}
			move('m' + i, d[6*i])			
		}
		for (let i = 0; i < 5; i++) {
			for (let j = 0; j < 5; j++) {
				a = '#m' + i + j
				$(a).click(() => {
					socketio.emit('tried_to_buy', i + ':' + j)
				})
			}
		}
	})
	$('#PersonalInfo').click(() => {
		socketio.emit('view-info', '')
	});	
	$('#SellingPortal').click(() => {
		socketio.emit('selling_portal', '')
	});		
	socketio.on('Bought', data => {
		d = data.split(':')
		i = Number(d[0])
		j = Number(d[1])
		move('m' + i + j, 'Bought')
	})
	function move(i, x) {
		console.log(i, x)
		document.getElementById(i).innerHTML = x
	}	
})

