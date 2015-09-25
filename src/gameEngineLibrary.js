function gameEngine(gameFunctions, gameConstructor){
	//initialize internal stuff
	this.FPS = 30;
	this._gameFunctionReferences = gameFunctions;
	this._runState=true;

	this.DATA={};
	this.LOOP=function(){gameLoop(this)};
	this.START=function(){
		this.INIT()
		this.LOOP();
	}
	this.STOP=function(){this._runState=false};
	this.INIT = gameConstructor;
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
