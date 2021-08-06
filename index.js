const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];

for(var i = 0; i < localStorage.length; ++i) {
    var storedData = JSON.parse(localStorage.getItem(localStorage.key(i)));
    document.getElementById("table-list").innerHTML += "<tr>\
        <td><img src='images/" + storedData[0] + "' height='50'></td>\
        <td>" + storedData[1] + "</td>\
        <td>" + storedData[2] + "</td>\
        <td>" + storedData[3] + "</td>\
        <td>" + storedData[4] + "</td>\
        <td>" + storedData[5] + "</td>\
        <td ><svg xmlns='http://www.w3.org/2000/svg' onclick='deleteRow(this)' width='24' height='24' fill='currentColor' class='bi bi-person-dash-fill deleteRow' viewBox='0 0 16 16'>\
            <path fill-rule='evenodd' d='M11 7.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5z'/><path d='M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z'/></svg>\
        </td>\
    </tr>";
}

function addEmployee() {
    const data = [];
    let firstName = document.querySelector('#first-name').value;
    let lastName = document.querySelector('#last-name').value;
    let email = document.querySelector('#email').value;

    const regx = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    if(!regx.test(email)) {
        alert("Invalid email format.");
        return; 
    }

    for(var i = 0; i < localStorage.length; ++i) {
        var storedData = JSON.parse(localStorage.getItem(localStorage.key(i)));
        if(email == storedData[3]) {
            alert("This email address already exists.");
            return;
        }
    }

    let gender = document.querySelector('#gender').value;
    let dob = document.querySelector('#birthday').value;
    let img = document.querySelector('#avatar');

    if(firstName == "" || lastName == "" || email == "" || gender == "Not specified" || !dob) {
        alert("Please fill out all fields.");
        return;
    }

    if(img.files.length == 0) {
        img = "default.jpg";
    } else {
        img = img.files.item(0).name;
    }
    
    let birthday = getDOB(dob);

    data.push(img, firstName, lastName, email, gender, birthday);

    document.getElementById("table-list").innerHTML += "<tr>\
        <td><img src='images/" + img + "' height='50'></td>\
        <td>" + firstName + "</td>\
        <td>" + lastName + "</td>\
        <td>" + email + "</td>\
        <td>" + gender + "</td>\
        <td>" + birthday + "</td>\
        <td ><svg xmlns='http://www.w3.org/2000/svg' onclick='deleteRow(this)' width='24' height='24' fill='currentColor' class='bi bi-person-dash-fill deleteRow' viewBox='0 0 16 16'>\
            <path fill-rule='evenodd' d='M11 7.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5z'/><path d='M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z'/></svg>\
        </td>\
    </tr>";
    document.getElementById("employee").reset();

    localStorage.setItem(email, JSON.stringify(data));
}

function getDOB(dob) {
    const d = new Date(dob);
    const year = d.getFullYear();
    const date = d.getDate();
    const mIndex = d.getMonth();
    const month = months[mIndex];

    return date + " " + month + " " + year;
}

function deleteRow(r) {
    var i = r.parentNode.parentNode.rowIndex;
    localStorage.removeItem(localStorage.key(i - 1));
    document.getElementById("emp-table").deleteRow(i);
}