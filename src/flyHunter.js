
function flyGameInit(ref){
	ref.DATA.TICK = 0;
	ref.DATA.DEBUG = [];
	ref.DEBUGON = true;
	ref.DATA.ENTITIES = [];
}

function flyGameLogic(){
	//reset from last frame
	GAME.DATA.DEBUG = [];

	//action for this frame
	GAME.DATA.TICK++;
	GAME.DATA.DEBUG.push('tick:'+GAME.DATA.TICK);
	spawnFly();
}

function flyGameDraw(){
	//reset from last frame
	clearCanvas();

	//action for this frame
	printDebug(GAME.DATA.DEBUG, document.getElementById('debug'));

	//draw entities
	for(var i=0;i<GAME.DATA.ENTITIES.length;i++){
		(GAME.DATA.ENTITIES[i]).draw();
	}
}


//============================= LISTENER FUNCTIONS ==================================\\

window.onresize = resizeCanvas;


//============================= HELPER FUNCTIONS ===================================\\

function spawnFly(){
	if(!GAME.DATA.context) return console.log('no context');
	if(GAME.DATA.ENTITIES.length==0){
		var fly = new Fly();
		fly.pos.x=100;
		fly.pos.y=100;
		GAME.DATA.ENTITIES.push(fly);
	}
}

//============================= HELPER FUNCTIONS ===================================\\

function initPrintDebug(){
	var debugBox = document.createElement('div');
	debugBox.id = 'debug';
	document.body.appendChild(debugBox);
	return debugBox;
}

function printDebug(data, div){
	if(data.length==0) return;
	if(!GAME.DEBUGON) return;
	if(!div){
		div = initPrintDebug();
	}

	div.innerHTML = JSON.stringify(data);
}

function initContext(){
	var canvas = document.getElementById('canvas');
	if(!canvas){
		var canvasBox = document.createElement('div');
		canvasBox.id='canvasWrapper';
		document.body.appendChild(canvasBox);

		var canvas = document.createElement('canvas');
		canvas.id = 'canvas';
		document.getElementById('canvasWrapper').appendChild(canvas);
	}
	GAME.DATA.canvas = canvas;
	GAME.DATA.context = canvas.getContext('2d');
	resizeCanvas();
}

function resizeCanvas(){
	GAME.DATA.canvas.width = document.body.clientWidth;
	GAME.DATA.canvas.height = document.body.clientHeight;
}

function clearCanvas(){
	if(!GAME.DATA.context) initContext();
	GAME.DATA.context.clearRect(0, 0, GAME.DATA.canvas.width, GAME.DATA.canvas.height);
	GAME.DATA.context.rect(0,0,GAME.DATA.canvas.width, GAME.DATA.canvas.height);
	GAME.DATA.context.fillStyle="#EFEFEF";
	GAME.DATA.context.fill();
}

function checkGameObj(){
	if(GAME && GAME.hasOwnProperty('LOOP')){
		return new Error('this module requires gameEngineLibrary');
	}
	
	return null
}
