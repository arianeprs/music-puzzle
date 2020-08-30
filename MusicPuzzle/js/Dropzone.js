/** @class Dropzone representing the spots where puzzle pieces must be dropped. */
class Dropzone {


	/**
	 * Creates an instance of Dropzone.
	 *
	 * @constructor
	 * @author: ariane <ame.parissis@gmail.com>
	 * @param {string} dropzoneID The ID of the dropzone 
	 * @param {Game} game The game currently played
	 *
	 */
	constructor(dropzoneID, game) {

		this.myGame = game;
		this.dropzoneID = dropzoneID;
		this.dropzoneDOM = this.createDropzoneDOM();
		this.dropzoneListeners();
	}

	/**
	 * Creates an HTML element (the dropzone) and inserts it in the DOM 
	 * @return {HTMLElement} newDropzoneElt The dropzone inserted in the DOM   
	 */
	createDropzoneDOM() {

		var allDropzones = document.getElementById("dropzones");

		var newDropzoneElt = document.createElement("div");
		newDropzoneElt.classList.add("puzzle-piece--dropzone", "puzzle-piece", this.dropzoneID);

		allDropzones.appendChild(newDropzoneElt);

		return newDropzoneElt;
	}

	/**
	 * All event listeners for the dropzones in the DOM, from the library interactjs:
	 * ondropactivate, ondragenter, ondragleave, ondrop
	 */
	dropzoneListeners() {

		var self = this;

		// enable draggables to be dropped into this
		interact('.puzzle-piece--dropzone').dropzone({

			ondropactivate: function (event) {
				var draggableElement = event.relatedTarget;
				draggableElement.style.transition = "transform 0s";
				draggableElement.classList.add('is-moving');
			},

			ondragenter: function (event) {
				var draggableElement = event.relatedTarget;
				var dropzoneElement = event.target;
				self.allowDrop(true, draggableElement, dropzoneElement);
				draggableElement.classList.add('can-drop');
			},

			ondragleave: function (event) {
				var draggableElement = event.relatedTarget;
				var dropzoneElement = event.target;

				dropzoneElement.classList.remove("is-taken");

				draggableElement.classList.remove('can-drop', 'puzzle-piece--correct-position',
					'puzzle-piece--incorrect-position', 'composition', 'puzzle-piece--hasBeenPlayed');

				self.myGame.puzzlePieces[0].stopSprite();
				self.myGame.composition.stopComposition();
				self.myGame.myHints.updateButtonHint();
				self.myGame.composition.enableButtonPlay();
			},

			ondrop: function (event) {

				var draggableElement = event.relatedTarget;
				var dropzoneElement = event.target;

				event.relatedTarget.classList.remove('composition', 'puzzle-piece--hasBeenPlayed');

				if (dropzoneElement.classList.contains(draggableElement.id)) {
					draggableElement.classList.add('puzzle-piece--correct-position');
					self.myGame.verifyGameFinished();
				}
				else {
					draggableElement.classList.add('puzzle-piece--incorrect-position');
				}

				self.allowDrop(false, draggableElement, dropzoneElement);

				self.myGame.puzzlePieces[0].stopSprite();
				self.myGame.composition.stopComposition();
				self.myGame.composition.enableButtonPlay();

				self.myGame.myHints.updateButtonHint();
			},
		})
	}

	/**
	 * Defines whether or not we allow draggable elements to be dropped in a dropzone. 
	 * (When a dropzone is taken already)
	 * @param{} bool Whether the drop action is allowed or not
	 * @param{} draggableElt 
	 * @param{} dropzoneElt 
	 */
	allowDrop(bool, draggableElt, dropzoneElt) {
		if (bool && draggableElt.classList.contains('can-drop')) {
			dropzoneElt.classList.remove("is-taken");
		}

		else if (!bool) {
			dropzoneElt.classList.add("is-taken");
		}
		this.myGame.puzzlePieces[0].dragElementConstraints();
	}
}