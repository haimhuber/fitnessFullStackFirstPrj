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
        if (Array.isArray(data) && data.length > 0) {
            let index = 0;
            data.forEach(item => {
                const addedDiv = document.createElement('div');
                addedDiv.classList.add('addedDiv');
                for (const key in item) {
                    if (item.hasOwnProperty(key)) {
                        const addP = document.createElement('p');
                        addP.textContent = `${key}: ${item[key]}`;
                        addedDiv.append(addP);


                    }
                }
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