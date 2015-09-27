function Keyboard(){
	var layoutUs = [
		('1234567890-=').split(''),
		('qwertyuiop[]').split(''),
		("asdfghjkl;'").split(''),
		('zxcvbnm,./').split('')
	];
	this.layout = layoutUs;

	this.maxWidthHeightRatio = 1.2;
	this.maxScaleRatio = 1;
	this.keyWidth = 1;
	this.keyHeight= 1;

	//GAME ENTITY VARS
	this.type='keyboard';
	this.z = 0;

	this.pressedKeys = ['a'];
	this.resetTimer=0;
	this.maxTicks=10;

	this.resetPressedKeys = function(){
		this.resetTimer--;
		if(this.resetTimer<0){
			this.pressedKeys = [];	
		}
		
	}

	this.addPressedKey = function(letter){
		//transform letter into base
		letter = this.replaceEquivalentKeys(letter);
		var allLetters = _.flatten(this.layout);

		//check letter is a valid key choice
		if(allLetters.indexOf(letter)<0) return console.log('invalid symbol ' + letter);
		this.pressedKeys.push(letter);

		//check if its the first letter pressed
		if(this.pressedKeys.length==1){
			this.resetTimer = this.maxTicks;
		}
	}

	this.resizeKeyboard = function(){
		//grab biggest width
		var maxKeys = 0;
		for(var i=0;i<this.layout.length;i++){
			var row = this.layout[i];
			maxKeys = (row.length>maxKeys)? row.length : maxKeys;
		}

		//set key width
		this.keyWidth = GAME.DATA.canvas.width/maxKeys;
		this.keyHeight = GAME.DATA.canvas.height/this.layout.length;

		//if too wide, scale height a little, then cap width;
		if(this.keyWidth>this.maxWidthHeightRatio * this.keyHeight){
			this.keyHeight = this.keyHeight*this.maxScaleRatio;
			this.keyWidth = this.keyHeight*this.maxWidthHeightRatio;
		}

		//if too tall, scale with, then cap height;
		if(this.keyHeight>this.maxWidthHeightRatio * this.keyWidth){
			this.keyWidth = this.keyWidth*this.maxScaleRatio;
			this.keyHeight = this.keyWidth*this.maxWidthHeightRatio;
		}
	}

	this.logic = function(){
		this.resetPressedKeys();
	};

	this.draw = function(){
		this.resizeKeyboard();
		this.drawKeyboard();
	};

	this.drawKeyboard = function(){
		var center = {
			x:GAME.DATA.canvas.width/2,
			y:GAME.DATA.canvas.height/2,
		}

		for(var i=0;i<this.layout.length;i++){
			var start = {
				y:center.y-(this.keyHeight*((this.layout.length/2)-i) ),
				x:center.x-(this.keyWidth*(this.layout[i].length/2)),
			}

			for(var j=0;j<this.layout[i].length;j++){
				var letter = this.layout[i][j];
				var isPressed = (this.pressedKeys.length>0 && this.pressedKeys.indexOf(letter)>=0); 
				this.drawKey(start.x + this.keyWidth*j, start.y, letter, isPressed);
			}
		}
	}

	this.drawKey = function(x,y, letter, filled){
		var margin = 10;
		GAME.DATA.context.save();
		GAME.DATA.context.strokeStyle='lightgrey';
		GAME.DATA.context.fillStyle='lightgrey';
		
		//GAME.DATA.context.fillStyle='grey';
		if (filled){
			 GAME.DATA.context.lineWidth=5;
			 GAME.DATA.context.fillStyle='white';	
		}
		this.drawRoundRec(GAME.DATA.context, x+margin,y+margin, this.keyWidth-2*margin, this.keyHeight-2*margin,5,filled , true)

		GAME.DATA.context.fillStyle='lightgrey';
		var fontSize = this.keyWidth/5;
		GAME.DATA.context.font=fontSize + 'px Verdana';
		GAME.DATA.context.fillText(letter, x+1.5*fontSize, y+1.5*fontSize);
		GAME.DATA.context.restore();
	}

	this.drawRoundRec = function(ctx, x, y, width, height, radius, fill, stroke) {
		if (typeof stroke == "undefined" ) {
			stroke = true;
		}
		if (typeof radius === "undefined") {
			radius = 5;
		}

		ctx.beginPath();
		ctx.moveTo(x + radius, y);
		ctx.lineTo(x + width - radius, y);
		ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
		ctx.lineTo(x + width, y + height - radius);
		ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
		ctx.lineTo(x + radius, y + height);
		ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
		ctx.lineTo(x, y + radius);
		ctx.quadraticCurveTo(x, y, x + radius, y);
		ctx.closePath();
		if (stroke) {
			ctx.stroke();
		}
		if (fill) {
			ctx.fill();
		}        
	}

	this.replaceEquivalentKeys = function(letter){
		letter = letter.toLowerCase();
		var shifted = ('~!@#$%^&*()_+{}:"<>?').split('');
		var normal = ("`1234567890-=[];',./").split('');

		var index = shifted.indexOf(letter);
		if(index<0) return letter;
		return normal[index];
	}
}



