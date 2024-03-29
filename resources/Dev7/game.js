/*
game.js for Perlenspiel 3.3.x
Last revision: 2022-03-15 (BM)

Perlenspiel is a scheme by Professor Moriarty (bmoriarty@wpi.edu).
This version of Perlenspiel (3.3.x) is hosted at <https://ps3.perlenspiel.net>
Perlenspiel is Copyright © 2009-22 Brian Moriarty.
This file is part of the standard Perlenspiel 3.3.x devkit distribution.

Perlenspiel is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Perlenspiel is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Lesser General Public License for more details.

You may have received a copy of the GNU Lesser General Public License
along with the Perlenspiel devkit. If not, see <http://www.gnu.org/licenses/>.
*/

/*
This JavaScript file is a template for creating new Perlenspiel 3.3.x games.
Any unused event-handling function templates can be safely deleted.
Refer to the tutorials and documentation at <https://ps3.perlenspiel.net> for details.
*/

/*
The following comment lines are for JSHint <https://jshint.com>, a tool for monitoring code quality.
You may find them useful if your development environment is configured to support JSHint.
If you don't use JSHint (or are using it with a configuration file), you can safely delete these two lines.
*/

/* jshint browser : true, devel : true, esversion : 6, freeze : true */
/* globals PS : true */

"use strict"; // Do NOT remove this directive!

// 0 = hub
// 1 = blue key room
// 2 = orange key room (not in this version)
// 3 = red key room
// 4 = maze key check
var CURRENTROOM = 0;
var MOUSE = PS.spriteSolid (PS.DEFAULT, PS.DEFAULT);
var GREENKEY = 0;
var BLUEKEY = 0;
var BLUEENTERED = 0;
var BLUEMAZEENTERED = 0;
var REDMAZEENTERED = 0;
var REDKEY = 0;
const TILESTEP = new Array(PS.COLOR_RED, PS.COLOR_ORANGE, PS.COLOR_YELLOW, PS.COLOR_GREEN, PS.COLOR_BLUE);
var ROOM3SOLVED = 0;
var CHEESEEATEN = 0;

/*
PS.init( system, options )
Called once after engine is initialized but before event-polling begins.
This function doesn't have to do anything, although initializing the grid dimensions with PS.gridSize() is recommended.
If PS.grid() is not called, the default grid dimensions (8 x 8 beads) are applied.
Any value returned is ignored.
[system : Object] = A JavaScript object containing engine and host platform information properties; see API documentation for details.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.init = function( system, options ) {
	// Uncomment the following code line
	// to verify operation:

	// PS.debug( "PS.init() called\n" );

	// This function should normally begin
	// with a call to PS.gridSize( x, y )
	// where x and y are the desired initial
	// dimensions of the grid.
	// Call PS.gridSize() FIRST to avoid problems!
	// The sample call below sets the grid to the
	// default dimensions (8 x 8).
	// Uncomment the following code line and change
	// the x and y parameters as needed.

	PS.gridSize(10, 11);
	for (let x = 0; x < 10; x++) 
	{
		for (let y = 0; y < 10; y++)
		{
			PS.border(x, y, 0);
		}
	}
	PS.spriteSolidColor (MOUSE, PS.COLOR_GRAY);
	PS.loadRoom(CURRENTROOM);
	for (let x = 0; x < 10; x++)
	{
		PS.data(x, 10, 1);
	}
	if (CURRENTROOM == 0)
	{
		PS.spriteMove(MOUSE, 5, 4);
	}
	
	

	// This is also a good place to display
	// your game title or a welcome message
	// in the status line above the grid.
	// Uncomment the following code line and
	// change the string parameter as needed.

	// PS.statusText( "Game" );

	// Add any other initialization code you need here.
};

/*
PS.touch ( x, y, data, options )
Called when the left mouse button is clicked over bead(x, y), or when bead(x, y) is touched.
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.touch = function( x, y, data, options ) {
	// Uncomment the following code line
	// to inspect x/y parameters:

	// PS.debug( "PS.touch() @ " + x + ", " + y + "\n" );

	// Add code here for mouse clicks/touches
	// over a bead.
	if (CURRENTROOM == 1 && x == 9 && y == 10)
	{
		let mouseLocPrev = PS.spriteMove(MOUSE);
		PS.loadRoom(1);
		PS.alpha(mouseLocPrev.x, mouseLocPrev.y, PS.ALPHA_OPAQUE);
		if (mouseLocPrev.x == 1 && mouseLocPrev.y == 1)
		{
			PS.color(1, 1, PS.COLOR_GRAY);
			PS.audioPlay("fx_squink");
		}
	}
};

/*
PS.keyDown ( key, shift, ctrl, options )
Called when a key on the keyboard is pressed.
This function doesn't have to do anything. Any value returned is ignored.
[key : Number] = ASCII code of the released key, or one of the PS.KEY_* constants documented in the API.
[shift : Boolean] = true if shift key is held down, else false.
[ctrl : Boolean] = true if control key is held down, else false.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.keyDown = function( key, shift, ctrl, options ) {
	// Uncomment the following code line to inspect first three parameters:

	//PS.debug( "PS.keyDown(): key=" + key + ", shift=" + shift + ", ctrl=" + ctrl + "\n" );

	// Add code here for when a key is pressed.

	let mouseLoc = PS.spriteMove(MOUSE);
	let mouseLocPrev = PS.spriteMove(MOUSE);
	
    let prevBlockColor = PS.color(mouseLocPrev.x, mouseLocPrev.y);
	if (CURRENTROOM == 1)
	{
		prevBlockColor = 0xA4DCFF
	}

	if (prevBlockColor == PS.COLOR_GRAY)
	{
		prevBlockColor = PS.COLOR_WHITE;
	}

	if (CURRENTROOM == 3 && ROOM3SOLVED == 1)
	{
		prevBlockColor = PS.borderColor(mouseLocPrev.x, mouseLocPrev.y);
	}

	// up
	if (key == 1006)
	{
		mouseLoc.y--;
	}

	// down
	if (key == 1008)
	{
		mouseLoc.y = mouseLoc.y + 1;
	}

	//right
	if (key == 1007)
	{
		mouseLoc.x++;
	}

	// left
	if (key == 1005)
	{
		mouseLoc.x--;
	}

	// general movement
	if ((mouseLoc.x >= 0 && mouseLoc.x <= 9) &&
		(mouseLoc.y >= 0 && mouseLoc.y <= 9))
	{
		if (PS.data(mouseLoc.x, mouseLoc.y) == 0 ||
		PS.data(mouseLoc.x, mouseLoc.y) == 5 || PS.data(mouseLoc.x, mouseLoc.y) == 6 ||
		PS.data(mouseLoc.x, mouseLoc.y) == 8)
		{
			PS.spriteMove(MOUSE, mouseLoc.x, mouseLoc.y);
			PS.color(mouseLocPrev.x, mouseLocPrev.y, prevBlockColor);
			PS.alpha(mouseLocPrev.x, mouseLocPrev.y, PS.ALPHA_OPAQUE);

			//ice breaking
			if (CURRENTROOM == 1){
				if ( PS.data(mouseLoc.x, mouseLoc.y) == 5)
				{
					PS.setIce(mouseLocPrev.x, mouseLocPrev.y, 1);
				}
				if ( PS.data(mouseLoc.x, mouseLoc.y) == 6)
				{
					PS.setLevelBead(mouseLocPrev.x, mouseLocPrev.y, 0x7699FF);
				}
			}

			if (CURRENTROOM == 3)
			{
				if(mouseLoc.x >= 0 && mouseLoc.x < 10 &&
					mouseLoc.y >= 0 && mouseLoc.y < 10 &&
					PS.borderColor(mouseLoc.x, mouseLoc.y) == TILESTEP[0])
				{
					PS.color(mouseLoc.x, mouseLoc.y, TILESTEP[0]);
					TILESTEP.shift();
					PS.audioPlay("fx_bloop");
				}
			}
		}
		else
		{
			PS.spriteMove(MOUSE, mouseLocPrev.x, mouseLocPrev.y);
		}
		
	}

	// collect key
	if (mouseLoc.x >= 0 && mouseLoc.x < 10 &&
		mouseLoc.y >= 0 && mouseLoc.y < 10 &&
		PS.data(mouseLoc.x, mouseLoc.y) == 3)
	{
		let keyColor = PS.color(mouseLoc.x, mouseLoc.y);
		PS.spriteMove(MOUSE, mouseLoc.x, mouseLoc.y);
		PS.collectKey(mouseLoc.x, mouseLoc.y, keyColor);
		PS.color(mouseLocPrev.x, mouseLocPrev.y, prevBlockColor);
		PS.audioPlay("fx_coin1");

		if (CURRENTROOM == 1)
		{
			PS.setIce(8, 8, 1);
			PS.alpha(8, 8, PS.ALPHA_OPAQUE);
		}
	}

	// unlock door
	if (mouseLoc.x >= 0 && mouseLoc.x < 10 &&
		mouseLoc.y >= 0 && mouseLoc.y < 10 &&
		PS.data(mouseLoc.x, mouseLoc.y) == 2)
	{
		let doorColor = PS.borderColor(mouseLoc.x, mouseLoc.y);
		
		if (PS.unlockDoor(mouseLoc.x, mouseLoc.y, doorColor) == 1)
		{
			PS.spriteMove(MOUSE, mouseLoc.x, mouseLoc.y);
			PS.color(mouseLoc.x, mouseLoc.y, doorColor);
        	PS.alpha(mouseLoc.x, mouseLoc.y, PS.ALPHA_OPAQUE);
			PS.audioPlay("fx_click");
		}
	}

	// eat cheese
	if (mouseLoc.x >= 0 && mouseLoc.x < 10 &&
		mouseLoc.y >= 0 && mouseLoc.y < 10 &&
		PS.data(mouseLoc.x, mouseLoc.y) == 7)
	{
		PS.checkCheese(mouseLoc.x, mouseLoc.y);
		CHEESEEATEN = 1;
		PS.audioPlay("fx_tada");
	}

	if (CURRENTROOM == 0)
	{
		if (mouseLoc.x == 9 && mouseLoc.y == 5)
		{
			PS.statusText("Hello rat! Cheese is somewhere in the lab.");
			if (CHEESEEATEN == 1)
			{
				PS.statusText("Looks like you found the cheese. Good job!");
			}	
		}

		// load room 1
		if (mouseLoc.x == 9 && mouseLoc.y == 1)
		{
			CURRENTROOM = 1;
			PS.loadRoom(CURRENTROOM);
			PS.audioPlay("fx_click");
		}
		// load room 3
		if (mouseLoc.x == 0 && mouseLoc.y == 1)
		{
			if (BLUEKEY == 1)
			{
				CURRENTROOM = 3;
				PS.loadRoom(CURRENTROOM);
				PS.audioPlay("fx_click");
			}
		}
		// load room 4
		if (mouseLoc.x == 1 && mouseLoc.y == 9)
		{
			CURRENTROOM = 4;
			PS.loadRoom(CURRENTROOM);
			PS.audioPlay("fx_click");
		}
	}

	if (CURRENTROOM == 1)
	{	
		if (mouseLoc.x == 0 && mouseLoc.y == 1)
		{
			CURRENTROOM = 0;
			
			PS.color(0, 1, PS.COLOR_BLUE);
			PS.loadRoom(CURRENTROOM);
			PS.spriteMove(MOUSE, 8, 1);
			PS.audioPlay("fx_click");
		}		
	}

	if (CURRENTROOM == 2)
	{
		if (mouseLoc.x == 3 && mouseLoc.y == 9)
		{
			CURRENTROOM = 0;
			PS.loadRoom(CURRENTROOM);
			PS.spriteMove(MOUSE, 3, 1);
			PS.audioPlay("fx_click");
		}
	}

	if (CURRENTROOM == 3)
	{
		if (PS.color(1, 1) == PS.COLOR_RED && PS.color(4, 3) == PS.COLOR_ORANGE && PS.color(7, 4) == PS.COLOR_YELLOW &&
		PS.color(1, 5) == PS.COLOR_GREEN && PS.color(6, 7) == PS.COLOR_BLUE)
		{
			if (REDKEY == 0)
			{
				PS.setLevelKey(1, 8, PS.COLOR_RED);
				ROOM3SOLVED = 1;
			}
		}

		if (mouseLoc.x == 9 && mouseLoc.y == 1)
		{
			CURRENTROOM = 0;
			PS.loadRoom(CURRENTROOM);
			PS.spriteMove(MOUSE, 1, 1);
			PS.audioPlay("fx_click");
		}
	}

	if (CURRENTROOM == 4)
	{
		if (mouseLoc.x == 1 && mouseLoc.y == 0)
		{
			CURRENTROOM = 0;
			PS.loadRoom(CURRENTROOM);
			PS.spriteMove(MOUSE, 1, 8);
			PS.audioPlay("fx_click");
		}
	}
};


PS.loadRoom = function(room)
{
	for (let x = 0; x < 10; x++) 
	{
		for (let y = 0; y < 10; y++)
		{
			PS.border(x, y, 0);
			PS.borderColor(x, y, PS.COLOR_WHITE);
			PS.color(x, y, PS.COLOR_WHITE);
			PS.alpha(x, y, PS.ALPHA_OPAQUE);
			PS.data(x, y, 0);
			PS.glyph(x, y, PS.DEFAULT);
		}
	}
	PS.border(9, 10, PS.DEFAULT);
	PS.glyph(9, 10, PS.DEFAULT);
	if (room == 0)
	{
		PS.statusText( "" );
		if (PS.color(0, 10) !=  PS.COLOR_GREEN)
		{
			PS.setLevelKey(3, 4, PS.COLOR_GREEN);
		}
		PS.setLevelBead(2, 3, PS.COLOR_BLACK);
		PS.setLevelBead(3, 3, PS.COLOR_BLACK);
		PS.setLevelBead(4, 3, PS.COLOR_BLACK);
		PS.setLevelBead(5, 3, PS.COLOR_BLACK);
		PS.setLevelBead(6, 3, PS.COLOR_BLACK);
		PS.setLevelBead(7, 3, PS.COLOR_BLACK);

		PS.setLevelBead(2, 4, PS.COLOR_BLACK);
		PS.setLevelBead(2, 5, PS.COLOR_BLACK);

		PS.setLevelBead(2, 6, PS.COLOR_BLACK);
		PS.setLevelBead(3, 6, PS.COLOR_BLACK);
		PS.setLevelBead(4, 6, PS.COLOR_BLACK);
		PS.setLevelBead(5, 6, PS.COLOR_BLACK);
		PS.setLevelBead(6, 6, PS.COLOR_BLACK);
		PS.setLevelBead(7, 6, PS.COLOR_BLACK);

		PS.setLevelBead(7, 4, PS.COLOR_BLACK);
		// green door
		PS.setLevelDoor(7, 5, PS.COLOR_GREEN);
		if (GREENKEY == 1)
		{
			PS.color(7, 5, PS.COLOR_GREEN);
		}

		// door (leads to 1)
		PS.setLevelDoor(9, 1, PS.COLOR_WHITE);

		// door (leads to 2)
		PS.setLevelDoor(3, 0, PS.COLOR_WHITE);


		// blue door (leads to 3)
		PS.setLevelDoor(0, 1, PS.COLOR_BLUE);
		if (BLUEENTERED == 1)
		{
			//PS.debug("BLUE ENTERED = 1\n");
			PS.color(0, 1, PS.COLOR_BLUE);
		}

		// door (leads to 4)
		PS.setLevelDoor(1, 9, PS.COLOR_WHITE);

		// NPC
		PS.setNPC(9, 5, PS.COLOR_WHITE, 128104);
	}

	// room to get blue key
	if (room == 1)
	{
		PS.statusText( "Hm. The ice looks like it might break" );
		PS.spriteMove(MOUSE, 1, 1);

		//reset button
		PS.addResetButton();

		for (let x = 0; x < 10; x++) 
		{
			for (let y = 0; y < 10; y++)
			{
				if ((x != 0 && y != 1) || (x != 1 && y != 1))
				{
					PS.setLevelBead(x, y, 0x7699FF);
				}
			}
		}
		PS.setLevelBead(9, 1, 0x7699FF);
		PS.alpha(9, 1, PS.ALPHA_OPAQUE);

		// door (leads to 0)
		PS.setLevelDoor(0, 1, PS.COLOR_WHITE);

		for (let x = 2; x < 9; x++)
		{
			PS.setIce(x, 1, 0);
			PS.setIce(x, 5, 0);
			PS.setIce(x, 8, 0);
		}
		PS.setIce(5, 2, 0);
		PS.setIce(8, 2, 0);
		PS.setIce(8, 4, 0);
		PS.setIce(2, 4, 0);
		PS.setIce(1, 5, 0);
		PS.setIce(1, 6, 0);
		PS.setIce(1, 7, 0);
		PS.setIce(1, 8, 0);
		PS.setIce(3, 6, 0);
		PS.setIce(3, 7, 0);

		for (let x = 2; x < 9; x++)
		{
			PS.setIce(x, 3, 0);
		}

		if (BLUEKEY == 0)
		{
			PS.setLevelKey(9, 8, PS.COLOR_BLUE);
		}
	}

	// room to get orange key
	if (room == 2)
	{
		PS.statusText( "" );
		PS.spriteMove(MOUSE, 4, 8);
		// door (leads to 0)
		PS.setLevelDoor(3, 9, PS.COLOR_WHITE);

		PS.setLevelBead(6, 3, PS.COLOR_ORANGE);
	}

	// room to get red key
	if (room == 3)
	{
		if (REDKEY == 0)
		{
			PS.statusText( "Rainbow tiles, maybe I should step on them?" );
		}
		for (let x = 0; x < 10; x++) 
		PS.color(9, 1, PS.COLOR_BLUE);
		PS.spriteMove(MOUSE, 8, 1);
		// door (leads to 0)
		PS.setLevelDoor(9, 1, PS.COLOR_BLUE);
		BLUEENTERED = 1;

		PS.setColorTile(1, 1, PS.COLOR_RED);
		PS.setColorTile(4, 3, PS.COLOR_ORANGE);
		PS.setColorTile(7, 4, PS.COLOR_YELLOW);
		PS.setColorTile(1, 5, PS.COLOR_GREEN);
		PS.setColorTile(6, 7, PS.COLOR_BLUE);

		if (ROOM3SOLVED == 1)
		{
			PS.color(1, 1, PS.COLOR_RED);
			PS.color(4, 3, PS.COLOR_ORANGE);
			PS.color(7, 4, PS.COLOR_YELLOW);
			PS.color(1, 5, PS.COLOR_GREEN);
			PS.color(6, 7, PS.COLOR_BLUE);
		}
	}

	// key check maze
	if (room == 4)
	{
		PS.statusText( "" );
		PS.spriteMove(MOUSE, 0, 0);

		// door (leads to 0)
		PS.setLevelDoor(1, 0, PS.COLOR_WHITE);

		PS.setLevelBead(2, 0, PS.COLOR_BLACK);
		PS.setLevelBead(1, 1, PS.COLOR_BLACK);
		PS.setLevelBead(2, 1, PS.COLOR_BLACK);
		PS.setLevelBead(4, 1, PS.COLOR_BLACK);
		PS.setLevelBead(7, 1, PS.COLOR_BLACK);
		PS.setLevelBead(8, 1, PS.COLOR_BLACK);
		PS.setLevelBead(1, 2, PS.COLOR_BLACK);
		PS.setLevelBead(5, 2, PS.COLOR_BLACK);
		PS.setLevelBead(6, 2, PS.COLOR_BLACK);
		PS.setLevelBead(7, 2, PS.COLOR_BLACK);
		PS.setLevelBead(1, 3, PS.COLOR_BLACK);
		PS.setLevelBead(2, 3, PS.COLOR_BLACK);
		PS.setLevelBead(3, 3, PS.COLOR_BLACK);
		PS.setLevelBead(5, 3, PS.COLOR_BLACK);
		PS.setLevelBead(3, 4, PS.COLOR_BLACK);
		PS.setLevelBead(5, 4, PS.COLOR_BLACK);
		PS.setLevelBead(7, 4, PS.COLOR_BLACK);
		PS.setLevelBead(8, 4, PS.COLOR_BLACK);
		PS.setLevelBead(1, 5, PS.COLOR_BLACK);
		PS.setLevelBead(2, 5, PS.COLOR_BLACK);
		PS.setLevelBead(5, 5, PS.COLOR_BLACK);
		PS.setLevelBead(7, 5, PS.COLOR_BLACK);
		PS.setLevelBead(3, 6, PS.COLOR_BLACK);
		PS.setLevelBead(6, 6, PS.COLOR_BLACK);
		PS.setLevelBead(7, 6, PS.COLOR_BLACK);
		PS.setLevelBead(9, 6, PS.COLOR_BLACK);
		PS.setLevelBead(1, 7, PS.COLOR_BLACK);
		PS.setLevelBead(2, 7, PS.COLOR_BLACK);
		PS.setLevelBead(3, 7, PS.COLOR_BLACK);
		PS.setLevelBead(6, 7, PS.COLOR_BLACK);
		PS.setLevelBead(2, 8, PS.COLOR_BLACK);
		PS.setLevelBead(5, 8, PS.COLOR_BLACK);
		PS.setLevelBead(6, 8, PS.COLOR_BLACK);
		PS.setLevelBead(6, 9, PS.COLOR_BLACK);

		if (CHEESEEATEN == 0)
		{
			PS.setCheese(8,8);
		}
		
		PS.setLevelDoor(0, 7, PS.COLOR_BLUE);
		if (BLUEMAZEENTERED == 1)
		{
			PS.color(0, 7, PS.COLOR_BLUE);
		}

		PS.setLevelDoor(8, 6, PS.COLOR_RED);
		if (REDMAZEENTERED == 1)
		{
			PS.color(8, 6, PS.COLOR_RED);
		}
	}
};

// data key!
// 0 = none
// 1 = level bead (walls/anything you can't walk on)
// 2 = door
// 3 = key
// 4 = NPC
// 5 = ice (standard)
// 6 = ice (breaking)
// 7 = cheese
// 8 = color tile
PS.setLevelBead = function(x, y, color)
{
	PS.color(x, y, color);
	PS.data(x, y, 1);
};

PS.setLevelDoor = function(x, y, color)
{
	PS.border(x, y, 5);
	PS.borderColor(x, y, color);
	PS.data(x, y, 2);
	PS.glyph(x, y, 128682);
};

PS.setLevelKey = function(x, y, color)
{
	PS.color(x, y, color);
	PS.alpha(x, y, PS.ALPHA_OPAQUE);
	PS.data(x, y, 3);
	PS.glyph(x, y, 128273);
};

PS.setIce = function(x, y, frozen)
{
	frozen = frozen || 0;
	// freezing ice
	if (frozen == 0)
	{
		PS.color(x, y, 0xA4DCFF);
		PS.data(x, y, 5);
	}

	// going to break
	if (frozen == 1)
	{
		PS.color(x, y, 0x5CA6FF);
		PS.data(x, y, 6);
	}

	// broken
	if (frozen == 2)
	{
		PS.setLevelBead(x, y, 0x7699FF);
	}
	return frozen;
};

PS.setNPC = function(x, y, color, glyph)
{
	PS.color(x, y, color);
	PS.data(x, y, 4);
	PS.glyph(x, y, glyph);
};

PS.setCheese = function(x, y)
{
	PS.data(x, y, 7);
	PS.glyph(x, y, 129472);
}

// collect a key when a key is touched
PS.collectKey = function(x, y, keyColor)
{
	if (keyColor == PS.COLOR_GREEN)
	{
		PS.color(0, 10, PS.COLOR_GREEN);
		PS.glyph(0, 10, 128273);
		PS.glyph(x, y, PS.DEFAULT);
		PS.data(x, y, 0);
		GREENKEY = 1;
	}
	if (keyColor == PS.COLOR_BLUE)
	{
		PS.color(1, 10, PS.COLOR_BLUE);
		PS.glyph(1, 10, 128273);
		PS.glyph(x, y, PS.DEFAULT);
		PS.data(x, y, 0);
		BLUEKEY = 1;
	}
	if (keyColor == PS.COLOR_RED)
	{
		PS.color(2, 10, PS.COLOR_RED);
		PS.glyph(2, 10, 128273);
		PS.glyph(x, y, PS.DEFAULT);
		PS.data(x, y, 0);
		REDKEY = 1;
	}
};

// checks if a door can be entered
// return
// 0: cannot unlock door
// 1: can unlock door
PS.unlockDoor = function(x, y, doorColor)
{
	if (doorColor == PS.COLOR_GREEN)
	{
		if (PS.color(0, 10) == PS.COLOR_GREEN)
		{
			return 1;
		}
		else
		{
			return 0; 
		}
	}
	if (doorColor == PS.COLOR_BLUE)
	{
		if (PS.color(1, 10) == PS.COLOR_BLUE)
		{
			if (CURRENTROOM == 3)
			{
				BLUEENTERED = 1; 
			}
			if (CURRENTROOM == 4)
			{
				if (doorColor == PS.COLOR_BLUE)
				{
					BLUEMAZEENTERED = 1;
				}
			}
			return 1;
		}
		else
		{
			return 0; 
		}
	}
	if (doorColor == PS.COLOR_RED)
	{
		if (PS.color(2, 10) == PS.COLOR_RED)
		{
			if (CURRENTROOM == 4)
			{
				if (doorColor == PS.COLOR_RED)
				{
					REDMAZEENTERED = 1;
				}
			}
			return 1;
		}
		else
		{
			return 0; 
		}
	}
	if (doorColor == PS.COLOR_WHITE)
	{
		return 1;
	}
};

PS.checkCheese = function(x, y)
{
	if (PS.data(x, y) == 7)
	{
		PS.statusText( "Cheese! Delicious!" );
		PS.glyph(x, y, PS.DEFAULT);
		PS.data(x, y, 0);
	}
};

PS.setColorTile = function(x, y, color)
{
	PS.border(x, y, 3);
	PS.borderColor(x, y, color);
	PS.data(x, y, 8);
};

PS.addResetButton = function()
{
	PS.border(9, 10, 5);
	PS.borderColor(9, 10, PS.COLOR_GRAY);
	PS.glyph(9, 10, 10227);
};
