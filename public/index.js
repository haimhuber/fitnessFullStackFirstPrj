// Global vars 

// <------------------------------------------------------------------>
async function showPlanDetalis() {
    try {
        const response = await fetch(`http://localhost:5500/plan`);
        const data = await response.json();
        console.log(data["Error getting data"] === false);
        const myDiv = document.querySelector("#class-from-db");
        myDiv.textContent = "";
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
        const response = await fetch(`http://localhost:5500/user/users`);
        const data = await response.json();
        console.log(data);
        const myDiv = document.querySelector("#class-from-db");
        myDiv.textContent = "";
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
                            return;

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

    if (!emptyFiledDetected) {
        try {
            const response = await fetch(`http://localhost:5500/user/update-user/${dataFromUser['userId']}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataFromUser),
            });
            const data = await response.json(); // Get response as text
            console.log(response.status);
            if (data.status === 500) {
                return alert('Email must be unique');

            } else if (data.status === 200) {
                return alert("User updated successfully");

            } else if (data.status === 404) {
                return alert("Bad request");
            }
        } catch (error) {
            alert('User updated successfully');
        }
    } else {
        return;
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
        const response = await fetch('http://localhost:5500/user/contact', {
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
        const response = await fetch('http://localhost:5500/user/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(queryToMemeberTable) //  Convert object to JSON string
        });

        const data = await response.json(); // Get response as text
        // console.log(data);

        if (data.status === 400) {
            return alert(`${data.errorValue} is already exist`);
        } else if (data.status === 200) {
            alert(`Welcome to our team ${queryToMemeberTable.fullName}! Our staff will reach out shortly`);
            window.location.href = 'http://127.0.0.1:5500/public/login.html'; // Page refresh
        } else if (data.status === 500) {
            alert("Internal server error!");
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
    const dataFromUser = {
        email: document.querySelector("#email").value,
        password: document.querySelector("#password").value
    }
    try {
        const response = await fetch(`http://localhost:5500/user/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataFromUser),
        });

        const data = await response.json(); // Get response as text
        console.log(data);

        if (data.status === 500 || data.error === 'Internal server error') {
            return alert('Internal Server Error');

        } else if (data.status === 404 || data.error === 'User not found') {
            return alert(`Email: ${dataFromUser.email} not found`);
        } else if (data.status === 200 && data.response) {
            window.location.href = "http://localhost:5500/screen/homePage";
        }
        else {
            return alert("Email or Password are wrong");
        }

    } catch (err) {
        return console.log(err);
    }

}


// // Detecet if back - farward has made - If did - Coockie deleted
window.addEventListener('pageshow', async (event) => {
    const targetPage = '/login.html'; // Page to watch

    if (window.location.pathname.endsWith(targetPage)) {
        console.log("Cookie1111");
        if (event.persisted) {
            console.log('Returned via back button (from bfcache) to homePage.html');

            try {
                const response = await fetch('http://localhost:5500/logout');
                if (response.ok) {


                    // Clear user info in frontend (if globally declared)
                    userIdSignedIn = 0;
                    userNameSignedIn = "";
                } else {
                    console.warn('Logout failed with status:', response.status);
                }
            } catch (error) {
                console.error('Error during logout on pageshow:', error);
            }

        } else {
            console.log('Normal load of homePage.html');
        }
    }
});

// Detecet if window closed - very important!
window.addEventListener('unload', async function () {
    const response = await fetch(`http://localhost:5500/logout`);
});

async function userNameFrontEnd() {
    const response = await fetch(`http://localhost:5500/user/userLoggedIn`);
    const data = await response.json();
    const userLogFrontend = document.querySelector("#userLoggedIn");
    userLogFrontend.classList.add('userFrontendName');
    userLogFrontend.textContent = `Welcome back -  ${data.loggnedUserName}`;

}
userNameFrontEnd();


