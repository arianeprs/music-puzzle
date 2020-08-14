
// intro screen fading in
var welcome = document.getElementById("welcome-panel");
welcome.classList.toggle('faded');


// launching the game when Play button is pressed
var buttonStart = document.querySelector(".buttonStart");
buttonStart.addEventListener("click", launchGame);


function launchGame(){

	var form = document.getElementById("musicList"); 
	var selectedMusic = form.options[form.selectedIndex].value;

	new Game(selectedMusic).startGame(); 

	buttonStart.removeEventListener("click", launchGame); 
	buttonStart.addEventListener("click", function(){ window.location.reload() });
}


