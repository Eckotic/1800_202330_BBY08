function check() {
    // Check if the user is logged in:
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            // do nothing
        } 

        else {
            window.location.replace("login.html");
        }
    })
}

check();