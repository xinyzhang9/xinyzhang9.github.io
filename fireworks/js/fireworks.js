var Fireworks = (function(){
	//create variables
	var particles = [],
		mainCanvas = null,
		mainContext = null,
		fireworkCanvas = null,
		fireworkContext = null,
		viewportWidth = 0,
		viewportHeight = 0;

	//create DOM elements
	function initialize(){
		onWindowResize();

		//create canvas
		mainCanvas = document.createElement('canvas');
		mainContext = mainCanvas.getContext('2d');

		//create off-screen buffer
		fireworkCanvas = document.createElement('canvas');
		fireworkContext = fireworkCanvas.getContext('2d');

		//set up colors
		createFireworkPalette(12);

		//set dimensions of canvas
		setMainCanvasDimensions();

		//add the canvas
		document.body.appendChild(mainCanvas);
		document.addEventListener('mouseup',createFirework,true);
		document.addEventListener('touchend',createFirework,true);

		//update
		update();

	}

	function createFirework(){
	    var audio = new Audio('sounds/fireworks.mp3');
	    audio.play()
		createParticle();
	}

	function createFireworkPalette(gridSize){
		var size = gridSize * 10;
		fireworkCanvas.width = size;
		fireworkCanvas.height = size;
		fireworkContext.globalCompositeOperation = 'source-over';

		for(var c = 0; c < 100; c++){
			var marker = c * gridSize;
			var gridX = marker % size;
			var gridY = Math.floor(marker / size) * gridSize;

			fireworkContext.fillStyle = 'hsl(' + Math.round(c*3.6)+',100%,60%)';
			fireworkContext.fillRect(gridX,gridY,gridSize,gridSize);
			fireworkContext.drawImage(
				Library.bigGlow,
				gridX,
				gridY
				);
		}
	}

	function setMainCanvasDimensions(){
		mainCanvas.width = viewportWidth;
		mainCanvas.height = viewportHeight;
	}

	//main loop
	function update(){
		clearContext();
		requestAnimFrame(update);
		drawFireworks();
	}

	function clearContext(){
		mainContext.fillStyle = 'rgba(0,0,0,0.2)';
		mainContext.fillRect(0,0,viewportWidth,viewportHeight);

	}

	function drawFireworks(){
		var a = particles.length;
		while(a--){
			var firework = particles[a];
			//if true, explode
			if(firework.update()){
				//kill the firework, replace it with the particles for the explode version
				particles.splice(a,1);

				if(!firework.usePhysics){
					if(Math.random() < 0.8){
						FireworkExplosions.star(firework);
					}else{
						FireworkExplosions.circle(firework);
					}
				}
			}
			//pass the canvas context and the firework colors to
			firework.render(mainContext,fireworkCanvas);
		}
	}

	function createParticle(pos,target,vel,color,usePhysics){
		pos = pos || {};
		target = target || {};
		vel = vel || {};

		particles.push(
			new Particle(
				//position
				{
					x: pos.x || viewportWidth * 0.5,
					y: pos.y || viewportHeight + 10
				},
				//target
				{
					y: target.y || 150 + Math.random() * 100
				},
				//velocity
				{
					x: vel.x || Math.random()*3 - 1.5,
					y: vel.y || 0
				},
				//color
				color || Math.floor(Math.random()*100)*12,
				usePhysics
			)

		);
	}

	function onWindowResize(){
		viewportWidth = window.innerWidth;
		viewportHeight = window.innerHeight;
	}

	//declare API
	return{
		initialize: initialize,
		createParticle: createParticle
	};

})();

var Particle = function(pos,target,vel,marker,usePhysics){
	this.GRAVITY = 0.06;
	this.alpha = 1;
	this.easing = Math.random()*0.02;
	this.fade = Math.random()*0.1;
	this.gridX = marker % 120;
	this.gridY = Math.floor(marker / 120) * 12;
	this.color = marker;

	this.pos = {
		x: pos.x || 0,
		y: pos.y || 0
	};
	this.vel = {
		x: vel.x || 0,
		y: vel.y || 0
	};
	this.lastPos = {
		x: this.pos.x,
		y: this.pos.y
	};
	this.target = {
		y:target.y || 0
	};
	this.usePhysics = usePhysics || false;
};

Particle.prototype = {
	update: function(){
		this.lastPos.x = this.pos.x;
		this.lastPos.y = this.pos.y;

		if(this.usePhysics){
			this.vel.y += this.GRAVITY;
			this.pos.y += this.vel.y;
			//fade out
			this.alpha -= this.fade;
		}else{
			var distance = (this.target.y - this.pos.y);

			//ease the position
			this.pos.y += distance * (0.03 + this.easing);

			//cap to 1
			this.alpha = Math.min(distance * distance * 0.00005, 1);
		}
		this.pos.x += this.vel.x;

		return (this.alpha < 0.005);
	},

	render: function(context,fireworkCanvas){
		var x = Math.round(this.pos.x),
			y = Math.round(this.pos.y),
			xVel = (x-this.lastPos.x)* -5,
			yVel = (y-this.lastPos.y)* -5;
		context.save();
		context.globalCompositeOperation = 'lighter';
		context.globalAlpha = Math.random()*this.alpha;
		//draw the line from past to current
		context.fillStyle = 'rgba(255,255,255,0.3)';
		context.beginPath();
		context.moveTo(this.pos.x, this.pos.y);
		context.lineTo(this.pos.x + 1.5, this.pos.y);
		context.lineTo(this.pos.x+xVel,this.pos.y+yVel);
		context.lineTo(this.pos.x - 1.5, this.pos.y);
		context.closePath();
		context.fill();

		context.drawImage(fireworkCanvas,this.gridX,this.gridY,12,12,x-6,y-6,12,12);
		context.drawImage(Library.smallGlow,x-3,y-3);
		context.restore();
	}
};

var Library = {
	bigGlow: document.getElementById('big-glow'),
	smallGlow: document.getElementById('small-glow')
};

var FireworkExplosions = {
	circle:function(firework){
		var count = 100;
		var angle = (Math.PI * 2) / count;
		while(count--){
			var randomVelocity = 4 + Math.random() * 4;
			var particleAngle = count * angle;

			Fireworks.createParticle(
				firework.pos,
				null,
				{
					x: Math.cos(particleAngle)*randomVelocity,
					y: Math.sin(particleAngle)*randomVelocity
				},
				firework.color,
				true
			);
		}
	},
	star:function(firework){
		var points = 6 + Math.round(Math.random()*15);
		var jump = 3 + Math.round(Math.random()*7);
		var subdivisions = 10;
		var radius = 80;
		var randomVelocity = -(Math.random()*3-6);

		var start = 0;
		var end = 0;
		var circle = Math.PI * 2;
		var adjustment = Math.random()*circle;

		do{
			start = end;
			end = (end + jump) % points;

			var sAngle = (start / points) * circle - adjustment;
			var eAngle = ((start + jump) / points) * circle - adjustment;

			var startPos = {
				x: firework.pos.x + Math.cos(sAngle)*radius,
				y: firework.pos.y + Math.sin(sAngle)*radius
			};

			var endPos = {
				x: firework.pos.x + Math.cos(eAngle)*radius,
				y: firework.pos.y + Math.sin(eAngle)*radius
			};

			var diffPos = {
				x: endPos.x - startPos.x,
				y: endPos.y - startPos.y,
				a: eAngle - sAngle
			};
			//linear interpolate
			for(var s = 0; s < subdivisions; s++){
				var sub = s / subdivisions;
				var subAngle = sAngle + (sub * diffPos.a);
				Fireworks.createParticle(
					{
						x: startPos.x + (sub * diffPos.x),
						y: startPos.y + (sub * diffPos.y)
					},
					null,
					{
						x: Math.cos(subAngle) * randomVelocity,
						y: Math.sin(subAngle) * randomVelocity
					},
					firework.color,
					true
				);
			}
		} while(end !== 0);
	}
};

window.onload = function(){
	Fireworks.initialize();
}












