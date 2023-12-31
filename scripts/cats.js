//various variables
var selectedCat = "fisherCat";
const game = db.collection("users").doc("xYwKXL8oCeTrSLyuwjbXYodDhCI2").collection("game").doc("userInfo");
const FieldValue = firebase.firestore.FieldValue;
let initialLoad = true;
let refreshingHTML = true;

//links html to the js scripts
const upgradeBtn = document.getElementById("upgrade-button");
const resourcesDisplay = document.getElementById("resources-goes-here");
const powerDisplay = document.getElementById("power-goes-here");
const nameDisplay = document.getElementById("name-goes-here");
const healthDisplay = document.getElementById("health-goes-here");

const catImg = document.getElementById("cat-img");
const fisherCatBtn = document.getElementById("fisherCatBtn");
const wizardCatBtn = document.getElementById("wizardCatBtn");
const warriorCatBtn = document.getElementById("warriorCatBtn");
const heroCatBtn = document.getElementById("heroCatBtn");
const roombaCatBtn = document.getElementById("roombaCatBtn");
const medicCatBtn = document.getElementById("medicCatBtn");

var upgrading = false;

//updates the stats of a cat
function updateStats(){

    //get the info of the specific cat
    let cat = db.collection("users").doc("xYwKXL8oCeTrSLyuwjbXYodDhCI2").collection("game").doc(selectedCat);
    cat.get().then( DOC => {
        
        //assign variables data from firebase
        let health = DOC.data().health;
        let healthIncrement = DOC.data().healthIncrement;

        let name = DOC.data().name;

        let power = DOC.data().power;
        let powerIncrement = DOC.data().powerIncrement;

        if (upgrading == true){

            cat.update({

                power: power + powerIncrement,
                health: health + healthIncrement

            });

            upgrading = false;

        }

        //update html elements
        nameDisplay.innerHTML = name;
        powerDisplay.innerHTML = "Power: " + power;
        healthDisplay.innerHTML = "Health: " + health;

        //function needs to be run twice to properly update
        if (refreshingHTML == true){
            refreshingHTML = false;
            updateStats();
        }
    });
}

//upgrade function (only power for now)
function upgradeStats(){

    //get user doc then...
    game.get().then( DOC => {

        //get user data for resources
        let resources = DOC.data().resources;

        if (resources > 49 && initialLoad == false){

            //reduce resources by 50
            game.update({
                resources: resources - 50
            });

        }

        //update display
        resourcesDisplay.innerHTML = "Resources left: " + resources;
        refreshingHTML = true;
        updateStats();
        initialLoad = false;
    });

}

//runs on site load to append the data to the site
upgradeStats();

//function that swaps between the cat images and stats
function changeCat(cat){
    var filePath = "./images/" + cat + "Cat.png";
    catImg.src = filePath;
    selectedCat = cat + "Cat";
    refreshingHTML = true;
    updateStats();
}

//all buttons with their respective functions
upgradeBtn.addEventListener("click", upgradeStats); 
fisherCatBtn.addEventListener("click", changeCat.bind(this, "fisher")); 
wizardCatBtn.addEventListener("click", changeCat.bind(this, "wizard")); 
warriorCatBtn.addEventListener("click", changeCat.bind(this, "warrior")); 
heroCatBtn.addEventListener("click", changeCat.bind(this, "hero")); 
medicCatBtn.addEventListener("click", changeCat.bind(this, "medic")); 
roombaCatBtn.addEventListener("click", changeCat.bind(this, "roomba")); 