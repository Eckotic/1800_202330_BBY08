function check() {
    // Check if the user is logged in:
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            // do nothing
        } 

        else {
            //move them to the login page
            window.location.replace("login.html");
        }
    })
}

check();