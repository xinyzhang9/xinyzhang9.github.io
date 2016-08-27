var gl,
	shaderProgram,
	vertices,
	matrix = mat4.create(),
	vertexCount = 30;

initGL();
createShaders();
createVertices();
draw();

function initGL(){
	var canvas = document.getElementById('canvas');
	gl = canvas.getContext('webgl');
	gl.viewport(0,0,canvas.width,canvas.height);
	gl.clearColor(1,1,1,1);
}

function createShaders(){

	var vertexShader = getShader(gl,"shader-vs");
	var fragmentShader = getShader(gl,"shader-fs");

	shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram,vertexShader);
	gl.attachShader(shaderProgram,fragmentShader);
	gl.linkProgram(shaderProgram);
	gl.useProgram(shaderProgram);

}

function createVertices(){
	vertices = [];

	for(var i = 0; i < vertexCount; i++){
		vertices.push(Math.random() * 2 -1);
		vertices.push(Math.random() * 2 -1);
		vertices.push(Math.random() * 2 -1);
	}
	var buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
	gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertices),gl.STATIC_DRAW);

	//get attribute
	var coords = gl.getAttribLocation(shaderProgram,'coords');
	// gl.vertexAttrib3f(coords,0.5,-0.5,0);
	gl.vertexAttribPointer(coords,3,gl.FLOAT,false,0,0);
	gl.enableVertexAttribArray(coords);
	gl.bindBuffer(gl.ARRAY_BUFFER,null);

	var pointSize = gl.getAttribLocation(shaderProgram,'pointSize');
	gl.vertexAttrib1f(pointSize,30);

	//get uniform
	var color = gl.getUniformLocation(shaderProgram,'color');
	gl.uniform4f(color,0.2,0,1,1);

}

function draw(){
	mat4.rotateX(matrix,matrix,0.007);
	mat4.rotateY(matrix,matrix,0.013);
	mat4.rotateZ(matrix,matrix,0.01);
	var transformMatrix = gl.getUniformLocation(shaderProgram,"transformMatrix");
	gl.uniformMatrix4fv(transformMatrix,false,matrix);
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.drawArrays(gl.TRIANGLES,0,vertexCount);
	requestAnimationFrame(draw);
}

function getShader(gl, id, type) {
  var shaderScript, theSource, currentChild, shader;
  
  shaderScript = document.getElementById(id);
  
  if (!shaderScript) {
    return null;
  }
  
  theSource = shaderScript.text;
  if (!type) {
    if (shaderScript.type == "x-shader/x-fragment") {
      type = gl.FRAGMENT_SHADER;
    } else if (shaderScript.type == "x-shader/x-vertex") {
      type = gl.VERTEX_SHADER;
    } else {
      // Unknown shader type
      return null;
    }
  }
  shader = gl.createShader(type);
  gl.shaderSource(shader, theSource);
    
  // Compile the shader program
  gl.compileShader(shader);  
    
  // See if it compiled successfully
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {  
      alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));  
      gl.deleteShader(shader);
      return null;  
  }
    
  return shader;
}