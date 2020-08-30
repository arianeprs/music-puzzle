/* Music Selection 
 * 
 * Methods to manage the dropdown list where the music selection takes place. 
 * 
 * */

var dropdownBtn = document.querySelector(".dropdown__btn");
var dropdownChoices = document.querySelectorAll(".dropdown__choices a");

dropdownChoices.forEach(item => {
    item.addEventListener("click", function () {
        updateBtnText(item);
        updateBtn();
    });
});

dropdownBtn.addEventListener("click", function () {
    updateBtn();
    event.stopPropagation();
});

document.addEventListener("click", function () {
    if (dropdownBtn.classList.contains("dropdown--open")) {
        openDropdown(false);
    }
});

var buttonImg = document.querySelector(".dropdown__img");

var dropdownBtnContent = document.querySelector(".dropdown__btn span");

var dropdown = document.querySelector(".dropdown__choices");

var buttonStart = document.querySelector(".welcome-panel__btn");

/**
* Displays/hide the dropdown list
* and update the arrow image on the dropdown button
* @param {Boolean} bool Whether the dropdown list needs to be shown (true) or not (false)
*/
function openDropdown(bool) {
    buttonImg.style.transform = "rotate(0deg)";

    if (bool) {
        dropdownBtn.classList.add("dropdown--open");
        dropdown.style.display = "block";
        buttonImg.src = "../image/down-arrow.png";
        buttonImg.style.transform = "rotate(180deg)";
    }
    else {
        dropdownBtn.classList.remove("dropdown--open");
        dropdown.style.display = "none";
        buttonImg.src = "../image/down-arrow-pink.png";
    }
}

/**
* Depending on whether the dropdown list is displayed or not,
* will call the function openDropDown with the relevant parameter
*/
function updateBtn() {

    var bool = true;

    if (dropdownBtn.classList.contains("dropdown--open")) {
        bool = false
    }

    openDropdown(bool);
}

/**
* Updates the text inside the dropdown button 
* and displays the start button
* @param {HTMLElement} item The dropdown link that was clicked on 
*/
function updateBtnText(item) {
    dropdownBtnContent.textContent = item.textContent;
    dropdownBtn.setAttribute("selected-music", item.id);
    buttonStart.style.visibility = "visible";
}