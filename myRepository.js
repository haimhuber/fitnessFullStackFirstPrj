
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
            .input('phoneNumber', userData.phoneNumber)
            .input('dateOfBirth', userData.dateOfBirth)
            .query(`UPDATE Members 
                    SET fullName = @fullName, 
                        email = @email, 
                        phoneNumber = @phoneNumber, 
                        dateOfBirth = @dateOfBirth
                        WHERE id = ${userData.userId}`);

        // Check if the row was updated
        if (result.rowsAffected[0] === 0) {
            return { message: 'User ID 1 not found', status: 404 };
        }
        return { message: 'User ID 1 updated successfully!', status: 200 };
    } catch (err) {
        console.error('Error updating user:', err);
        return { message: err, status: 500 };
    }
};

module.exports.updateUser = updateUser;


// Getting users Data
async function getUsersData(userData) {
    try {
        const pool = await connectionToSqlDB(); // Connect to DB

        // Execute update query for user ID 1
        const result = await pool.request()
        await pool.request()
            .input('fullName', userData.fullName)
            .input('email', userData.email)
            .input('phonenumber', userData.phonenumber)
            .input('dateOfBirth', userData.dateOfBirth)
            .query(`INSERT INTO Members (fullName, email, phonenumber, dateOfBirth) VALUES (@fullName, @email, @phonenumber, @dateOfBirth)`);


        // Check if the row was updated
        if (result.rowsAffected[0] === 0) {
            return { message: 'User cannot be updated! please check all necceries fields', status: 404 };
        }

        return { message: 'User inserted!', status: 200 };
    } catch (err) {
        //next(err);
        console.error('Error updating user:', err);
        return { message: err, status: 500 };

    }
};

module.exports.getUsersData = getUsersData;
