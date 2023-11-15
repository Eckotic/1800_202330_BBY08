//declaring variables waw
const selectedCat = "farmerCat";
const cat = db.collection("users").doc("xYwKXL8oCeTrSLyuwjbXYodDhCI2").collection("game").doc(selectedCat);
const FieldValue = firebase.firestore.FieldValue;

//links html to the js, waw
const upgradeBtn = document.getElementById("upgrade-button");
const resourcesDisplay = document.getElementById("resources-goes-here");
const powerDisplay = document.getElementById("power-goes-here");

//little console log to see if the code is even up and running
console.log("code is running")

//upgrade function (only power for now)
function upgradePwr(){

    //get user doc then...
    cat.get().then( DOC => {

        //get user data for "resources"
        let resources = DOC.data().resources;
        let power = DOC.data().power;

        if (resources > 0){

            //reduce resources by 1, increase power by 1
            cat.update({
                resources: resources - 1,
                power: power + 1
            });

            //update display
            resourcesDisplay.innerHTML = "Resources left: " + resources;
            powerDisplay.innerHTML = "Power: " + power;
        }
        else {
            console.log("No resources left :(");
        }
    });

}

//on click, upgrade power stat
upgradeBtn.addEventListener("click", upgradePwr); 