/** @class Dropzone representing the spots where puzzle pieces must be dropped. */
class Dropzone{


	/**
	 * Creates an instance of Dropzone.
	 *
	 * @constructor
	 * @author: ariane <ame.parissis@gmail.com>
	 * @param {string} dropzoneID The ID of the dropzone 
	 * @param {Game} game The game currently played
	 *
	 */
	constructor(dropzoneID, game){

		this.myGame = game;
		this.dropzoneID = dropzoneID;
		this.dropzoneDOM = this.createDropzoneDOM(); 
		this.dropzoneListeners();
	}

	/**
	 * Creates an HTML element (the dropzone) and inserts it in the DOM 
	 * @return {HTMLElement} newDropzoneElt The dropzone inserted in the DOM   
	 */
	createDropzoneDOM(){

		var allDropzones = document.getElementById("dropzones"); 
		 
		var newDropzoneElt = document.createElement("div"); 
		newDropzoneElt.classList.add("dropzone", this.dropzoneID);  

		allDropzones.appendChild(newDropzoneElt); 

		return newDropzoneElt;
	}

	/**
	 * All event listeners for the dropzones in the DOM, from the library interactjs:
	 * ondropactivate, ondragenter, ondragleave, ondrop
	 */
	dropzoneListeners(){

		var self = this; 
		
		// enable draggables to be dropped into this
	 	interact('.dropzone').dropzone({

	    ondropactivate: function (event) {
	      var draggableElement = event.relatedTarget;

	      draggableElement.style.transition = "transform 0s";
	      draggableElement.classList.add('isMoving');
	      draggableElement.classList.remove('hint');
	    },

	    ondragenter: function (event) {
	      var draggableElement = event.relatedTarget;
	      var dropzoneElement = event.target;
	      self.allowDrop(true, draggableElement, dropzoneElement);
	    },

	    ondragleave: function (event) {
	      var draggableElement = event.relatedTarget;
	      var dropzoneElement = event.target;
	      
	      dropzoneElement.classList.remove('taken') 
	      draggableElement.classList.remove('can-drop','correct-position',
	      	'incorrect-position'); 

	      self.myGame.puzzlePieces[0].stopSprite();
	      self.myGame.composition.stopComposition(); 

	      self.myGame.composition.enableButtonPlay();
	    },

	    ondrop: function (event) {    

	      var draggableElement = event.relatedTarget;
	      var dropzoneElement = event.target;

	      draggableElement.classList.add('can-drop');

	      if (dropzoneElement.classList.contains(draggableElement.id)){
	        draggableElement.classList.add('correct-position');
		    self.myGame.verifyGameFinished();
	      }
	      else{
	        draggableElement.classList.add('incorrect-position');
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
	allowDrop(bool, draggableElt, dropzoneElt){
		if (bool){
			if (draggableElt.classList.contains('can-drop') & 
				(dropzoneElt.classList.contains('no-drop'))){
				dropzoneElt.classList.remove('no-drop'); 
			}
		}

		else
		{
			dropzoneElt.classList.add("no-drop");
		}
		this.myGame.puzzlePieces[0].dragElementConstraints();
	}
}