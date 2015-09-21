function Fly(){
	var sounds = ['ross1','ross2','ross3','ross4','smith1','smith2','smith3','trott1','trott2'];
	this.sound = sounds[Math.floor(Math.random() * sounds.length)] || sounds[0];
	
	var sides = [
		{x:GAME.DATA.context.width*Math.random(), y:0},
		{x:GAME.DATA.context.width*Math.random(), y:GAME.DATA.context.height},
		{x:GAME.DATA.context.width, y:GAME.DATA.context.height*Math.random()},
		{x:0, y:GAME.DATA.context.height*Math.random()}
	]
	this.pos = sides[Math.floor(Math.random()*sides.length)] || sides[0];
	this.nextPos = {
		x=0,
		y=0
	}

}
