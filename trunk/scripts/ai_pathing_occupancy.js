// Create an occupancy grid for pathing purposes
function o_map()
{
	this.occupancy = new Array();
	for (var i = 0; i < ui.grid_cols; i++)
	{
		this.occupancy[i] = new Array();
		for (var j = 0; j < ui.grid_rows; j ++)
			this.occupancy[i][j] = 0;
	}
	
	// Update the occupancy grid
	this.update = function()
	{
		// TODO: First reset everything to map file
		// Current design: Empty everything (Empty Map)
		for (var i = 0; i < ui.grid_cols; i++)
		{
			this.occupancy[i] = new Array();
			for (var j = 0; j < ui.grid_rows; j ++)
				this.occupancy[i][j] = 0;
		}
		// Place all the units in the grid
		for (var i in Game.units)
		{
			var unit = Game.units[i];
			//console.log(unit.X);
			var col = Math.floor(unit.X/GRID_SIZE);
			var row = Math.floor(unit.Y/GRID_SIZE);
			// Give ships a weight of 10
			this.occupancy[col][row] = 10;
		}
	}
	
	// Return whether a given grid spot (not x,y) is empty
	this.is_empty = function (col, row)
	{
		return (this.occupancy[col][row] == 0);
	}

}

