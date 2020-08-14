/** @class Timer representing the Timer management methods. */
class Timer{


	/**
	 * Creates an instance of Timer.
	 *
	 * @constructor
	 * @author: ariane <ame.parissis@gmail.com>
	 *
	 */
	constructor(){

		this.minutes =  document.querySelector('#min');
		this.seconds =  document.querySelector('#sec');
		this.miliseconds =  document.querySelector('#ms');

		this.minutes.textContent = "00";
		this.seconds.textContent = "00";
		this.miliseconds.textContent = "00";
	} 

	/**
	 * Increases the value of a selected timer unit
	 * @param {HTMLElement} element The unit (minutes, seconds or miliseconds) that needs to be increased
	 * @param {number} maxValue The max value for this specific unit (59, 59, 99) 
	 */

	increaseTimer(element, maxValue){

		var timerValue = Number(element.textContent);  

		if (timerValue < maxValue){

			var newValue = timerValue +1;

			if (newValue < 10){
				element.textContent = "0" + newValue;
			}

			else{
				element.textContent = newValue;
			}
		}
		else{
			element.textContent = "00";
		}
	}

	/**
     * Starts the timer by creating 3 distinct intervals (intervalMs, intervalS, intervalMn)
     * that will repeatedly call increaseTimer function with corresponding parameters.
     */
	
	startTimer(){

		var self = this;

		this.intervalMs = setInterval(function(){
			self.increaseTimer(self.miliseconds,99)}, 1);

		this.intervalS = setInterval(function(){
			self.increaseTimer(self.seconds, 59)}, 1000);
		
		this.intervalMn = setInterval(function(){
			self.increaseTimer(self.minutes, 59)}, 60000); 
	}

	/**
     * Stops the timer by clearing the 3 intervals (intervalMs, intervalS, intervalMn)
     * previously created.
     */
	
	stopTimer(){

		clearInterval(this.intervalMs); 
		clearInterval(this.intervalMn); 
		clearInterval(this.intervalS);
	}

	/**
     * Returns a string of the current Timer values
     * @return {string} myTimer Current Timer values
     */

	getTime(){

		var myTimer = this.minutes.textContent + ":"
			+ this.seconds.textContent + "."
			+ this.miliseconds.textContent;

		return myTimer;
	}
}
