async function getData() {
    const paymentMethod = document.querySelector("#paymentText").value;
    if (!paymentMethod) {
        alert("Method payment must be typed!");
        return;
    }
    try {
        document.querySelector("#createdData").textContent = "";
        const response = await fetch(`http://localhost:5500/payments?methodPay=${paymentMethod}`);
        const data = await response.json();
        console.log(data);
        const myDiv = document.querySelector("#createdData");
        myDiv.textContent = "";
        if (Array.isArray(data) && data.length > 0) {
            let index = 0;
            document.querySelector("#dataFromSQL").textContent = "";
            data.forEach(item => {
                // Creating the DOM
                const date = new Date(item['joinDate']);
                const addedDiv = document.createElement('div');
                addedDiv.classList.add('addedDiv');
                const memberFirstName = document.createElement('p');
                const memberEmail = document.createElement('p');
                const memberJoinDate = document.createElement('p');
                const memberPaymentMethod = document.createElement('p');
                memberPaymentMethod.textContent = `Member Payment Method: ${item['paymentMethods']}`;
                memberFirstName.textContent = `Member Name: ${item['fullName']}`;
                memberEmail.textContent = `Member Email: ${item['email']}`;
                memberJoinDate.textContent = `Join Date: ${date.toLocaleString()}`;
                // Appending the DOM
                addedDiv.appendChild(memberFirstName);
                addedDiv.appendChild(memberEmail);
                addedDiv.appendChild(memberJoinDate);
                addedDiv.appendChild(memberJoinDate);
                addedDiv.appendChild(memberPaymentMethod);
                // Appending to the main div
                myDiv.appendChild(addedDiv);
            })
        } else {
            document.querySelector("#dataFromSQL").textContent = "There's no data from SQL server";
        }

    } catch (error) {
        console.error('Error:', error);
        document.querySelector("#dataFromSQL").textContent = 'Error fetching data from SQL server';

    }
}


async function showAllMembers() {
    const response = await fetch(`http://localhost:5500/members`);
    const data = await response.json();
    console.log(data);
    const myDiv = document.querySelector("#createdData");
    myDiv.classList.add('myDiv');
    myDiv.textContent = "";
    if (Array.isArray(data) && data.length > 0) {
        data.forEach(item => {
            // Getting the join date 
            const date = new Date(item['joinDate']);
            // Creating the sub div to each member
            const addedDiv = document.createElement('div');
            addedDiv.classList.add('addedDiv');
            // Creating member deatilas as a 'p'
            const memberFirstName = document.createElement('p');
            const memberEmail = document.createElement('p');
            const memberPhoneNumber = document.createElement('p');
            const memberJoinDate = document.createElement('p');
            memberFirstName.textContent = `Member Name: ${item['fullName']}`;
            memberEmail.textContent = `Member Email: ${item['email']}`;
            memberPhoneNumber.textContent = `Member Phone Number: ${item['phoneNumber']}`;
            memberJoinDate.textContent = `Member Join Date: ${date.toLocaleDateString()}`;
            // Appending each member to the sub div
            addedDiv.appendChild(memberFirstName);
            addedDiv.appendChild(memberEmail);
            addedDiv.appendChild(memberPhoneNumber);
            addedDiv.appendChild(memberJoinDate);
            // Appending to the main div
            myDiv.appendChild(addedDiv);
        });
    }
}



async function sendForm(event) {
    event.preventDefault();
    // Collecting form data
    const formData = {
        firstname: document.getElementById('firstname').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };

    // Convert formData to URL-encoded string
    const urlEncodedData = new URLSearchParams(formData).toString();

    try {
        const response = await fetch('http://localhost:5500/contact-us', {
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
