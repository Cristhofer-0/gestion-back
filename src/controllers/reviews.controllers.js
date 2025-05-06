//import { getConnection } from "../database/connection.js"
import sql from 'mssql'

export const getReviews = async (req, res) => {
    const pool = await getConnection()

    const result = await pool.request().query("SELECT * FROM Reviews")
    res.json(result.recordset)
}

export const getReview = async (req, res) => {
    const reviewId = req.params.id;

    try {
        const pool = await getConnection();
        const result = await pool
            .request()
            .input('ReviewId', sql.Int, reviewId)
            .query('SELECT * FROM Reviews WHERE ReviewId = @ReviewId');

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Review no encontrado" });
        }

        res.json(result.recordset[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener el Review" });
    }
}

export const createReview = async (req, res)  => {
    const pool = await getConnection()

    const result = await pool
        .request()
        .input('EventId', sql.Int, req.body.EventId)
        .input('UserId', sql.Int, req.body.UserId)
        .input('Rating', sql.Int, req.body.Rating)
        .input('Comment', sql.Text, req.body.Comment)
        .input('CreatedAt', sql.DateTime, req.body.CreatedAt)
        .query('INSERT INTO Reviews (EventId, UserId, Rating, Comment, CreatedAt) VALUES (@EventId, @UserId, @Rating, @Comment, @CreatedAt)');
    //console.log(result)
    res.json({
        EventId: req.body.EventId,
        UserId: req.body.UserId,
        Rating: req.body.Rating,
        Comment: req.body.Comment,
        CreatedAt: req.body.CreatedAt
    })
}

export const updateReview = async (req, res) => {
    const reviewId = req.params.id;
    const {
        EventId,
        UserId,
        Rating,
        Comment,
        CreatedAt
    } = req.body;

    try {
        const pool = await getConnection();
        await pool
            .request()
            .input('ReviewId', sql.Int, reviewId)
            .input('EventId', sql.Int, EventId)
            .input('UserId', sql.Int, UserId)
            .input('Rating', sql.Int, Rating)
            .input('Comment', sql.Text, Comment)
            .input('CreatedAt', sql.DateTime, CreatedAt)
            .query(`
                UPDATE Reviews
                SET EventId = @EventId,
                    UserId = @UserId,
                    Rating = @Rating,
                    Comment = @Comment,
                    CreatedAt = @CreatedAt
                WHERE ReviewId = @ReviewId
            `);

        res.status(200).json({ message: "Review actualizado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al actualizar el Review" });
    }

}

export const deleteReview = async (req, res) => {
    const reviewId = req.params.id;

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('ReviewId', sql.Int, reviewId)
            .query('DELETE FROM Reviews WHERE ReviewId = @ReviewId');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "Review no encontrado" });
        }

        res.json({ message: "Review eliminado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al eliminar el Review" });
    }
}