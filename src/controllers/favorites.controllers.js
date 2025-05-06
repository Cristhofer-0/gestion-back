//import { getConnection } from "../database/connection.js";
import sql from 'mssql'

export const getFavoritos = async (req, res) => {
    try {
        const pool = await getConnection()

        const result = await pool.request().query("SELECT * FROM Favorites")
        res.status(200).json(result.recordset)
    } catch (error) {
        console.error("Error al obtener los favoritos:", error)
        res.status(500).json({ message: "Error al obtener los favoritos" })
    }
}

export const getFavorito = async (req, res) => {
    const favoriteId = req.params.id;

    try {
        const pool = await getConnection();
        const result = await pool
            .request()
            .input('FavoriteId', sql.Int, favoriteId)
            .query('SELECT * FROM Favorites WHERE FavoriteId = @FavoriteId');

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Favorito no encontrado" });
        }

        res.json(result.recordset[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener el favorito" });
    }
}

export const createFavorito = async (req, res)  => {
    try {
        const pool = await getConnection()

        const result = await pool
            .request()
            .input('UserId', sql.Int, req.body.UserId)
            .input('EventId', sql.Int, req.body.EventId)
            .query(`
                INSERT INTO Favorites (UserId, EventId)
                VALUES (@UserId, @EventId)
            `);

        res.status(201).json({
            UserId: req.body.UserId,
            EventId: req.body.EventId
        });
    } catch (error) {
        console.error("Error al crear el nuevo favorito:", error);
        res.status(500).json({ message: "Error al crear el nuevo favorito" });
    }
}

export const updateFavorito = async (req, res) => {
    const favoriteId = req.params.id;
    const {
        UserId,
        EventId,
    } = req.body;

    try {
        const pool = await getConnection();
        await pool
            .request()
            .input('FavoriteId', sql.Int, favoriteId)
            .input('UserId', sql.Int,UserId)
            .input('EventId', sql.Int,EventId)
            .query(`
                UPDATE Favorites
                SET UserId = @UserId,
                    EventId = @EventId
                WHERE FavoriteId = @FavoriteId
            `);

        res.status(200).json({ message: "Favorito actualizado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al actualizar el favorito" });
    }
}

export const deleteFavorito = async (req, res) => {
    const favoriteId = req.params.id;

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('FavoriteId', sql.Int, favoriteId)
            .query('DELETE FROM Favorites WHERE FavoriteId = @FavoriteId');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "Favorito no encontrado" });
        }

        res.json({ message: "Favorito eliminado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al eliminar el Favorito" });
    }
}