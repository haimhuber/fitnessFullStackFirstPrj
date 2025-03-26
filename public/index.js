// Radio button global variable
// User Action -> Update / Delete
let buttonUserAction = 0;

// Check which radio button client picked
document.querySelectorAll('.radioButoons').forEach((radio) => {
    radio.addEventListener('click', () => {
        buttonUserAction = radio.value;
    })
})
// <------------------------------------------------>
const action = document.createElement('input');
action.classList.add('userActionsButton');
action.setAttribute('type', 'button');
action.setAttribute('value', 'Send');
// <----------------------------------------------------------------->

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

async function showPlanDetalis() {
    try {
        const response = await fetch(`http://localhost:5500/plan`);
        const data = await response.json();
        console.log(data);
        const myDiv = document.querySelector("#class-from-db");
        // myDiv.classList.add('myDiv');
        myDiv.textContent = "";
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
    } catch (error) {
        console.error('Error:', error);
        document.querySelector("#dataFromSQL").textContent = 'Error fetching data from SQL server';

    }
}


async function showAllUsers() {
    try {
        const response = await fetch(`http://localhost:5500/users`);
        const data = await response.json();
        console.log(data);
        const myDiv = document.querySelector("#class-from-db");
        const userActionDiv = document.querySelector("#userActions");
        if (Array.isArray(data) && data.length > 0) {
            data.forEach(item => {
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
                // Appending each member to the sub div
                addedDiv.appendChild(memberName);
                addedDiv.appendChild(memberEmail);
                addedDiv.appendChild(memberPhoneNunber);
                addedDiv.appendChild(dateOfBirth);
                addedDiv.appendChild(joinDate);
                // Appending to the main div
                myDiv.appendChild(addedDiv);
                addedDiv.addEventListener('click', () => {
                    // Creation of the body req - PUT Method
                    const updateMemeberTable = {
                        fullName: item['fullName'],
                        email: item['email'],
                        phonenumber: item['phoneNumber'],
                        dateOfBirth: `${new Date((item['dateOfBirth'])).toISOString().split("T")[0]}`,
                        table: 'Members'
                    }
                    userActionDiv.textContent = "";
                    // User name
                    const actionName = document.createElement('input');
                    actionName.classList.add('userActions');
                    actionName.setAttribute('type', 'text');
                    actionName.value = `${item['fullName']}`;
                    // User Email
                    const actionEmail = document.createElement('input');
                    actionEmail.classList.add('userActions');
                    actionEmail.setAttribute('type', 'text');
                    actionEmail.value = `${item['email']}`;
                    // User Phone Number
                    const actionPhoneNumber = document.createElement('input');
                    actionPhoneNumber.classList.add('userActions');
                    actionPhoneNumber.setAttribute('type', 'text');
                    actionPhoneNumber.value = `${item['phoneNumber']}`;
                    // User Phone Number
                    const actionBirthDate = document.createElement('input');
                    actionBirthDate.classList.add('userActions');
                    actionBirthDate.setAttribute('type', 'date');
                    actionBirthDate.value = `${new Date((item['dateOfBirth'])).toISOString().split("T")[0]}`;
                    //Radio button from line 4
                    action.setAttribute(
                        'onclick',
                        `userAction(${item['id']}, '${JSON.stringify(updateMemeberTable).replace(/'/g, "\\'")}')`
                    );


                    // Appendings
                    userActionDiv.appendChild(actionName);
                    userActionDiv.appendChild(actionEmail);
                    userActionDiv.appendChild(actionPhoneNumber);
                    userActionDiv.appendChild(actionBirthDate);
                    userActionDiv.appendChild(action);

                });
            });
        }

    } catch (Error) {
        console.log(Error);


    }

}

async function deleteUser() {
    const dataFromUser = JSON.parse(dataToUpdate);
}

async function userAction(userId, dataToUpdate) {
    const dataFromUser = JSON.parse(dataToUpdate);
    console.log(typeof (buttonUserAction));
    if (buttonUserAction === '0') {
        alert('Please pick an user action!');
    } else if (buttonUserAction === '1') { //Update User
        console.log('YES');

        try {
            const response = await fetch(`http://localhost:5500/update-user/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataFromUser),
            });

            const data = await response.json(); // Get response as text
            console.log('Server Response:', data);
        } catch (error) {
            console.error('Error:', error);
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
        message: document.getElementById('message').value,
        table: 'ContactForm'
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
        console.log(data);
        window.location.href = 'http://127.0.0.1:5500/public/thankYou.html';  // Replace with your main page URL 

        // document.getElementById('responseMessage').innerText = data; // Show response
    } catch (error) {
        console.error('Error:', error);
        // document.getElementById('responseMessage').innerText = 'Error sending message!';
        console.log("Form cannot be sended");

    }


}

// Join - Us button
async function joinUs() {
    let dateOfBirth = new Date();
    const dateInput = document.querySelector("#birthOfDate").value;

    if (!dateInput) {
        dateOfBirth = new Date();
    } else {
        dateOfBirth = new Date(dateInput).toISOString().split("T")[0]; // Get 'YYYY-MM-DD' only
    }
    const queryToMemeberTable = {
        fullName: document.querySelector("#fullName").value,
        email: document.querySelector("#email").value,
        phoneNumber: document.querySelector("#phonenumber").value,
        dateOfBirth: dateOfBirth
    }
    for (let key in queryToMemeberTable) {
        if (queryToMemeberTable.hasOwnProperty(key)) {  // Ensure the key is part of the object
            const value = queryToMemeberTable[key];
            if (!value) {  // Check if the value is falsy (e.g., empty string, null, undefined)
                alert("Fill all fields!");
                return; // return
            }
        }
    }
    // console.log(queryToMemeberTable);
    try {
        const response = await fetch('http://localhost:5500/join-us', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Sending as x-www-form-urlencoded
            },
            body: JSON.stringify(queryToMemeberTable) //  Convert object to JSON string
        });

        const data = await response.text(); // Get response as text
        console.log(data);

        if (data === "Not Found") {
            console.log("User cannot be insreted");
            return;
        } else if (data === "OK") {
            alert("Thank you! Our staff will reach out shortly");
            window.location.href = 'http://127.0.0.1:5500/public/about.html'; // Page refresh
        } else if (data === "Internal Server Error") {
            alert("Email must be unique!");
        }

        // document.getElementById('responseMessage').innerText = data; // Show response
    } catch (error) {
        console.error('Error:', error);
        // document.getElementById('responseMessage').innerText = 'Error sending message!';
    }
}


