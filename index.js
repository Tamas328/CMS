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

function addEmployee() {
    let firstName = document.querySelector('#first-name').value;
    let lastName = document.querySelector('#last-name').value;
    let email = document.querySelector('#email').value;
    let gender = document.querySelector('#gender').value;
    let dob = document.querySelector('#birthday').value;
    let img = document.querySelector('#avatar');
    img = img.files.item(0).name;
    let birthday = getDOB(dob);

    document.getElementById("table-list").innerHTML += "<tr><td><img src='images/" + img + "' height='50'></td><td>" + firstName + "</td><td>" + lastName + "</td><td>" + email + "</td><td>" + gender + "</td><td>" + birthday + "</td></tr>";
}

function getDOB(dob) {
    const d = new Date(dob);
    const year = d.getFullYear();
    const date = d.getDate();
    const mIndex = d.getMonth();
    const month = months[mIndex];
    
    return date + " " + month + " " + year;
}