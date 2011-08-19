function UI() {
	// Game View Settings
	this.play_height = .8;
	this.play_width = 1;
	this.VHEIGHT = this.play_height*HEIGHT;
	this.VWIDTH = this.play_width*WIDTH;
	// Grid Settings
	this.grid_on = true;
	this.grid_cols = Math.floor(MWIDTH/GRID_SIZE);
	this.grid_rows = Math.floor(MHEIGHT/GRID_SIZE);
	MWIDTH = GRID_SIZE*this.grid_cols;
	MHEIGHT = GRID_SIZE*this.grid_rows;
	if (MWIDTH < WIDTH)
		X_0 -= (WIDTH - MWIDTH)/2;	
	if (MHEIGHT < HEIGHT)
		Y_0 -= (HEIGHT - MHEIGHT)/2;	
	// Selection stuff
	this.selecting = false;
	this.shift_select = false;
	// Gameplay UI Options
	this.health_bars = true;
	
	this.update = function()
	{
		// Screen panning
		if (Game.mu_x < GRID_SIZE/2 && X_0 > 0)
			X_0 -= SCROLL_SPEED;
		if (Game.mu_x > this.VWIDTH-GRID_SIZE/2 && X_0+this.VWIDTH < MWIDTH)
			X_0 += SCROLL_SPEED;
		if (Game.mu_y < GRID_SIZE/2 && Y_0 > 0)
			Y_0 -= SCROLL_SPEED;
		if (Game.mu_y > this.VHEIGHT-GRID_SIZE/2 && Y_0+this.VHEIGHT < MHEIGHT)
			Y_0 += SCROLL_SPEED;
	}
	this.draw = function()
	{
		// Draw cell grid if requested
		if (this.grid_on)
		{
			for (var x = 0.5-X_0; x < this.VWIDTH && x < MWIDTH-X_0+1; x += GRID_SIZE)
			{
				CTX.moveTo(x, MHEIGHT<this.VHEIGHT?-Y_0:0);
				CTX.lineTo(x, MHEIGHT<this.VHEIGHT?(MHEIGHT-Y_0):this.VHEIGHT);
			}
			for (var y = 0.5-Y_0; y < this.VHEIGHT && y < MHEIGHT-Y_0+1; y += GRID_SIZE)
			{
				CTX.moveTo(MWIDTH<this.VWIDTH?-X_0:0, y);
				CTX.lineTo(MWIDTH<this.VWIDTH?(MWIDTH-X_0):this.VWIDTH, y);
			}
			CTX.strokeStyle = "#0fff00";
			CTX.stroke();
		}
		// Draw selection box if in process
		if(this.selecting)
		{
			CTX.beginPath();
			CTX.moveTo(Game.md_x, Game.md_y);
			CTX.lineTo(Game.md_x, Game.mu_y);
			CTX.lineTo(Game.mu_x, Game.mu_y);
			CTX.lineTo(Game.mu_x, Game.md_y);
			CTX.lineTo(Game.md_x, Game.md_y);
			CTX.strokeStyle = "#00ff00";
			if(this.shift_select)
				CTX.strokeStyle = "#00ffff";
			CTX.stroke();
		}
		// Draw resource counters, timers, etc
		// Draw minimap
		// Draw unit management
		// Draw command-pane
	};
}
