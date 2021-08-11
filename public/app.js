function initializeFirebase() {
    var firebaseConfig = {
        apiKey: "AIzaSyDYrJNXOiDxU2jYumo2TWvynNUCUn9TsCk",
        authDomain: "cms-internship.firebaseapp.com",
        databaseURL: "https://cms-internship-default-rtdb.europe-west1.firebasedatabase.app",
        projectId: "cms-internship",
        storageBucket: "cms-internship.appspot.com",
        messagingSenderId: "380552358148",
        appId: "1:380552358148:web:e7c77102fc7d4713e94851"
    };

    firebase.initializeApp(firebaseConfig);
    const app = firebase.app();
    const db = firebase.firestore();
    const empRef = db.collection("Employees")

    document.getElementById('employeeForm').addEventListener('submit', submitForm);

    function submitForm(e) {
        e.preventDefault();
        
        var avatar = document.getElementById('avatar');
        avatar = avatar.files.item(0).name;
        var firstName = getValues('first-name');
        var lastName = getValues('last-name');
        var email = getValues('email');
        var sex = getValues('gender');
        var birthdate = getValues('birthday');

        addEmployee(avatar, firstName, lastName, email, sex, birthdate);
    }

    function getValues(id) {
        return document.getElementById(id).value;
    }

    function addEmployee(avatar, firstName, lastName, email, sex, birthdate) {
        db.collection('Employees').add({
            avatar: avatar,
            firstName: firstName,
            lastName: lastName,
            email: email,
            sex: sex,
            birthdate: birthdate
        });
        document.getElementById('employeeForm').reset();
    }

    const ref = firebase.firestore().collection('Employees');
    ref.onSnapshot(snapshot => {
        let req = [];
        snapshot.forEach(doc => {
            req.push({...doc.data(), id: doc.id})
        });
        let html = ``;
        req.forEach(request => {
            html += `<tr>\
                <td><img id="avatar" src='/images/${request.avatar}' height="50"></td>\
                <td>${request.firstName}</td>\
                <td>${request.lastName}</td>\
                <td>${request.email}</td>\
                <td>${request.sex}</td>\
                <td>${request.birthdate}</td>\
                <td ><svg xmlns="http://www.w3.org/2000/svg" onclick="deleteRow(this)" width="24" height="24" fill="currentColor" class="bi bi-person-dash-fill deleteRow" viewBox="0 0 16 16">\
                    <path fill-rule="evenodd" d="M11 7.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5z"/><path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/></svg>\
                </td>\
            </tr>`;
            document.getElementById("table-list").innerHTML = html;
        })
    });
}

