function Bullet(origin, target)
{
	// Position
	this.X = origin.X;
	this.Y = origin.Y;
	this.source = origin;
	this.sink = target;
	this.destX = this.sink.X;
	this.destY = this.sink.Y;
	// Attributes
	this.homing = true;
	this.speed = 10;
	this.update = function()
	{
		var distance, direction, vX, vY;
		distance = getDistance(this.X, this.Y, this.sink.X, this.sink.Y);
		if (this.homing)
			direction = unitVector(this.X, this.Y, this.sink.X, this.sink.Y);
		else
			direction = unitVector(this.X, this.Y, this.destX, this.destY);
		// Set velocities
		if (distance > this.speed)
		{
			vX = this.speed*direction[0];
			vY = this.speed*direction[1];
			// Set new position
			this.X += vX;
			this.Y += vY;
		}
		else
		{
			this.X = this.sink.X;
			this.Y = this.sink.Y;
		}
		if(Math.abs(this.X - this.sink.X) < 5 && Math.abs(this.Y - this.sink.Y) < 5)
		{
			// Reduce the target's health
			this.sink.health -= this.source.damage;
			// Kill this bullet
			this.source.attacks.splice(this.source.attacks.indexOf(this),1);
		}
	}
	this.draw = function()
	{
		var sX, sY;
		sX = parseInt(Math.floor(this.X)) - X_0;
		sY = parseInt(Math.floor(this.Y)) - Y_0 -7;
		CTX.beginPath();
		CTX.arc(sX, sY, 3, 0, Math.PI*2, true);
		CTX.closePath();
		CTX.strokeStyle = "#00ff00";
		CTX.stroke();
	}
}