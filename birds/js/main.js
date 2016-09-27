//main script


//define variables
var SCREEN_WIDTH = window.innerWidth,
	SCREEN_HEIGHT = window.innerHeight,
	SCREEN_WIDTH_HALF = SCREEN_WIDTH/2,
	SCREEN_HEIGHT_HALF = SCREEN_HEIGHT/2,

	camera,scene,renderer,
	bird,birds,
	boid,boids,
	stats;

var isMobile = false; //initiate as false
// device detection
if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) isMobile = true;

if(isMobile){
	maxBoids = 100;
}else{
	maxBoids = 400;
}

init();
animate();

function init(){
	camera = new THREE.PerspectiveCamera(75,SCREEN_WIDTH/SCREEN_HEIGHT,1,10000);
	camera.position.z = 450;
	scene = new THREE.Scene();
	birds = [];
	boids = [];
	for(var i = 0; i < maxBoids; i++){
		boid = boids[i] = new Boid();
		boid.position.x = Math.random()*400-200;
		boid.position.y = Math.random()*400-200;
		boid.position.z = Math.random()*400-200;
		boid.velocity.x = Math.random()*2-1;
		boid.velocity.y = Math.random()*2-1;
		boid.velocity.z = Math.random()*2-1;
		boid.setAvoidWalls(true);
		boid.setWorldSize(500,500,400);
		bird = birds[i] = new THREE.Mesh(new Bird(), new THREE.MeshBasicMaterial({
			color:Math.random()*0xffffff,
			side:THREE.DoubleSide
		}));
		bird.phase = Math.floor(Math.random()*62.83);
		scene.add(bird);
	}
	renderer = new THREE.CanvasRenderer();
	renderer.setClearColor(0x000000);
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(SCREEN_WIDTH,SCREEN_HEIGHT);
	document.addEventListener('mousemove',onDocumentMouseMove,false);
	document.body.appendChild(renderer.domElement);

	stats = new Stats();
	// document.getElementById('container').appendChild(stats.dom);

	window.addEventListener('resize',onWindowResize,false);

}

function onWindowResize(){
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth,window.innerHeight);
}

function onDocumentMouseMove(e){
	var vector = new THREE.Vector3(e.pageX - SCREEN_WIDTH_HALF,-e.pageY+SCREEN_HEIGHT_HALF,0);
	document.getElementById('notice').innerHTML = e.pageX+' , '+e.pageY+' , '+SCREEN_WIDTH_HALF + ' , '+SCREEN_HEIGHT_HALF;
	for(var i = 0; i < boids.length; i++){
		boid = boids[i];
		vector.z = boid.position.z;
		boid.repulse(vector);
	}
}

function animate(){
	requestAnimationFrame(animate);
	stats.begin();
	render();
	stats.end();
}

function render(){
	if(touched){
		var vector = new THREE.Vector3(pageX - SCREEN_WIDTH_HALF,-pageY+SCREEN_HEIGHT_HALF,0);
		document.getElementById('notice').innerHTML = pageX+' , '+pageY+' , '+SCREEN_WIDTH_HALF + ' , '+SCREEN_HEIGHT_HALF;
		for(var i = 0; i < boids.length; i++){
			boid = boids[i];
			vector.z = boid.position.z;
			boid.repulse(vector);
		}
	}
	for(var i = 0; i < birds.length; i++){
		boid = boids[i];
		boid.run(boids);
		bird = birds[i];
		bird.position.copy(boids[i].position);
		color = bird.material.color;
		// color.r = color.g = color.b = (500-bird.position.z)/1000;
		// console.log(bird.position.z);
		color.r = 0.5+bird.position.z/400;
		color.g = 0.5+bird.position.x/400;
		color.b = 0.5+bird.position.y/400;
		bird.rotation.y = Math.atan2(-boid.velocity.z,boid.velocity.x);
		bird.rotation.z = Math.asin(boid.velocity.y/boid.velocity.length());
		bird.phase = (bird.phase + (Math.max(0,bird.rotation.z)+0.1)) % 62.83;
		bird.geometry.vertices[5].y = bird.geometry.vertices[4].y = Math.sin(bird.phase)*5;

	}
	renderer.render(scene,camera);
}
















