
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
        console.log(dataFromUser);

        if (data.status === 500 || data.error === 'Internal server error') {
            return alert('Internal Server Error');

        } else if (data.status === 404 || data.error === 'User not found') {
            return alert(`Email: ${dataFromUser.email} not found`);

        } else if (data.status === 200 && data.result) {
            try {
                const response = await fetch(`http://localhost:5500/createmycookie`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(dataFromUser),
                });
                const data = await response.text(); // Get response as text
                console.log(data);
                window.location.href = "http://localhost:5500/homePage.html";
                return;
            } catch (err) {
                return err;
            }
        }
        else {
            return alert("Email or Password are wrong");
        }

    } catch (err) {
        return console.log(err);
    }

}
// Detecet if back - farward has made - If did - Coockie deleted
window.addEventListener('pageshow', async (event) => {
    if (event.persisted) {
        console.log('Returned via back button (from bfcache)');
        await fetch(`http://localhost:5500/logout`);
    } else {
        console.log('Normal page load');
    }
});
