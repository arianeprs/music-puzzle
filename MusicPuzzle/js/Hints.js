/** @class Hints representing the Hint management methods. */
class Hints {

	/**
	 * Creates an instance of Hints.
	 *
	 * @constructor
	 * @author: ariane <ame.parissis@gmail.com>
	 * @param {Game} game The game currently played
	 *
	 */
	constructor(game) {

		this.myGame = game;
		this.givenHints = 0;
		this.hintLimit = game.hintLimit;

		this.buttonHint = document.querySelector(".game-panel__hint");

		this.buttonHintEventListener();
	}

	// ----- METHODS CALLED TO GIVE A HINT ----

	/**
	 * Decides which puzzle piece will be selected as a hint, 
	 * by randomly choosing an element from the array possibleHints 
	 * @return {PuzzlePiece} selectedHint The puzzle piece that will me used
	 */
	chooseHint() {
		var randomIndex = this.getRandom(0, this.possibleHints.length);
		var selectedHint = this.possibleHints[randomIndex];
		return selectedHint;
	}

	/**
	 * Calls relevant methods to give the hint to the user: 
	 * Moving the piece on the board, updating the hint button, verifying if the game is finished...
	 * @param {PuzzlePiece} selectedHint The puzzle piece that will be moved on the board
	 */
	giveHint(selectedHint) {

		// dropzone corresponding to the selected hint
		var targetDropzone = this.myGame.findMatchingDropzone(selectedHint);

		// move hint to corresponding dropzone 
		this.moveHint(selectedHint.elementDOM, targetDropzone.dropzoneDOM);

		this.givenHints += 1;
		this.updateButtonHint();

		this.myGame.composition.enableButtonPlay();
		this.myGame.puzzlePieces[0].dragElementConstraints();
		 
	}

	/**
	 * Defines an array of puzzle pieces that can considered as possible hints 
	 * i.e they are not placed on a dropzone & their corresponding dropzone is not taken
	 * @return {PuzzlePiece[]} possibleHints Array of puzzle pieces
	 */
	getPossibleHints() {

		var possibleHints = [];
		var puzzlePieces = this.myGame.puzzlePieces;

		for (var elt of puzzlePieces) {

			if (!elt.elementDOM.classList.contains('can-drop')) {

				// element's corresponding dropzone
				var matchingDz = this.myGame.findMatchingDropzone(elt);

				if (!matchingDz.dropzoneDOM.classList.contains("is-taken")) {
					possibleHints.push(elt);
				}
			}
		}
		return possibleHints;
	}

	/**
	 * Returns value between min (included) and max (exluded)
	 * @param {number} min Min value
	 * @param {number} max Max value
	 * @return {number} randomNumber between (included) and max (exluded)
	 */
	getRandom(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		var randomNumber = Math.floor(Math.random() * (max - min)) + min;
		return randomNumber;
	}

	/**
	 * Moves the selected puzzle piece (hint) to the corresponding dropzone
	 * @param {PuzzlePiece} myElt The puzzle piece (hint) to be moved 
	 * @param {PuzzlePiece} targetDropzone The corresponding dropzone it needs to go to
	 */
	moveHint(myElt, targetDropzone) {

		var startPos = this.myGame.getPosition(myElt);
		var targetPos = this.myGame.getPosition(targetDropzone);

		// translate element to the target position  while taking into account previous moves
		var DeltaX = targetPos.x + Number(myElt.getAttribute('data-x')) - startPos.x;
		var DeltaY = targetPos.y + Number(myElt.getAttribute('data-y')) - startPos.y;

		myElt.style.transition = "transform 0.3s linear";

		myElt.style.webkitTransform =
			myElt.style.transform =
			'translate(' + DeltaX + 'px, ' + DeltaY + 'px)';

		// update the position attributes
		myElt.setAttribute('data-x', DeltaX);
		myElt.setAttribute('data-y', DeltaY);


		this.myGame.puzzlePieces[0].stopSprite();
		this.myGame.composition.stopComposition();

		myElt.classList.add("can-drop", "puzzle-piece--correct-position");
		targetDropzone.classList.add("is-taken");
	}

	/**
	 * Updates the content of the hint button (in DOM) depending on the number of remaining hints 
	 */
	updateButtonHint() {

		var buttonText = "Use a hint";

		var remainingHints = this.getPossibleHints().length;

		if ((remainingHints <= 0) | (this.hintLimit <= this.givenHints)) {
			this.buttonHint.disabled = true;
			buttonText = "";
		}

		else {
			this.buttonHint.disabled = false;
		}

		this.buttonHint.textContent = buttonText;

	}

	/**
	 * Event listener (on click) for the hint button in the DOM
	 */
	buttonHintEventListener() {
		var self = this;

		this.buttonHint.addEventListener("click", function () {
			self.possibleHints = self.getPossibleHints();
			self.giveHint(self.chooseHint());
		});
	}
}