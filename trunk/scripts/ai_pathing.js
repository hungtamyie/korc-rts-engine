// Create an occupancy grid for pathing purposes
function o_map()
{
	this.occupancy = new Array();
	for (var i = 0; i < ui.grid_cols; i++)
	{
		occupancy[i] = new Array();
		for (var j = 0; j < Game.ui.grid_rows; j ++)
			occupancy[i][j] = 0;
	}
}

// Update the occupancy grid
function update_occupancy()
{
	// TODO: First reset everything to map file
	// Current design: Empty everything (Empty Map)
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