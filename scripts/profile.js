var userName = document.getElementById("name");
var email = document.getElementById("email");
var country = document.getElementById("country");
var school = document.getElementById("school");
var number = document.getElementById("number");
var description = document.getElementById("description");
var profilePicture = document.getElementById("pfp");

firebase.auth().onAuthStateChanged(user => {
    if (user) {
       
        currentUser = db.collection("users").doc(user.uid);
        
        currentUser.get().then(userDoc => {
            userName.setAttribute("value", userDoc.data().name);
            email.setAttribute("value", userDoc.data().email);
            country.setAttribute("value", userDoc.data().country);
            school.setAttribute("value", userDoc.data().school);
            if (userDoc.data().number === undefined) {
                number.setAttribute("value", "");
            } else {
                number.setAttribute("value", userDoc.data().number);
            }
            
            if (userDoc.data().description === undefined) {
                description.setAttribute("value", "");
            } else {
                description.setAttribute("value", userDoc.data().description);
            }
            profilePicture.setAttribute("src", userDoc.data().picture);

        })

    }
})

function edit() {
    userName.disabled = false;
    email.disabled = false;
    country.disabled = false;
    school.disabled = false;
    number.disabled = false;
    description.disabled = false;
}

function save() {
    userName.disabled = true;
    email.disabled = true;
    country.disabled = true;
    school.disabled = true;
    number.disabled = true;
    description.disabled = true;

    firebase.auth().onAuthStateChanged(user => {
        if (user) {

            currentUser = db.collection("users").doc(user.uid);
            
            url = profilePicture.getAttribute("src");

            currentUser.set({
                name: userName.value,
                email: email.value,
                country: country.value,
                school: school.value,
                number: number.value,
                description: description.value,
                picture: url
                });

        }
    })

}