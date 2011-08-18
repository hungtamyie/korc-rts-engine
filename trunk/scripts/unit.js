/*
Defines the basic unit class in 
*/

function Unit(xx, yy, oo) {
	// Position
	this.X = cell_coords(xx,yy)[0];
	this.Y = cell_coords(xx,yy)[1];
	this.destX = xx;
	this.destY = yy;
	// Ship attributes
	this.owner = oo;
	this.maxSpeed = 20;						// Max attainable speed
	this.accel = 1;							// Acceleration and deceleration rate	
	//	Combat
	this.maxHealth = 100;
	this.range = 10;
	this.damage = 10;
	this.maxAtk_cd = 20;
	// State flags
	this.is_attacking = false;		// Attacking is a "state of mind"
	this.is_firing = false;			// Firing means within range and shooting
	this.is_moving = false;
	this.is_selected = false;
	// Data containers
	this.action_q = new Array();
	this.path = new Array();
	this.target = new Array();
	this.attacks = new Array();
	// Stats
	this.health = 100;
	this.facing = 0;
	this.speed = 0;
	this.atk_cd = this.maxAtk_cd;

	Game.units.push(this);
	this.attack = function(target, queue)
	{
		this.target = target;
		if (queue)
			this.action_q.push({axn: "attack", param: target});
		else
		{
			// Replace all actions
			this.action_q = [{axn: "attack", param: target}];
			this.is_moving = false;
		}
		this.is_attacking = true;
	}
	this.stopAttacking = function()
	{
		this.target = null;
		this.atk_cd = this.maxAtk_cd;
		this.is_attacking = false;
		this.is_firing = false;
	}
	this.moveTo = function(_x, _y, queue)
	{
		var target_cell = get_cell(_x,_y);
		var this_cell = get_cell(this.X, this.Y);
		// Ignore instruction if it doesn't change anything
		if (target_cell[0] == this_cell[0] && target_cell[1] == this_cell[1])
			return false;
		var cell_xy = snap2grid(_x, _y);
		var destination = {x:cell_xy[0], y:cell_xy[1], wp: "dest"};
		if (queue)
		{
			// Shift-queued movevments, executed after current instructions
			this.path.push(destination);
			this.action_q.push({axn: "move", param: destination});
		}
		else
		{
			// Replace all actions
			this.path = [destination];
			this.action_q = [{axn: "move", param: destination}];
			this.destX = cell_xy[0];
			this.destY = cell_xy[1];
			this.update_path(destination, 0);
			this.stopAttacking();
		}
		this.is_moving = true;
	};
	
	this.update_path = function(dest, n)
	/* This algorithm is expected to ignore other units. Flying is cool :D
	returns true if a path update was performed, false otherwise
	Process:
		Check if the opening waypoints are "pathed" waypoints, ie, from a
		previous path update.
			If true, then just check the final destination occupancy
				If unoccupied, return
				If occupied, find closest spot that is open
			Else, replot path to the destination
	Currently Known Bugs:
		* If selected unit is right beside target location, and it is occupied, sometimes units stack
		* If units are grouped, there is no squad management, and they will stack if all units arrive
			at almost the same time
	*/
	{
		var pos = get_cell(dest.x, dest.y);
		var selfcell = get_cell(this.X, this.Y);
		// If you are in the square you're travelling to, then it's ok
		if (selfcell[0] == pos[0] && selfcell[1] == pos[1])
			return false;
		var pathed = true;
		for (var i = 0; i<n+1; i++)
			pathed = (pathed && (dest.wp == "dest" || dest.wp == "pathed"));
		// If the current destination is an alternate destination, recheck intended destination
		if ("old" in dest)
		{
			var cell = get_cell(dest.old.x, dest.old.y)
			if (is_map_empty(cell[0], cell[1]))
			{
				this.path.splice(0, 1);
				this.path = [dest.old].concat(this.path);
				return true;
			}
		}
		// If you are following a pre-evaluated path and the destination is clear		
		if (pathed && is_map_empty(pos[0], pos[1]))
			return false;

		// Repathing algorithm from here
		var X = this.X, Y = this.Y;
		var mindist = getDistance(X, Y, dest.x, dest.y);
		var minpos = pos;
		// Get the 8 cells around the destination
		// [DONE] TODO: Fix corner cases
		var ilims = [pos[0]==0?0:-1, pos[0]==ui.grid_cols-1?1:2];
		var jlims = [pos[1]==0?0:-1, pos[1]==ui.grid_rows-1?1:2];
		for (var i = ilims[0]; i < ilims[1]; i++)
			for (var j = jlims[0]; j < jlims[1]; j++)
			{
				var substitute = [pos[0] + i, pos[1] + j];
				if (!(i == 0 && j == 0) && is_map_empty(substitute[0], substitute[1]))
				{
					var sub_xy = cell_coords(substitute[0], substitute[1]);
					var sub_dist = getDistance(X, Y, sub_xy[0], sub_xy[1]);
					// Minimize src->sub-point->destination
					if ( sub_dist < mindist)
					{
						minpos = substitute;
						mindist = sub_dist;
					}
				}
			}
		if (minpos == pos)
			minpos = get_cell(this.X, this.Y);
		// NOTE: The above works only because we consider no dynamic obstacles
		// Wrap into a destination waypoint
		var new_dest = cell_coords(minpos[0], minpos[1]);
		var waypoint = {x: new_dest[0], y: new_dest[1], wp: "dest", old: {x:dest.x, y:dest.y, wp: dest.wp}};
		// Create list of waypoints
		var waypoints = new Array();
		waypoints.push(waypoint);
		// Trim existing path
		this.path.splice(0, 1);
		// Do A* (to account for static obstacles)
		// Add these waypoints to the path list
		this.path = waypoints.concat(this.path);
		// Set the current position as destination to start considering the new path instantly
		return true;
	}
	this.update = function()
	{
		// Reset ship to within play area
		// Update ship state:
		
		// Manipulate attack cooldown
		if (this.atk_cd > 0)
			this.atk_cd--;
		// Remove unit if health runs out
		if (this.health <= 0)
			Game.units.splice(Game.units.indexOf(this), 1);
		// Attack Target
		if (this.is_attacking && this.atk_cd == 0)
		{
			var distance = getDistance(this.X, this.Y, this.target.X, this.target.Y)
			if (distance > this.range*GRID_SIZE)
			{
				// Out of range, move in towards target
				this.destX = this.target.X;
				this.destY = this.target.Y;
				this.is_moving = true;
				this.is_firing = false;
			}
			else
			{
				// In range, attack target
				this.is_moving = false;
				this.is_firing = true;
			}
			if (this.target.health < 0 || this.target == null)
				this.stopAttacking();
		}
		// Attack the target
		if(this.is_firing)
		{
			if (this.atk_cd == 0)
			{
				// Fire an attack!
				var atk = new Bullet(this, this.target);
				this.attacks.push(atk);
				// Reset attack cooldown
				this.atk_cd = this.maxAtk_cd;
			}
		}
		// Move to destination
		if (this.is_moving)
		{
			// Update destination
			if (this.path != 0)
			{
				this.update_path(this.path[0], 1);
				var waypoint = this.path[0];
				this.destX = waypoint.x;
				this.destY = waypoint.y;
			}
			else
			{
				this.is_moving = false;
				this.speed = 1;
			}
			
			var distance, direction, maxDist;
			distance = getDistance(this.X, this.Y, this.destX, this.destY);
			maxDist = (this.speed/this.accel)*this.speed;		// Distance to decelerate to 0
			// Accelerate on depart
			if (this.speed < this.maxSpeed && distance > maxDist)
				this.speed += this.accel;
			// Deccelerate on approach
			if (this.speed > 0 && distance <= maxDist)
				this.speed -= this.accel;
			var direction, vX, vY;
			direction = unitVector(this.X, this.Y, this.destX, this.destY);
			// Set velocities
			vX = this.speed*direction[0];
			vY = this.speed*direction[1];
			// Set new position
			this.X += vX;
			this.Y += vY;
			// Update pathing
			if (distance <= 1)
			{
				// Update destination queue
				this.path.shift();
			}
		}
		// Sub-updates: bullets
		for (var i in this.attacks)
			this.attacks[i].update();
	};
	this.draw = function()
	{
		var sX, sY, position;
		sX = parseInt(Math.floor(this.X)) - X_0;
		sY = parseInt(Math.floor(this.Y)) - Y_0 -7;
		// Unit drawing
		// NOTE: Custom unit drawing here
		CTX.beginPath();
		CTX.moveTo(sX, sY);
		CTX.lineTo(sX-7,sY+15);
		CTX.lineTo(sX+7,sY+15);
		CTX.lineTo(sX, sY);
		if (this.owner)
			CTX.strokeStyle = "#dd0000";
		else
			CTX.strokeStyle = "#ff00ff";
		CTX.stroke();
		if (this.is_selected)
		{
			// Selection Circle
			CTX.beginPath();
			CTX.arc(sX,sY+9,12,0,Math.PI*2,true);
			CTX.closePath();
			CTX.strokeStyle = "#00ff00";
			CTX.stroke();		
			// UI Action drawing
			//  Attack-line
			if (this.is_attacking)
			{
				CTX.beginPath();
				CTX.moveTo(sX, sY+7);
				CTX.lineTo(this.target.X - X_0, this.target.Y - Y_0);
				CTX.strokeStyle = "#ff0000";
				CTX.stroke();			
			}
			//  Movement line
			if (this.is_moving)
			{
				CTX.beginPath();
				CTX.moveTo(sX, sY+7);
				CTX.lineTo(this.destX - X_0, this.destY - Y_0);
				for (var i in this.path)
				{
					var _x = this.path[i].x - X_0;
					var _y = this.path[i].y - Y_0;
					CTX.lineTo(_x, _y);
				}
				CTX.strokeStyle = "#5555ff";
				CTX.stroke();
			}
		}// Sub-draws: bullets
		for (var i in this.attacks)
			this.attacks[i].draw();
	};
}