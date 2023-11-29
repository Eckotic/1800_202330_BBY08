const carouselPrev = document.getElementById("date-carousel-prev");
const carouselNext = document.getElementById("date-carousel-next");
const carouselDate = document.getElementById("date-selector");

let currentDate = new Date();

let slideNext = 1;
let slideprev = 1;

function setDayBack() {
    carouselDate.innerHTML = currentDate.getDate() - slideprev;
    slideprev ++;
}

function setDayNext() {
    carouselDate.innerHTML = currentDate.getDate() + slideNext;
    slideNext ++;
}