/* File:			menu.js		
   Author:			Roshan Ramankutty
   Description:		Where blocks are associated with functions that are called when they run
					Contains the actual code for running the script as the user builds it up
*/

var menu = document.querySelector('.menu');
var script = document.querySelector('.script');
var scriptRegistry = {};
var scriptDirty = false;


/**
  * @func runSoon
  * Used to notify the system to run the script during the next fram handler
  */

var runSoon = function() { scriptDirty = true; }

/**
  * @func run
  * Called on every frame, but returns immediately unless scriptDirty is set
  */
var run = function() {
	if (scriptDirty) {
		scriptDirty = false;
		Block.trigger('beforeRun', script);
		var blocks = [].slice.call(
				document.querySelectorAll('.script > .block'));
		Block.run(blocks);
		Block.trigger('afterRun', script);
	} else {
		Block.trigger('everyFrame', script);
	}
	requestAnimationFrame(run);
}

/* This method is provided by the browser for animation @ 60fps */
requestAnimationFrame(run);

/**
  * @func runEach
  * finds and executes associated function in each block as a part of running
  * @params evt - not sure?
  */
var runEach = function(evt) {
	var elem = evt.target;
	if (!matches(elem, '.script .block')) return;
	if (elem.dataset.name === 'Define block') return;
	elem.classList.add('running');
	scriptRegistry[elem.dataset.name](elem);
	elem.classList.remove('running');
}

/**
  * @func menuItem
  * Add blocks to the menu - takes a normal block, associates it with a function, 
  * and puts it in the menu column
  * @params name - name of block
  * @params fn - function
  * @params value - numerical value of input
  * @params units - still not totally ceratin what this is - number of subsequent blocks?
  */
var menuItem = function(name, fn, value, units) {
	var item = Block.create(name, value, units);
	scriptRegistry[name] = fn;
	menu.appendChild(item);
	return item;
}


/**
  * @func repeat
  * @params block - block with children to repeat
  */

var repeat = function(block) {
	var count = Block.value(block);
	var children = Block.contents(block);
	for (var i = 0; i < count; i++) {
		Block.run(children);
	}
}
menuItem('Repeat', repeat, 10, []);

