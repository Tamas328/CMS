document.getElementById('employeeForm').addEventListener('submit', submitForm);

function submitForm(e) {
    e.preventDefault();
    
    var avatar = getValues('avatar');
    var firstName = getValues('first-name');
    var lastName = getValues('last-name');
    var email = getValues('email');
    var sex = getValues('gender');
    var birthdate = getValues('birthday');

    console.log(avatar);
}

function getValues(id) {
    return document.getElementById(id).value;
}