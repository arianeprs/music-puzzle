/** @class PuzzlePiece representing the fragments of the song to be arranged in order */
class PuzzlePiece {
	/**
	 * Creates an instance of PuzzlePiece.
	 *
	 * @constructor
	 * @author: ariane <ame.parissis@gmail.com>
	 * @param {Game} game The game currently played
	 * @param {string} spriteID The audio sprite ID = the music fragment associated to the puzzle piece 
	 * @param {number} interval The duration of each audio sprite 
	 *
	 */
	constructor(game, spriteID, interval) {

		this.snapRange = 30;
		this.snapPoint = { x: 0.5, y: 0.5 };
		this.interval = interval;
		this.myGame = game;
		this.spriteID = spriteID;
		this.elementDOM = this.createDOMElt();

		var self = this;
		window.addEventListener("resize", function () { self.dragElementConstraints() });
	}

	// ------- CONSTRUCTOR FUNCTIONS -------

	/**
	 * Creates an HTML element (the puzzle piece) and inserts it in the DOM 
	 * @return {HTMLElement} newElt The puzzle piece inserted in the DOM   
	 */
	createDOMElt() {

		// Declare id and class of new element
		var newElt = document.createElement("div");
		newElt.classList.add("puzzle-piece", "puzzle-piece--drag-drop", "can-move");
		newElt.id = this.spriteID;

		// insert new element in parent node 
		var parent = document.querySelector(".game-panel__puzzle-pieces");
		parent.appendChild(newElt);

		this.spriteClickListener(newElt);

		return newElt;
	}

	// --------- EVENT LISTENERS ----------

	/**
	 * Adds click event listener to an element of the DOM : 
	 * a click does not trigger the same event depending on if the piece is already playing or moving 
	 * @param {HTMLElement} elementDOM The puzzle piece in the DOM 
	 */
	spriteClickListener(elementDOM) {

		var self = this;

		var classListDOM = elementDOM.classList;

		elementDOM.addEventListener('click', function () {

			// If target is already playing (and click is not triggered by drag) --> Stop the audio
			if (classListDOM.contains('puzzle-piece--is-playing') && !classListDOM.contains('is-moving')) {
				self.stopSprite();
				self.myGame.composition.stopComposition();
			}

			else if (!classListDOM.contains('is-moving')) {
				self.stopSprite();
				self.myGame.composition.stopComposition();
				self.playSprite();
			}
			classListDOM.remove("is-moving");
		});
	}

	/**
	 * Updates the attributes data-x and data-y of the DOM element when it is dragged around
	 * from library interactjs
	 * @param {event} event Movement of the mouse 
	 */
	spriteDragMoveListener(event) {

		var target = event.target;

		// keep the dragged position in the data-x/data-y attributes
		var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
		var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

		// translate the element
		target.style.webkitTransform =
			target.style.transform =
			'translate(' + x + 'px, ' + y + 'px)'

		// update the posiion attributes
		target.setAttribute('data-x', x)
		target.setAttribute('data-y', y)
	}

	/**
	 * Defines behaviours of puzzle pieces (with the class "can-move") in the DOM (from library interactjs)
	 * Their movement is restricted to the playground area, and they are "attracted" to dropzones centers
	 */
	dragElementConstraints() {

		var self = this;

		interact('.can-move').draggable({
			modifiers: [

				interact.modifiers.restrictRect({
					restriction: document.getElementById("playground"),
					endOnly: true
				}),

				// Each drag-drop element is given [targets] = centers of all the dropzones 
				// Meaning they will be snapped to the center of the dropzones when they are in range
				interact.modifiers.snap({
					targets: self.getDropzonesCenters(),
					relativePoints: [this.snapPoint],
					range: this.snapRange
				})
			],

			listeners: { move: self.spriteDragMoveListener }
		});
	}

	/**
	 * Returns an array of the positions of all dropzones that are still free (not taken by a puzzle piece)
	 * @return {object[]} dropCenters An array of the positions (key-value pairs)
	 */
	getDropzonesCenters() {
		 
		var myDropzones = this.myGame.dropzones;
		var dropCenters = [];
		      
		var freeDropzones = myDropzones.filter(item => !item.dropzoneDOM.classList.contains("is-taken"));
		 
		freeDropzones.forEach(item => {

			let dropCenter = this.myGame.getPosition(item.dropzoneDOM);
			dropCenters.push(dropCenter);

		});

		return dropCenters;
	}

	 
	// ----- PLAY/STOP AUDIO SPRITE ------

	/**
	 * Plays the audio sprite associated with the puzzle piece.
	 * Note: cannot be called in iterative loops (event on "end" does not support it)
	 */
	playSprite() { 
		this.myGame.myHowl.play(this.spriteID); 
		this.elementDOM.classList.add("puzzle-piece--is-playing", "puzzle-piece--hasBeenPlayed");
	}

	/**
	 * Stops all audios and updates the classlist of the puzzle pieces in the DOM
	 */
	stopSprite() {
		this.myGame.myHowl.stop();

		var puzzlePieces = this.myGame.puzzlePieces;

		puzzlePieces.forEach(elt => {
			elt.elementDOM.classList.remove("puzzle-piece--is-playing");
		});
	}

	/**
	 * Removes the classes 'is-playing' and 'hasBeenPlayed' of all puzzle pieces 
	 * that are not part of the Composition (i.e. that were not placed on a dropzone when user pressed play button)
	 */
	removeFeedback() {

		var piecesNotPlaced = this.myGame.puzzlePieces.filter(item => !item.elementDOM.classList.contains("composition"));

		piecesNotPlaced.forEach(item => {
			item.elementDOM.classList.remove("puzzle-piece--is-playing", "puzzle-piece--hasBeenPlayed"); 
		}); 
	}
	 
	 
}