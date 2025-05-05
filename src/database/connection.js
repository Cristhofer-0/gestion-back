import sql from 'mssql'
import dotenv from 'dotenv';
dotenv.config()

const dbSettings = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_HOST,
    database: process.env.DB_NAME,
    options: {
        encrypt: process.env.DB_ENCRYPT === 'true',
        trustServerCertificate: process.env.DB_TRUST_CERT === 'true',
    }
}

export const getConnection = async() =>{
    try {
        const pool = await sql.connect(dbSettings)
        
        //const result = await pool.request().query("SELECT * FROM Events")
        //console.log('DB_HOST:', process.env.DB_HOST)
        return pool
    } catch (error) {
        console.error(error)
    }
}