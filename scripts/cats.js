//declaring variables waw
const user = db.collection("users").doc("EQcbvYfwKDMcvOF82PpyMhllD5a2");
const cat = db.collection("users").doc("EQcbvYfwKDMcvOF82PpyMhllD5a2").collection("cats").doc("farmer");
const FieldValue = firebase.firestore.FieldValue;

//links html to the js, waw
const upgradeBtn = document.getElementById("upgrade-button");
const resourcesDisplay = document.getElementById("resources-goes-here");
const powerDisplay = document.getElementById("power-go-here");

//little console log to see if the code is even up and running
console.log("code is running")

//upgrade function (only power for now)
function upgradePwr(){

    //get user doc then...
    user.get().then( DOC => {

        //get user data for "resources"
        let resources = DOC.data().resources;
        
        if (resources > 0){

            //reduce resources by 1, increase power by 1
            user.set({
                resources: resources - 1
            });

            //update display
            resourcesDisplay.innerHTML = "Resources left: " + resources;
        }
        else {
            console.log("No resources left :(");
        }
    });

    //process will be repeated to update power

}

//on click, upgrade power stat
upgradeBtn.addEventListener("click", upgradePwr); 