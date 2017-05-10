$(() => {
	const socketio = io()
	socketio.emit('selling_portal_is_up')
	socketio.on('redirect', function(destination) {
	    window.location.href = destination;
	});	
	socketio.on('selling_portal', data => {
		console.log(data)
		d = data.split(':')
		plyrL = []
		i = 0		
		for (let j = 1; j < d.length; j++) {
			move('m' + j, d[j])
			plyrL.push(d[j])
		}
		for(let j = plyrL.length; j <= 11; j++) {
			document.getElementById('m' + j).style.display = 'none';
		}
		move('handle', d[0])			
		for (let j = 1; j < d.length; j++) {
			a = '#m' + j 
			$(a).click(() => {
				socketio.emit('tried_to_sell', plyrL[j - 1])
			})
		}
	})
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
	socketio.on('Sold', data => {
		i = 0
		j = find_in_ls(plyrL, data)
		move('m' + (j + 1), 'Sold')
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
