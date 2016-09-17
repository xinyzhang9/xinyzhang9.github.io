function playGround(){
	var ch1 = new zhuge();
	var ch2 = new wangsitu();
	var count1 = 0;
	var count2 = 0;
	var enable = true;
	var isPlay = true;
	this.initialize = function(){
		var bgm = new Audio('assets/mp3/preshow.mp3');
		bgm.play();
		$(document).ready(function(){
			$(document).keydown(function(e){
				if(e.keyCode == 81 && isPlay && enable){ //q
					document.getElementById('stage_gif').src = "assets/gif/action_10.gif";
					ch2.health-=2;
					var audio = new Audio('assets/mp3/cubizhiyu.mp3');
					audio.play();
					enable = false;
					setTimeout(function(){ enable=true }, 1000);
					
				}else if(e.keyCode == 87 && isPlay && enable){ //w
					document.getElementById('stage_gif').src = "assets/gif/action_11.gif";	
					ch2.health-=5;
					ch1.health = ch1.health <90?ch1.health+10:100
					var audio = new Audio('assets/mp3/raoshe.mp3');
					audio.play();
					enable = false;
					setTimeout(function(){ enable=true }, 1200);			
				}else if(e.keyCode == 69 && isPlay && enable){ //e
					document.getElementById('stage_gif').src = "assets/gif/action_9.gif";	
					ch2.health-=10;
					var audio = new Audio('assets/mp3/wuchilaozei.mp3');
					audio.play();
					var audio2 = new Audio('assets/mp3/wangwangwang.mp3');
					audio2.play();
					enable = false;
					setTimeout(function(){ enable=true }, 7200);	

				}else if(e.keyCode == 65 && isPlay && enable){ //a
					document.getElementById('stage_gif').src = "assets/gif/action_8.gif";	
					ch2.health-=5;
					var audio = new Audio('assets/mp3/qinshou.mp3');
					audio.play();	
					enable = false;
					setTimeout(function(){ enable=true }, 1000);
				}else if(e.keyCode == 83 && isPlay && enable){ //s
					document.getElementById('stage_gif').src = "assets/gif/action_6.gif";	
					ch2.health-=30;
					var audio = new Audio('assets/mp3/houyanwuchi.mp3');
					audio.play();	
					enable = false;
					setTimeout(function(){ enable=true }, 4000);		
				}else if(e.keyCode == 68 && isPlay && enable){ //d
					document.getElementById('stage_gif').src = "assets/gif/action_14.gif";
					ch1.health-=10;
					ch2.health-=10;
					var audio = new Audio('assets/mp3/wang_hehe.mp3');
					audio.play();
					var audio2 = new Audio('assets/mp3/zhuge_haha.mp3');
					audio2.play();	
					enable = false;
					setTimeout(function(){ enable=true }, 8000);


				}else if(e.keyCode == 73 && isPlay && enable){ //i
					document.getElementById('stage_gif').src = "assets/gif/action_13.gif";	
					ch1.health-=5;
					var audio = new Audio('assets/mp3/kongming.mp3');
					audio.play();	
					enable = false;
					setTimeout(function(){ enable=true }, 1200);			
				}else if(e.keyCode == 79 && isPlay && enable){ //o
					document.getElementById('stage_gif').src = "assets/gif/action_7.gif";	
					ch2.health = ch2.health<=90?ch2.health+10:100;
					var audio = new Audio('assets/mp3/wang_hehe.mp3');
					audio.play();			
					enable = false;
					setTimeout(function(){ enable=true }, 1000);
				}else if(e.keyCode == 80 && isPlay && enable){ //p
					document.getElementById('stage_gif').src = "assets/gif/action_12.gif";	
					ch1.health -= 7;
					var audio = new Audio('assets/mp3/niruo.mp3');
					audio.play();
					enable = false;
					setTimeout(function(){ enable=true }, 2000);
				}else if(e.keyCode == 74 && isPlay && enable){ //j
					document.getElementById('stage_gif').src = "assets/gif/action_1.gif";	
					ch1.health -= 10;
					var audio = new Audio('assets/mp3/yizhiwangba.mp3');
					audio.play();	
					enable = false;
					setTimeout(function(){ enable=true }, 2000);		
				}else if(e.keyCode == 75 && isPlay && enable){ //k
					document.getElementById('stage_gif').src = "assets/gif/action_5.gif";	
					ch1.health -= 10;
					var audio = new Audio('assets/mp3/zhugecunfu.mp3');
					audio.play();	
					var audio2 = new Audio('assets/mp3/zhukou.mp3');
					audio2.play();	
					enable = false;
					setTimeout(function(){ enable=true }, 2000);		
				}else if(e.keyCode == 76 && isPlay && enable){ //l
					document.getElementById('stage_gif').src = "assets/gif/action_2.gif";	
					ch1.health -= 20;
					var audio = new Audio('assets/mp3/wang_die.mp3');
					audio.play();		
					enable = false;
					setTimeout(function(){ enable=true }, 5000);		
				}
			})

		})
		
}
	this.mainLoop = function(){
		ch1.check();
		ch2.check();
		if(!(ch1.isLive && ch2.isLive)){
			//wangsitu die
			if(count1 <1 && ch1.isLive){
				var audio = new Audio('assets/mp3/wang_die.mp3');
				audio.play();
				document.getElementById('wst').src = "assets/img/wangsitu_bw.gif";
				count1+=1;
			}
			//zhuge die
			if(count2 <1 && ch2.isLive){
				var audio = new Audio('assets/mp3/zhuge_die.mp3');
				audio.play();
				document.getElementById('zgl').src = "assets/img/zhuge_bw.gif";
				count2+=1;
			}
			
			isPlay = false;
		}

	}
	this.checkplay = function(){
		return isPlay;
	}

}

function zhuge(){
	this.health = 100;
	var maxHealth = 100;
	this.isLive = true;
	var canvas = document.getElementById('health1');
	canvas.width = 200
	canvas.height = 70
	var context = canvas.getContext('2d');
	var object1 = {
		x: 20,
		y: 30,
		width: 200,
		height: 20
	};
		// Render Loop
		this.check = function(){
		    // Clear the canvas
		    canvas.width = canvas.width;
		    this.health = this.health >0?this.health:0;
		    // Calculate health bar percent
		    var percent = this.health / maxHealth;
		    

		    context.fillStyle = "Red";
		    context.font = "18px sans-serif";
		    context.fillText("Life " + this.health +"%", 20, 20);

		    context.fillStyle = "black";
		    context.fillRect(object1.x, object1.y, object1.width, object1.height);

		    context.fillStyle = "red";
		    context.fillRect(object1.x, object1.y, object1.width * percent, object1.height);
		    if(this.health <=0){
		    	this.isLive = false;
		    	document.getElementById('stage_gif').src = "assets/img/zhuge_die.gif";

		    }
		}

	}
	function wangsitu(){
		this.health = 100;
		var maxHealth = 100;
		this.isLive = true;
		var canvas = document.getElementById('health2');
		canvas.width = 200
		canvas.height = 70
		var context = canvas.getContext('2d');
		var object1 = {
			x: 20,
			y: 30,
			width: 200,
			height: 20
		};
		// Render Loop
		this.check = function(){
		    // Clear the canvas
		    canvas.width = canvas.width;
		    this.health = this.health >0?this.health:0;
		    
		    // Calculate health bar percent
		    var percent = this.health / maxHealth;

		    context.fillStyle = "Red";
		    context.font = "18px sans-serif";
		    context.fillText("Life " + this.health +"%", 20, 20);

		    context.fillStyle = "black";
		    context.fillRect(object1.x, object1.y, object1.width, object1.height);

		    context.fillStyle = "red";
		    context.fillRect(object1.x, object1.y, object1.width * percent, object1.height);

		    if(this.health <=0){
		    	this.isLive = false;
		    	document.getElementById('stage_gif').src = "assets/gif/action_3.gif";

		    }
		}

	}

	
