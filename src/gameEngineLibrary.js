function gameEngine(gameFunctions, gameConstructor){
	//initialize internal stuff
	this.FPS = 10
	this._gameFunctionReferences = gameFunctions;
	this._runState=true;

	this.DATA={};
	this.LOOP=function(){gameLoop(this)};
	this.START=this.LOOP;
	this.STOP=function(){this._runState=false};

	//call the external constructor
	gameConstructor(this);
}


function gameLoop(){
	setTimeout(function(){
		if(!GAME._runState) return;

		requestAnimationFrame(gameLoop);
		for(var i=0;i<GAME._gameFunctionReferences.length;i++){
			GAME._gameFunctionReferences[i]();
		}
	},
	1000/GAME.FPS);
}
