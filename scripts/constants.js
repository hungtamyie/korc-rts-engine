function define_constants() {
	// Engine Constants
	// Action codes
	ATTACK = 0;
	MOVE = 1;
	ATTACK_MOVE = 2;
	FOLLOW = 3;
	PATROL = 4;

	// GAME CONSTANTS
	MWIDTH = 1440;
	MHEIGHT = 800;
	SCROLL_SPEED = 10;	//0-10
	GRID_SIZE = 30;
	X_0 = 0;
	Y_0 = 0;
	// Game Content
	Game.units = new Array();
	Game.selected = new Array();
	// Map content
	// Player ships
	capship = new Unit(23, 10, 0);
	supportship_1 = new Unit(22, 12, 0);
	supportship_2 = new Unit(24, 12, 0);
	// Enemy ships
	ecapship = new Unit(23, 4, 1);
	esupportship_1 = new Unit(22, 2, 1);
	esupportship_2 = new Unit(24, 2, 1);
	
}