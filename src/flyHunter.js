
function flyGameInit(){
	GAME.DATA.TICK = 0;
	GAME.DATA.DEBUG = [];
	GAME.DEBUGON = true;
	GAME.DATA.ENTITIES = [];

	clearCanvas();
	GAME.DATA.ENTITIES.push(new Keyboard());
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
$(document.body).keydown(function(e){logKeyPress(e.keyCode)});


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

function logKeyPress(keyCode){
	// names of known key codes (0-255)
	var keyboardMap = ["","","","CANCEL","","","HELP","","BACK_SPACE","TAB","","","CLEAR","ENTER","RETURN","","SHIFT","CONTROL","ALT","PAUSE","CAPS_LOCK","KANA","EISU","JUNJA","FINAL","HANJA","","ESCAPE","CONVERT","NONCONVERT","ACCEPT","MODECHANGE","SPACE","PAGE_UP","PAGE_DOWN","END","HOME","LEFT","UP","RIGHT","DOWN","SELECT","PRINT","EXECUTE","PRINTSCREEN","INSERT","DELETE","","0","1","2","3","4","5","6","7","8","9",":",";","<","=",">","?","@","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","WIN","","CONTEXT_MENU","","SLEEP","NUMPAD0","NUMPAD1","NUMPAD2","NUMPAD3","NUMPAD4","NUMPAD5","NUMPAD6","NUMPAD7","NUMPAD8","NUMPAD9","*","+","SEPARATOR","-",".","/","F1","F2","F3","F4","F5","F6","F7","F8","F9","F10","F11","F12","F13","F14","F15","F16","F17","F18","F19","F20","F21","F22","F23","F24","","","","","","","","","NUM_LOCK","SCROLL_LOCK","WIN_OEM_FJ_JISHO","WIN_OEM_FJ_MASSHOU","WIN_OEM_FJ_TOUROKU","WIN_OEM_FJ_LOYA","WIN_OEM_FJ_ROYA","","","","","","","","","","CIRCUMFLEX","!",'"',"#","$","%","&","_","(",")","*","+","|","-","{","}","~","","","","","VOLUME_MUTE","VOLUME_DOWN","VOLUME_UP","","",";","=",",","-",".","/","`","","","","","","","","","","","","","","","","","","","","","","","","","","","[","/","]","'","","META","ALTGR","","WIN_ICO_HELP","WIN_ICO_00","","WIN_ICO_CLEAR","","","WIN_OEM_RESET","WIN_OEM_JUMP","WIN_OEM_PA1","WIN_OEM_PA2","WIN_OEM_PA3","WIN_OEM_WSCTRL","WIN_OEM_CUSEL","WIN_OEM_ATTN","WIN_OEM_FINISH","WIN_OEM_COPY","WIN_OEM_AUTO","WIN_OEM_ENLW","WIN_OEM_BACKTAB","ATTN","CRSEL","EXSEL","EREOF","PLAY","ZOOM","","PA1","WIN_OEM_CLEAR",""];
	var keyboard = _.findWhere(GAME.DATA.ENTITIES, {type:'keyboard'});

	if(keyboard){
		keyboard.addPressedKey(keyboardMap[keyCode]);
	}
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
