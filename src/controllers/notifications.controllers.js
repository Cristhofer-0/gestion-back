//import { getConnection } from "../database/connection.js";
import sql from 'mssql'

export const getNotificaciones = async (req, res) => {
    try {
        const pool = await getConnection()

        const result = await pool.request().query("SELECT * FROM Notifications")
        res.status(200).json(result.recordset)
    } catch (error) {
        console.error("Error al obtener las notificaciones:", error)
        res.status(500).json({ message: "Error al obtener las notificaciones" })
    }
}

export const getNotificacion = async (req, res) => {
    const notificationId = req.params.id;

    try {
        const pool = await getConnection();
        const result = await pool
            .request()
            .input('NotificationId', sql.Int, notificationId)
            .query('SELECT * FROM Notifications WHERE NotificationId = @NotificationId');

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Notificacion no encontrada" });
        }

        res.json(result.recordset[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener la notificacion" });
    }
}

export const createNotificacion = async (req, res)  => {
    try {
        const pool = await getConnection()

        const result = await pool
            .request()
            .input('UserId', sql.Int, req.body.UserId)
            .input('Type', sql.NVarChar(50), req.body.Type)
            .input('Message', sql.Text, req.body.Message)
            .input('ReadStatus', sql.Bit, req.body.ReadStatus)
            .query(`
                INSERT INTO Notifications (UserId, Type,Message,ReadStatus)
                VALUES (@UserId, @Type,@Message,@ReadStatus)
            `);

        res.status(201).json({
            UserId: req.body.UserId,
            Type: req.body.Type,
            Message: req.body.Message,
            ReadStatus: req.body.ReadStatus,
        });
    } catch (error) {
        console.error("Error al crear la nueva notificacion:", error);
        res.status(500).json({ message: "Error al crear la nueva notificacion" });
    }
}

export const updateNotificacion = async (req, res) => {
    const notificationId = req.params.id;
    const {
        UserId,
        Type,
        Message,
        ReadStatus,
    } = req.body;

    try {
        const pool = await getConnection();
        await pool
            .request()
            .input('NotificationId', sql.Int, notificationId)
            .input('UserId', sql.Int, UserId)
            .input('Type', sql.NVarChar(50), Type)
            .input('Message', sql.Text, Message)
            .input('ReadStatus', sql.Bit, ReadStatus)
            .query(`
                UPDATE Notifications
                SET UserId = @UserId,
                    Type = @Type,
                    Message = @Message,
                    ReadStatus = @ReadStatus
                WHERE NotificationId = @NotificationId
            `);

        res.status(200).json({ message: "Notificacion actualizada correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al actualizar la notificacion" });
    }
}

export const deleteNotificacion = async (req, res) => {
    const notificationId = req.params.id;

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('NotificationId', sql.Int, notificationId)
            .query('DELETE FROM Notifications WHERE NotificationId = @NotificationId');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "Notificacion no encontrada" });
        }

        res.json({ message: "Notificacion eliminada correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al eliminar la notificacion" });
    }
}