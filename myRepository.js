
const sql = require('mssql');

const config = {
    user: 'sa10',
    password: '1234',
    server: 'localhost',
    database: 'FitnessClubDB',
    options: {
        encrypt: false, // for azure change to true
        trustServerCertificate: true // change to false for production
    }
};

async function connectionToSqlDB() {
    try {
        let pool = await sql.connect(config);
        console.log('Connected to SQL Server');
        return pool;
    } catch (err) {
        console.error('Database connection failed:', err);
        throw err;
    }
}

module.exports.connectionToSqlDB = connectionToSqlDB;



async function updateUser(userData) {
    try {
        const pool = await connectionToSqlDB(); // Connect to DB

        // Execute update query for user ID 1
        const result = await pool.request()
            .input('fullName', userData.fullName)
            .input('email', userData.email)
            .input('phoneNumber', userData.phonenumber)
            .input('dateOfBirth', userData.dateOfBirth)
            .query(`UPDATE Members 
                    SET fullName = @fullName, 
                        email = @email, 
                        phoneNumber = @phoneNumber, 
                        dateOfBirth = @dateOfBirth
                        WHERE id = ${userData.userId}`);

        // Check if the row was updated
        if (result.rowsAffected[0] === 0) {
            return { message: `User ID ${userData.userId} not found`, status: 404 };
        }
        return { message: `User ID ${userData.userId} updated successfully!`, status: 200 };
    } catch (err) {
        return { 'Error updating user': err['message'], status: 500 };
    }
};

module.exports.updateUser = updateUser;


// Inserting users Data
async function insertingNewUser(userData) {

    try {
        const pool = await connectionToSqlDB(); // Connect to DB

        // Execute update query for user ID 1
        const result = await pool.request()
            .input('fullName', userData.fullName)
            .input('email', userData.email)
            .input('phoneNumber', userData.phoneNumber)
            .input('dateOfBirth', userData.dateOfBirth)
            .query(`INSERT INTO Members (fullName, email, phonenumber, dateOfBirth) VALUES (@fullName, @email, @phonenumber, @dateOfBirth)`);

        // Check if the row was updated
        if (result.rowsAffected[0] === 0) {
            return { message: `User ID ${userData.userId} not found`, status: 404 };
        }
        return { message: 'User inserted successfully!', status: 200 };
    } catch (err) {
        //console.error('Error updating user:', err);
        return { message: err.message, status: 500 };
    }
};

module.exports.insertingNewUser = insertingNewUser;

// Inserting users Data
async function deletingUser(userId) {
    console.log(userId);

    try {
        const pool = await connectionToSqlDB(); // Connect to DB

        // Execute update query for user ID 1
        const result = await pool.request()
            .query(`DELETE FROM Members WHERE id = ${userId}`);

        // Check if the row was updated
        if (result.rowsAffected[0] === 0) {
            return { message: `User ID ${userId} not found`, status: 404 };
        }
        return { message: 'User deleted successfully!', status: 200 };
    } catch (err) {
        //console.error('Error updating user:', err);
        return { message: err.message, status: 500 };
    }
};
module.exports.deletingUser = deletingUser;

// Contact from form
async function formContact(userData) {
    try {
        const pool = await connectionToSqlDB(); // Connect to DB
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
        const pool = await connectionToSqlDB(); // Connect to DB
        const result = await pool.request().query('SELECT * FROM WorkoutPlans'); // Fetch all records
        console.log({ 'Data imported successfully': 200 });

        return { data: result.recordsets[0] };
    } catch (err) {
        //next(err);
        console.error('Error imported successfully!:', err);
        return { message: err, status: 500 };

    }
};

module.exports.getAllPlansData = getAllPlansData;


// Getting users Data
async function getAllUsersData() {

    try {
        const pool = await connectionToSqlDB(); // Connect to DB
        const result = await pool.request().query('SELECT * FROM Members'); // Fetch all records
        console.log({ 'Data imported successfully': 200 });

        return { data: result.recordsets[0] };
    } catch (err) {
        //next(err);
        console.error('Error imported successfully!:', err);
        return { message: err, status: 500 };

    }
};

module.exports.getAllUsersData = getAllUsersData;


// Sing Up new user
async function signUpNewUser(userData) {
    try {
        const pool = await connectionToSqlDB(); // Connect to DB

        // Execute update query for user ID 1
        const result = await pool.request()
            .input('fullName', userData.fullName)
            .input('email', userData.email)
            .input('userName', userData.userName)
            .input('password', userData.password)
            .input('phoneNumber', userData.phoneNumber)
            .input('dateOfBirth', userData.dateOfBirth)
            .query(`INSERT INTO Members (fullName, email, userName, password, phoneNumber, dateOfBirth) VALUES (@fullName, @email, @userName, @password, @phoneNumber, @dateOfBirth)`);

        // Check if the row was updated
        if (result.rowsAffected[0] === 0) {
            return { message: "Can't add user info - Check DB", status: 404 };
        }
        return { message: `User login details insreted correctly`, status: 200 };
    } catch (err) {
        return { status: 500 };
    }
};

module.exports.signUpNewUser = signUpNewUser;