var userName = document.getElementById("name");
var email = document.getElementById("email");
var country = document.getElementById("country");
var school = document.getElementById("school");
var number = document.getElementById("number");
var description = document.getElementById("description");

firebase.auth().onAuthStateChanged(user => {
    if (user) {
       
        currentUser = db.collection("users").doc(user.uid);
        
        currentUser.get().then(userDoc => {
            userName.setAttribute("value", userDoc.data().name);
            email.setAttribute("value", userDoc.data().email);
            country.setAttribute("value", userDoc.data().country);
            school.setAttribute("value", userDoc.data().school);
            number.setAttribute("value", userDoc.data().number);
            description.setAttribute("value", userDoc.data().description);
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
            
            currentUser.set({
                name: userName.value,
                email: email.value,
                country: country.value,
                school: school.value,
                number: number.value,
                description: description.value
                });

        }
    })

}