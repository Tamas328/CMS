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
        if(avatar.files.length == 0) {
            avatar = 'default.jpg';
        }
        var firstName = getValues('first-name');
        var lastName = getValues('last-name');
        var email = getValues('email');
        var sex = getValues('gender');
        var birthdate = getValues('birthday');
        birthdate = new Date(birthdate);
        birthdate = moment(birthdate).format('D MMMM YYYY');

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
            td7.innerHTML = `<svg id=edit${request.id} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-person-lines-fill editEmployee" viewBox="0 0 16 16">
                                <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-5 6s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zM11 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5zm.5 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1h-4zm2 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1h-2zm0 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1h-2z"/></svg>`;
            td8.innerHTML = `<svg id=${request.id} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-person-dash-fill deleteRow" viewBox="0 0 16 16">\
                                <path fill-rule="evenodd" d="M11 7.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5z"/><path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/></svg>`
            tableBody.appendChild(tr);
            
            tr.appendChild(td1); tr.appendChild(td2); tr.appendChild(td3);
            tr.appendChild(td4); tr.appendChild(td5); tr.appendChild(td6);
            tr.appendChild(td7); tr.appendChild(td8);

            document.getElementById(`${request.id}`).addEventListener('click', function (e) {
                db.collection("Employees").doc(this.getAttribute('id')).delete();
                refreshTable();
            });

            document.getElementById(`edit${request.id}`).addEventListener('click', function (e) {
                $('#myModal').modal('show');
                document.getElementById('emp-id').value = `${request.id}`;
                db.collection("Employees").doc(`${request.id}`).get()
                    .then(snapshot => setModalData(snapshot.data()));

            });
        });
    });
}

function refreshTable() {
    var Parent = document.getElementById("table-list");
    while(Parent.hasChildNodes()) {
        Parent.removeChild(Parent.firstChild);
    }
}

function setModalData(data) {
    document.getElementById('first-name2').value = data.firstName;
    document.getElementById('last-name2').value = data.lastName;
    document.getElementById('email2').value = data.email;
    document.getElementById('gender2').value = data.sex;
    var bdate = new Date(data.birthdate);
    document.getElementById('birthday2').value = moment(bdate).format('yyyy-MM-DD');
    document.getElementById('avatar2-preview').src = 'images/' + data.avatar;
}

document.getElementById('avatar2').addEventListener('change', function (e) {
    document.getElementById('avatar2-preview').src = 'images/' + this.files[0].name;
});

document.getElementById('update').addEventListener('click', function (e) {
    var id = document.getElementById('emp-id').value;
    var firstName = document.getElementById('first-name2').value;
    var lastName = document.getElementById('last-name2').value;
    var email = document.getElementById('email2').value;
    var sex = document.getElementById('gender2').value
    var bdate = document.getElementById('birthday2').value;
    bdate = moment(bdate).format('D MMMM YYYY');
    var avatar = document.getElementById('avatar2');
    if(avatar.files.length != 0) {
        avatar = avatar.files[0].name;
        firebase.firestore().collection("Employees").doc(id).update({
            avatar: avatar,
            firstName: firstName,
            lastName: lastName,
            email: email,
            sex: sex,
            birthdate: bdate
        });
    } else {
        firebase.firestore().collection("Employees").doc(id).update({
            firstName: firstName,
            lastName: lastName,
            email: email,
            sex: sex,
            birthdate: bdate
        });
    }
    $('#myModal').modal('hide');
    refreshTable();
});

function search_filter() {
    var input = document.getElementById("search-bar");
    var filter = input.value.toUpperCase();
    var table = document.getElementById("emp-table");
    var tr = table.getElementsByTagName("tr");
    for(var i = 0; i < tr.length; ++i) {
        var firstName = tr[i].getElementsByTagName("td")[1];
        var lastName = tr[i].getElementsByTagName("td")[2];
        if(firstName && lastName) {
            var txtValue = firstName.textContent + " " + lastName.textContent || firstName.innerText + " " + lastName.innerText;
            if(txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

function sortTable(n) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("emp-table");
    switching = true;

    dir = "asc";

    while (switching) {
        switching = false;
        rows = table.rows;

        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];

            if (dir == "asc") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            } else if (dir == "desc") {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchcount ++;
        } else {
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}

function sortBirthday() {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("emp-table");
    switching = true;

    dir = "asc";

    while (switching) {
        switching = false;
        rows = table.rows;

        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = new Date(rows[i].getElementsByTagName("TD")[5].innerHTML);
            y = new Date(rows[i + 1].getElementsByTagName("TD")[5].innerHTML);

            if (dir == "asc") {
                if (x > y) {
                    shouldSwitch = true;
                    break;
                }
            } else if (dir == "desc") {
                if (x < y) {
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchcount ++;
        } else {
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}