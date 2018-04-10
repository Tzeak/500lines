/* File:			drag.js		
   Author:			Roshan Ramankutty
   Description:		Turn static blocks of HTML into a dynamic programming language through drag and drop
   Due to the nature of HTML5 Drag and Drop, this does not work on mobile yet.
 */

(function(global){
	'use strict';

	var dragTarget = null; //Block we're dragging
	var dragType = null; // are we dragging from the menu or from the script?
	var scriptBlocks = []; // Blocks in the script, sorted by position
	var nextBlock = null;

	/**
	 * @func dragStart
	 * start tracking whether the block is being copied from the menu or moved from/within the script
	 * Grab list of all blocks in script not being changed to use later.
	 * @params evt - the drag event
	 */
	var dragStart = function(evt) {
		if(!matches(evt.target, '.block')) return;
		if (matches(evt.target, '.menu .block')) {
			dragType = 'menu';
		} else {
			dragType = 'script';
		}
		evt.target.classList.add('dragging');
		dragTarget = evt.target;
		scriptBlocks = [].slice.call(document.querySelectorAll('.script .block:not(.dragging)'));
		// For dragging to take place in Firefox, we have to set this, even if we don't use it
		// Used to transfer data between browser and desktop (even though we're totally not doing that
		evt.dataTransfer.setData('text/html', evt.target.outerHTML);
		if (matches(evt.target, '.menu .block')) {
			evt.dataTransfer.effectAllowed = 'copy';
		} else {
			evt.dataTransfer.effectAllowed = 'move';
		}
	}

	/**
	 * @func findPosition 
	 * While not expressly necessary, this uses the location of the full block to make the experience 
	 * of dropping off a block much easier
	 * @params evt - the drag event, altered by reference to more easily identify the block location
	 */
	function findPosition(evt){
		var prevBlock = nextBlock;
		nextBlock = null;
		var x = evt.clientX;
		var y = evt.clientY;
		var offset = 15; // pixels cursor can overlap a block by
		for (var i = 0; i < scriptBlocks.length; i++){
			var block = scriptBlocks[i];
			var rect = block.getBoundingClientRect();
			if (y < (rect.top + offset)){
				nextBlock = block;
				break;
			}
		}
		if (prevBlock !== nextBlock){
			if (prevBlock){ prevBlock.classList.remove('next'); }
			if (nextBlock){ nextBlock.classList.add('next'); }
		}
	}

	function dragEnter(evt){
		if (matches(evt.target, '.menu, .script, .content')){
			evt.target.classList.add('over');
			if (evt.preventDefault) { evt.preventDefault(); }// Necessary. Allows us to drop.
		}else{
			if (!matches(evt.target, '.menu *, .script *')){
				_findAndRemoveClass('over');
				evt.target.classList.remove('over');
			}
		}
		return false;
	}


	/**
	 * @func dragOver
	 * Defines whether we're moving or copying a block
	 * @params evt - drop event? not sure
	 */
	var dragOver = function(evt) {
		if (!matches(evt.target, '.menu, .menu *, .script, .script *, .content')) {
			return;
		}

		// Necessary. Allows us to drop.
		if (evt.preventDefault) { evt.preventDefault(); }
		if (dragType === 'menu') {
			// See the section on the DataTransfer object.
			evt.dataTransfer.dropEffect = 'copy';
		} else {
			evt.dataTransfer.dropEffect = 'move';
		}
		return false;
	}

	/**
	 * @func drop
	 * Checks where we dragged from (set in dragSTart) and where we dragged to
	 * Determines whether to copy, move, or delete the block
	 * @params evt - mouse release
	 */
	var drop = function(evt) {
		if(!matches(evt.target, '.menu, .menu *, .script, .script *')) return;
		var dropTarget = closest(
				evt.target, '.script .container, .script .block, .menu, .script');
		findPosition(evt);
		var dropType = 'script';
		if (matches(dropTarget, '.menu')) { dropType = 'menu'; }
		// stops the browser from redirecting.
		if (evt.stopPropagation) {evt.stopPropagation();}
		if (dragType === 'script' && dropType === 'menu'){
			trigger('blockRemoved', dragTarget.parentElement, dragTarget);
			dragTarget.parentElement.removeChild(dragTarget);
		}else if (dragType ==='script' && dropType === 'script') {
			if (matches(dropTarget, '.block')){
				dropTarget.parentElement.insertBefore(
						dragTarget, dropTarget.nextSibling);
			} else {
				dropTarget.insertBefore(dragTarget, dropTarget.firstChildElement);
			}
			trigger('blockMoved', dropTarget, dragTarget);
		} else if (dragType === 'menu' && dropType === 'script') {
			var newNode = dragTarget.cloneNode(true);
			newNode.classList.remove('dragging');
			if (matches(dropTarget, '.block')) {
				dropTarget.parentElement.insertBefore(
						newNode, dropTarget.nextSibling);
			} else {
				dropTarget.insertBefore(newNode, dropTarget.firstChildElement);
			}
			trigger('blockAdded', dropTarget, newNode);
		}
	}

	/**
	 * @func _findAndRemoveClass
	 * Utility class for dragEnd
	 * @params klass - class without the keyword type
	 */
	function _findAndRemoveClass(klass){
		var elem = document.querySelector('.' + klass);
		if (elem) { elem.classList.remove(klass); }
	}

	/**
	 * @func dragEnd
	 * Cleans up and removes classes from elements, resets things for next drag
	 * @params evt - mouse up + drop() completes
	 */

	var dragEnd = function(evt) {
		_findAndRemoveClass('dragging');
		_findAndRemoveClass('over');
		_findAndRemoveClass('next');
	}
	document.addEventListener('dragstart', dragStart, false);
	document.addEventListener('dragenter', dragEnter, false);
	document.addEventListener('dragover', dragOver, false);
	document.addEventListener('drag', function(){}, false);
	document.addEventListener('drop', drop, false); 
	document.addEventListener('dragend', dragEnd, false);
})(window);
