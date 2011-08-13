// Custom Game code:

// Update the occupancy grid
function update_occupancy()
{
	// TODO: First reset everything to map file
	// Current design: Empty everything
	for (var i = 0; i < ui.grid_cols; i++)
	{
		Game.o_map[i] = new Array();
		for (var j = 0; j < ui.grid_rows; j ++)
			Game.o_map[i][j] = 0;
	}
	// Place all the units in the grid
	for (var i in Game.units)
	{
		var unit = Game.units[i];
		//console.log(unit.X);
		var col = Math.floor(unit.X/GRID_SIZE);
		var row = Math.floor(unit.Y/GRID_SIZE);
		// Give ships a weight of 10
		Game.o_map[col][row] = 10;
	}
}
// Return whether a given grid spot (not x,y) is empty
function is_map_empty(col, row)
{
	return (Game.o_map[col][row] == 0);
}

// Return the grid indices (not x,y) from a coordinate (x,y)
function get_cell(_x, _y)
{
	var xy_arr = new Array();
	xy_arr[0] = Math.floor(_x/GRID_SIZE);
	xy_arr[1] = Math.floor(_y/GRID_SIZE);
	return xy_arr;
}

function cell_coords(col, row)
{
	var xy_arr = new Array();
	xy_arr[0] = (col*GRID_SIZE)+GRID_SIZE/2;
	xy_arr[1] = (row*GRID_SIZE)+GRID_SIZE/2;
	return xy_arr;
}
// Return the coordinate(x,y) snapped to grid from any coordinate (x,y)
function snap2grid(_x, _y)
{
	var xy_arr = new Array();
	xy_arr[0] = _x-(_x%GRID_SIZE)+GRID_SIZE/2;
	xy_arr[1] = _y-(_y%GRID_SIZE)+GRID_SIZE/2;
	return xy_arr;
}

// Main Game code: Override and define engine functions
function init_game()
{
	define_constants();
	make_ui();
	make_occupancy();
}

function custom_update()
{
	ui.update();
	for (var i in Game.units)
	{
		unit = Game.units[i];
		unit.update();
	}
	update_occupancy();
}
function custom_draw()
{
	ui.draw();
	for (var i in Game.units)
	{
		unit = Game.units[i];
		unit.draw();
	}
}
// Custom Event Handlers
function mouseMove(e)
{
	// Hover code
	
	// UI Drag selection
	if (Game.md && e.button == 0)
	{
		ui.selecting = true;
		if (e.shiftKey)
			ui.shift_select = true;
		else
			ui.shift_select = false;
	}
	else
		ui.selecting = false;
	return false;
}

function mouseDown(e)
{
	if (e.button == 2)
	{
		ui.selecting = false;
		//Player intends movement, just ignore this
		return 0;
	}
	// Start Drag-Selecting Units
}

function mouseUp(e)
{
	ui.selecting = false;
	// Move/Attack with unit if already selected
	if (e.button == 2)
	{
		// Attack
		var u_x = Game.mu_x + X_0;
		var u_y = Game.mu_y + Y_0;
		var targetzone = get_cell(u_x, u_y);
		// If there is a unit ...
		if (!is_map_empty(targetzone[0], targetzone[1]))
		{
			for (var i in Game.units)
			{
				var unit = Game.units[i];
				// If the unit is an enemy ...
				if (unit.owner)
				{
					var unitzone = get_cell(unit.X, unit.Y);
					// ... Then the unit has been targeted
					if (unitzone[0] == targetzone[0] && unitzone[1] == targetzone[1])
					{
						for (var i in Game.selected)
						{
							var attker = Game.selected[i];
							attker.attack(unit);
						}
						return true;
					}
				}
			}
		}
		// Move
		for (var i in Game.selected)
		{
			var unit = Game.selected[i];
			unit.moveTo(Game.mu_x + X_0, Game.mu_y + Y_0, e.shiftKey);
		}
		return true;
	}
	var d_x = Game.md_x + X_0;
	var d_y = Game.md_y + Y_0;
	var u_x = Game.mu_x + X_0;
	var u_y = Game.mu_y + Y_0;
	if (Math.abs(d_x - u_x) > 5 && Math.abs(d_y - u_y) > 5)
	{
		// End drag-selection
		if (!e.shiftKey)
		{
			ui.shift_select = false;
			Game.selected = new Array();
		}
		var l2r = (u_x-d_x)>0?true:false;
		var t2b = (u_y-d_y)>0?true:false;
		for (var i in Game.units)
		{
			var unit = Game.units[i];
			if (unit.owner)
				break;
			// Check if the unit is within the selection box
			if (((l2r && d_x < unit.X && unit.X < u_x) || (!l2r && d_x > unit.X && unit.X > u_x)) &&
				((t2b && d_y < unit.Y && unit.Y < u_y) || (!t2b && d_y > unit.Y && unit.Y > u_y)))
			{
				unit.is_selected = true;
				Game.selected.push(unit);
			}
			else
				if(!ui.shift_select)
					unit.is_selected = false;
		}
		return false;
		// Modifies the selection
	}
}

function keyDown(e)
{
	if (e.shiftKey)
		ui.shift_select = true;
}

function keyUp(e)
{
}

function keyPress(e)
{
	var keyCode = document.layers? e.which: ((document.all ? event.keyCode: document.getElementById)? e.keyCode : 0);
	
	// Screen panning
	if (keyCode == 37 && X_0 > 0)
		X_0 -= SCROLL_SPEED;
	if (keyCode == 39 && X_0+WIDTH < MWIDTH)
		X_0 += SCROLL_SPEED;
	if (keyCode == 38 && Y_0 > 0)
		Y_0 -= SCROLL_SPEED;
	if (keyCode == 40 && Y_0+HEIGHT < MHEIGHT)
		Y_0 += SCROLL_SPEED;
	
}

function mouseScroll()
{
	//draw();
	CTX.fillText("Scrolled", 50, 150);	
}
