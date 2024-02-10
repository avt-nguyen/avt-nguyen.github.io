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

// stores a color selected from the palette
// default value on start is white
var CURRENTCOLOR = PS.DEFAULT;

// 0 = do not draw
// 1 = draw
// allows for continual drawing when left mouse button is held while cursor moves around canvas
var DRAW = 0;

var CURRENTLEVEL = 1;

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

	PS.gridSize( 10, 11 );

	// This is also a good place to display
	// your game title or a welcome message
	// in the status line above the grid.
	// Uncomment the following code line and
	// change the string parameter as needed.
	
	// Add any other initialization code you need here.

	// second row of colors
	PS.color(0, 10, 0xFF8E80); // light red
	PS.color(1, 10, 0xFFC07D); // light orange
	PS.color(2, 10, 0xFFEC82); // light yellow
	PS.color(3, 10, 0x84D87C); // light green
	PS.color(4, 10, 0xA6D2FF); // light blue
	PS.color(5, 10, 0xB4ABED); // light purple
	PS.color(6, 10, 0xFFB5EF); // light pink
	PS.color(7, 10, PS.COLOR_WHITE); // white
	// clear canvas button
	PS.borderColor(8, 10, PS.COLOR_RED);
	PS.border(8, 10, 3)
	PS.glyph(8, 10, 128465);
	// check answer button
	PS.borderColor(9, 10, PS.COLOR_GREEN);
	PS.border(9, 10, 3)
	PS.glyph(9, 10, 10003);
	

	PS.initLevel(CURRENTLEVEL);
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

	//PS.debug( "PS.touch() @ " + x + ", " + y + "\n" );
	
	// Add code here for mouse clicks/touches
	// over a bead.

	// turn on ability to draw 
	DRAW = 1;

	// if bead clicked is part of the palette
	if (y > 9)
	{
		CURRENTCOLOR = PS.color(x, y); // set color to palette color
		
		// if bead clicked is clear canvas button
		if (x == 8)
		{
			PS.audioPlay("fx_rip");
			for (let clearX = 0; clearX < 10; clearX++) // clear entire canvas
			{
				for (let clearY = 0; clearY < 10; clearY++)
				{
					PS.borderColor(clearX, clearY, PS.DEFAULT);
					PS.border(clearX, clearY, PS.DEFAULT);
					if (PS.data(clearX, clearY) == 0)
					{
						PS.color(clearX, clearY, PS.DEFAULT);
					}
					
				}
			}
		}

		if (x == 9)
		{
			PS.checkLevel(CURRENTLEVEL);
		}
		if (x < 8) {
			PS.audioPlay("fx_click");
		}
	}
	else if (data == 0)
	{
		PS.color(x, y, CURRENTCOLOR); // if bead is not part of the palette or part of the level, draw with whatever the current color is
	}
	 
	// PS.debug( "PS.color() " + CURRENTCOLOR + "\n");
	// PS.debug( "PS.data() " + data + "\n");
};

/*
PS.release ( x, y, data, options )
Called when the left mouse button is released, or when a touch is lifted, over bead(x, y).
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.release = function( x, y, data, options ) {
	// Uncomment the following code line to inspect x/y parameters:

	//PS.debug( "PS.release() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse button/touch is released over a bead.

	// turn off drawing when left mouse is released
	DRAW = 0;
};

/*
PS.enter ( x, y, button, data, options )
Called when the mouse cursor/touch enters bead(x, y).
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

PS.enter = function( x, y, data, options ) {
	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.enter() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse cursor/touch enters a bead.
	//select color
	
	//if draw is on and the bead is not part of the palette or the level, draw
	if (DRAW == 1 && y < 10 && data == 0)
	{
		PS.color(x, y, CURRENTCOLOR);
	}
};

// checks if the current level was solved correctly
PS.checkLevel = function(level)
{
	if (level == 1)
	{
		if (PS.color(3, 5) == 0xFFC07D)
		{
			PS.correct();
		}
		else
		{
			PS.wrong();
			PS.changeBorderCheck(3, 5, 0xFFC07D);
		}

	}
	if (level == 2)
	{
		if (PS.color(4, 5) == 0xFF8E80 && PS.color(8, 5) == 0xFFEC82)
		{
			PS.correct();
		}
		else
		{
			PS.wrong();
			PS.changeBorderCheck(4, 5, 0xFF8E80);
			PS.changeBorderCheck(8, 5, 0xFFEC82);
		}

	}
	if (level == 3)
	{
		if (PS.color(4, 5) == 0xA6D2FF && PS.color(6, 5) == 0xFFB5EF && PS.color(8, 5) == 0xB4ABED)
		{
			PS.correct();
		}
		else
		{
			PS.wrong();
			PS.changeBorderCheck(4, 5, 0xA6D2FF);
			PS.changeBorderCheck(6, 5, 0xFFB5EF);
			PS.changeBorderCheck(8, 5, 0xB4ABED);
		}

	}
	if (level == 4)
	{
		if (PS.color(5, 5) == 0xFFB5EF && PS.color(6, 3) == 0xFFEC82 && PS.color(6, 4) == 0xA6D2FF && PS.color(7, 3) == 0x84D87C && PS.color(7, 5) == 0xB4ABED
		&& PS.color(5, 3) == PS.COLOR_WHITE && PS.color(5, 4) == PS.COLOR_WHITE && PS.color(5, 6) == PS.COLOR_WHITE && PS.color(6, 5) == PS.COLOR_WHITE
		&& PS.color(6, 6) == PS.COLOR_WHITE && PS.color(7, 4) == PS.COLOR_WHITE && PS.color(7, 6) == PS.COLOR_WHITE && PS.color(8, 3) == PS.COLOR_WHITE
		&& PS.color(8, 4) == PS.COLOR_WHITE && PS.color(8, 5) == PS.COLOR_WHITE && PS.color(8, 6) == PS.COLOR_WHITE && PS.color(9, 4) == PS.COLOR_WHITE)
		{
			PS.correct();
		}
		else
		{
			PS.wrong();
			for (let checkX = 5; checkX < 10; checkX++)
			{
				for (let checkY = 3; checkY < 7; checkY++)
				{
					PS.changeBorderCheck(checkX, checkY, PS.COLOR_WHITE);
				}
			}
			PS.changeBorderCheck(5, 5, 0xFFB5EF);
			PS.changeBorderCheck(6, 3, 0xFFEC82);
			PS.changeBorderCheck(6, 4, 0xA6D2FF);
			PS.changeBorderCheck(7, 3, 0x84D87C);
			PS.changeBorderCheck(7, 5, 0xB4ABED);
			PS.borderColor(9, 3, PS.DEFAULT);
			PS.border(9, 3, PS.DEFAULT);
			PS.borderColor(9, 5, PS.DEFAULT);
			PS.border(9, 5, PS.DEFAULT);
			PS.borderColor(9, 6, PS.DEFAULT);
			PS.border(9, 6, PS.DEFAULT);
		}
	}
	if (level == 5)
	{
		var correctColors = 0;
		var correctBlanks = 0; // 72 total blank squares in correct answer

		if (PS.color(1, 3) == 0xA6D2FF && PS.color(2, 3) == 0xFFEC82 && PS.color(3, 4) == 0xFFB5EF
		&& PS.color(5, 3) == 0xB4ABED && PS.color(6, 1) == 0xFFC07D && PS.color(7, 3) == 0xFFEC82
		&& PS.color(6, 5) == 0xFFB5EF && PS.color(7, 7) == 0x84D87C
		&& PS.color(0, 9) == 0xFF8E80 && PS.color(2, 6) == 0xFFEC82 && PS.color(4, 6) == 0xB4ABED)
		{
			correctColors = 1;
		}

		for (let checkX = 0; checkX < 10; checkX++)
		{
			for (let checkY = 0; checkY < 10; checkY++)
			{
				if ((checkY === 0 || checkY === 9) && (checkX !== 0 && checkX !== 9) ||
					(checkY === 1 || checkY === 8) && (checkX !== 3 && checkX !== 6) ||
					(checkY === 2 || checkY === 7) && (checkX !== 2 && checkX !== 7) ||
					(checkY === 3 || checkY === 6) && (checkX !== 1 && checkX !== 2 && checkX !== 4 && checkX !== 5 && checkX !== 7 && checkX !== 8) ||
					(checkY === 4 || checkY === 5) && (checkX !== 3 && checkX !== 6))
					{
					if (PS.color(checkX, checkY) === PS.COLOR_WHITE)
					{
						correctBlanks++;
					}
				}
			}
		}
		

		if (correctColors == 1 && correctBlanks == 72)
		{
			PS.correct();
		}
		else
		{
			PS.wrong();

			for (let checkX = 0; checkX < 10; checkX++)
			{
				for (let checkY = 0; checkY < 10; checkY++)
				{
					if (PS.data(checkX, checkY) != 1)
					{
						PS.changeBorderCheck(checkX, checkY, PS.COLOR_WHITE);
					}
				}
			}

			// Quadrant 1
			PS.changeBorderCheck(1, 3, 0xA6D2FF);
			PS.changeBorderCheck(2, 3, 0xFFEC82);
			PS.changeBorderCheck(3, 4, 0xFFB5EF);

			// Q2
			PS.changeBorderCheck(5, 3, 0xB4ABED);
			PS.changeBorderCheck(6, 1, 0xFFC07D);
			PS.changeBorderCheck(7, 3, 0xFFEC82);

			// Q3
			PS.changeBorderCheck(6, 5, 0xFFB5EF);
			PS.changeBorderCheck(7, 7, 0x84D87C);

			// Q4
			PS.changeBorderCheck(0, 9, 0xFF8E80);
			PS.changeBorderCheck(2, 6, 0xFFEC82);
			PS.changeBorderCheck(4, 6, 0xB4ABED);
		}
	}
}


// red    0xFF8E80
// orange 0xFFC07D
// yellow 0xFFEC82
// green  0x84D87C
// blue   0xA6D2FF
// purple 0xB4ABED
// pink   0xFFB5EF
// white  PS.COLOR_WHITE or PS.DEFAULT

// initializes levels when called
PS.initLevel = function(level)
{
	// clears the level and sets grey area
	for (let clearX = 0; clearX < 10; clearX++)
		{
			for (let clearY = 0; clearY < 10; clearY++)
			{
				PS.color(clearX, clearY, PS.COLOR_GRAY);
				PS.data(clearX, clearY, 1);
				PS.borderColor(clearX, clearY, PS.DEFAULT);
				PS.border(clearX, clearY, PS.DEFAULT);
			}
		}
	if (level == 1)
	{
		PS.statusText("Level 1: Rainbow");
		PS.setLevelBead(2, 5, 0xFF8E80); // red
		PS.color(3, 5, PS.DEFAULT); // white
		PS.data(3, 5, 0);
		PS.setLevelBead(4, 5, 0xFFEC82); // yellow
		PS.setLevelBead(5, 5, 0x84D87C); // green
		PS.setLevelBead(6, 5, 0xA6D2FF); // blue
		PS.setLevelBead(7, 5, 0xB4ABED); // purple
	}
	if (level == 2)
	{
		PS.statusText("Level 2: Complete the Pattern");
		PS.setLevelBead(1, 5, 0xFF8E80); // red
		PS.setLevelBead(2, 5, 0xFFEC82); // yellow
		PS.color(4, 5, PS.DEFAULT); // white
		PS.data(4, 5, 0);
		PS.setLevelBead(5, 5, 0xFFEC82); // yellow
		PS.setLevelBead(7, 5, 0xFF8E80); // red
		PS.color(8, 5, PS.DEFAULT); // white
		PS.data(8, 5, 0);
	}
	if (level == 3)
	{
		PS.statusText("Level 3: Complete the Pattern");
		PS.setLevelBead(0, 5, 0xFFB5EF); // pink
		PS.setLevelBead(1, 5, 0xA6D2FF); // blue
		PS.setLevelBead(2, 5, 0xB4ABED); // purple
		PS.setLevelBead(3, 5, 0xFFB5EF); // pink
		PS.color(4, 5, PS.DEFAULT); // white
		PS.data(4, 5, 0);
		PS.setLevelBead(5, 5, 0xB4ABED); // purple
		PS.color(6, 5, PS.DEFAULT); // white
		PS.data(6, 5, 0);
		PS.setLevelBead(7, 5, 0xA6D2FF); // blue
		PS.color(8, 5, PS.DEFAULT); // white
		PS.data(8, 5, 0);
		PS.setLevelBead(9, 5, 0xFFB5EF); // pink
	}
	if (level == 4)
	{
		PS.statusText("Level 4: Symmetry");
		// add drawable
		for (let clearX = 0; clearX < 10; clearX++)
		{
			for (let clearY = 3; clearY < 7; clearY++)
			{
				PS.color(clearX, clearY, PS.DEFAULT);
				// make half the board unable to be drawn on
				if (clearX < 5)
				{
					PS.data(clearX, clearY, 1);
				}
				else
				{
					PS.data(clearX, clearY, 0);
				}
			}
		}
		
		// solution to be mirrored
		PS.setLevelBead(0, 3, 0xFF8E80); // red
		PS.setLevelBead(0, 5, 0xFF8E80); // red
		PS.setLevelBead(0, 6, 0xFFC07D); // orange
		PS.setLevelBead(2, 3, 0x84D87C); // green
		PS.setLevelBead(2, 5, 0xB4ABED); // purple
		PS.setLevelBead(3, 3, 0xFFEC82); // yellow
		PS.setLevelBead(3, 4, 0xA6D2FF); // blue
		PS.setLevelBead(4, 5, 0xFFB5EF); // pink
		// starting point
		PS.setLevelBead(9, 3, 0xFF8E80); // red
		PS.setLevelBead(9, 5, 0xFF8E80); // red
		PS.setLevelBead(9, 6, 0xFFC07D); // orange
	}
	if (level == 5)
	{
		PS.statusText("Level 5: Symmetry");
		for (let clearX = 0; clearX < 10; clearX++)
		{
			for (let clearY = 0; clearY < 10; clearY++)
			{
				PS.color(clearX, clearY, PS.DEFAULT);
				PS.data(clearX, clearY, 0);
				PS.border(clearX, clearY, PS.DEFAULT);
			}
		}

		// Quadrant 1 (note: quadrants are numbered in clockwise order, top left is 1)
		PS.setLevelBead(0, 0, 0xFF8E80); // red
		PS.setLevelBead(2, 2, 0x84D87C); // green
		PS.setLevelBead(3, 1, 0xFFC07D); // orange
		PS.setLevelBead(4, 3, 0xB4ABED); // purple

		// Quadarant 2
		PS.setLevelBead(6, 4, 0xFFB5EF); // pink
		PS.setLevelBead(7, 2, 0x84D87C); // green
		PS.setLevelBead(8, 3, 0xA6D2FF); // blue
		PS.setLevelBead(9, 0, 0xFF8E80); // red

		// Quadrant 3
		PS.setLevelBead(5, 6, 0xB4ABED); // purple
		PS.setLevelBead(6, 8, 0xFFC07D); // orange
		PS.setLevelBead(7, 6, 0xFFEC82); // yellow
		PS.setLevelBead(8, 6, 0xA6D2FF); // blue
		PS.setLevelBead(9, 9, 0xFF8E80); // red

		// Quadrant 4
		PS.setLevelBead(1, 6, 0xA6D2FF); // blue
		PS.setLevelBead(2, 7, 0x84D87C); // green
		PS.setLevelBead(3, 5, 0xFFB5EF); // pink
		PS.setLevelBead(3, 8, 0xFFC07D); // orange
	}
	if (level == 6)
	{
		PS.statusText("free draw! you cleared all levels!");
		for (let clearX = 0; clearX < 10; clearX++)
		{
			for (let clearY = 0; clearY < 10; clearY++)
			{
				PS.color(clearX, clearY, PS.DEFAULT);
				PS.data(clearX, clearY, 0);
				PS.border(clearX, clearY, PS.DEFAULT);
			}
		}
	}
}

// what to do when the solution is correct
PS.correct = function()
{
	PS.statusText("correct!");
	PS.audioPlay("fx_ding");
	CURRENTLEVEL++;
	PS.initLevel(CURRENTLEVEL);
}

// what to do when the solution is incorrect
PS.wrong = function()
{
	PS.statusText("wrong!");
	PS.audioPlay("fx_bloink");
}

PS.changeBorderCheck = function(x, y, correctColor)
{
	if (PS.color(x, y) == correctColor)
	{
		PS.borderColor(x, y, PS.COLOR_GREEN);
		PS.border(x, y, 2);
	}
	else
	{
		PS.borderColor(x, y, PS.COLOR_RED);
		PS.border(x, y, 2);
	}
}

PS.setLevelBead = function(x, y, color)
{
	PS.color(x, y, color);
	PS.data(x, y, 1);
}