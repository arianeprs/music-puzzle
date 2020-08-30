/** @class Game representing the game management methods */
class Game {

	/**
	 * Creates an instance of Game.
	 *
	 * @constructor
	 * @author: ariane <ame.parissis@gmail.com>
	 * @param {chosenMusic} chosenMusic Id of the selected music from the input
	 *
	 */
	constructor(chosenMusic) {

		this.interval = 4; //sprite duration
		this.hintLimit = 3; // max number of hints 
		this.maxSequences = 11; // number of sequences
		this.howlVolume = 0.3;

		this.colorPiecesInterval = 50;
		this.colorPiecesTimeout = 400;

		this.chosenMusic = chosenMusic;

		this.audioSprites = this.createAudioSprites(); //all audio sprites (Map: id, [start,duration])

		this.myHowl = this.createHowl();

		this.puzzlePieces = this.createPuzzlePieces(); //all puzzle pieces, in shuffled order

		this.composition = new Composition(this);

		this.myTimer = new Timer();
	}

	// ------------- CONSTRUCTOR FUNCTIONS ---------------

	/**
	 * From the chosen music, the max number of sequences (= puzzle pieces) and the interval
	 * it will create a map of audio sprites (fragment of the song) 
	 * @return {object} allAudioSprites Map of {id, [offset, duration]} 
	 */
	createAudioSprites() {

		var allAudioSprites = new Map();

		var audioElement = document.getElementById(this.chosenMusic);
		var duration = audioElement.duration;

		var numberOfSequences = Math.floor(duration / this.interval);

		if (numberOfSequences > this.maxSequences) {
			numberOfSequences = this.maxSequences;
		}

		for (var i = 1; i <= numberOfSequences; i++) {

			var spriteName = "sprite_" + i;
			//spriteInfo = [offset, duration] (conversion in ms)
			var spriteInfo = [i * this.interval * 1000, this.interval * 1000];
			allAudioSprites.set(spriteName, spriteInfo);
		}
		return allAudioSprites;
	}

	/**
	 * From the chosen music and the map of all audio sprites
	 * it will create a Howl (from the library howler.js)
	 * @return {Howl} myHowl An audio object allowing an easy access to specific sprites 
	 */
	createHowl() {
		var self = this;
		var musicSrc = "../sounds/" + this.chosenMusic + ".mp3";

		var myHowl = new Howl({
			src: musicSrc,
			sprite: Object.fromEntries(this.audioSprites),
			volume: this.howlVolume,
			onend: function () { self.puzzlePieces[0].removeFeedback(); }
		});

		return myHowl;
	}

	/**
	 * From the map of all the audio sprites, it will call a shuffling method and create instances of
	 * Puzzle Pieces (that will be inserted in the DOM in this random order)
	 * @return {PuzzlePiece[]} allPuzzlePieces Array of all puzzle pieces that were created
	 */
	createPuzzlePieces() {

		var allPuzzlePieces = [];

		//shuffled Map 
		var shuffledMap = this.shuffle(this.audioSprites);
		var shuffledSprites = Array.from(shuffledMap.keys());

		for (let i = 0; i < shuffledSprites.length; i++) {
			var spriteID = shuffledSprites[i];
			allPuzzlePieces.push(new PuzzlePiece(this, spriteID, this.interval));
		}

		return allPuzzlePieces;
	}

	/**
	 * Using the Fisher-Yates shuffle method, shuffles elements of a map
	 * @param {object} audioSprites Map of all the audio sprites 
	 * @return {object} shuffledSprites Map of all the audio sprites, in a random order
	 */
	shuffle(audioSprites) {

		let shuffledSprites = new Map();

		//Shuffle the array of keys
		let keys = Array.from(audioSprites.keys());

		for (let i = keys.length - 1; i > 0; i--) {

			let randomIndex = Math.floor(Math.random() * Math.floor(i));
			[keys[i], keys[randomIndex]] = [keys[randomIndex], keys[i]];
		}

		//re-create map shuffledSprites from keys array
		for (let i = 0; i < keys.length; i++) {
			shuffledSprites.set(keys[i], audioSprites.get(keys[i]));
		}

		return shuffledSprites;
	}

	// ---------------- START THE GAME ------------------

	/**
	 * Method to start the game: will call several methods 
	 * to reveal the game panel, create the dropzones, start the timer... 
	 */
	startGame() {

		var self = this;

		this.revealGamePanel(true);

		this.dropzones = this.createDropzones();

		this.puzzlePieces[0].dragElementConstraints();

		this.myTimer.startTimer();
		this.myHints = new Hints(this);

		var buttonRestart = document.querySelector(".game-panel__restart");
		buttonRestart.addEventListener("click", function () { window.location.reload() });
	}

	/**
	 *  From the map of all audio Sprites, will create instances of Dropzones 
	 * (that will be inserted in the DOM) 
	 * @return {Dropzone[]} dropzonesArray Array of dropzones that were created 
	 */
	createDropzones() {

		var spritesArray = Array.from(this.audioSprites.keys());

		var dropzonesArray = [];

		for (var sprite of spritesArray) {

			dropzonesArray.push(new Dropzone(sprite, this));
		}
		return dropzonesArray;
	}

	/**
	 * Method to reveal/hide the game panel 
	 * @param {boolean} bool Defines whether the game panel will be hidden or revealed
	 */
	revealGamePanel(bool) {

		var gamePanel = document.querySelector(".game-panel"),
			welcomePanel = document.querySelector(".welcome-panel");

		if (bool == true) {
			welcomePanel.style.display = "none";
			gamePanel.style.display = "block";
		}

		else {
			welcomePanel.style.display = "flex";
			gamePanel.style.display = "none";
		}
	}

	// ---------------- FINISH THE GAME ----------------

	/**
	 *  Method to verify wether all the puzzle pieces are placed correctly or not
	 *  If so, it will call relevant methods to stop the timer and start the finish animation
	 */
	verifyGameFinished() {

		var gameCompleted = true;

		for (var elt of this.puzzlePieces) {
			if (!elt.elementDOM.classList.contains('puzzle-piece--correct-position')) {
				gameCompleted = false;
			}
		}
		if (gameCompleted) {
			this.myTimer.stopTimer();
			this.finishAnimation();
			this.displayFinishScreen();
		}
	}

	/**
	 *  Colors all the puzzle pieces in green
	 */
	finishAnimation() {

		var self = this;

		setTimeout(function () {

			var spritesToColor = self.composition.getUserSequence();

			setInterval(function () {

				if (spritesToColor.length > 0) {
					spritesToColor[0].elementDOM.classList.add("puzzle-piece--hasBeenPlayed", "puzzle-piece--correct-position", "composition");
					spritesToColor.shift();
				}

			}, this.colorPiecesInterval);

		}, this.colorPiecesTimeout);

		self.displayFinishScreen();
	}

	/**
	 *  Displays the finish screen by calling relevant methods and updating DOM elements' text
	 */
	displayFinishScreen() {

		console.log("display finish screen");

		this.displayConfetti(true);
		this.revealGamePanel(false);

		var title = document.querySelector(".welcome-panel__title");
		title.textContent = "Congrats!";

		var intro = document.querySelector(".welcome-panel__subtitle");
		intro.textContent = "You completed the puzzle in " + this.myTimer.getTime();

		var musicList = document.querySelector(".dropdown");
		musicList.style.display = "none";

		var button = document.querySelector(".welcome-panel__btn");
		button.textContent = "Play again";

	}

	/**
	 * Method to display/hide the confetti (for the finish screen)
	 * @param {boolean} bool Defines whether the confetti will be displayed or hidden
	 */
	displayConfetti(bool) {

		var confettiSettings = {
			"target": "confetti",
			"max": "150",
			"size": "1",
			"animate": true,
			"props": ["square", "triangle"],
			"colors": [[231, 98, 161], [230, 61, 135], [0, 199, 228], [253, 214, 126], [231, 98, 161]],
			"clock": "30",
			"rotate": true,
			"start_from_edge": false,
			"respawn": true
		};

		this.confetti = new ConfettiGenerator(confettiSettings);

		if (bool) { this.confetti.render(); }
		else { this.confetti.clear(); }
	}

	/**
	 * Returns coordinates of an element's center
	 * @param {HTMLElement} element in the DOM 
	 * @param {object} elementPos The coordinates of its center (key-value) 
	 */
	getPosition(element) {
		var elementRect = element.getBoundingClientRect();
		var elementPos = {
			x: elementRect.left + (elementRect.width / 2),
			y: elementRect.top + (elementRect.height / 2)
		}
		return elementPos;
	}

	/**
	 * Returns dropzone matching to given puzzle piece
	 * @param {PuzzlePiece} puzzlePiece The instance of PuzzlePiece 
	 * @return {Dropzone} matchingDropzone The dropzone corresponding to the puzzle piece
	 */
	findMatchingDropzone(puzzlePiece) {
		var matchingDropzone = this.dropzones.find(({ dropzoneID }) => dropzoneID === puzzlePiece.spriteID);
		return matchingDropzone;
	}
}