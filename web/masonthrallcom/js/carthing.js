function Car(){
	this.makeCar = function(){
		this.x = $('#d').width()/2,
		this.y = $('#d').height()/2,
		this.heading = 0,
		this.speed = 0,
		this.pastLocations = []
	};
	this.moveCar = function(){
		if (this.pastLocations.indexOf(this.x + ',' + this.y) == -1){
			this.pastLocations.push(this.x + ',' + this.y);
		}
		this.x += (this.speed * Math.cos(this.heading * (Math.PI/180)));
		this.y += (this.speed * Math.sin(this.heading * (Math.PI/180)));
		if (this.x > $('#d')[0].width){this.x = 0;}
		if (this.y > $('#d')[0].height){this.y = 0;}
		if (this.x < 0){this.x = $('#d')[0].width;}
		if (this.y < 0){this.y = $('#d')[0].height;}
		if (this.heading > 360){this.heading = 0;}
		if (this.heading < 0){this.heading = 360;}
	};
};

$(document).ready(function(){
	var ctx = $('#d')[0].getContext("2d");
	var c = new Car();
	c.makeCar();
	setInterval(function() {
		c.moveCar();
		draw(ctx, c);
	}, 1);
	document.addEventListener('keydown', function(event){keyHandler(event,c)});
});

function keyHandler(k,c){
	switch(k.keyCode){
		case 38:
			c.speed += .1;
			break;
		case 40:
			c.speed -= .1;
			break;
		case 37:
			c.heading -= 2;
			break;
		case 39:
			c.heading += 2;
			break;
		default:
			console.log('not a useful key');
	}
}

function draw(ctx, c) {
	$('#t').html([
		'<tr><th>param</th><th>val</th></tr>',
		'<tr><td>x</td><td>' + (c.x).toFixed(1) + '</td></tr>',
		'<tr><td>y</td><td>' + (c.y).toFixed(1) + '</td></tr>',
		'<tr><td>heading</td><td>' + (c.heading).toFixed(1) + '</td></tr>',
		'<tr><td>speed</td><td>' + (c.speed).toFixed(1) + '</td></tr>',
	].join('/n'));
	ctx.clearRect(0, 0, $('#d')[0].width, $('#d')[0].height);
	ctx.fillStyle = 'yellow';
	ctx.fillRect(0, 0, $('#d')[0].width, $('#d')[0].height);
	ctx.fillStyle = 'black';
	ctx.save();
	ctx.translate(c.x,c.y);
	ctx.rotate(c.heading*Math.PI/180);
	ctx.fillRect(-5,-5,10,10)
	ctx.restore();
	c.pastLocations.map(function(p){
		var a = p.split(',');
		ctx.fillRect(a[0],a[1],1,1);
	});
}