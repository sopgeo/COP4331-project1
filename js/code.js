const urlBase = 'http://cop4331-manager.xyz/LAMPAPI';
const extension = 'php';


let userId = localStorage.getItem("userId"); //retrieves local storage variable
let firstName = "";
const ids = [];
let lastName = "";

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
//	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {login:login,password:password};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{

				let jsonObject = JSON.parse( xhr.responseText );
				localStorage.setItem("userId", jsonObject.id); //create local storage variable to travel between pages
                userId = localStorage.getItem("userId"); //set user id to the local storage var


				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "contacts.html";
                
			}
		};
        
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

// Testing this function below.
function goToRegister()
{
	window.location.href = "register.html";
}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie() {
    userId = -1;
    let data = document.cookie;
    let splits = data.split(",");

    for (var i = 0; i < splits.length; i++) {

        let thisOne = splits[i].trim();
        let tokens = thisOne.split("=");

        if (tokens[0] == "firstName") {
            firstName = tokens[1];
        }

        else if (tokens[0] == "lastName") {
            lastName = tokens[1];
        }

        else if (tokens[0] == "userId") {
            userId = parseInt(tokens[1].trim());
        }
    }

    if (userId < 0) {
        window.location.href = "index.html";
    }

    else {
        document.getElementById("userName").innerHTML = "Welcome, " + firstName + " " + lastName + "!";
    }
}

function doLogout()
{
	userId = 0;
    localStorage.setItem("userId", 0);
	fullName = "";
	// lastName = "";
	document.cookie = "fullName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function showTable() {
    var x = document.getElementById("addMe");
    var contacts = document.getElementById("contactsTable")
    if (x.style.display === "none") {
        x.style.display = "block";
        contacts.style.display = "none";
    } else {
        x.style.display = "none";
        contacts.style.display = "block";
    }
}

function addContact()
{
	let name = document.getElementById("contactTextName").value;
    // let lastname = document.getElementById("contactTextLast").value;
    let phone = document.getElementById("contactTextNumber").value;
    let email = document.getElementById("contactTextEmail").value;
    //userId = localStorage.getItem("userId");


    if (!validAddContact(name, phone, email)) {
        console.log("INVALID NAME, PHONE, OR EMAIL SUBMITTED");
        return;
    }

    let tmp = {
        name: name,
        phone: phone,
        email: email,
        userId: userId
    };

	let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/AddContacts.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log("Contact added");
                // Clear input fields in form 
                document.getElementById("addMe").reset();
                // reload contacts table and switch view to show
                loadContacts();
                // showTable();
            }
        };
        xhr.send(jsonPayload);

    } catch (err) {
        console.log(err.message);
    }
}

function loadContacts() {
    let tmp = {
        search: "",
        userId: userId
    };

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/SearchContacts.' + extension;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                if (jsonObject.error) {
                    console.log(jsonObject.error);
                    return;
                }
                let text = "<table border='1'>"
                for (let i = 0; i < jsonObject.results.length; i++) {
                    ids[i] = jsonObject.results[i].ID
                    text += "<tr id='row" + i + "'>"
                    text += "<td id='name" + i + "'><span>" + jsonObject.results[i].Name + "</span></td>";
                    text += "<td id='email" + i + "'><span>" + jsonObject.results[i].Email + "</span></td>";
                    text += "<td id='phone" + i + "'><span>" + jsonObject.results[i].Phone + "</span></td>"; 



                    // replaced <span class='glyphicon glyphicon-edit'></span> with EDIT
                    // replaced <span class='glyphicon glyphicon-saved'></span> with SAVE
                    // replaced <span class='glyphicon glyphicon-trash'></span> with DELETE

                    text += "<td>" +
                        "<button type='button' id='edit_button" + i + "' class='w3-button w3-rounder w3-transparent' onclick='edit_row(" + i + ")'>" + " EDIT " + "</button>" +
                        "<button type='button' id='save_button" + i + "' value='Save' class='w3-button w3-rounder w3-transparent' onclick='save_row(" + i + ")' style='display: none'>" + " SAVE " + "</button>" +
                        "<button type='button' onclick='delete_row(" + i + ")' class='w3-button w3-rounder w3-transparent'>" + " DELETE " + "</button>" + "</td>";
                    text += "<tr/>"
                }

                text += "</table>"
                document.getElementById("tbody").innerHTML = text;
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log(err.message);
    }
}


function edit_row(id) {
    document.getElementById("edit_button" + id).style.display = "none";
    document.getElementById("save_button" + id).style.display = "inline-block";

    // var firstNameI = document.getElementById("first_Name" + id);
    var name = document.getElementById("name" + id);
    var email = document.getElementById("email" + id);
    var phone = document.getElementById("phone" + id);

    var name_data = name.innerText;
    // var namel_data = lastNameI.innerText;
    var email_data = email.innerText;
    var phone_data = phone.innerText;

    name.innerHTML = "<input type='text' id='name_text" + id + "' value='" + name_data + "'>";
    // lastNameI.innerHTML = "<input type='text' id='namel_text" + id + "' value='" + namel_data + "'>";
    email.innerHTML = "<input type='text' id='email_text" + id + "' value='" + email_data + "'>";
    phone.innerHTML = "<input type='text' id='phone_text" + id + "' value='" + phone_data + "'>"
}

function save_row(no) {
    var name_val = document.getElementById("name_text" + no).value;
    // var namel_val = document.getElementById("namel_text" + no).value;
    var email_val = document.getElementById("email_text" + no).value;
    var phone_val = document.getElementById("phone_text" + no).value;
    var id_val = ids[no]

    document.getElementById("name" + no).innerHTML = name_val;
    // document.getElementById("last_Name" + no).innerHTML = namel_val;
    document.getElementById("email" + no).innerHTML = email_val;
    document.getElementById("phone" + no).innerHTML = phone_val;

    document.getElementById("edit_button" + no).style.display = "inline-block";
    document.getElementById("save_button" + no).style.display = "none";

    let tmp = {
        phone: phone_val,
        email: email_val,
        name: name_val,
        // newLastName: namel_val,
        id: id_val
    };

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/UpdateContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log("Contact has been updated");
                loadContacts();
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log(err.message);
    }
}

function delete_row(no) {
    var name_val = document.getElementById("name" + no).innerText;
    var email_val = document.getElementById("email" + no).innerText;
    var phone_val = document.getElementById("phone" + no).innerText;
    // var namel_val = document.getElementById("last_Name" + no).innerText;
    nameOne = name_val.substring(0, name_val.length);
    phoneOne = phone_val.substring(0, phone_val.length);
    emailOne = email_val.substring(0, email_val.length);
    console.log(nameOne);
    console.log(phoneOne);
    console.log(emailOne);
    // nameTwo = namel_val.substring(0, namel_val.length);
    let check = confirm('Confirm deletion of contact: ' + nameOne);

    if (check === true) {
        document.getElementById("row" + no + "").outerHTML = "";
        let tmp = {
            name: nameOne,
            email: emailOne,
            phone: phoneOne,
            userId: userId
        };

        let jsonPayload = JSON.stringify(tmp);

        let url = urlBase + '/DeleteContact.' + extension;

        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        try {
            xhr.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {

                    console.log("Contact has been deleted");
                    loadContacts();
                }
            };
            xhr.send(jsonPayload);
        } catch (err) {
            console.log(err.message);
        }

    };

}

function searchContacts() {
    const content = document.getElementById("searchText");
    const selections = content.value.toUpperCase().split(' ');
    const table = document.getElementById("contacts");
    const tr = table.getElementsByTagName("tr"); // Table Row

    for (let i = 0; i < tr.length; i++) {
        const td_n = tr[i].getElementsByTagName("td")[0]; // Table Data: First Name
        // const td_ln = tr[i].getElementsByTagName("td")[1];// Table Data: Last Name

        if (td_n) {
            const txtValue_n = td_n.textContent || td_n.innerText;
            // const txtValue_ln = td_ln.textContent || td_ln.innerText;
            tr[i].style.display = "none";

            for (selection of selections) {
                if (txtValue_n.toUpperCase().indexOf(selection) > -1) {
                    tr[i].style.display = "";
                }
                // if (txtValue_ln.toUpperCase().indexOf(selection) > -1) {
                //     tr[i].style.display = "";
                // }
            }
        }
    }
}


function clickLogin() {
    var log = document.getElementById("login");
    var reg = document.getElementById("signup");
    var but = document.getElementById("btn");

    log.style.left = "-400px";
    reg.style.left = "0px";
    but.style.left = "130px";
}

function clickRegister() {

    var log = document.getElementById("login");
    var reg = document.getElementById("signup");
    var but = document.getElementById("btn");

    reg.style.left = "-400px";
    log.style.left = "0px";
    but.style.left = "0px";

}

function validLoginForm(logName, logPass) {

    var logNameErr = logPassErr = true;

    if (logName == "") {
        console.log("USERNAME IS BLANK");
    }
    else {
        var regex = /(?=.*[a-zA-Z])[a-zA-Z0-9-_]{3,18}$/;

        if (regex.test(logName) == false) {
            console.log("USERNAME IS NOT VALID");
        }

        else {

            console.log("USERNAME IS VALID");
            logNameErr = false;
        }
    }

    if (logPass == "") {
        console.log("PASSWORD IS BLANK");
        logPassErr = true;
    }
    else {
        var regex = /(?=.*\d)(?=.*[A-Za-z])(?=.*[!@#$%^&*]).{8,32}/;

        if (regex.test(logPass) == false) {
            console.log("PASSWORD IS NOT VALID");
        }

        else {

            console.log("PASSWORD IS VALID");
            logPassErr = false;
        }
    }

    if ((logNameErr || logPassErr) == true) {
        return false;
    }
    return true;

}

function validAddContact(name, phone, email) {

    var nameErr = phoneErr = emailErr = true;

    if (name == "") {
        console.log("NAME IS BLANK");
    }
    else {
        console.log("name IS VALID");
        nameErr = false;
    }

    // if (lastName == "") {
    //     console.log("LAST NAME IS BLANK");
    // }
    // else {
    //     console.log("LAST name IS VALID");
    //     lNameErr = false;
    // }

    if (phone == "") {
        console.log("PHONE IS BLANK");
    }
    else {
        var regex = /^[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/;

        if (regex.test(phone) == false) {
            console.log("PHONE IS NOT VALID");
        }

        else {

            console.log("PHONE IS VALID");
            phoneErr = false;
        }
    }

    if (email == "") {
        console.log("Please enter an email address");
    }
    else {
        var regex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;

        if (regex.test(email) == false) {
            console.log("Invalid email");
        }

        else {

            console.log("EMAIL IS VALID");
            emailErr = false;
        }
    }

    if ((phoneErr || emailErr || nameErr) == true) {
        return false;

    }

    return true;

}

function doRegister()
{
    let login = document.getElementById("loginName").value;
    let firstName = document.getElementById("firstName").value;
    let lastName = document.getElementById("lastName").value;
    let password = document.getElementById("loginPassword").value;

    // if statement to check if the user input for register is valid.

    var valid = true;
    var validLogin = true;
    var validFirstName = true;
    var validLastName = true;
    var validPassword = true;

    if (firstName == "")
    {
        console.log("Please enter First Name.");
        valid = false;
	validFirstName = false;
    }

    if (lastName == "")
    {
        console.log("Please enter Last Name.");
        valid = false;
	validLastName = false;
    }

    if (password == "")
    {
        console.log("Please enter a password.");
        valid = false;
 	validPassword = false;
    }

    if (login == "")
    {
        console.log("Please enter a Username.");
        valid = false;
	validLogin = false;
    }

    if (!valid)
    {
        document.getElementById("registerResult").innerHTML = "Not valid registration";

	if (!validLogin)
	{
	    document.getElementById("userResult").innerHTML = "Please enter a username";
	}
	else
	{
	    document.getElementById("userResult").innerHTML = "";
	}

	if (!validFirstName)
	{
	    document.getElementById("firstNameResult").innerHTML = "Please enter first name";
	}
	else
	{
	    document.getElementById("firstNameResult").innerHTML = "";
	}

	if (!validLastName)
	{
	    document.getElementById("lastNameResult").innerHTML = "Please enter last name";
	}
	else
	{
	    document.getElementById("lastNameResult").innerHTML = "";
	}

	if (!validPassword)
	{
	    document.getElementById("passwordResult").innerHTML = "Please enter a password";
	}
	else
	{
	    document.getElementById("passwordResult").innerHTML = "";
	}
        return;
    }

    document.getElementById("registerResult").innerHTML = "";

    let tmp = {login:login,firstName:firstName,lastName:lastName,password:password};
    let jsonPayload = JSON.stringify( tmp );

    let url = urlBase + '/Register.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
    {
		xhr.onreadystatechange = function() 
		{

			if (this.status == 409) {
                		document.getElementById("registerResult").innerHTML = "Username Taken";
                		return;
            		}

			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse(xhr.responseText);
               			userId = jsonObject.id;
                		document.getElementById("registerResult").innerHTML = "User added";
                		firstName = jsonObject.firstName;
                		lastName = jsonObject.lastName;
                		saveCookie();

				//window.location.href = "index.html";
			}
		};
        
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("registerResult").innerHTML = err.message;
	}

}

function returnToLogin()
{
    window.location.href = "index.html";
}
