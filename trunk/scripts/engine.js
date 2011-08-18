/*
author: @keerthik Omanakuttan
e-mail: keerthiko[at]gmail[dot]com

Assumptions
 javascript allows free threading by having this engine run as a different script
 Synchronization may become an issue, but it should get corrected between states
*/

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