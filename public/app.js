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

    const ref = firebase.firestore().collection('Employees');
    ref.onSnapshot(snapshot => {
        let req = [];
        snapshot.forEach(doc => {
            req.push({...doc.data(), id: doc.id})
        });
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

            td1.innerHTML = `<img id="avatar" src='${request.avatar}' height="50">`; 
            td2.innerHTML = `${request.firstName}`;
            td3.innerHTML = `${request.lastName}`; 
            td4.innerHTML = `${request.email}`;
            td5.innerHTML = `${request.sex}`; 
            td6.innerHTML = `${request.birthdate}`;
            td7.innerHTML = `<i id=edit${request.id} class="fas fa-lg fa-user-edit"></i>`;
            
            td8.innerHTML = `<i id=${request.id} class="fas fa-lg fa-user-minus"></i>`
            tableBody.appendChild(tr);
            
            tr.appendChild(td1); tr.appendChild(td2); tr.appendChild(td3);
            tr.appendChild(td4); tr.appendChild(td5); tr.appendChild(td6);
            tr.appendChild(td7); tr.appendChild(td8);

            document.getElementById(`${request.id}`).addEventListener('click', function (e) {
                if(confirm(`Delete employee: ${request.firstName} ${request.lastName}?`)) {
                    db.collection("Employees").doc(this.getAttribute('id')).delete();
                    refreshTable();
                }
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

document.getElementById('employeeForm').addEventListener('submit', submitForm);

function submitForm(e) {
    e.preventDefault();
    
    var avatar = '';

    const file = document.getElementById("avatar").files[0];
    if(!file) {
        avatar = "/images/d.png";
        var firstName = getValues('first-name');
        var lastName = getValues('last-name');
        var email = getValues('email');
        var sex = getValues('gender');
        var birthdate = getValues('birthday');
        birthdate = new Date(birthdate);
        birthdate = moment(birthdate).format('D MMMM YYYY');

        addEmployee(avatar, firstName, lastName, email, sex, birthdate);
    } else {
        const storageRef = firebase.app().storage().ref();
        var metadata = { contentType: file.type };
        const fileRef = storageRef.child(file.name).put(file, metadata);
        fileRef.on('state_changed', function(snapshot) {
        }, function(error) {
        }, function() {
            fileRef.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                avatar = downloadURL;
                var firstName = getValues('first-name');
                var lastName = getValues('last-name');
                var email = getValues('email');
                var sex = getValues('gender');
                var birthdate = getValues('birthday');
                birthdate = new Date(birthdate);
                birthdate = moment(birthdate).format('D MMMM YYYY');

                addEmployee(avatar, firstName, lastName, email, sex, birthdate);
            })
        })
    }
}

function getValues(id) {
    return document.getElementById(id).value;
}

function addEmployee(avatar, firstName, lastName, email, sex, birthdate) {
    firebase.firestore().collection('Employees').add({
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

function setModalData(data) {
    document.getElementById('first-name2').value = data.firstName;
    document.getElementById('last-name2').value = data.lastName;
    document.getElementById('email2').value = data.email;
    document.getElementById('gender2').value = data.sex;
    var bdate = new Date(data.birthdate);
    document.getElementById('birthday2').value = moment(bdate).format('yyyy-MM-DD');
    document.getElementById('avatar2-preview').src = data.avatar;
}

document.getElementById('avatar2').addEventListener('change', function (e) {
    document.getElementById('avatar2-preview').src = '/images/' + this.files[0].name;
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
        const file = document.getElementById("avatar2").files[0];
        const storageRef = firebase.app().storage().ref();
        var metadata = { contentType: file.type };
        const fileRef = storageRef.child(file.name).put(file, metadata);
        fileRef.on('state_changed', function(snapshot) {
        }, function(error) {
        }, function() {
            fileRef.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                firebase.firestore().collection("Employees").doc(id).update({
                    avatar: downloadURL,
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    sex: sex,
                    birthdate: bdate
                });
            })
        })
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

function sortPicture() {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("emp-table");
    switching = true;

    dir = "asc";

    while (switching) {
        switching = false;
        rows = table.rows;

        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("img")[0].src.length;
            y = rows[i + 1].getElementsByTagName("img")[0].src.length;

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

function filter(x) {
    var defaultPicture = "/images/d.png";
    var table = document.getElementById("emp-table");
    var rows = table.rows;
    switch (x) {
        case 'With avatar':
            for(var i = 1; i <= (rows.length - 1); ++i) {
                var img = rows[i].getElementsByTagName("img")[0].getAttribute("src");
                if(img == defaultPicture) {
                    rows[i].style.display = "none";
                } else {
                    rows[i].style.display = "";
                }
            }
            break;
        case 'Without avatar':
            for(var i = 1; i <= (rows.length - 1); ++i) {
                var img = rows[i].getElementsByTagName("img")[0].getAttribute("src");
                if(img != defaultPicture) {
                    rows[i].style.display = "none";
                } else {
                    rows[i].style.display = "";
                }
            }
            break;
        case 'Female':
            for(var i = 1; i <= (rows.length - 1); ++i) {
                var f = rows[i].getElementsByTagName("TD")[4].innerHTML;
                if(f == "Female") {
                    rows[i].style.display = "";
                } else {
                    rows[i].style.display = "none";
                }
            }
            break;
        case 'Male':
            for(var i = 1; i <= (rows.length - 1); ++i) {
                var f = rows[i].getElementsByTagName("TD")[4].innerHTML;
                if(f == "Male") {
                    rows[i].style.display = "";
                } else {
                    rows[i].style.display = "none";
                }
            }
            break;
        case 'Other':
            for(var i = 1; i <= (rows.length - 1); ++i) {
                var f = rows[i].getElementsByTagName("TD")[4].innerHTML;
                if(f == "Other") {
                    rows[i].style.display = "";
                } else {
                    rows[i].style.display = "none";
                }
            }
            break;
        case 'Prefer not to say':
            for(var i = 1; i <= (rows.length - 1); ++i) {
                var f = rows[i].getElementsByTagName("TD")[4].innerHTML;
                if(f == "Unknown") {
                    rows[i].style.display = "";
                } else {
                    rows[i].style.display = "none";
                }
            }
            break;
        case 'Reset filter':
            for(var i = 1; i <= (rows.length - 1); ++i) {
                var img = rows[i].getElementsByTagName("img")[0].getAttribute("src");
                rows[i].style.display = "";
            }
            break;
    }
}

var sortings = document.getElementsByClassName('dropdown-item');

for(var i = 0; i < sortings.length; ++i) {
    sortings[i].addEventListener('click', function(e) {
        filter(this.innerHTML);
    })
}

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('date-from').addEventListener('change', filterRows);
    document.getElementById('date-to').addEventListener('change', filterRows);
});

function filterRows() {
    var table = document.getElementById("emp-table");
    var rows = table.rows;
    var from = document.getElementById('date-from').value;
    var to = document.getElementById('date-to').value;
    
    if(!from && !to) {
        return;
    }

    from = from || "1900-01-01";
    to = to || "2005-12-12"

    var dateFrom = moment(from);
    var dateTo = moment(to);

    for(var i = 1; i <= (rows.length - 1); ++i) {
        var rowDate = new Date(rows[i].getElementsByTagName("td")[5].innerText);
        rowDate = moment(rowDate, "DD/MM/YYYY");
        var visible = rowDate.isBetween(dateFrom, dateTo, null, []) ? "" : "none";
        rows[i].style.display = visible;
    }
}