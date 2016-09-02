window.onload = main;

var offset = 0,
	deadTimeOut = 1000,
	i,n,
	canvas,
	gl,
	ratio,
	vertices,
	velocities,
	colorLoc,
	cw,ch,
	cr = 0,cg = 0,cb = 0,
	tr,tg,tb,
	rndX = 0,rndY = 0,
	rndOn = false,
	rndSX = 0,rndSY = 0,
	lastUpdate = 0,
	IDLE_DELAY = 6000,
	totalLines = 80000,
	renderMode = 0,
	colorTimeout,
	numLines = totalLines;

function main(){
	loadScene();

	window.addEventListener("resize",onResize,false);
	onResize();

	animate();
}

function onResize(e){
	cw = window.innerWidth;
	ch = window.innerHeight;
}


function animate(){
	requestAnimationFrame(animate);
	draw();
}

function draw(){
	var i, n = vertices.length, p, bp;

	// animate color
	cr = cr * .99 + tr * .01;
	cg = cg * .99 + tg * .01;
	cb = cb * .99 + tb * .01;
	gl.uniform4f( colorLoc, cr, cg, cb, .5 );
	
	for(i = 0; i < numLines; i+=2){
		bp = i * 3;
		//copy old positions
		vertices[bp] = vertices[bp + 3];
		vertices[bp + 1] = vertices[bp + 4];

		//inertia
		velocities[bp] *= velocities[bp + 2];
		velocities[bp + 1] *= velocities[bp + 2];

		//horizontal
		p = vertices[bp + 3];
		p += velocities[bp];
		if (p < -ratio){
			p = -ratio;
			velocities[bp] = Math.abs(velocities[bp]);
		} else if(p > ratio){
			p = ratio;
			velocities[bp] = -Math.abs(velocities[bp]);
		}
		vertices[bp + 3] = p;

		//vertical
		p = vertices[bp + 4];
		p += velocities[bp + 1];
		if (p < -1){
			p = -1;
			velocities[bp + 1] = Math.abs(velocities[bp + 1]);
		} else if(p > 1){
			p = 1;
			velocities[bp + 1] = -Math.abs(velocities[bp + 1])
		}
		vertices[bp + 4] = p;

		if(touched){
			var dx = touchX - vertices[bp],
				dy = touchY - vertices[bp + 1],
				d = Math.sqrt(dx * dx + dy * dy);
				if(d < 2){
					if(d < 0.03){
						vertices[bp + 3] = (Math.random() * 2 - 1) * ratio;
						vertices[bp + 4] = Math.random() * 2 - 1;
						velocities[bp] = 0;
						velocities[bp + 1] = 0;
					} else{
						dx /= d;
						dy /= d;
						d = (2-d)/2;
						d *= d;
						velocities[bp] += dx * d * 0.01;
						velocities[bp + 1] += dy * d * 0.01;
					}
				}
		}
	}
	gl.lineWidth(2);
	gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.DYNAMIC_DRAW);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.drawArrays(gl.LINES,0,numLines);
	gl.flush();
}

function switchColor(){
	var a = 0.5,
		c1 = 0.3 + Math.random() * 0.2,
		c2 = Math.random() * 0.06 + 0.01,
		c3 = Math.random() * 0.06 + 0.02;
	switch(Math.floor(Math.random()*3)){
		case 0:
			tr = c1;
			tg = c2;
			tb = c3;
			break;
		case 1:
			tr = c2;
			tg = c1;
			tb = c3;
			break;
		case 2:
			tr = c3;
			tg = c2;
			tb = c1;
			break;
	}
	if(colorTimeout){
		clearTimeout(colorTimeout);
	}
	colorTimeout = setTimeout(switchColor,500+Math.random()*2000);
}

function loadScene(){
	canvas = document.getElementById('c');
	gl = canvas.getContext('webgl');
	if(!gl){
		alert("Unable to load webgl context!");
		return;
	}

	cw = window.innerWidth;
	ch = window.innerHeight;
	canvas.width = cw;
	canvas.height = ch;
	gl.viewport(0,0,canvas.width,canvas.height);

	//    Grab the script element
	var vertexShaderScript = document.getElementById("shader-vs");
	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vertexShader, vertexShaderScript.text);
	gl.compileShader(vertexShader);
	if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
		alert("Couldn't compile the vertex shader");
		gl.deleteShader(vertexShader);
		return;
	}
	
	//    Load the fragment shader that's defined in a separate script
	//    More info about fragment shaders: http://en.wikipedia.org/wiki/Fragment_shader
	//var fragmentShaderScript = document.getElementById("shader-fs");
	var fragmentShaderScript = document.getElementById("shader-fs");
	
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fragmentShader, fragmentShaderScript.text);
	gl.compileShader(fragmentShader);
	if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
		alert("Couldn't compile the fragment shader");
		gl.deleteShader(fragmentShader);
		return;
	}

	//    Create a shader program. 
	gl.program = gl.createProgram();
	gl.attachShader(gl.program, vertexShader);
	gl.attachShader(gl.program, fragmentShader);
	gl.linkProgram(gl.program);
	if (!gl.getProgramParameter(gl.program, gl.LINK_STATUS)) {
		alert("Unable to initialise shaders");
		gl.deleteProgram(gl.program);
		gl.deleteProgram(vertexShader);
		gl.deleteProgram(fragmentShader);
		return;
	}
	gl.useProgram(gl.program);

	colorLoc = gl.getUniformLocation(gl.program,'color');
	gl.uniform4f(colorLoc,0.4,0.01,0.08,0.5);

	var vertexPosition = gl.getAttribLocation(gl.program,'vertexPosition');

	gl.enableVertexAttribArray(vertexPosition);

	gl.clearColor(0.0,0.0,0.0,1.0);
	gl.clearDepth(1.0);

	gl.enable(gl.BLEND);
	gl.disable(gl.DEPTH_TEST);
	gl.blendFunc(gl.SRC_ALPHA,gl.ONE);

	var vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);

	vertices = [];
	ratio = cw/ch;
	velocities = [];
	for(var i = 0; i < totalLines; i++){
		vertices.push(0,0,1.83);
		velocities.push((Math.random()*2-1)*0.05,(Math.random()*2-1)*0.5, 0.93 + Math.random()*0.02);
	}
	vertices = new Float32Array(vertices);
	velocities = new Float32Array(velocities);

	gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.DYNAMIC_DRAW);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	var fieldOfView = 30.0;
	var aspectRatio = canvas.width / canvas.height;
	var nearPlane = 1.0;
	var farPlane = 10000.0;
	var top = nearPlane * Math.tan(fieldOfView * Math.PI / 360.0);
	var bottom = -top;
	var right = top * aspectRatio;
	var left = -right;

	var a = (right + left)/(right - left);
	var b = (top + bottom)/(top - bottom);
	var c = (farPlane + nearPlane) / (farPlane - nearPlane);
	var d = (2 * farPlane * nearPlane) / (farPlane - nearPlane);
	var x = (2 * nearPlane) / (right - left);
	var y = (2 * nearPlane) / (top - bottom);
	var perspectiveMatrix = [
		x,0,a,0,
		0,y,b,0,
		0,0,c,d,
		0,0,-1,0
	];

	var modelViewMatrix = [
		1,0,0,0,
		0,1,0,0,
		0,0,1,0,
		0,0,0,1
	];

	var vertexPosAttribLocation = gl.getAttribLocation(gl.program,'vertexPosition');
	gl.vertexAttribPointer(vertexPosAttribLocation,3.0,gl.FLOAT,false,0,0);
	var uModelViewMatrix = gl.getUniformLocation(gl.program,'modelViewMatrix');
	var uPerspectiveMatrix = gl.getUniformLocation(gl.program,'perspectiveMatrix');

	gl.uniformMatrix4fv(uModelViewMatrix,false,new Float32Array(perspectiveMatrix));
	gl.uniformMatrix4fv(uPerspectiveMatrix,false,new Float32Array(modelViewMatrix));

	switchColor();


}




