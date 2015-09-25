
function flyGameInit(){
	GAME.DATA.TICK = 0;
	GAME.DATA.DEBUG = [];
	GAME.DEBUGON = false;
	GAME.DATA.ENTITIES = [];

	clearCanvas();
}

function flyGameLogic(){
	//reset from last frame
	GAME.DATA.DEBUG = [];

	//action for this frame
	GAME.DATA.TICK++;
	GAME.DATA.DEBUG.push('tick:'+GAME.DATA.TICK);

	spawnFly();
	

	//logic entities
	for(var i=0;i<GAME.DATA.ENTITIES.length;i++){
		if(typeof GAME.DATA.ENTITIES[i].logic ==='function'){
			(GAME.DATA.ENTITIES[i]).logic();
		}
	}
}

function flyGameDraw(){
	//reset from last frame
	clearCanvas();

	//action for this frame
	printDebug(GAME.DATA.DEBUG, document.getElementById('debug'));

	//draw entities
	var drawSorted = _.sortBy(GAME.DATA.ENTITIES, 'z');
	for(var i=0;i<drawSorted.length;i++){
		if(typeof drawSorted[i].draw ==='function'){
			(drawSorted[i]).draw();
		}
	}
}


//============================= LISTENER FUNCTIONS ==================================\\

window.onresize = resizeCanvas;


//============================= HELPER FUNCTIONS ===================================\\

function spawnFly(){
	var maxFlies = 2;
	if(!GAME.DATA.context) return console.log('no context');
	if(countFlies() < maxFlies){
		var fly = new Fly();
		fly.ENTITYID=GAME.DATA.ENTITIES.length;
		GAME.DATA.ENTITIES.push(fly);
	}
}

function countFlies(){
	var flyCount =0;
	for(var i=0;i<GAME.DATA.ENTITIES.length;i++){
		var entity = GAME.DATA.ENTITIES[i];
		if(entity.type && entity.type == 'fly'){
			flyCount ++;
		}
	}
	return flyCount;
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
	var ref = GAME.DATA;

	if(!ref.context) initContext();
	ref.context.clearRect(0, 0, ref.canvas.width, ref.canvas.height);
	ref.context.rect(0,0,ref.canvas.width, ref.canvas.height);
	ref.context.fillStyle="#EFEFEF";
	ref.context.fill();
}

function checkGameObj(){
	if(GAME && GAME.hasOwnProperty('LOOP')){
		return new Error('this module requires gameEngineLibrary');
	}
	
	return null
}
