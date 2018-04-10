/* File:			blocks.js		
   Author:			Roshan Ramankutty
   Description:		This is the abstract representation of the block-based language
*/

/* Note: Wrap the file in a function to prevent leaking variables into the global scope
   In order to expose variables, define a single global per file.
*/
(function(global){
	'use strict';

	/**
	 * @func createBlock
	 * @params name - name of the block function
	 * @params value - numerical value, if block function has a parameter
	 * @params contents - Handles other blocks or string
	 * @return a Block as a DOM element populated with all internal elements, ready to insert into the document.
	 */
	var createBlock = function(name, value, contents) {
		var item = elem('div', {'class': 'block', draggable: true, 'data-name': name}, [name]);
		if (value !== undefined && value !== null) {
			item.appendChild(elem('input', {type: 'number', value: value}));
		}
		if (Array.isArray(contents)) {
			item.appendChild(
					elem('div', {'class': 'container'}, contents.map(function(block) {
						return createBlock.apply(null, block);
					})));
		}else if (typeof contents === 'string') {
			// Add units (degrees, etc.) specifier
			item.appendChild(document.createTextNode(' ' + contents));
		}
		return item;
	}

	/**
	 * @func blockContents 
	 * Retrieves the child blocks of a container block
	 * @params block - handles a block div
	 * @return container - list with all the conents of the container block, or null if simple block
	 */
	var blockContents = function(block) {
		var container = block.querySelector('.container');
		return container ? [].slice.call(container.children) : null;
	}

	/**
	 * @func blockValue
	 * Retrieves the numerical input of a block if block has an input field
	 * @params block - handles a block div
	 * @return input - returns value of input, or null if no such parameter
	 */
	var blockValue = function(block) {
		var input = block.querySelector('input');
		return input ? Number(input.value) : null;
	}

	/**
	 * @func blockUnit
	 * Preserves the units for serialization (i.e degrees, steps)
	 * @params block - handles a block div
	 * @return the units in text (i.e degrees, steps)
	 */

	var blockUnits = function(block) {
		if (block.children.length > 1 &&
				block.lastChild.nodeType === Node.TEXT_NODE &&
				block.lastChild.textContent) {

			console.log(block.lastChild.textContent.slice(1));
			return block.lastChild.textContent.slice(1);
		}
	}

	/**
	 * @func blockScript
	 * Returns a structure suitable for serializing JSON, to save blocks
	 * @params block - handles a block div
	 * @return script - structure in JSON format with null objects filtered out
	 */

	var blockScript = function(block) {
		var script = [block.dataset.name];
		var value = blockValue(block);
		if (value !== null) {
			script.push(blockValue(block));
		}
		var contents = blockContents(block);
		var units = blockUnits(block);
		if (contents){script.push(contents.map(blockScript));}
		if (units){script.push(units);}
		return script.filter(function(notNull){ return notNull !== null;})
	}

	/**
	 * @func runBlocks
	 * Runs each block in array of blocks.
	 * @params blocks - handles an array of block divs
	 */
	var runBlocks = function(blocks) {
		blocks.forEach(function(block) { trigger('run', block); });
	}
	global.Block = {
		create: createBlock,
		value: blockValue,
		contents: blockContents,
		script: blockScript,
		run: runBlocks,
		trigger: trigger
	};

	window.addEventListener('unload', file.saveLocal, false);
	window.addEventListener('load', file.restoreLocal, false);

})(window);
