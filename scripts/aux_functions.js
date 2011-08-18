/*
author: @keerthik Omanakuttan
e-mail: keerthiko[at]gmail[dot]com

Assumptions
 javascript allows free threading by having this engine run as a different script
 Synchronization may become an issue, but it should get corrected between states
*/

// Convenience functions - parse mouse input for game
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

// Convenience functions - custom operations
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