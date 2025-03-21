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
                const description = document.createElement('p');
                const freqPerWeek = document.createElement('p');
                const price = document.createElement('p');
                planName.textContent = `Plan Name: ${item['planName']}`;
                description.textContent = `Plan Description: ${item['description']}`;
                freqPerWeek.textContent = `Per Week: ${item['freqPerWeek']}`;
                price.textContent = `Price: ${(item['price'])}$`;
                // Appending each member to the sub div
                addedDiv.appendChild(planName);
                addedDiv.appendChild(description);
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

        // document.getElementById('responseMessage').innerText = data; // Show response
    } catch (error) {
        console.error('Error:', error);
        // document.getElementById('responseMessage').innerText = 'Error sending message!';
    }

    window.location.href = 'http://127.0.0.1:5500/public/thankYou.html';  // Replace with your main page URL  
}

// Join - Us button

async function checkUnioueEmail() {
    let emailIsUnique = false;
    const userInputEmail = document.querySelector("#email").value;
    try {
        const response = await fetch('http://localhost:5500/join-us')
        const data = await response.json();
        console.log(data);
        data.forEach(element => {
            if (userInputEmail === element['email']) {
                emailIsUnique = false;
                showJoinUs(emailIsUnique);
                return;
            }
        });
        emailIsUnique = true;
        showJoinUs(emailIsUnique);



    } catch (error) {
        console.error('Error:', error);
        return;

    }
}

async function showJoinUs(email) {
    if (email) {

        let dateOfBirth = new Date();
        const dateInput = document.querySelector("#birthOfDate").value;
        console.log(dateInput);

        if (!dateInput) {
            dateOfBirth = new Date();
        } else {
            dateOfBirth = new Date(dateInput).toISOString().split("T")[0]; // Get 'YYYY-MM-DD' only
        }


        const queryToMemeberTable = {
            fullName: document.querySelector("#fullName").value,
            email: document.querySelector("#email").value,
            phonenumber: document.querySelector("#phonenumber").value,
            dateOfBirth: dateOfBirth,
            table: 'Members'
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
        console.log(queryToMemeberTable);
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
            alert("Thank you! Our staff will reach out shortly");
            window.location.href = 'http://127.0.0.1:5500/public/about.html'; // Page refresh

            // document.getElementById('responseMessage').innerText = data; // Show response
        } catch (error) {
            console.error('Error:', error);
            // document.getElementById('responseMessage').innerText = 'Error sending message!';
        }

    } else {
        alert('Email is already in use');
    }
}




// async function getData() {
//     const paymentMethod = document.querySelector("#paymentText").value;
//     if (!paymentMethod) {
//         alert("Method payment must be typed!");
//         return;
//     }
//     try {
//         document.querySelector("#createdData").textContent = "";
//         const response = await fetch(`http://localhost:5500/payments?methodPay=${paymentMethod}`);
//         const data = await response.json();
//         console.log(data);
//         const myDiv = document.querySelector("#createdData");
//         myDiv.textContent = "";
//         if (Array.isArray(data) && data.length > 0) {
//             let index = 0;
//             document.querySelector("#dataFromSQL").textContent = "";
//             data.forEach(item => {
//                 // Creating the DOM
//                 const date = new Date(item['joinDate']);
//                 const addedDiv = document.createElement('div');
//                 addedDiv.classList.add('addedDiv');
//                 const memberFirstName = document.createElement('p');
//                 const memberEmail = document.createElement('p');
//                 const memberJoinDate = document.createElement('p');
//                 const memberPaymentMethod = document.createElement('p');
//                 memberPaymentMethod.textContent = `Member Payment Method: ${item['paymentMethods']}`;
//                 memberFirstName.textContent = `Member Name: ${item['fullName']}`;
//                 memberEmail.textContent = `Member Email: ${item['email']}`;
//                 memberJoinDate.textContent = `Join Date: ${date.toLocaleString()}`;
//                 // Appending the DOM
//                 addedDiv.appendChild(memberFirstName);
//                 addedDiv.appendChild(memberEmail);
//                 addedDiv.appendChild(memberJoinDate);
//                 addedDiv.appendChild(memberJoinDate);
//                 addedDiv.appendChild(memberPaymentMethod);
//                 // Appending to the main div
//                 myDiv.appendChild(addedDiv);
//             })
//         } else {
//             document.querySelector("#dataFromSQL").textContent = "There's no data from SQL server";
//         }

//     } catch (error) {
//         console.error('Error:', error);
//         document.querySelector("#dataFromSQL").textContent = 'Error fetching data from SQL server';

//     }
// }

