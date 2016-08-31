var canvas,
	gl,
	cubeVerticesBuffer,
	cubeVerticesTextureCoordBuffer,
	cubeVerticesIndexBuffer;

var	cubeRotation = 0.0;
var lastCubeUpdateTime = 0;

var cubeImage;
var cubeTexture;

var mvMatrix,
	shaderProgram,
	vertexPositionAttribute,
	textureCoordAttribute,
	perspectiveMatrix;

function start(){
	canvas = document.getElementById('c');
	canvas.width = document.body.clientWidth;
	canvas.height = document.body.clientHeight;
	initWebGL();

	if (gl){
		gl.clearColor(0.0,0.0,0.0,1.0);
		gl.clearDepth(1.0);
		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LEQUAL);

		initShaders();
		initBuffers();
		initTextures();

		setInterval(drawScene,15);
	}
}

function initWebGL(){
	gl = null;
	try{
		gl = canvas.getContext('webgl');
	}
	catch(e){

	}
	if(!gl){
		alert('Unable to initialize WebGL. Your browser may not support it.');
	}
}

function initBuffers(){
	cubeVerticesBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,cubeVerticesBuffer);
	var vertices = [
		//front face
		-1.0,-1.0,1.0,
		1.0,-1.0,1.0,
		1.0,1.0,1.0,
		-1.0,1.0,1.0,
		//back face
		-1.0,-1.0,-1.0,
		-1.0,1.0,-1.0,
		1.0,1.0,-1.0,
		1.0,-1.0,-1.0,
		//top face
		-1.0,1.0,-1.0,
		-1.0,1.0,1.0,
		1.0,1.0,1.0,
		1.0,1.0,-1.0,
		//bottom face
		-1.0,-1.0,-1.0,
		1.0,-1.0,-1.0,
		1.0,-1.0,1.0,
		-1.0,-1.0,1.0,
		//right face
		1.0,-1.0,-1.0,
		1.0,1.0,-1.0,
		1.0,1.0,1.0,
		1.0,-1.0,1.0,
		//left face
		-1.0,-1.0,-1.0,
		-1.0,-1.0,1.0,
		-1.0,1.0,1.0,
		-1.0,1.0,-1.0
	];
	gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertices),gl.STATIC_DRAW);
	cubeVerticesTextureCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,cubeVerticesTextureCoordBuffer);

	var textureCoordinates = [
		//front
		0.0,0.0,
		1.0,0.0,
		1.0,1.0,
		0.0,1.0,
		//back
		0.0,0.0,
		1.0,0.0,
		1.0,1.0,
		0.0,1.0,
		//top
		0.0,0.0,
		1.0,0.0,
		1.0,1.0,
		0.0,1.0,
		//bottom
		0.0,0.0,
		1.0,0.0,
		1.0,1.0,
		0.0,1.0,
		//right
		0.0,0.0,
		1.0,0.0,
		1.0,1.0,
		0.0,1.0,
		//left
		0.0,0.0,
		1.0,0.0,
		1.0,1.0,
		0.0,1.0
	];

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates),gl.STATIC_DRAW);

	cubeVerticesIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,cubeVerticesIndexBuffer);

	var cubeVertexIndices = [
		0,1,2,0,2,3,//front
		4,5,6,4,6,7,//back
		8,9,10,8,10,11,//top
		12,13,14,12,14,15,//bottom
		16,17,18,16,18,19,//right
		20,21,22,20,22,23//left
	];

	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(cubeVertexIndices),gl.STATIC_DRAW);
}

function initTextures(){
	cubeTexture = gl.createTexture();
	cubeImage = new Image();
	cubeImage.onload = function(){
		handleTextureLoaded(cubeImage,cubeTexture);
	}
	cubeImage.src = "cubetexture4.jpg";
}

function handleTextureLoaded(image,texture){
	console.log("handleTextureLoaded, image = " + image);
	gl.bindTexture(gl.TEXTURE_2D,texture);
	gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image);
	gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_NEAREST);
	gl.generateMipmap(gl.TEXTURE_2D);
	gl.bindTexture(gl.TEXTURE_2D,null);

}

function drawScene(){
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	var width = document.body.clientWidth;
	var height = document.body.clientHeight;
	perspectiveMatrix = makePerspective(45,width/height,0.1,100.0);
	loadIdentity();
	mvTranslate([-0.0,0.0,-6.0]);
	mvPushMatrix();
	mvRotate(cubeRotation,[1,0,1]);

	//draw the cube
	gl.bindBuffer(gl.ARRAY_BUFFER,cubeVerticesBuffer);
	gl.vertexAttribPointer(vertexPositionAttribute,3,gl.FLOAT,false,0,0);
	//set texture coordinates
	gl.bindBuffer(gl.ARRAY_BUFFER,cubeVerticesTextureCoordBuffer);
	gl.vertexAttribPointer(textureCoordAttribute,2,gl.FLOAT,false,0,0);

	//specify the texture to map onto the faces
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D,cubeTexture);
	gl.uniform1i(gl.getUniformLocation(shaderProgram,'uSampler'),0);

	//draw the cube
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,cubeVerticesIndexBuffer);
	setMatrixUniforms();
	gl.drawElements(gl.TRIANGLES,36,gl.UNSIGNED_SHORT,0);

	//restore the original matrix
	mvPopMatrix();

	var currentTime = (new Date).getTime();
	if(lastCubeUpdateTime){
		var delta = currentTime - lastCubeUpdateTime;
		cubeRotation += (30 * delta) / 1000.0;
	}

	lastCubeUpdateTime = currentTime;
}

function initShaders() {
  var fragmentShader = getShader(gl, "shader-fs");
  var vertexShader = getShader(gl, "shader-vs");

  // Create the shader program

  shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("Unable to initialize the shader program: " + gl.getProgramInfoLog(shader));
  }

  gl.useProgram(shaderProgram);

  vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
  gl.enableVertexAttribArray(vertexPositionAttribute);

  textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
  gl.enableVertexAttribArray(textureCoordAttribute);
}

//
// getShader
//
// Loads a shader program by scouring the current document,
// looking for a script with the specified ID.
//
function getShader(gl, id) {
  var shaderScript = document.getElementById(id);

  // Didn't find an element with the specified ID; abort.

  if (!shaderScript) {
    return null;
  }

  // Walk through the source element's children, building the
  // shader source string.

  var theSource = "";
  var currentChild = shaderScript.firstChild;

  while(currentChild) {
    if (currentChild.nodeType == 3) {
      theSource += currentChild.textContent;
    }

    currentChild = currentChild.nextSibling;
  }

  // Now figure out what type of shader script we have,
  // based on its MIME type.

  var shader;

  if (shaderScript.type == "x-shader/x-fragment") {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if (shaderScript.type == "x-shader/x-vertex") {
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else {
    return null;  // Unknown shader type
  }

  // Send the source to the shader object

  gl.shaderSource(shader, theSource);

  // Compile the shader program

  gl.compileShader(shader);

  // See if it compiled successfully

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
    return null;
  }

  return shader;
}

//
// Matrix utility functions
//

function loadIdentity() {
  mvMatrix = Matrix.I(4);
}

function multMatrix(m) {
  mvMatrix = mvMatrix.x(m);
}

function mvTranslate(v) {
  multMatrix(Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4());
}

function setMatrixUniforms() {
  var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
  gl.uniformMatrix4fv(pUniform, false, new Float32Array(perspectiveMatrix.flatten()));

  var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
  gl.uniformMatrix4fv(mvUniform, false, new Float32Array(mvMatrix.flatten()));
}

var mvMatrixStack = [];

function mvPushMatrix(m) {
  if (m) {
    mvMatrixStack.push(m.dup());
    mvMatrix = m.dup();
  } else {
    mvMatrixStack.push(mvMatrix.dup());
  }
}

function mvPopMatrix() {
  if (!mvMatrixStack.length) {
    throw("Can't pop from an empty matrix stack.");
  }

  mvMatrix = mvMatrixStack.pop();
  return mvMatrix;
}

function mvRotate(angle, v) {
  var inRadians = angle * Math.PI / 180.0;
  var m = Matrix.Rotation(inRadians, $V([v[0], v[1], v[2]])).ensure4x4();
  multMatrix(m);
}

