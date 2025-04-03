
function signUp() {
    window.location.href = "http://localhost:5500/signup.html";
}
async function login() {
    const dataFromUser = {
        email: document.querySelector("#email").value,
        password: document.querySelector("#password").value
    }
    try {
        const response = await fetch(`http://localhost:5500/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataFromUser),
        });

        const data = await response.json(); // Get response as text
        console.log(data.error);

        if (data.status === 500 || data.error === 'Internal server error') {
            return alert('Internal Server Error');

        } else if (data.status === 404 || data.error === 'User not found') {
            return alert(`Email: ${dataFromUser.email} not found`);

        } else if (data.status === 200) {
            if (data.result['email'] === dataFromUser['email'] && data.result['password'] === dataFromUser['password']) {
                const cookieResponse = await fetch('http://localhost:5500/createmycookie');
                const cookieData = await cookieResponse.json();
                console.log(cookieData);
                window.location.href = "http://localhost:5500/homePage.html";
                return;

            } else {
                console.log(data.result['email'], data.result['password']);
                return alert("Email or Password are wrong");
            }
        }

    } catch (err) {
        return console.log(err);
    }

}