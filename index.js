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
]

for(var i = 0; i < localStorage.length; ++i) {
    var storedData = JSON.parse(localStorage.getItem(localStorage.key(i)));
    document.getElementById("table-list").innerHTML += "<tr><td><img src='images/" + storedData[0] + "' height='50'></td><td>" + storedData[1] + "</td><td>" + storedData[2] + "</td><td>" + storedData[3] + "</td><td>" + storedData[4] + "</td><td>" + storedData[5] + "</td></tr>";
}

function addEmployee() {
    const data = [];
    let firstName = document.querySelector('#first-name').value;
    let lastName = document.querySelector('#last-name').value;
    let email = document.querySelector('#email').value;
    let gender = document.querySelector('#gender').value;
    let dob = document.querySelector('#birthday').value;
    let img = document.querySelector('#avatar');

    if(img.files.length == 0) {
        img = "default.jpg";
    } else {
        img = img.files.item(0).name;
    }
    
    let birthday = getDOB(dob);

    data.push(img, firstName, lastName, email, gender, birthday);

    document.getElementById("table-list").innerHTML += "<tr><td><img src='images/" + img + "' height='50'></td><td>" + firstName + "</td><td>" + lastName + "</td><td>" + email + "</td><td>" + gender + "</td><td>" + birthday + "</td></tr>";
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