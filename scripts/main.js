function getNameFromAuth() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if a user is signed in:
        if (user) {
            // Do something for the currently logged-in user here: 
            console.log(user.uid); //print the uid in the browser console
            console.log(user.displayName);  //print the user name in the browser console
            userName = user.displayName;

            //method #1:  insert with JS
            document.getElementById("name-goes-here").innerText = userName;    

            

            //method #2:  insert using jquery
            //$("#name-goes-here").text(userName); //using jquery

            //method #3:  insert using querySelector
            //document.querySelector("#name-goes-here").innerText = userName

        } else {
            // No user is signed in.
        }
    });
}

function createUserDB(){
    firebase.auth().onAuthStateChanged(user =>{

        if (user){

            let doc = db.collection("users").doc(user.uid);

            doc.get().then( DOC => {
                if (!DOC.exists){
                    console.log("DOES NOT EXIST");
                    doc.set({
                        name: user.displayName,
                        resources: 50
                    });
                    doc.collection("game").doc("farmerCat").set({
                        power: 50,
                        health: 50
                    });
                }
                else{
                    console.log("exists")
                }
            });

            
        }

    });
}

createUserDB();
getNameFromAuth(); //run the function
