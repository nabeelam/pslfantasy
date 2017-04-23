$(() => {
	const socketio = io()
	socketio.emit('selling_portal_is_up')
	socketio.on('redirect', function(destination) {
	    window.location.href = destination;
	});	
	socketio.on('Selling_portal', data => {
		console.log(data)
		d = data.split(':')
		plyrL = []
		i = 0		
		for (let j = 1; j < d.length; j++) {
			move('m' + i + (j - 1), d[j])
			plyrL.push(d[j])
		}
		move('m' + i, d[0])			
		for (let j = 0; j < 5; j++) {
			a = '#m' + i + j
			$(a).click(() => {
				console.log("tried to sell " + plyrL[j])
				socketio.emit('tried_to_sell', plyrL[j])
			})
		}
	})
	$('#PersonalInfo').click(() => {
		socketio.emit('view-info', '')
	});	
	$('#BuyingPortal').click(() => {
		socketio.emit('buying_portal', '')
	});		
	socketio.on('Sold', data => {
		i = 0
		j = find_in_ls(plyrL, data)
		console.log(j)
		move('m' + i + j, 'Sold')
	})
	function move(i, x) {
		console.log(i, x)
		document.getElementById(i).innerHTML = x
	}	

})
function find_in_ls(ls, name) {
	for(j = 0; j < ls.length; j++) {
		if(ls[j] === name)
			return j
	}
	return -1
}
