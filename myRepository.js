
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
module.exports = { connectionToSqlDB };





// async function getPayMethod(methodPay) {
//     try {
//         let pool = await sql.connect(config);
//         let result = await pool.request()
//             .input('MathodPay', sql.VarChar(50), methodPay)
//             .execute('spMethodPayByInput');

//         console.log(result.recordset);
//         return result.recordset;
//     } catch (err) {
//         console.log(err);
//         throw err;
//     } finally {
//         sql.close();
//     }
// }
// module.exports.getPayMethod = getPayMethod;