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
        refreshTable();
    }

    function refreshTable() {
        var Parent = document.getElementById("table-list");
        while(Parent.hasChildNodes()) {
            Parent.removeChild(Parent.firstChild);
        }
    }

    const ref = firebase.firestore().collection('Employees');
    ref.onSnapshot(snapshot => {
        let req = [];
        snapshot.forEach(doc => {
            req.push({...doc.data(), id: doc.id})
        });
        let html = ``;
        var tableBody = document.getElementById("table-list");
        req.forEach(request => {
            var id = `${request.id}`;
            var tr = document.createElement("tr");
            var td1 = document.createElement("td");
            var td2 = document.createElement("td");
            var td3 = document.createElement("td");
            var td4 = document.createElement("td");
            var td5 = document.createElement("td");
            var td6 = document.createElement("td");
            var td7 = document.createElement("td");
            var td8 = document.createElement("td");

            td1.innerHTML = `<img id="avatar" src='/images/${request.avatar}' height="50">`; td2.innerHTML = `${request.firstName}`;
            td3.innerHTML = `${request.lastName}`; td4.innerHTML = `${request.email}`;
            td5.innerHTML = `${request.sex}`; td6.innerHTML = `${request.birthdate}`;
            td7.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-person-lines-fill editEmployee" viewBox="0 0 16 16">
                                <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-5 6s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zM11 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5zm.5 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1h-4zm2 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1h-2zm0 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1h-2z"/></svg>`;
            td8.innerHTML = `<svg id=${request.id} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-person-dash-fill deleteRow" viewBox="0 0 16 16">\
                                <path fill-rule="evenodd" d="M11 7.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5z"/><path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/></svg>`
            tableBody.appendChild(tr);
            
            tr.appendChild(td1); tr.appendChild(td2); tr.appendChild(td3);
            tr.appendChild(td4); tr.appendChild(td5); tr.appendChild(td6);
            tr.appendChild(td7); tr.appendChild(td8);

            document.getElementById(`${request.id}`).addEventListener('click', function (e) {
                console.log(this.getAttribute('id'));
                db.collection("Employees").doc(this.getAttribute('id')).delete();
                refreshTable();
            });
        });
    });
}

