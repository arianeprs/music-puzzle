var buttonsStart = document.querySelectorAll(".welcome-panel__btn");


buttonsStart.forEach(buttonStart => {


	buttonStart.addEventListener("click", function (event) {

		// button on the intro screen launches the game
		if (event.target.textContent == "Play") {
			var selectedMusic = dropdownBtn.getAttribute("selected-music");
			new Game(selectedMusic).startGame();
		}
		// button on the finish screen refreshes the page, to go back to intro screen
		else if (event.target.textContent == "Play again") {
			window.location.reload();
		}
	});

});