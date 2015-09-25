function Splatter(fly){
	var sounds = ['ross1','ross2','ross3','ross4','smith1','smith2','smith3','trott1','trott2'];
	this.sound = sounds[Math.floor(Math.random() * sounds.length)] || sounds[0];
	this.type='splatter';
	this.z=1;

	// POSITIONING variables
	this.pos = fly.pos;
	this.width = fly.width;
	this.height= fly.height;

	// MESS variables
	this.mess=[];
	this.messIterations = 12;
	this.messDeviation = .2; //0-1
	this.minMessRange=20;
	this.maxMessRange=30;
	this.maxRangeRadius=.3; //0-1
	this.messAnimTime=3;
	this.maxLineWidth=3;

	//========================= functions ==========================\\

	this.draw = function(){
		this.animateMess();
		this.drawMess();
		this.drawCarcass();
		this.drawMessDebug()

	}

	this.logic = function(){
		if(this.mess.length==0){
			this.generateMess();
		}
	}

	this.generateMess = function(){
		for(var i=0;i<this.messIterations;i++){
			var distance = this.minMessRange + (Math.random() * this.maxMessRange);
			var angle = ((this.pos.a + ((this.maxRangeRadius*Math.random()*Math.PI) - (this.maxRangeRadius*Math.PI/2))) + (2*Math.PI) ) % (2*Math.PI)
			var forwardOrBack = (Math.random()<.6)? 1 : -1;

			//variance is odds of a random angle.
			angle = (Math.random()<this.messDeviation)? (this.pos.a + (Math.random()*Math.PI)) : angle;

			//vary color between yellow and green
			var blueHue = Math.round(Math.random() * 200); //0-200
			var redHue = (Math.random() < .5)? blueHue : 255; // 50% chance of yellow or green

			var point = {
				targetX : distance*Math.cos(angle)*forwardOrBack,
				targetY : distance*Math.sin(angle)*forwardOrBack,
				x:this.pos.x,
				y:this.pos.y,
				lineWidth:Math.round(Math.random()*this.maxLineWidth),
				color: 'rgb(' + redHue + ',255,' + blueHue + ')',
				ticks:0,
				type:'guts'
			}

			this.mess.push(point);
		}
	}

	this.drawMessDebug = function(){
		if(GAME.DEBUGON){
			for(var i=0;i<this.mess.length;i++){
				this.drawPoint(this.mess[i],'grey');
			}
		}
	}

	this.animateMess = function(){
		for(var i=0;i<this.mess.length;i++){
			var pos = this.mess[i];
			var timeRatio = pos.ticks/this.messAnimTime; //0-1
			if(timeRatio <1 ){
				pos.x = this.pos.x + pos.targetX * timeRatio;
				pos.y = this.pos.y + pos.targetY * timeRatio;
				pos.ticks++;
			} 
		}
	}

	this.drawMess = function(){
		for(var i=0;i<this.mess.length;i++){
			var pos = this.mess[i];
			if(pos.type=='guts'){
				this.drawLine(pos);

			}
		}
	}

	this.drawCarcass = function(){
		this.drawPoint(this.pos, 'green');
	}

	this.drawLine = function(line){
		if(!line) return;

		var ctx = GAME	.DATA.context;
		ctx.save();
		ctx.beginPath();
		ctx.moveTo(this.pos.x - this.width/2, this.pos.y - this.height/2);
		ctx.lineTo(line.x - this.width/2, line.y - this.height/2);
		ctx.lineWidth=line.lineWidth;
		ctx.strokeStyle=line.color;
		ctx.stroke();
		ctx.restore();
	}

	this.drawPoint = function(pos, color){
		var p = {width:4, height:4}
		if(!pos) return;

		var ctx = GAME	.DATA.context;
		ctx.save();
		ctx.fillStyle=color;
		ctx.translate(pos.x-p.width/2, pos.y-p.height/2);

		ctx.beginPath();
      		ctx.arc(-p.width/2, -p.height/2, p.width/2, 0, 2*Math.PI, false);
      		ctx.fillStyle = color;
      		ctx.fill();
      		ctx.closePath();

		ctx.restore();
	}

}