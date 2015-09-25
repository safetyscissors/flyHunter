function Fly(){
	
	// POSITIONING variabls
	this.width=10;
	this.height=10;

	var sides = [
		{x:GAME.DATA.canvas.width*Math.random(), y:0, a:(Math.PI/2)},
		{x:GAME.DATA.canvas.width*Math.random(), y:GAME.DATA.canvas.height, a:(3*Math.PI/2)},
		{x:GAME.DATA.canvas.width, y:GAME.DATA.canvas.height*Math.random(), a:Math.PI},
		{x:0, y:GAME.DATA.canvas.height*Math.random(), a:0}
	]
	this.pos = sides[Math.floor(Math.random()*sides.length)] || sides[0];
	this.nextPos = [];

	// MOVEMENT variables
	this.speed=0;
	this.maxSpeed=5;
	this.turnSpeed=.1;
	this.attentionSpan=60; //ticks

	// variables
	this.alive=true;
	this.type='fly';
	this.z = 2;

	//========================= functions ==========================\\

	this.draw = function(){
		this.drawPos(this.pos, 'green');

		if(GAME.DEBUGON){
			this.drawDirection(this.pos);
			this.drawPos(this.nextPos[0], 'red')
		}
	}

	this.logic = function(){
		if(!this.alive) return;

		this.getNextPos();
		this.move();
		this.checkFlyFlewAway();
	}

	this.getNextPos = function(){
		//if its already going somewhere, skip this.
		if(this.nextPos.length>0) return;

		var range = 100;
		var minRange = 50;
		var randomPosition = {
			x:this.pos.x + minRange + Math.random()*range,
			y:this.pos.y + minRange + Math.random()*range,
			ticks:0
		}
	
		//move position onto the screen
		if(this.posOutOfCanvas(randomPosition)){
			if(randomPosition.x < 0) randomPosition.x = 2*(range+minRange);
			if(randomPosition.x >= GAME.DATA.canvas.width) randomPosition.x = GAME.DATA.canvas.width - 2*(range+minRange);
			if(randomPosition.y < 0) randomPosition.y = 2*(range+minRange);
			if(randomPosition.y >= GAME.DATA.canvas.height) randomPosition.y = GAME.DATA.canvas.height - 2*(range+minRange);
		}

		this.nextPos.push(randomPosition);
	}

	this.posOutOfCanvas = function(pos){
		if(pos.x<0 || pos.y<0) return true;
		if(pos.x >= GAME.DATA.canvas.width || pos.y >= GAME.DATA.canvas.height) return true;
		return false;
	};

	this.drawDirection = function(pos){
		//draw direction
		var ctx = GAME.DATA.context;
		ctx.save();
		ctx.translate(pos.x-this.width/2, pos.y-this.height/2);
		
		ctx.beginPath();
		ctx.moveTo(0,0);
		ctx.rotate(pos.a);
		ctx.lineTo(50,0);
		ctx.strokeStyle='red';
		ctx.stroke();

		ctx.restore();
	}

	this.drawPos = function(pos, color){
		if(!pos) return;

		var ctx = GAME.DATA.context;
		ctx.save();
		ctx.fillStyle=color;
		ctx.translate(pos.x-this.width/2, pos.y-this.height/2);
		ctx.rotate(pos.a);
		ctx.fillRect(-this.width/2,-this.height/2,this.width,this.height);

		ctx.restore();
	}

	this.move = function(){
		//boring go in straight line
		//TODO replace with bezier parametric

		//if not going anywhere, do nothing.
		if(this.nextPos.length==0) return;
		var p2 = this.nextPos[0];
		var p1 = this.pos;
		var xDiff = p2.x-p1.x;
		var yDiff = p2.y-p1.y;

		//turn toward the point
		var idealAngle = (Math.atan2(yDiff,xDiff) + (2*Math.PI) ) % (2*Math.PI);
		var angleDistance = ((idealAngle - this.pos.a) + (2*Math.PI) ) % (2*Math.PI);
		if(angleDistance > this.turnSpeed){
			this.pos.a += (angleDistance>Math.PI)? -this.turnSpeed : this.turnSpeed;
			this.pos.a = ((this.pos.a) + (2*Math.PI) ) % (2*Math.PI);
		}

		//timeout nextPos. infinite circle.
		(this.nextPos[0]).ticks++;
		if((this.nextPos[0]).ticks > this.attentionSpan){
			return this.nextPos.pop();
		}

		//move toward the point
		var distance = Math.sqrt((xDiff*xDiff) + (yDiff*yDiff));
		var vector = (angleDistance>Math.PI)?  Math.abs(2-(angleDistance/Math.PI)): (angleDistance/Math.PI);
		//vector is 0-1 as percent of how close its pointing to to target.
		vector = Math.abs(1-vector);
		
		//if its close to the point, its done.
		if(distance>1.5*this.speed){
			this.speed=vector*this.maxSpeed;
		}else{
			return this.nextPos.pop();
		}

		this.pos.x += this.speed*Math.cos(this.pos.a);
		this.pos.y += this.speed*Math.sin(this.pos.a);
	}

	this.checkFlyFlewAway = function(){
		if(!this.posOutOfCanvas(this.pos)) return this.offScreenTicks=0;

		if(!this.offScreenTicks) return this.offScreenTicks=1;

		if(this.offScreenTicks<this.attentionSpan) return this.offScreenTicks++;

		//been offscreen too long.
		this.kill();
	}

	this.kill = function(){
		this.alive=false;
		var mess=new Splatter(this);
		mess.ENTITYID = GAME.DATA.ENTITIES.LENGTH;
		GAME.DATA.ENTITIES.push(mess);

		GAME.DATA.ENTITIES[this.ENTITYID] = {};
	}
}
