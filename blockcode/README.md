* 500 lines or less is not valuable to simply copy and paste. Even if you comment every function, it doesn’t permit full understanding. Make edits to the program in your own ways to truly understand things
* Maybe add color to the pen?
* It’s worth drawing a conceptual map of the architecture before jumping in. Write down hypotheses, ask open-ended questions.
* A good chunk of information is missing from the explanation. Spend the time to understand what is going on in each omitted section

Discussion of the Architecture

* Five major files -
  * one regarding langauge (turtle.js)
  * Web utilities (util.js, drag.js, file.js)
  * Two for handling and providing blocks (blocks.js, menu.js)
* Turtle.js operates as the compiler, associating particular blocks with particular functions
* Web utilites, while available in libraries, are useful to have available on their own accord, to better understand the needs of the project as well as to avoid importing useless library junk and needlessly extending the line count
  * Drag.js implements the key interaction of the language, allowing the user to drag blocks from the menu into the script
* Block Handlers
  * Block.js provided the abstract representation of block-based language (what does a block look like, how do you save a block, how do you read from a block, how do you run the function associated with a block)
  * Menu.js runs the actual program and has helper code (Dive into this more maybe?)

Block.js

* Create HTML structure of a block
* Create utility to createBlock
* create utilities to handle blocks as DOM elements
  * blockContents, blockValue, blockUnits, blockScript
* Create a handler that runs each block in an array of blocks

Drag.js

* Identifies interactions between the menu and script sections
  * script to menu (delete block from script)
  * script to script (move block within script)
  * menu to script (copy block into script)
  * menu to menu (do nothing)
* Implements utilities to determine what state we are in
  * dragStart
    * check if we’re dragging a menu or a script block
    * collect scriptBlocks, to use later during the drop
  * dragOver (dragenter, dragout)
    * allows us to add visual cues to where we’re dropping blocks off
  * drop
    * Check where we dragged from (set in dragStart) and where we dragged to
    * Script —\> menu : blockRemoved
    * Menu —\> script: blockAdded, clone block
    * Script —\> Script: move block

Menu.js

*Note: Having a single file to gather random functions together is useful, especially when an architecture is under development.*

* Where blocks are associated with the functions that are called when they run
* Defines the list of blocks you can choose for your script
* Handling when and what to run
  * runSoon
    * Since the browser tries to run on every frame, we return immediately unless marking the script as dirty through this function
  * run
    * cleans scriptDirty, calls Block.run
  * runEach
    * for each block, run the function associated with block name by adding it to the scriptRegistry, mapping it by name
* Handle menu utilities
  * menuItem
    * Add functions to the menu through this function
* General Purpose Language functiongs
  * repeat
    * repeat the running of a particular block including children

Turtle.js

* Identifies the rules of a turtle programming langauge (pen up, pen down, turn left/right, forward/backward, circles)
* Draws turtle/pen itself
* Adds functions to the menu itself via global variable Menu.item

Extra Notes

The planning of a simple architecture is important before and after running through these exercises. 

Possible Extensions:

* Add color changes
* Create “function” blocks
* Implement undo/redo