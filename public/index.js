function highlight() {
    let navItems = document.getElementsByClassName('navigator');
    Array.from(navItems).forEach(item => {
        item.addEventListener('click', function () {
            console.log(navItems);
            // Remove highlight from all items first
            Array.from(navItems).forEach(nav => nav.classList.remove('highlight'));

            // Add highlight only to the clicked item
            this.classList.add('highlight');
            const myDiv = document.querySelector("#class-from-db");
            myDiv.textContent = "";
        });
    });

}
// Ensure function runs after the DOM has loaded
document.addEventListener('DOMContentLoaded', highlight);

// <------------------------------------------------------------------>
async function showPlanDetalis() {
    try {
        const response = await fetch(`http://localhost:5500/plan`);
        const data = await response.json();
        console.log(data["Error getting data"] === false);
        const myDiv = document.querySelector("#class-from-db");
        if (data["Error getting data"] === false) {
            myDiv.textContent = "Server Error! Please check DB connection";
            return;
        }
        else {
            if (Array.isArray(data) && data.length > 0) {
                data.forEach(item => {
                    // Creating the sub div to each member
                    const addedDiv = document.createElement('div');
                    addedDiv.classList.add('flexDiv');
                    // addedDiv.classList.add('addedDiv');
                    // Creating member deatilas as a 'p'
                    const planName = document.createElement('p');
                    const freqPerWeek = document.createElement('p');
                    const price = document.createElement('p');
                    planName.textContent = `Plan Name: ${item['planName']}`;
                    freqPerWeek.textContent = `Per Week: ${item['freqPerWeek']}`;
                    price.textContent = `Price: ${(item['price'])}$`;
                    // Appending each member to the sub div
                    addedDiv.appendChild(planName);
                    addedDiv.appendChild(freqPerWeek);
                    addedDiv.appendChild(price);
                    // Appending to the main div
                    myDiv.appendChild(addedDiv);
                });
            }
        }
    } catch (error) {
        console.error(error);
        document.querySelector("#dataFromSQL").textContent = 'Error fetching data from SQL server';
    }
}
async function showAllUsers() {
    try {
        const response = await fetch(`http://localhost:5500/users`);
        const data = await response.json();
        console.log(data);
        const myDiv = document.querySelector("#class-from-db");
        // if (data["Error getting data"] === false) {
        //     myDiv.textContent = "Server Error! Please check DB connection";
        // }
        // else {
        // const userActionDiv = document.querySelector("#userActions");
        if (Array.isArray(data) && data.length > 0) {
            data.forEach(item => {
                let flag = false;
                // Creating the sub div to each member
                const addedDiv = document.createElement('div');
                addedDiv.classList.add('flexDiv');
                // addedDiv.classList.add('addedDiv');
                // Creating member deatilas as a 'p'
                const memberName = document.createElement('p');
                const memberEmail = document.createElement('p');
                const memberPhoneNunber = document.createElement('p');
                const dateOfBirth = document.createElement('p');
                const joinDate = document.createElement('p');
                memberName.textContent = `Full Name: ${item['fullName']}`;
                memberEmail.textContent = `Email: ${item['email']}`;
                memberPhoneNunber.textContent = `PB: ${(item['phoneNumber'])}`;
                dateOfBirth.textContent = `Bitrh Date: ${new Date((item['dateOfBirth'])).toISOString().split("T")[0]} `;
                joinDate.textContent = `Join Date: ${new Date((item['joinDate'])).toISOString().split("T")[0]} `;
                // Buttons for user action
                const updateButton = document.createElement('input');
                updateButton.classList.add('hide');
                updateButton.setAttribute('type', 'Button');
                updateButton.setAttribute('value', 'Update');
                const deleteButton = document.createElement('input');
                deleteButton.classList.add('hide');
                deleteButton.setAttribute('type', 'Button');
                deleteButton.setAttribute('value', 'Delele');
                // Appending each member to the sub div
                addedDiv.appendChild(memberName);
                addedDiv.appendChild(memberEmail);
                addedDiv.appendChild(memberPhoneNunber);
                addedDiv.appendChild(dateOfBirth);
                addedDiv.appendChild(joinDate);
                addedDiv.appendChild(updateButton);
                addedDiv.appendChild(deleteButton);
                // Appending to the main div
                myDiv.appendChild(addedDiv);

                let inputMemberName = document.createElement('input');
                inputMemberName.classList.add('newAddedInput');
                inputMemberName.setAttribute('type', 'text');
                inputMemberName.value = item['fullName'];

                let inputMemberEmail = document.createElement('input');
                inputMemberEmail.classList.add('newAddedInput');
                inputMemberEmail.setAttribute('type', 'text');
                inputMemberEmail.value = item['email'];

                let inputMemberPb = document.createElement('input');
                inputMemberPb.classList.add('newAddedInput');
                inputMemberPb.setAttribute('type', 'text');
                inputMemberPb.value = item['phoneNumber'];

                let inputMemberBod = document.createElement('input');
                inputMemberBod.classList.add('newAddedInput');
                inputMemberBod.setAttribute('type', 'text');
                inputMemberBod.value = new Date((item['dateOfBirth'])).toISOString().split("T")[0];

                addedDiv.addEventListener('click', async () => {
                    // Show buttons
                    updateButton.classList.remove('hide');
                    updateButton.classList.add('smallButton');
                    deleteButton.classList.remove('hide');
                    deleteButton.classList.add('smallDeleteButton');
                    // Creation of the body req - PUT Method
                    if (!flag) {
                        // User name
                        addedDiv.replaceChild(inputMemberName, memberName);
                        addedDiv.replaceChild(inputMemberEmail, memberEmail);
                        addedDiv.replaceChild(inputMemberPb, memberPhoneNunber);
                        addedDiv.replaceChild(inputMemberBod, dateOfBirth);
                        flag = true;
                    }
                    const updateMemeberTable = {
                        fullName: inputMemberName.value,
                        email: inputMemberEmail.value,
                        phonenumber: inputMemberPb.value,
                        dateOfBirth: inputMemberBod.value,
                        userId: item['id']
                    }
                    // Update Button
                    updateButton.addEventListener('click', async () => {
                        let flag = true;
                        if (flag) {
                            console.log('Sent');
                            flag = false;
                            udpateUser(updateMemeberTable);
                            window.location.reload();

                        }
                    });
                    // Delete Button
                    deleteButton.addEventListener('click', async () => {
                        let flag = true;
                        if (flag) {
                            console.log('Sent');
                            flag = false;
                            deleteUser(updateMemeberTable['userId']);

                        }
                    });

                });

            });

        }

        // }
    } catch (Error) {
        console.log(Error);
    }
}
// Delete clicked user by his ID
async function deleteUser(userId) {
    try {
        const response = await fetch(`http://localhost:5500/deleteUser/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json(); // Get response as text
        console.log(data);

        if (data.status) {
            alert('User deleted successfully');
            window.location.reload();
            return;
        }
    } catch (error) {
        console.log(Error);
    }
}
// Updating user by his ID
async function udpateUser(dataToUpdate) {
    const dataFromUser = dataToUpdate;
    let emptyFiledDetected = false;
    console.log(dataFromUser);

    for (const [key, value] of Object.entries(dataFromUser)) {
        if (!value) {
            emptyFiledDetected = true;
            alert(`${key} field is empty! Please enter value!`);
            return;
        }
    }
    console.log(emptyFiledDetected);

    if (!emptyFiledDetected) {
        console.log(dataFromUser);

        try {
            const response = await fetch(`http://localhost:5500/update-user/${dataFromUser['userId']}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataFromUser),
            });
            console.log(response.status);

            const data = response.status; // Get response as text
            if (data === 500) {
                return alert('Email must be unique');

            } else if (data === 200) {
                return alert("User updated successfully");

            } else if (data === 404) {
                return alert("Bad request");

            }

        } catch (error) {
            alert('User updated successfully');
        }
    }
}
async function sendForm(event) {
    event.preventDefault();
    // Collecting form data
    const formData = {
        name: document.getElementById('firstname').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };
    // Convert formData to URL-encoded string
    const urlEncodedData = new URLSearchParams(formData).toString();
    try {
        const response = await fetch('http://localhost:5500/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded', // Sending as x-www-form-urlencoded
            },
            body: urlEncodedData // Sending as URL-encoded string
        });
        const data = await response.text(); // Get response as text
        if (data === "OK") {
            window.location.href = "http://localhost:5500/thankYou.html";
            console.log({ "Form sent": formData });

            return;
        } else if (data === "Bad request") {
            alert("There was a problem sending request. Please try again later");
            return;
        }
        // document.getElementById('responseMessage').innerText = data; // Show response
    } catch (error) {
        console.error('Error:', error);
        // document.getElementById('responseMessage').innerText = 'Error sending message!';
        console.log("Form cannot be sended");
    }
}

// Join - Us button
async function signUpUser() {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/; // PAssword type -> Abc@1234 
    let dateOfBirth = new Date();
    const dateInput = document.querySelector("#birthOfDate").value;
    const tempPassword = document.querySelector("#password").value;
    const confirmPassword = document.querySelector('#confirmPassword').value;
    if (!dateInput) {
        dateOfBirth = new Date();
    } else {
        dateOfBirth = new Date(dateInput).toISOString().split("T")[0]; // Get 'YYYY-MM-DD' only
    }
    const queryToMemeberTable = {
        fullName: document.querySelector("#fullName").value,
        userName: document.querySelector("#userName").value,
        email: document.querySelector("#email").value,
        phoneNumber: document.querySelector("#phoneNumber").value,
        dateOfBirth: dateOfBirth,
        password: ""
    };
    for (const [key, value] of Object.entries(queryToMemeberTable)) {
        if (!value) {
            alert("All fields are required!");
            return;
        }
    }
    if (tempPassword != confirmPassword) {
        alert('Password are not match');
        return;
    } else if (!passwordRegex.test(tempPassword)) { // Checking if password is pass regax test
        alert("Password must be at least 8 characters long and include:\n- At least one uppercase letter\n- At least one lowercase letter\n- At least one number\n- At least one special character (@$!%*?&)");
        return;
    }
    else {
        queryToMemeberTable['password'] = document.querySelector("#password").value;
        for (const [key, value] of Object.entries(queryToMemeberTable)) {
            if (!value) {
                alert("Please fill all fields!");
                console.log(queryToMemeberTable);
                return; // If any field is empty - Don't send it!
            }
        }
    }
    try {
        const response = await fetch('http://localhost:5500/signupNewUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(queryToMemeberTable) //  Convert object to JSON string
        });

        const data = await response.text(); // Get response as text
        // console.log(data);

        if (data === "User cannot be added") {
            console.log("User cannot be insreted");
            return;
        } else if (data === "OK") {
            alert(`Welcome to our team ${queryToMemeberTable.fullName}! Our staff will reach out shortly`);
            window.location.href = 'http://127.0.0.1:5501/public/login.html'; // Page refresh
        } else if (data === "Internal server error") {
            alert("Email or User name is alreay in use please use diffrent email!");
            return;
        }

        // document.getElementById('responseMessage').innerText = data; // Show response
    } catch (error) {
        console.error('Error:', error);
        // document.getElementById('responseMessage').innerText = 'Error sending message!';
    }

}


function signUp() {
    window.location.href = "http://localhost:5500/signup.html";
}
async function login() {
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    let createCookie = false;
    let userIndex = 0;
    try {
        const response = await fetch(`http://localhost:5500/users`);
        const data = await response.json();
        let found = false;
        for (let i = 0; i < data.length; i++) {

            if (data[i]['email'] === email && data[i]['password'] === password) {
                createCookie = true;
                console.log(createCookie);
                userIndex = i;
                break;
            }
        }
        if (createCookie) {
            const cookieResponse = await fetch('http://localhost:5500/create-my-cookie');
            const cookieData = await cookieResponse.json();
            console.log(cookieResponse);
            window.location.href = "http://localhost:5500/homePage.html";
            return;

        } else {
            console.log({ 'email': email, 'password': password });
            alert("Email or password are wrong")
            console.log("Not match");
            return;
        }

    } catch (err) {
        return console.log(err);
    }

}

// window.addEventListener("unload", () => {
//     fetch('/logout'); // Send logout request
// });


