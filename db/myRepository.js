const connectDb = require('./db');

async function updateUser(userData) {
    try {
        const pool = await connectDb.connectionToSqlDB(); // Connect to DB

        // Execute update query for user ID 1
        const result = await pool.request()
            .input('userId', userData.userId)
            .input('fullName', userData.fullName)
            .input('email', userData.email)
            .input('phoneNumber', userData.phonenumber)
            .input('dateOfBirth', userData.dateOfBirth)
            .execute('spUpdateUser');

        // Check if the row was updated
        if (result.rowsAffected[0] === 0) {
            return { message: `User ID ${userData.userId} not found`, status: 404 };
        }
        return { message: `User ID ${userData.userId} updated successfully!`, status: 200 };
    } catch (err) {
        return { message: err.message, status: 500 };
    }
};

module.exports.updateUser = updateUser;


// Check is user exist
async function isUserExist(userData) {
    try {
        const pool = await connectDb.connectionToSqlDB(); // Connect to DB

        // Execute update query for user ID 1
        const result = await pool.request()
            .input('email', userData.email)
            .execute('spIsUserExist');

        // Check if the row was updated
        if (!result.recordset || result.recordset.length === 0) {
            return { result: `User ${userData.email} not found`, status: 404 };
        }

        return { result: result.recordset[0], status: 200 };

    } catch (err) {
        console.console.log("Database Error:", err);
        // Log actual error for debugging
        return { result: "Internal Server Error", status: 500 };
    }

};
module.exports.isUserExist = isUserExist;

// Inserting users Data
async function insertingNewUser(userData) {
    try {
        const pool = await connectDb.connectionToSqlDB(); // Connect to DB

        const result = await pool.request()
            .input('fullName', userData.fullName)
            .input('userName', userData.userName)
            .input('email', userData.email)
            .input('phoneNumber', userData.phoneNumber)
            .input('dateOfBirth', userData.dateOfBirth)
            .input('password', userData.password)
            .execute('spInsertNewUser');
        console.log(result.message);

        // Assuming the stored procedure returns something meaningful in rowsAffected
        if (result.rowsAffected[0] === 0) {
            return { message: `User insertion failed`, status: 404 };
        }

        return { message: 'User inserted successfully!', status: 200 };
    } catch (err) {
        console.error('Error inserting user:', err); // Corrected the logging
        return { message: err.message, status: 400 };
    }
}

module.exports.insertingNewUser = insertingNewUser;

// Inserting users Data
async function deletingUser(userId) {
    console.log({ id: userId });

    try {
        const pool = await connectDb.connectionToSqlDB(); // Connect to DB

        // Execute update query for user ID 1
        const result = await pool.request()
            .query(`DELETE FROM Members WHERE id = ${userId}`);

        // Check if the row was updated

        if (result.rowsAffected[0] === 0) {
            return { message: `User ID ${userId} not found`, status: 404 };
        }
        return { message: 'User deleted successfully!', status: 200 };
    } catch (err) {
        console.log(err);

        //console.error('Error updating user:', err);
        return { message: err.message, status: 500 };
    }
};
module.exports.deletingUser = deletingUser;

// Contact from form
async function formContact(userData) {
    try {
        const pool = await connectDb.connectionToSqlDB(); // Connect to DB
        // Execute update query for user ID 1
        const result = await pool.request()
            .input('name', userData.name)
            .input('email', userData.email)
            .input('subject', userData.subject)
            .input('message', userData.message)
            .query(`INSERT INTO ContactForm (name, email, subject, message) VALUES (@name, @email, @subject, @message)`);

        // Check if the row was updated
        if (result.rowsAffected[0] === 0) {
            return { message: 'Contact canoot be sent ', status: 404 };
        }
        return { message: 'Contact sent successfully!', status: 200 };
    } catch (err) {
        //console.error('Error updating user:', err);
        return { message: err.message, status: 500 };
    }
};

module.exports.formContact = formContact;


// Getting plans Data
async function getAllPlansData() {

    try {
        const pool = await connectDb.connectionToSqlDB(); // Connect to DB
        const result = await pool.request().query('SELECT * FROM WorkoutPlans'); // Fetch all records
        console.log({ 'Data imported successfully': 200 });

        return { data: result.recordsets[0] };
    } catch (err) {
        //next(err);
        console.error('Error imported!:', err);
        return { message: err, status: 500 };

    }
};

module.exports.getAllPlansData = getAllPlansData;


// Getting users Data
async function getAllUsersData() {

    try {
        const pool = await connectDb.connectionToSqlDB(); // Connect to DB
        const result = await pool.request().query('SELECT * FROM Members'); // Fetch all records
        console.log({ 'Data imported successfully': 200 });

        return { data: result.recordsets[0] };
    } catch (err) {
        //next(err);
        return { message: err, status: 500 };

    }
};

module.exports.getAllUsersData = getAllUsersData;


// Sing Up new user
async function signUpNewUser(userData) {
    try {
        const pool = await connectDb.connectionToSqlDB(); // Connect to DB

        // Execute update query for user ID 1
        const result = await pool.request()
            .input('fullName', userData.fullName)
            .input('email', userData.email)
            .input('userName', userData.userName)
            .input('password', userData.password)
            .input('phoneNumber', userData.phoneNumber)
            .input('dateOfBirth', userData.dateOfBirth)
            .query(`INSERT INTO Members (fullName, email, userName, password, phoneNumber, dateOfBirth) VALUES (@fullName, @email, @userName, @password, @phoneNumber, @dateOfBirth)`);
        console.log(result);


        // Check if the row was updated
        if (result.rowsAffected[0] === 0) {
            return { status: 400 };
        }
        console.log(result);
        return { status: 200 };
    } catch (err) {
        console.log({ 'Error updating user': result });
        return { status: 500 };
    }
};

module.exports.signUpNewUser = signUpNewUser;