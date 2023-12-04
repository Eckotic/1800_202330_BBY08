//declaring variables waw
var selectedCat = "fisherCat";
const game = db.collection("users").doc("xYwKXL8oCeTrSLyuwjbXYodDhCI2").collection("game").doc("userInfo");
const FieldValue = firebase.firestore.FieldValue;
let initialLoad = true;

//links html to the js, waw
const upgradeBtn = document.getElementById("upgrade-button");
const resourcesDisplay = document.getElementById("resources-goes-here");
const powerDisplay = document.getElementById("power-goes-here");
const nameDisplay = document.getElementById("name-goes-here");
const healthDisplay = document.getElementById("health-goes-here");

const catImg = document.getElementById("cat-img");
const fisherCatBtn = document.getElementById("fisherCatBtn");
const wizardCatBtn = document.getElementById("wizardCatBtn");

var upgrading = false;

//little console log to see if the code is even up and running
console.log("code is running")

//updates power stat of a cat
function updateStats(){

    let cat = db.collection("users").doc("xYwKXL8oCeTrSLyuwjbXYodDhCI2").collection("game").doc(selectedCat);

    cat.get().then( DOC => {
        
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

        nameDisplay.innerHTML = name;
        powerDisplay.innerHTML = "Power: " + power;
        healthDisplay.innerHTML = "Health: " + health;

    });
}

//upgrade function (only power for now)
function upgradeStats(){

    //get user doc then...
    game.get().then( DOC => {

        //get user data for "resources"
        let resources = DOC.data().resources;

        if (resources > 0 && initialLoad == false){

            //reduce resources by 1, increase power by 1
            game.update({
                resources: resources - 1
            });

            //update display
            resourcesDisplay.innerHTML = "Resources left: " + resources;
            upgrading = true;
            updateStats();

        }
        else {
            resourcesDisplay.innerHTML = "Resources left: " + resources;
            updateStats();
            initialLoad = false;
        }
    });

}

upgradeStats();

function changeCat(cat){
    var filePath = "./images/" + cat + "Cat.png";
    catImg.src = filePath;
    selectedCat = cat + "Cat";
    updateStats();
}

//on click, upgrade power stat
upgradeBtn.addEventListener("click", upgradeStats); 
fisherCatBtn.addEventListener("click", changeCat.bind(this, "fisher")); 
wizardCatBtn.addEventListener("click", changeCat.bind(this, "wizard")); 