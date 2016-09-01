window.onload = main;
var options = {
  // this option is not actually in the UI
  fireEmitPositionSpread: {x:100,y:20},
  fireEmitRate: 1600,
  fireEmitRateSlider: {min:1,max:5000},
  fireSize: 40.0,
  fireSizeSlider: {min:2.0,max:100.0},
  fireSizeVariance:  100.0,
  fireSizeVarianceSlider: {min:0.0,max:100.0},
  fireEmitAngleVariance: 0.42,
  fireEmitAngleVarianceSlider: {min:0.0,max:Math.PI/2},
  fireSpeed: 200.0,
  fireSpeedSlider: {min:20.0,max:500},
  fireSpeedVariance: 80.0,
  fireSpeedVarianceSlider: {min:0.0,max:100.0},
  fireDeathSpeed: 0.003,
  fireDeathSpeedSlider: {min: 0.001, max: 0.05},
  fireTriangleness: 0.00015,
  fireTrianglenessSlider: {min:0.0, max:0.0003},
  fireTextureHue: 25.0,
  fireTextureHueSlider: {min:-180,max:180},
  fireTextureHueVariance: 15.0,
  fireTextureHueVarianceSlider: {min:0.0,max:180},
  fireTextureColorize: true,
  wind: true,
  omnidirectionalWind:false,
  windStrength:20.0,
  windStrengthSlider:{min:0.0,max:60.0},
  windTurbulance:0.0003,
  windTurbulanceSlider:{min:0.0,max:0.001},
  sparks: true,
  // some of these options for sparks are not actually available in the UI to save UI space
  sparkEmitRate: 6.0,
  sparkEmitSlider: {min:0.0,max:10.0},
  sparkSize: 10.0,
  sparkSizeSlider: {min:5.0,max:100.0},
  sparkSizeVariance: 20.0,
  sparkSizeVarianceSlider: {min:0.0,max:100.0},
  sparkSpeed: 400.0,
  sparkSpeedSlider: {min:20.0, max:700.0},
  sparkSpeedVariance: 80.0,
  sparkSpeedVarianceSlider: {min:0.0, max:100.0},
  sparkDeathSpeed: 0.0085,
  sparkDeathSpeedSlider: {min: 0.002, max: 0.05},
};
textureList = ["skull.png","circle.png","gradient.png","thicker_gradient.png","explosion.png","flame.png","smilie.png","heart.png"];
images = [];
textures = [];
currentTextureIndex = 2;
function loadTexture(textureName,index) {
  textures[index] = gl.createTexture();
  images[index] = new Image();
  images[index].onload = function() {handleTextureLoaded(images[index],index,textureName)};
  images[index].onerror = function() {alert("ERROR: texture " + textureName + " can't be loaded!"); console.error("ERROR: texture " + textureName + " can't be loaded!");};
  images[index].src = textureName;
  console.log("starting to load " + textureName);
}
function handleTextureLoaded(image,index,textureName) {
  console.log("loaded texture " + textureName);
  gl.bindTexture(gl.TEXTURE_2D, textures[index]);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.bindTexture(gl.TEXTURE_2D, null);
  // load the next texture
  if (index < textureList.length-1)
    loadTexture("textures/" + textureList[index+1],index+1);
  //texturesLoadedCount += 1;
  
}
function loadAllTextures() {
  var fireTextureCombobox = document.getElementById("fireTexture");
  fireTextureCombobox.onchange = function() {
    var image = document.getElementById("fireTextureVal");
    var newIndex = fireTextureCombobox.selectedIndex;
    image.src = "textures/" + textureList[newIndex];
    currentTextureIndex = newIndex;
  }
  for (var i = 0; i < textureList.length; i++) {
    fireTextureCombobox.options.add(new Option(textureList[i],i));
  }
  fireTextureCombobox.selectedIndex = 2;
  loadTexture("textures/" + textureList[0],0);
}
fireParticles = [];
sparkParticles = [];
function createFireParticle(emitCenter) {
  var size = randomSpread(options.fireSize,options.fireSize*(options.fireSizeVariance/100.0));
  var speed = randomSpread(options.fireSpeed,options.fireSpeed*options.fireSpeedVariance/100.0);
  var color = {};
  if (!options.fireTextureColorize)
    color = {r:1.0,g:1.0,b:1.0,a:0.5};
  else {
    var hue = randomSpread(options.fireTextureHue,options.fireTextureHueVariance);
    color = HSVtoRGB(convertHue(hue),1.0,1.0);
    color.a = 0.5;
  }
  var particle = {
    pos: random2DVec(emitCenter,options.fireEmitPositionSpread),
    vel: scaleVec(randomUnitVec(Math.PI/2,options.fireEmitAngleVariance),speed),
    size: {width:size,
           height:size},
    color: color,
};
  fireParticles.push(particle);
}
function createSparkParticle(emitCenter) {
  var size = randomSpread(options.sparkSize,options.sparkSize*(options.sparkSizeVariance/100.0));
  var origin = clone2DVec(emitCenter);
  var speed = randomSpread(options.sparkSpeed,options.sparkSpeed*options.sparkSpeedVariance/100.0);
  var particle = {
    origin: origin,
    pos: random2DVec(emitCenter,options.fireEmitPositionSpread),
    vel: scaleVec(randomUnitVec(Math.PI/2,options.fireEmitAngleVariance*2.0),speed),
    size: {width:size,
           height:size},
    color: {r:1.0, g:0.8, b:0.3, a: 1.0}
  };
  sparkParticles.push(particle);
}
var currentlyPressedKeys = {};
mouseDown = false;
mousePos = {};
function handleKeyDown(event) {
  currentlyPressedKeys[event.keyCode] = true;
}
function handleKeyUp(event) {
  currentlyPressedKeys[event.keyCode] = false;
}
function canvasCoordinates(canvas,pos) {
  var rect = canvas.getBoundingClientRect();
  return {x:pos.x-rect.left,y:pos.y-rect.top};
}
function handleMouseDown(event) {
 mouseDown = true;
 mousePos = canvasCoordinates(canvas,{x:event.clientX,y:event.clientY});
}
function handleMouseMove(event) {
 mousePos = canvasCoordinates(canvas,{x:event.clientX,y:event.clientY});
}
function handleMouseUp(event) {
 mouseDown = false;
}
function setupSlider(id,valueId,value,sliderMinMax,step,changeCallback) {
  var slider = document.getElementById(id);
  var sliderDiv = document.getElementById(valueId);
  console.log(id + " " + valueId);
  slider.min = sliderMinMax.min;
  slider.max = sliderMinMax.max;
  slider.step = step;
  slider.value = value;
  slider.oninput = function() {
    newValue = this.value;
    sliderDiv.innerHTML = newValue;
    changeCallback(newValue);
  };
  slider.oninput();
}
// initialze the scene
function main() {
  // document.getElementById("texture_setting").style.visibility = "hidden";
  // Get A WebGL context
  canvas = document.getElementById("canvas");
  gl = getWebGLContext(canvas);
  if (!gl) {
    return;
  }
  loadAllTextures();
  var tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
              new Uint8Array([255, 0, 0, 255])); // red
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  vertexBuffer = gl.createBuffer();
  colorBuffer = gl.createBuffer();
  squareTextureCoordinateVertices = gl.createBuffer();
  // setup GLSL program
  vertexShader = createShaderFromScriptElement(gl, "2d-vertex-shader");
  fragmentShader = createShaderFromScriptElement(gl, "2d-fragment-shader");
  program = createProgram(gl, [vertexShader, fragmentShader]);
  gl.useProgram(program);
  // look up where the vertex data needs to go.
  positionAttrib = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(positionAttrib);
  colorAttrib = gl.getAttribLocation(program, "a_color");
  gl.enableVertexAttribArray(colorAttrib);
  textureCoordAttribute = gl.getAttribLocation(program, "a_texture_coord");
  gl.enableVertexAttribArray(textureCoordAttribute);
  
  // lookup uniforms
  resolutionLocation = gl.getUniformLocation(program, "u_resolution");
  cameraLocation = gl.getUniformLocation(program, "cam_position");
  textureSamplerLocation = gl.getUniformLocation(program, "u_sampler")
  // setup UI
  setupSlider("fireEmitRate","fireEmitRateVal",options.fireEmitRate,options.fireEmitRateSlider,1,function(newValue) {options.fireEmitRate = +newValue;});
  setupSlider("fireSize","fireSizeVal",options.fireSize,options.fireSizeSlider,1,function(newValue) {options.fireSize = +newValue;});
  setupSlider("fireSizeVariance","fireSizeVarianceVal",options.fireSizeVariance,options.fireSizeVarianceSlider,0.01,function(newValue) {options.fireSizeVariance = +newValue;});
  setupSlider("fireEmitAngleVariance","fireEmitAngleVarianceVal",options.fireEmitAngleVariance,options.fireEmitAngleVarianceSlider,0.0001,function(newValue) {options.fireEmitAngleVariance = +newValue;});
  setupSlider("fireSpeed","fireSpeedVal",options.fireSpeed,options.fireSpeedSlider,0.01,function(newValue) {options.fireSpeed = +newValue;});
  setupSlider("fireSpeedVariance","fireSpeedVarianceVal",options.fireSpeedVariance,options.fireSpeedVarianceSlider,0.01,function(newValue) {options.fireSpeedVariance = +newValue;});
  setupSlider("fireDeathSpeed","fireDeathSpeedVal",options.fireDeathSpeed,options.fireDeathSpeedSlider,0.000001,function(newValue) {options.fireDeathSpeed = +newValue;});
  setupSlider("fireTriangleness","fireTrianglenessVal",options.fireTriangleness,options.fireTrianglenessSlider,0.000001,function(newValue) {options.fireTriangleness = +newValue;});
  setupSlider("fireTextureHue","fireTextureHueVal",options.fireTextureHue,options.fireTextureHueSlider,0.01,function(newValue) {
      options.fireTextureHue = +newValue;
      var hue = convertHue(options.fireTextureHue);
      document.getElementById("fireTextureHueVal").style.backgroundColor = rgbToHex(HSVtoRGB(hue,1.0,1.0));
  });
  setupSlider("fireTextureHueVariance","fireTextureHueVarianceVal",options.fireTextureHueVariance,options.fireTextureHueVarianceSlider,0.01,function(newValue) {options.fireTextureHueVariance = +newValue;});
  document.getElementById("fireTextureColorize").onchange = function() {
    options.fireTextureColorize = this.checked;
  };
  document.getElementById("sparks").onchange = function() {
    options.sparks = this.checked;
  };
  document.getElementById("wind").onchange = function() {
    options.wind = this.checked;
  };
  document.getElementById("omnidirectionalWind").onchange = function() {
    options.omnidirectionalWind = this.checked;
  };
  setupSlider("windStrength","windStrengthVal",options.windStrength,options.windStrengthSlider,0.01,function(newValue) {options.windStrength = +newValue;});
  setupSlider("windTurbulance","windTurbulanceVal",options.windTurbulance,options.windTurbulanceSlider,0.00001,function(newValue) {options.windTurbulance = +newValue;});
  document.onkeydown = handleKeyDown;
  document.onkeyup = handleKeyUp;
  canvas.onmousedown = handleMouseDown;
  document.onmouseup = handleMouseUp;
  document.onmousemove = handleMouseMove;
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
  gl.enable(gl.BLEND);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); //Prevents s-coordinate wrapping (repeating).
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); //Prevents t-coordinate wrapping (repeating).
  animloop();
  
}
// main program loop
function animloop() {
  requestAnimFrame(animloop);
  timing();
  logic();
  render();
}
// the timing function's only job is to calculate the framerate
frameTime = 18;
lastTime = time();
lastFPSDivUpdate = time();
function timing() {
  currentTime = time();
  frameTime = frameTime * 0.9 + (currentTime - lastTime) * 0.1;
  fps = 1000.0/frameTime;
  if (currentTime - lastFPSDivUpdate > 100) {
    document.getElementById("fps").innerHTML = "FPS: " + Math.round(fps);
    lastFPSDivUpdate = currentTime;
  }
  lastTime = currentTime;
}
function keyCodePressed(charVal) {
  return currentlyPressedKeys[charVal.charCodeAt(0)];
}
function time() {
  var d = new Date();
  var n = d.getTime();
  return n;
}
var particleDiscrepancy = 0;
var lastParticleTime = time();
var sparkParticleDiscrepancy = 0;
noise.seed(Math.random());
// calculate new positions for all the particles
function logic() {
  var currentParticleTime = time();
  var timeDifference = currentParticleTime - lastParticleTime;
  // we don't want to generate a ton of particles if the browser was minimized or something
  if (timeDifference > 100)
    timeDifference = 100;
  // update fire particles
  particleDiscrepancy += options.fireEmitRate*(timeDifference)/1000.0;
  while (particleDiscrepancy > 0) {
    createFireParticle({x:canvas.width/2,y:canvas.height/2+200});
    particleDiscrepancy -= 1.0;
  }
  particleAverage = {x:0,y:0};
  var numParts = fireParticles.length;
  for (var i = 0; i < numParts; i++) {
    particleAverage.x += fireParticles[i].pos.x/numParts;
    particleAverage.y += fireParticles[i].pos.y/numParts;
  }
  for (var i = 0; i < fireParticles.length; i++) {
    var x = fireParticles[i].pos.x;
    var y = fireParticles[i].pos.y;
    // apply wind to the velocity
    if (options.wind) {
      if (options.omnidirectionalWind)
        fireParticles[i].vel = addVecs(fireParticles[i].vel,scaleVec(unitVec((noise.simplex3(x / 500, y / 500, lastParticleTime*options.windTurbulance)+1.0)*Math.PI),options.windStrength));
      else
        fireParticles[i].vel = addVecs(fireParticles[i].vel,scaleVec(unitVec((noise.simplex3(x / 500, y / 500, lastParticleTime*options.windTurbulance)+1.0)*Math.PI*0.5),options.windStrength));
    }
    // move the particle
    fireParticles[i].pos = addVecs(fireParticles[i].pos,scaleVec(fireParticles[i].vel,timeDifference/1000.0));
    //var offAngle = angleBetweenVecs(fireParticles[i].vel,subVecs(particleAverage,));
    //console.log(offAngle);
  fireParticles[i].color.a -= options.fireDeathSpeed+Math.abs(particleAverage.x-fireParticles[i].pos.x)*options.fireTriangleness;//;Math.abs((fireParticles[i].pos.x-canvas.width/2)*options.fireTriangleness);
    if (fireParticles[i].pos.y <= -fireParticles[i].size.height*2 || fireParticles[i].color.a <= 0)
      markForDeletion(fireParticles,i);
  }
  fireParticles = deleteMarked(fireParticles);
  // update spark particles
  sparkParticleDiscrepancy += options.sparkEmitRate*(timeDifference)/1000.0;
  while (sparkParticleDiscrepancy > 0) {
    createSparkParticle({x:canvas.width/2,y:canvas.height/2+200});
    sparkParticleDiscrepancy -= 1.0;
  }
  for (var i = 0; i < sparkParticles.length; i++) {
    var x = sparkParticles[i].pos.x;
    var y = sparkParticles[i].pos.y;
    sparkParticles[i].vel = addVecs(sparkParticles[i].vel,scaleVec(unitVec((noise.simplex3(x / 500, y / 500, lastParticleTime*0.0003)+1.0)*Math.PI*0.5),20.0));
    sparkParticles[i].pos = addVecs(sparkParticles[i].pos,scaleVec(sparkParticles[i].vel,timeDifference/1000.0));
    sparkParticles[i].color.a -= options.sparkDeathSpeed;
    if (sparkParticles[i].pos.y <= -sparkParticles[i].size.height*2 || sparkParticles[i].color.a <= 0)
      markForDeletion(sparkParticles,i);
  }
  sparkParticles = deleteMarked(sparkParticles);
  document.getElementById("numParticles").innerHTML = "number of particles: " + (fireParticles.length + sparkParticles.length);
  lastParticleTime = currentParticleTime;
}
function render() {
  gl.clear(gl.COLOR_BUFFER_BIT);
    // set the resolution
  gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
  gl.uniform1i(textureSamplerLocation, 0);
  drawRects(fireParticles);
  if (options.sparks)
      drawRects(sparkParticles);
  console.log(particleAverage);
}
rectArray = [];
colorArray = [];
rects = [];
function concat_inplace(index,arr1,arr2) {
  for (var i = 0; i < arr2.length; i++) {
    arr1[index] = arr2[i];
    index += 1;
  }
  return index;
}
function drawRects(rects,textureIndex) {
  var index = 0;
  var colorIndex = 0;
  var texIndex = 0;
  rectArray = [];
  colorArray = [];
  textureCoordinates = [];
  for (var i = 0; i < rects.length; i++) {
      var x1 = rects[i].pos.x - rects[i].size.width/2;
      var x2 = rects[i].pos.x + rects[i].size.width/2;
      var y1 = rects[i].pos.y - rects[i].size.height/2;
      var y2 = rects[i].pos.y + rects[i].size.height/2;
      index = concat_inplace(index,rectArray,[
         x1, y1,
         x2, y1,
         x1, y2,
         x1, y2,
         x2, y1,
         x2, y2]);
      texIndex = concat_inplace(texIndex,textureCoordinates,[
         0.0, 0.0,
         1.0, 0.0,
         0.0, 1.0,
         0.0, 1.0,
         1.0, 0.0,
         1.0, 1.0
      ]);
      for (var ii = 0; ii < 6; ii++) {
        colorIndex = concat_inplace(colorIndex,colorArray,[
            rects[i].color.r,
            rects[i].color.g,
            rects[i].color.b,
            rects[i].color.a
          ]);
      }
  }
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, textures[currentTextureIndex]);
  gl.bindBuffer(gl.ARRAY_BUFFER, squareTextureCoordinateVertices);
  gl.vertexAttribPointer(textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates),
                gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.vertexAttribPointer(positionAttrib, 2, gl.FLOAT, false, 0, 0);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(rectArray), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.vertexAttribPointer(colorAttrib, 4, gl.FLOAT, false, 0, 0);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorArray), gl.STATIC_DRAW);
  gl.drawArrays(gl.TRIANGLES, 0, rects.length*6);
}
