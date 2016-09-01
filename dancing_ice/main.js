window.onload = main;

var canvas,
	gl,
	ratio,
	vertices,
	velocities,
	colorLoc,
	cw,
	ch,
	numLines = 30000;


function main(){
	canvas = document.getElementById('c');
	gl = canvas.getContext('webgl');
	if(!gl){
		alert('Unable to load Webgl context. Your browser may not support it!');
		return;
	}
	cw = window.innerWidth;
	ch = window.innerHeight;
	canvas.width = cw;
	canvas.height = ch;
	gl.viewport(0,0,canvas.width,canvas.height);

	//load vertex shader
	var vertexShaderScript = document.getElementById('shader-vs');
	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vertexShader,vertexShaderScript.text);
	gl.compileShader(vertexShader);
	if(!gl.getShaderParameter(vertexShader,gl.COMPILE_STATUS)){
		alert('Error while compiling the vertex shader!');
		gl.deleteShader(vertexShader);
		return;
	}
	//load fragment shader
	var fragmentShaderScript = document.getElementById('shader-fs');
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fragmentShader,fragmentShaderScript.text);
	gl.compileShader(fragmentShader);
	if(!gl.getShaderParameter(fragmentShader,gl.COMPILE_STATUS)){
		alert('Error while compiling the fragment shader!');
		gl.deleteShader(fragmentShader);
		return;
	}

	//create shader program
	gl.program = gl.createProgram();
	gl.attachShader(gl.program,vertexShader);
	gl.attachShader(gl.program,fragmentShader);
	gl.linkProgram(gl.program);
	if(!gl.getProgramParameter(gl.program,gl.LINK_STATUS)){
		alert("Error while initializing shaders!");
		gl.deleteProgram(gl.program);
		gl.deleteShader(vertexShader);
		gl.deleteShader(fragmentShader);
		return;
	}

	gl.useProgram(gl.program);

	//get vertexPosition attribute from the linked shader program
	var vertexPosition = gl.getAttribLocation(gl.program,"vertexPosition");

	//enable vertexPosition vertex attribute array
	gl.enableVertexAttribArray(vertexPosition);

	//clear color buffer with black
	gl.clearColor(0.0,0.0,0.0,1.0);

	//clear depth buffer
	gl.clearDepth(1.0);

	//disable depth test
	gl.enable(gl.BLEND);
	gl.disable(gl.DEPTH_TEST);
	gl.blendFunc(gl.SRC_ALPHA,gl.ONE);

	//create vertex buffer
	var vertexBuffer = gl.createBuffer();

	//bind the buffer to ARRAY_BUFFER
	gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);

	vertices = [];
	ratio = cw/ch;
	velocities = [];
	for(var i = 0; i < numLines; i++){
		vertices.push(0,0,1.83);
		velocities.push((Math.random()*2-1)*0.05,(Math.random()*2-1)*0.05,0.93 + Math.random()*0.02);
	}
	vertices = new Float32Array(vertices);
	velocities = new Float32Array(velocities);

	gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.DYNAMIC_DRAW);

	//clear color buffer and depth buffer
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	//define the viewing frustum parameters
	var fieldOfView = 30.0;
	var aspectRatio = canvas.width / canvas.height;
	var nearPlane = 1.0;
	var farPlane = 10000.0;
	var top = nearPlane * Math.tan(fieldOfView * Math.PI / 360.0);
	var bottom = -top;
	var right = top * aspectRatio;
	var left = -right;

	//create the perspective matrix
	var a = (right + left) / (right - left);
	var b = (top + bottom) / (top - bottom);
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

	//create the modelview matrix
	var modelViewMatrix = [
		1,0,0,0,
		0,1,0,0,
		0,0,1,0,
		0,0,0,1
	];

	//get the vertex position attribute location
	var vertexPosAttribLocation = gl.getAttribLocation(gl.program,'vertexPosition');

	//specify the location and format of the vertex position attribute
	gl.vertexAttribPointer(vertexPosAttribLocation,3.0,gl.FLOAT,false,0,0);

	//get the location of modelviewMatrix uniform variable
	var uModelViewMatrix = gl.getUniformLocation(gl.program,'modelViewMatrix');

	//get the location of the perspectiveMatrix uniform variable.
	var uPerspectiveMatrix = gl.getUniformLocation(gl.program,'perspectiveMatrix');

	//set the values and format
	gl.uniformMatrix4fv(uModelViewMatrix,false,new Float32Array(perspectiveMatrix));
	gl.uniformMatrix4fv(uPerspectiveMatrix,false,new Float32Array(modelViewMatrix));

	animate();

}

function animate(){
	requestAnimationFrame(animate);
	draw();
}

function draw(){
	var i, n = vertices.length, p, bp;
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


