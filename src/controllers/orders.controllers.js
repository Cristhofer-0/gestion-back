import { getConnection } from "../database/connection.js"
import sql from 'mssql'

export const getOrders = async (req, res) => {
    const pool = await getConnection()

    const result = await pool.request().query("SELECT * FROM Orders")
    res.json(result.recordset)
}

export const getOrder = async (req, res) => {
    const orderId = req.params.id;

    try {
        const pool = await getConnection();
        const result = await pool
            .request()
            .input('OrderId', sql.Int, orderId)
            .query('SELECT * FROM Orders WHERE OrderId = @OrderId');

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Order no encontrado" });
        }

        res.json(result.recordset[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener el order" });
    }
}

export const createOrder = async (req, res)  => {
    const pool = await getConnection()

    const result = await pool
        .request()
        .input('UserId', sql.Int, req.body.UserId)
        .input('EventId', sql.Int, req.body.EventId)
        .input('TicketId', sql.Int, req.body.TicketId)
        .input('Quantity', sql.Int, req.body.Quantity)
        .input('TotalPrice', sql.Decimal, req.body.TotalPrice)
        .input('PaymentStatus', sql.Text, req.body.PaymentStatus)
        .input('CouponCode', sql.Text, req.body.CouponCode)
        .input('DiscountPercentage', sql.Decimal, req.body.DiscountPercentage)
        .input('OrderDate', sql.DateTime, req.body.OrderDate)
        .input('TicketPdfUrl', sql.Text, req.body.TicketPdfUrl)
        .input('QrCodeUrl', sql.Text, req.body.QrCodeUrl)
        .query('INSERT INTO Orders (UserId, EventId, TicketId, Quantity, TotalPrice, PaymentStatus,CouponCode, DiscountPercentage, OrderDate, TicketPdfUrl, QrCodeUrl) VALUES (@UserId, @EventId, @TicketId, @Quantity, @TotalPrice, @PaymentStatus,@CouponCode, @DiscountPercentage, @OrderDate, @TicketPdfUrl, @QrCodeUrl)');
    //console.log(result)
    res.json({
        UserId: req.body.UserId,
        EventId: req.body.EventId,
        TicketId: req.body.TicketId,
        Quantity: req.body.Quantity,
        TotalPrice: req.body.TotalPrice,
        PaymentStatus: req.body.PaymentStatus,
        CouponCode: req.body.CouponCode,
        DiscountPercentage: req.body.DiscountPercentage,
        OrderDate: req.body.OrderDate,
        TicketPdfUrl: req.body.TicketPdfUrl,
        QrCodeUrl: req.body.QrCodeUrl
    })
}

export const updateOrder = async (req, res) => {
    const orderId = req.params.id;
    const {
        UserId,
        EventId,
        TicketId,
        Quantity,
        TotalPrice,
        PaymentStatus,
        CouponCode,
        DiscountPercentage,
        OrderDate,
        TicketPdfUrl,
        QrCodeUrl
    } = req.body;

    try {
        const pool = await getConnection();
        await pool
            .request()
            .input('OrderId', sql.Int, orderId)
            .input('UserId', sql.Int, UserId)
            .input('EventId', sql.Int, EventId)
            .input('TicketId', sql.Int, TicketId)
            .input('Quantity', sql.Int, Quantity)
            .input('TotalPrice', sql.Decimal, TotalPrice)
            .input('PaymentStatus', sql.Text, PaymentStatus)
            .input('CouponCode', sql.Text, CouponCode)
            .input('DiscountPercentage', sql.Decimal, DiscountPercentage)
            .input('OrderDate', sql.DateTime, OrderDate)
            .input('TicketPdfUrl', sql.Text, TicketPdfUrl)
            .input('QrCodeUrl', sql.Text, QrCodeUrl)
            .query(`
                UPDATE Orders
                SET UserId = @UserId,
                    EventId = @EventId,
                    TicketId = @TicketId,
                    Quantity = @Quantity,
                    TotalPrice = @TotalPrice,
                    PaymentStatus = @PaymentStatus,
                    CouponCode = @CouponCode,
                    DiscountPercentage = @DiscountPercentage,
                    OrderDate = @OrderDate,
                    TicketPdfUrl = @TicketPdfUrl,
                    QrCodeUrl = @QrCodeUrl
                WHERE OrderId = @OrderId
            `);

        res.status(200).json({ message: "Order actualizado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al actualizar el order" });
    }

}

export const deleteOrder = async (req, res) => {
    const orderId = req.params.id;

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('OrderId', sql.Int, orderId)
            .query('DELETE FROM Orders WHERE OrderId = @OrderId');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "Ordero no encontrado" });
        }

        res.json({ message: "Ordero eliminado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al eliminar el Ordero" });
    }
}