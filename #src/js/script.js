// making white bg to the header menu

const menu = document.querySelector(".header__inner");
const menuTel = document.querySelector(".menu a");
document.addEventListener("scroll", changeBg);

function changeBg(event) {
  if (window.scrollY > 0) {
    menu.style.backgroundColor = "#f5f8fa";
    menu.style.color = "#000000";
    menuTel.style.color = "#000000";
  } else {
    menu.style.backgroundColor = "transparent";
    menu.style.color = "#ffffff";
    menuTel.style.color = "#ffffff";
  }
}

// toggle arrow

const toggle = document.querySelector(".calculator__section-title_toggle");
const toggleArrrow = document.querySelector(
  ".calculator__section-title_toggle > .material-icons-outlined"
);
function toggleOption() {
  toggle.nextElementSibling.classList.toggle("unable");
  toggleArrrow.classList.toggle("active");
}
toggle.addEventListener("click", toggleOption);

// calculator

// html elements
const allCards = document.querySelector(".card");

const timeOfDay = document.querySelector(".calculator__time");
const dayCards = document.querySelectorAll(".card.day");
const evCards = document.querySelectorAll(".card.ev");

const durationOfRent = document.querySelector(".calculator__duration");

const typeOfLift = document.querySelector(".calculator__lift");

const extras = document.querySelector(".calculator__extras");

const outputResult = document.querySelector(".total__result > p");

// states
let time = "day";
let duration = "1";
let totalAmount = 0;
let lift = "2";
let extrasPrice = 0;

// Listeners
timeOfDay.addEventListener("click", timeOfDayHandler);
durationOfRent.addEventListener("click", durationHandler);
typeOfLift.addEventListener("click", liftHandler);
extras.addEventListener("click", extrasHadler);

// functions and headlers
function reactiveLogic(
  _time = time,
  _duration = duration,
  _lift = lift,
  _extras = extrasPrice
) {
  if (_time === "evening") {
    totalAmount = (400 + (_lift === "4" ? 100 : 0)) * _duration;
  }
  if (_time === "day") {
    totalAmount =
      (300 + (_lift === "4" ? 100 : 0)) * _duration -
      (_duration === "10" ? 500 : 0);
  }

  outputResult.childNodes[0].textContent = totalAmount + extrasPrice;
}

function toggleActiveCard(event, section) {
  Array.from(section.querySelectorAll(".card")).map((card) => {
    card.classList.remove("active");
    event.srcElement.classList.add("active");
  });
}

function timeOfDayHandler(event) {
  const testTime = event.srcElement.attributes?.time.value;

  if (testTime != undefined) {
    toggleActiveCard(event, timeOfDay);
    time = testTime;
    const evCardArray = Array.from(evCards);
    const dayCardArray = Array.from(dayCards);
    reactiveLogic();
    if (time === "day") {
      evCardArray.map((timeCard) => {
        timeCard.style.display = "none";
      });
      dayCardArray.map((timeCard) => {
        timeCard.style.display = "flex";
      });
    } else {
      evCardArray.map((timeCard) => {
        timeCard.style.display = "flex";
      });
      dayCardArray.map((timeCard) => {
        timeCard.style.display = "none";
      });
    }
  }
}

function durationHandler(event) {
  const testDuration = event.srcElement.attributes?.value.value;

  if (testDuration != undefined) {
    toggleActiveCard(event, durationOfRent);
    duration = testDuration;
    reactiveLogic();
  }
}

function liftHandler(event) {
  const testLift = event.srcElement.attributes?.lift.value;

  if (testLift != undefined) {
    toggleActiveCard(event, typeOfLift);
    lift = testLift;
    reactiveLogic();
  }
}

function extrasHadler(event) {
  const testExtras = event.srcElement.attributes?.value.value;

  if (testExtras != undefined) {
    if (event.srcElement.classList.contains("active")) {
      extrasPrice -= +testExtras;
      event.srcElement.classList.remove("active");
    } else {
      extrasPrice += +testExtras;
      event.srcElement.classList.add("active");
    }
    reactiveLogic();
  }
}
