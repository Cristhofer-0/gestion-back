import { getConnection } from "../database/connection.js"
import sql from 'mssql'

export const getTickets = async (req, res) => {
    const pool = await getConnection()

    const result = await pool.request().query("SELECT * FROM Tickets")
    res.json(result.recordset)
}

export const getTicket = async (req, res) => {
    const ticketId = req.params.id;

    try {
        const pool = await getConnection();
        const result = await pool
            .request()
            .input('TicketId', sql.Int, ticketId)
            .query('SELECT * FROM Tickets WHERE TicketId = @TicketId');

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Ticket no encontrado" });
        }

        res.json(result.recordset[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener el ticket" });
    }
}

export const createTicket = async (req, res)  => {
    const pool = await getConnection()

    const result = await pool
        .request()
        .input('EventId', sql.Int, req.body.EventId)
        .input('Type', sql.Text, req.body.Type)
        .input('Price', sql.Decimal, req.body.Price)
        .input('Description', sql.Text, req.body.Description)
        .input('StockAvailable', sql.Int, req.body.StockAvailable)
        .input('CreatedAt', sql.DateTime, req.body.CreatedAt)
        .input('UpdatedAt', sql.DateTime, req.body.UpdatedAt)
        .query('INSERT INTO Tickets (EventId, Type, Price, Description, StockAvailable,CreatedAt, UpdatedAt) VALUES (@EventId, @Type, @Price, @Description, @StockAvailable,@CreatedAt, @UpdatedAt)');
    //console.log(result)
    res.json({
        EventId: req.body.EventId,
        Type: req.body.Type,
        Price: req.body.Price,
        Description: req.body.Descripcion,
        StockAvailable: req.body.StockAvailable,
        CreatedAt: req.body.CreatedAt,
        UpdatedAt: req.body.UpdatedAt
    })
}

export const updateTicket = async (req, res) => {
    const ticketId = req.params.id;
    const {
        EventId,
        Type,
        Price,
        Description,
        StockAvailable,
        CreatedAt,
        UpdatedAt
    } = req.body;

    try {
        const pool = await getConnection();
        await pool
            .request()
            .input('TicketId', sql.Int, ticketId)
            .input('EventId', sql.Int, EventId)
            .input('Type', sql.Text, Type)
            .input('Price', sql.Decimal, Price)
            .input('Description', sql.Text, Description)
            .input('StockAvailable', sql.Int, StockAvailable)
            .input('CreatedAt', sql.DateTime, CreatedAt)
            .input('UpdatedAt', sql.DateTime, UpdatedAt)
            .query(`
                UPDATE Tickets
                SET EventId = @EventId,
                    Type = @Type,
                    Price = @Price,
                    Description = @Description,
                    StockAvailable = @StockAvailable,
                    CreatedAt = @CreatedAt,
                    UpdatedAt = @UpdatedAt
                WHERE TicketId = @TicketId
            `);

        res.status(200).json({ message: "Ticket actualizado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al actualizar el ticket" });
    }

}

export const deleteTicket = async (req, res) => {
    const ticketId = req.params.id;

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('TicketId', sql.Int, ticketId)
            .query('DELETE FROM Tickets WHERE TicketId = @TicketId');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "Ticket no encontrado" });
        }

        res.json({ message: "Ticket eliminado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al eliminar el ticket" });
    }
}