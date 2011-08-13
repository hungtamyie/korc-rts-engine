/*
author: @keerthik Omanakuttan
e-mail: keerthiko[at]gmail[dot]com

Assumptions
 javascript allows free threading by having this engine run as a different script
 Synchronization may become an issue, but it should get corrected between states
*/

// Convenience functions - operations
function wrapAdd(A, B, lowlim, uplim)
{
	var result;
	result = A+B;
	if (result > uplim)
		result = lowlim + (result - uplim);
	if (result < lowlim)
		result = uplim - (lowlim - result);
	return result;
}
// Convenience functions - geometry
function getDistance(x1,y1,x2,y2)
{
	var dist;
	dist = Math.sqrt( (x2-x1)*(x2-x1) + (y2-y1)*(y2-y1) );
	return dist;
}
function getRelAngle(x1,y1,x2,y2)
{
	var angle;
	angle = Math.atan2((y2-y1),(x2-x1));
	return angle;
}
function unitVector(x1,y1,x2,y2)
{
	var unitv = new Array(2);
	dist = getDistance(x1,y1,x2,y2);
	if (dist == 0)
		return [0,0];
	unitv[0] = (x2-x1)/dist;
	unitv[1] = (y2-y1)/dist;
	return unitv;
}
function getDest(x1,y1,dist,angle)
{
	var dest = new Array(2);
	dest[0] = x1+dist*Math.cos(angle);
	dest[1] = y1+dist*Math.sin(angle);
	return dest;
}

// Game class
Game = {};

Game.set_engine_vars = function()
{
	Game.RUN_LOOP = true;
	Game.DONE_DRAW = true;
	Game.TIMER = null;
	// Identify canvas and context (Global)
	CANVAS = document.getElementById("canvas_nav");
	CTX = CANVAS.getContext("2d");
	// Set Height and other Canvas settings
	CANVAS.height = document.body.clientHeight - 180;
	CANVAS.width = document.body.clientWidth - 30;
	HEIGHT = CANVAS.height;
	WIDTH = CANVAS.width - CANVAS.offsetLeft;
	CTX.fillStyle = "#ffffff";
	CTX.font = "12px Kontrapunkt Bold";
	// Event listeners for mouse actions
	CANVAS.onmousemove = Game.mouseMove;
	CANVAS.onmousedown = Game.mouseDown;
	window.onmouseup = Game.mouseUp;
	CANVAS.onmousewheel = Game.mouseScroll; //most browsers
	CANVAS.addEventListener ("DOMMouseScroll", Game.mouseScroll, false); //FireFox
	// Mouse control vars
	Game.md = false;
	Game.md_x = 0;
	Game.md_y = 0;
	Game.mu_x = 0;
	Game.mu_y = 0;
	
	// Keyboard buttons
	document.onkeydown = Game.keyDown;
	document.onkeyup = Game.keyUp;
	document.onkeypress = Game.keyPress;
	Game.eobj = null;
	// Control other browser actions
	// Disable context menu
	document.oncontextmenu = function(){return false;};
};

function parseMouseInput(e)
{
	var x, y;
	if (e.pageX != undefined && e.pageY != undefined) 
	{
		x = e.pageX;
		y = e.pageY;
	}
	x -= CANVAS.offsetLeft;
    y -= CANVAS.offsetTop;
	return [x, y];
}
// Mouse Input actions
Game.mouseMove = function(e)
{
	var x, y;
	var mouseVals = parseMouseInput(e);
	x = mouseVals[0];
	y = mouseVals[1];
	Game.mu_x = x;
	Game.mu_y = y;
	mouseMove(e);
}

Game.mouseDown = function(e)
{
	var x, y;
	var mouseVals = parseMouseInput(e);
	x = mouseVals[0];
	y = mouseVals[1];
	Game.md_x = x;
	Game.md_y = y;
	Game.md = true;
	mouseDown(e);
}

Game.mouseUp = function(e)
{
	var x, y;
	var mouseVals = parseMouseInput(e);
	x = mouseVals[0];
	y = mouseVals[1];
	Game.mu_x = x;
	Game.mu_y = y;
	Game.md = false;
	mouseUp(e);
	return false;
}

Game.mouseScroll = function(e)
{
	var x, y;
	var mouseVals = parseMouseInput(e);
	x = mouseVals[0];
	y = mouseVals[1];
	mouseScroll(e);
}
// Keyboard handlers
Game.keyDown = function(e)
{
	Game.eobj = window.event? event: e;
	keyDown(e);
}

Game.keyUp = function(e)
{
	Game.eobj = window.event? event: e;
	keyUp(e);
}

Game.keyPress = function(e)
{
	Game.eobj = window.event? event: e;
	keyPress(e);
}

Game.update = function()
{
	custom_update();
};

Game.draw = function()
{
	Game.DONE_DRAW = false;
	// Reset the canvas
	CANVAS.width = WIDTH;
	// Run the custom draw from your game
	custom_draw();
	// Specific to korcgames.com
	Game.DONE_DRAW = true;
};

Game.init_engine = function()
{
	// Initialize the engine
	Game.set_engine_vars();
	// Initialize Game-specific parameters
	init_game();
	
	if(Game.TIMER == null)   
	{      
		// do the one-time setup stuff      
		Game.TIMER = setInterval("Game.loop_step()", 30);   
	}
};

Game.stop = function()
{   
	if(Game.TIMER != null)  
	{      
		clearInterval(Game.TIMER);      
		Game.TIMER = null;   
	}
};

Game.loop_step = function()
{
	Game.update();
	Game.draw();
	//TIMER = setTimeout("draw()", 33);
};