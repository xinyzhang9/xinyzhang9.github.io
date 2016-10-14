Array.prototype.clone = function() {
				return this.slice(0);
			};
			var poem = [
			'和','田','沙','暖','玉','难','寻',
			'随','我','篱','落','野','花','馨',
			'冰','弦','在','手','长','相','忆',
			'墨','笔','如','一','久','沉','吟',
			'苍','猿','赋','曲','起','秋','色',
			'归','雁','衔','书','空','好','音',
			'醉','卧','酒','家','客','识','不',
			'半','生','修','道','只','缘','君',
			];
			function shuffle(array) {
			    var counter = array.length;
			    var new_array = array.clone();

			    // While there are elements in the array
			    while (counter > 0) {
			        // Pick a random index
			        var index = Math.floor(Math.random() * counter);

			        // Decrease counter by 1
			        counter--;
			        // And swap the last element with it
			        var temp = new_array[counter];
			        new_array[counter] = new_array[index];
			        new_array[index] = temp;
			    }
			    var res = [];
			    var c = 0;
			    //add positions
			    for(var i = 1; i <= 8; i++){
			    	for(var j = 1; j <=7; j++){
			    		res.push(new_array[c]);
			    		res.push(j);
			    		res.push(i);
			    		c += 1;
			    	}
			    }
			    return res;
			}

			function transform_line(array,line_index,s1,s2,s3,s4,s5,s6,s7){
				var res = array.clone();
				var indexes = [res.indexOf(s1),res.indexOf(s2),res.indexOf(s3),res.indexOf(s4),res.indexOf(s5),res.indexOf(s6),res.indexOf(s7)];
				for(var i = 1; i <= 7; i++){
					var tmp1 = res[indexes[i-1]+1];
					var tmp2 = res[indexes[i-1]+2];

					for(var j = 0; j < res.length; j+=3){
						if((res[j+1]) == i && (res[j+2]) == line_index){
							res[j+1] = tmp1;
							res[j+2] = tmp2;
							break; 
						}
					}
					res[indexes[i-1]+1] = i;
					res[indexes[i-1]+2] = line_index;
				}
				return res;
			}


			function swap(array,i,j){
				var tmp = array[i];
				array[i] = array[j];
				array[j] = tmp;
			}


			var table = shuffle(poem);
			var table2 = transform_line(table,1,'和','田','沙','暖','玉','难','寻');
			var table3 = transform_line(table2,2,'随','我','篱','落','野','花','馨');
			var table4 = transform_line(table3,3,'冰','弦','在','手','长','相','忆');
			var table5 = transform_line(table4,4,'墨','笔','如','一','久','沉','吟');
			var table6 = transform_line(table5,5,'苍','猿','赋','曲','起','秋','色');
			var table7 = transform_line(table6,6,'归','雁','衔','书','空','好','音');
			var table8 = transform_line(table7,7,'醉','卧','酒','家','客','识','不');
			var table9 = transform_line(table8,8,'半','生','修','道','只','缘','君');

			var special = ['和','我','在','一','起','好','不'];
			var camera, scene, renderer;
			var controls;
			var objects = [];
			var targets = { table:[],table2:[],table3:[],table4:[],table5:[],table6:[],table7:[],table8:[],table9:[],helix:[] };

			var count = 0;
			var timer;

			init();
			animate();
			function init() {
				var audio = new Audio('loveletter.mp3');
				audio.play();
				camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 10000 );
				camera.position.z = 3000;
				scene = new THREE.Scene();
				// table
				for ( var i = 0; i < table.length; i += 3 ) {
					var element = document.createElement( 'div' );
					//set id
					element.id = table[i];
					element.className = 'element';
					element.style.backgroundColor = 'rgba(0,127,127,' + ( Math.random() * 0.5 + 0.25 ) + ')';
					var symbol = document.createElement( 'div' );
					symbol.className = 'symbol';
					symbol.textContent = table[ i ];
					element.appendChild( symbol );
					
					var object = new THREE.CSS3DObject( element );
					object.position.x = Math.random() * 4000 - 2000;
					object.position.y = Math.random() * 4000 - 2000;
					object.position.z = Math.random() * 4000 - 2000;
					scene.add( object );
					objects.push( object );
					//
					var object = new THREE.Object3D();
					object.position.x = ( table[ i + 1 ] * 140 ) - 550;
					object.position.y = - ( table[ i + 2 ] * 180 ) + 990;
					targets.table.push( object );
				}

				for ( var i = 0; i < table2.length; i+=3) {
					//
					var object = new THREE.Object3D();
					object.position.x = ( table2[ i + 1 ] * 140 ) - 550;
					object.position.y = - ( table2[ i + 2 ] * 180 ) + 990;
					targets.table2.push( object );
				}

				for ( var i = 0; i < table3.length; i += 3 ) {
					//
					var object = new THREE.Object3D();
					object.position.x = ( table3[ i + 1 ] * 140 ) - 550;
					object.position.y = - ( table3[ i + 2 ] * 180 ) + 990;
					targets.table3.push( object );
				}

				for ( var i = 0; i < table4.length; i += 3 ) {
					//
					var object = new THREE.Object3D();
					object.position.x = ( table4[ i + 1 ] * 140 ) - 550;
					object.position.y = - ( table4[ i + 2 ] * 180 ) + 990;
					targets.table4.push( object );
				}

				for ( var i = 0; i < table5.length; i += 3 ) {
					//
					var object = new THREE.Object3D();
					object.position.x = ( table5[ i + 1 ] * 140 ) - 550;
					object.position.y = - ( table5[ i + 2 ] * 180 ) + 990;
					targets.table5.push( object );
				}

				for ( var i = 0; i < table6.length; i += 3 ) {
					//
					var object = new THREE.Object3D();
					object.position.x = ( table6[ i + 1 ] * 140 ) - 550;
					object.position.y = - ( table6[ i + 2 ] * 180 ) + 990;
					targets.table6.push( object );
				}

				for ( var i = 0; i < table7.length; i += 3 ) {
					//
					var object = new THREE.Object3D();
					object.position.x = ( table7[ i + 1 ] * 140 ) - 550;
					object.position.y = - ( table7[ i + 2 ] * 180 ) + 990;
					targets.table7.push( object );
				}

				for ( var i = 0; i < table8.length; i += 3 ) {
					//
					var object = new THREE.Object3D();
					object.position.x = ( table8[ i + 1 ] * 140 ) - 550;
					object.position.y = - ( table8[ i + 2 ] * 180 ) + 990;
					targets.table8.push( object );
				}

				for ( var i = 0; i < table9.length; i += 3 ) {
					//
					var object = new THREE.Object3D();
					object.position.x = ( table9[ i + 1 ] * 140 ) - 550;
					object.position.y = - ( table9[ i + 2 ] * 180 ) + 990;
					targets.table9.push( object );
				}


				var vector = new THREE.Vector3();
				console.log(objects.length);
				for ( var i = 0, l = objects.length; i < l; i ++ ) {
					var phi = i * 0.175 + Math.PI;
					var object = new THREE.Object3D();
					object.position.x = 900 * Math.sin( phi );
					object.position.y = - ( i * 8 ) + 450;
					object.position.z = 900 * Math.cos( phi );
					vector.x = object.position.x * 2;
					vector.y = object.position.y;
					vector.z = object.position.z * 2;
					object.lookAt( vector );
					targets.helix.push( object );
				}

				//
				renderer = new THREE.CSS3DRenderer();
				renderer.setSize( window.innerWidth, window.innerHeight );
				renderer.domElement.style.position = 'absolute';
				document.getElementById( 'container' ).appendChild( renderer.domElement );
				//
				controls = new THREE.TrackballControls( camera, renderer.domElement );
				controls.rotateSpeed = 0.5;
				controls.minDistance = 500;
				controls.maxDistance = 6000;
				controls.addEventListener( 'change', render );

				var button = document.getElementById('solve');
				button.addEventListener('click',function( event ){
					if(count == 0){
						poem.slice(count*7,count*7+7).forEach(function(id){
							document.getElementById(id).style.backgroundColor = 'rgba(0,51,255,' + ( Math.random() * 0.25 + 0.7 ) + ')';
						})
						transform( targets.table2, 2000 );
						count ++;
					}else if(count == 1){
						poem.slice(count*7,count*7+7).forEach(function(id){
							document.getElementById(id).style.backgroundColor = 'rgba(0,58,219,' + ( Math.random() * 0.25 + 0.7 ) + ')';
						})
						transform( targets.table3, 2000 );
						count ++;
					}else if(count == 2){
						poem.slice(count*7,count*7+7).forEach(function(id){
							document.getElementById(id).style.backgroundColor = 'rgba(0,66,182,' + ( Math.random() * 0.25 + 0.7 ) + ')';
						})
						transform( targets.table4, 2000 );
						count ++;
					}else if(count == 3){
						poem.slice(count*7,count*7+7).forEach(function(id){
							document.getElementById(id).style.backgroundColor = 'rgba(0,73,146,' + ( Math.random() * 0.25 + 0.7 ) + ')';
						})
						transform( targets.table5, 2000 );
						count ++;
					}else if(count == 4){
						poem.slice(count*7,count*7+7).forEach(function(id){
							document.getElementById(id).style.backgroundColor = 'rgba(0,80,109,' + ( Math.random() * 0.25 + 0.7 ) + ')';
						})
						transform( targets.table6, 2000 );
						count ++;
					}else if(count == 5){
						poem.slice(count*7,count*7+7).forEach(function(id){
							document.getElementById(id).style.backgroundColor = 'rgba(0,87,73,' + ( Math.random() * 0.25 + 0.7 ) + ')';
						})
						transform( targets.table7, 2000 );
						count ++;
					}else if(count == 6){
						poem.slice(count*7,count*7+7).forEach(function(id){
							document.getElementById(id).style.backgroundColor = 'rgba(0,95,36,' + ( Math.random() * 0.25 + 0.7 ) + ')';
						})
						transform( targets.table8, 2000 );
						count ++;
					}else if(count == 7){
						poem.slice(count*7,count*7+7).forEach(function(id){
							document.getElementById(id).style.backgroundColor = 'rgba(0,102,0,' + ( Math.random() * 0.25 + 0.7 ) + ')';
						})
						transform( targets.table9, 2000 );
						count ++;
					}else if(count == 8){
						special.forEach(function(id){
							document.getElementById(id).style.backgroundColor = 'rgba(255, 104, 104,' + ( Math.random() * 0.25 + 0.7 ) + ')';
						})
						count ++;
					}else if(count == 9){
						transform(targets.helix,2000);
						render1();
						count++;
						document.getElementById('notice').innerHTML = '舵主，这首诗只为你而作。       -- 阳哥'
					}
					else{
						location.reload();
					}
				});

				transform(targets.table, 2000 );
				//
				window.addEventListener( 'resize', onWindowResize, false );
			}
			function transform( targets, duration ) {
				TWEEN.removeAll();
				for ( var i = 0; i < objects.length; i ++ ) {
					var object = objects[ i ];
					var target = targets[ i ];
					new TWEEN.Tween( object.position )
						.to( { x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration )
						.easing( TWEEN.Easing.Exponential.InOut )
						.start();
					new TWEEN.Tween( object.rotation )
						.to( { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration )
						.easing( TWEEN.Easing.Exponential.InOut )
						.start();
				}
				if(count !== 9){
					new TWEEN.Tween( this )
					.to( {}, duration * 2 )
					.onUpdate( render )
					.start();
				}else{
					new TWEEN.Tween( this )
					.to( {}, duration * 1314 )
					.onUpdate( render1 )
					.start();
				}
				
			}
			function onWindowResize() {
				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize( window.innerWidth, window.innerHeight );
				render();
			}
			function animate() {
				requestAnimationFrame( animate );
				TWEEN.update();
				controls.update();
			}
			function render() {
				renderer.render( scene, camera );
			}
			function render1(){
				timer = Date.now()*0.0005;
				camera.position.x -= Math.cos(timer)*200;
				camera.position.z += Math.sin(timer)*200;
				camera.lookAt(scene.position);
				renderer.render( scene, camera );
			}