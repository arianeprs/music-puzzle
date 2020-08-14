/** @class Composition representing the user composition. */
class Composition{

	/**
	 * Creates an instance of Composition.
	 *
	 * @constructor
	 * @author: ariane <ame.parissis@gmail.com>
	 * @param {Game} game The game currently played
	 *
	 */
	constructor(game){

		this.myGame = game;

 		var self = this;

		this.buttonPlay = document.getElementById("playSequence"); 
		this.buttonPlay.disabled = true;

		this.buttonPlay.addEventListener("click", function(e){ 

			if(self.buttonPlay.classList.contains("can-play")){
				self.updateButtonPlayImg(false);
				self.playSequence(self.getUserSequence());
			}

			else{ 
				self.myGame.puzzlePieces[0].stopSprite();
				self.updateButtonPlayImg(true); 
				clearInterval(self.myInterval);
			}
		});
	}

// ------- GET USER COMPOSITION  -------

	/**
	 * Gets all puzzle pieces that have been dropped in dropzones,  
	 * i.e all DOM divs that have the class 'can-drop'   
	 * @return {PuzzlePiece[]} droppedElements Array of all puzzle pieces that have been dropped
	 */
	getAllDropped(){

		var droppedElements = [];

		for (var item of this.myGame.puzzlePieces){

			if (item.elementDOM.classList.contains("can-drop")){
				droppedElements.push(item);
			}
		} 
		return droppedElements;
	}

	/**
	 * Compares the position of 2 PuzzlePieces' elements in the DOM (comparing distance from left)
	 * @param{PuzzlePiece} elt1 
	 * @param{PuzzlePiece} elt2
	 * @return {number} comparisonValue (1 or -1) depending on which element is placed before the other
	 */
	compareLeftPosition(elt1, elt2){
		var pos1 = elt1.elementDOM.getBoundingClientRect().left;
		var pos2 = elt2.elementDOM.getBoundingClientRect().left;

		var comparisonValue = 1; 

		if (pos1 < pos2){ comparisonValue = -1; }

		return comparisonValue; 
	}

	/**
	 * Accesses all elements dropped by the user and orders them in the 'left to right' order
	 * @return {PuzzlePiece[]} userSequence Array of all the puzzle pieces dropped by the user, in order
	 */
	getUserSequence(){

		var droppedElements = this.getAllDropped();
		var userSequence = droppedElements.sort(this.compareLeftPosition);
		return userSequence;
	}

// ----------- PLAY SEQUENCE ----------
	
	/**
	 * Defines an interval that will play each puzzle piece from the sequence defined by user
	 * @param {PuzzlePiece[]} userSequence Array of all the puzzle pieces dropped by the user, in order
	 */
	playSequence(userSequence){

		var self= this;

		// start playing the first puzzle piece
		var currentPiece = userSequence[0];
		var previousPiece = userSequence[0];

		currentPiece.stopSprite();

		for (var elt of userSequence){
			elt.elementDOM.classList.add("composition");
		}

		currentPiece.elementDOM.classList.add("isPlaying", "hasBeenPlayed", "composition");
		this.myGame.myHowl.play(currentPiece.spriteID);

		userSequence.shift();
		
		// will continue to play each piece until there is none left
		this.myInterval = setInterval(function(){

			if (userSequence.length > 0){
				previousPiece.elementDOM.classList.remove("isPlaying", "composition");

				currentPiece = userSequence[0];
				currentPiece.elementDOM.classList.add("isPlaying");
				self.myGame.myHowl.play(currentPiece.spriteID);

				previousPiece = currentPiece;
				
				userSequence.shift();
			}

			else{
				currentPiece.stopSprite();
				self.stopComposition();
				
			}
		}, currentPiece.interval*1000); // conversion in ms
	}

	/**
	 * Calls 2 methods to clear the interval previously defined and update the image in the play button.
	 */
	stopComposition(){
		clearInterval(this.myInterval);
		this.updateButtonPlayImg(true); 
	}

// ----- BUTTON / COLORS feedback -----
	
	/**
	 * Updates the image in the play button and add/remove its "can-play" class.
	 * @param{boolean} bool If true, the image displayed is "play". Else, "stop".
	 */
	updateButtonPlayImg(bool){
		
		if (bool){
			//button can be pressed to play the composition
			document.getElementById("play_img").style.display = "block";
			document.getElementById("stop_img").style.display = "none";
			this.buttonPlay.classList.add("can-play");
		}

		else{
			//button can be pressed to stop playing 
			document.getElementById("stop_img").style.display = "block";
			document.getElementById("play_img").style.display = "none"; 
			this.buttonPlay.classList.remove("can-play");
		}
	}

	/**
	 *  Decides whether or not the play button is enabled, 
	 *  depending on the existence of a puzzle piece with the class "can-drop".
	 */
	enableButtonPlay(){
 
		var droppedElements = document.querySelector(".can-drop");

		if (droppedElements != null){
			this.buttonPlay.disabled = false;
		}

		else{
			this.buttonPlay.disabled=true;
		}
	}
}