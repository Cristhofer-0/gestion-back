import Ticket from '../models/Ticket/Ticket.js';
import Order from '../models/Order/Order.js';

export const getOrders = async (req, res) => {
    try {
        const orders = await Order.findAll();
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los orders' });
    }
}

export const getOrder = async (req, res) => {
    const orderId = req.params.id;
    if (isNaN(orderId)) {
        return res.status(400).json({ message: 'OrderId inválido' });
    }

    try {
        const order = await Order.findByPk(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Orden no encontrado' });
        }
        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener la orden' });
    }
}

export const createOrder = async (req, res) => {
    try {
        const order = await Order.create(req.body);
        res.status(201).json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear la orden' });
    }
}

export const updateOrder = async (req, res) => {
    const orderId = req.params.id;

    try {
        const [updatedRows] = await Order.update(req.body, {
            where: { OrderId: orderId },
        });

        if (updatedRows === 0) {
            return res.status(404).json({ message: 'Orden no encontrado o sin cambios' });
        }

        res.json({ message: 'Orden actualizado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar la orden' });
    }

}

export const deleteOrder = async (req, res) => {
    const orderId = req.params.id;

    try {
        const deletedRows = await Order.destroy({
            where: { OrderId: orderId },
        });

        if (deletedRows === 0) {
            return res.status(404).json({ message: 'Orden no encontrado' });
        }

        res.json({ message: 'Orden eliminada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar la orden' });
    }
}

//ELIMINAR DEL CARRITO EL PRODUCTO
export const eliminarDelCarrito = async (req, res) => {
    try {
        const userId = req.user.userId;  // viene del middleware
        const { eventoId } = req.body;

        const deletedRows = await Order.destroy({
            where: {
                UserId: userId,
                EventId: eventoId,
                PaymentStatus: "pending",
            },
        });

        if (deletedRows === 0) {
            return res.status(404).json({ message: 'Producto no encontrado en carrito' });
        }

        res.json({ message: 'Producto eliminado del carrito correctamente' });
    } catch (error) {
        console.error("Este es el error: " + error);
        res.status(500).json({ message: 'Error al eliminar del carrito' });
    }
};
//AGREGAR EL PRODUCTO AL CARRITO
export const crearOrderDelUsuario = async (req, res) => {
    try {
        const userId = req.user.userId; // viene del middleware

        const { eventId, ticketId, quantity } = req.body;

        if (!eventId || !ticketId || !quantity) {
            return res.status(400).json({ message: 'Faltan datos obligatorios (eventId, ticketId o quantity).' });
        }

        const ticket = await Ticket.findByPk(ticketId);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket no encontrado.' });
        }

        const unitPrice = parseFloat(ticket.Price);
        const totalPrice = unitPrice * quantity;

        const nuevaOrden = await Order.create({
            UserId: userId,
            EventId: eventId,
            TicketId: ticketId,
            Quantity: quantity,
            TotalPrice: totalPrice.toFixed(2),
            PaymentStatus: 'pending',
            CouponCode: null,
            DiscountPercentage: null,
            TicketPdfUrl: null,
            QrCodeUrl: null
        });

        res.status(201).json({
            message: 'Orden creada exitosamente',
            order: nuevaOrden
        });

    } catch (error) {
        console.error("Error al crear la orden:", error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

//HISTORIAL COMPRAS
export const historialCompras = async (req, res) => {
    try {
        const userId = req.user.userId; // viene del middleware

        const ordenesPagadas = await Order.findAll({
            where: {
                UserId: userId,
                PaymentStatus: 'paid'
            }
        });

        res.status(200).json({
            message: 'Órdenes pagadas encontradas',
            ordenes: ordenesPagadas
        });

    } catch (error) {
        console.error("Error al obtener órdenes pagadas:", error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Ver eventos seleccionados (carrito)
export const verEventosSeleccionados = async (req, res) => {
    try {
        const userId = req.user.userId; // viene del middleware

        const ordenesPendientes = await Order.findAll({
            where: {
                UserId: userId,
                PaymentStatus: 'pending'
            }
        });

        res.status(200).json({
            message: 'Órdenes pendientes encontradas',
            ordenes: ordenesPendientes
        });

    } catch (error) {
        console.error("Error al obtener órdenes pendientes:", error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

//EDITAR CANTIDAD DE LOS BOLETOS
export const editarCantidadOrden = async (req, res) => {
    try {
        const userId = req.user.userId; // viene del middleware
        const { orderId, newQuantity } = req.body;

        if (!orderId || !newQuantity || newQuantity <= 0) {
            return res.status(400).json({ message: 'Se requiere orderId y newQuantity válida.' });
        }

        const orden = await Order.findOne({
            where: {
                OrderId: orderId,
                UserId: userId,
                PaymentStatus: 'pending'
            }
        });

        if (!orden) {
            return res.status(404).json({ message: 'Orden no encontrada o no editable.' });
        }

        const ticket = await Ticket.findByPk(orden.TicketId);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket asociado no encontrado.' });
        }

        const unitPrice = parseFloat(ticket.Price);
        const nuevoTotal = unitPrice * newQuantity;

        orden.Quantity = newQuantity;
        orden.TotalPrice = nuevoTotal.toFixed(2);
        await orden.save();

        res.status(200).json({
            message: 'Orden actualizada exitosamente',
            order: orden
        });

    } catch (error) {
        console.error("Error al editar la orden:", error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};