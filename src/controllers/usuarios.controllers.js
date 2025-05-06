import { getConnection } from "../database/connection.js"
import sql from 'mssql'

export const getUsuarios = async (req, res) => {
    const pool = await getConnection()

    const result = await pool.request().query("SELECT * FROM Users")
    res.json(result.recordset)
}

export const getUsuario = async (req, res) => {
    const userId = req.params.id;

    if (isNaN(userId)) {
        return res.status(400).json({ message: "UserId inválido" });
    }

    try {
        const pool = await getConnection();
        const result = await pool
            .request()
            .input('UserId', sql.Int, userId)
            .query('SELECT * FROM Users WHERE UserId = @UserId');

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.json(result.recordset[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener el usuario" });
    }
}

export const loginUsuario = async (req, res) => {
    // POST /login
    const { email, password } = req.body; //ASI DEBEN SER LOS PARAMETROS EN EL FORMULARIO


    try {
        const pool = await getConnection();
        const result = await pool
            .request()
            .input('Email', sql.NVarChar, email)
            .input('PasswordHash', sql.NVarChar, password)
            .query('SELECT * FROM Users WHERE Email = @Email AND PasswordHash = @PasswordHash');

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" + email  + password });	
        }

        res.json(result.recordset[0]);

    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener el usuario" });
    }
}

export const createUsuario = async (req, res) => {
    const pool = await getConnection()

    const result = await pool
        .request()
        .input('FullName', sql.Text, req.body.FullName)
        .input('BirthDate', sql.DateTime, req.body.BirthDate)
        .input('Phone', sql.Text, req.body.Phone)
        .input('DNI', sql.Text, req.body.DNI)
        .input('Email', sql.Text, req.body.Email)
        .input('PasswordHash', sql.Text, req.body.PasswordHash)
        .input('Role', sql.Text, req.body.Role)
        .input('VerifiedOrganizer', sql.Int, req.body.VerifiedOrganizer)
        .input('CreatedAt', sql.DateTime, req.body.CreatedAt)
        .input('UpdatedAt', sql.DateTime, req.body.UpdatedAt)
        .query('INSERT INTO Users (FullName, BirthDate, Phone, DNI,Email, PasswordHash, Role, VerifiedOrganizer, CreatedAt, UpdatedAt) VALUES (@FullName, @BirthDate, @Phone, @DNI,@Email, @PasswordHash, @Role, @VerifiedOrganizer, @CreatedAt, @UpdatedAt)');
    //console.log(result)
    res.json({
        FullName: req.body.FullName,
        BirthDate: req.body.BirthDate,
        Phone: req.body.Phone,
        DNI: req.body.DNI,
        Email: req.body.Email,
        PasswordHash: req.body.PasswordHash,
        Role: req.body.Role,
        VerifiedOrganizer: req.body.VerifiedOrganizer,
        CreatedAt: req.body.CreatedAt,
        UpdatedAt: req.body.UpdatedAt,
    })
}

export const updateUsuario = async (req, res) => {
    const userId = req.params.id;
    const {
        FullName,
        BirthDate,
        Phone,
        DNI,
        Email,
        PasswordHash,
        Role,
        VerifiedOrganizer,
        CreatedAt,
        UpdatedAt
    } = req.body;

    try {
        const pool = await getConnection();
        await pool
            .request()
            .input('UserId', sql.Int, userId)
            .input('FullName', sql.Text, FullName)
            .input('BirthDate', sql.DateTime, BirthDate)
            .input('Phone', sql.Text, Phone)
            .input('DNI', sql.Text, DNI)
            .input('Email', sql.Text, Email)
            .input('PasswordHash', sql.Text, PasswordHash)
            .input('Role', sql.Text, Role)
            .input('VerifiedOrganizer', sql.Int, VerifiedOrganizer)
            .input('CreatedAt', sql.DateTime, CreatedAt)
            .input('UpdatedAt', sql.DateTime, UpdatedAt)
            .query(`
                UPDATE Users
                SET FullName = @FullName,
                    BirthDate = @BirthDate,
                    Phone = @Phone,
                    DNI = @DNI,
                    Email = @Email,
                    PasswordHash = @PasswordHash,
                    Role = @Role,
                    VerifiedOrganizer = @VerifiedOrganizer,
                    CreatedAt = @CreatedAt,
                    UpdatedAt = @UpdatedAt
                WHERE UserId = @UserId
            `);

        res.status(200).json({ message: "Usuario actualizado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al actualizar el usuario" });
    }

}

export const deleteUsuario = async (req, res) => {
    const userId = req.params.id;

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('UserId', sql.Int, userId)
            .query('DELETE FROM Users WHERE UserId = @UserId');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al eliminar el usuario" });
    }
}