import jwt from 'jsonwebtoken';
import Ticket from '../models/Ticket/Ticket.js';
import Order from '../models/Order/Order.js';

const JWT_SECRET = process.env.JWT_SECRET;

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


export const crearOrderDelUsuario = async (req, res) => {
    try {
        // 🔒 Verifica que haya token en cookies
        const token = req.cookies?.tokenUsuario;
        if (!token) {
            return res.status(401).json({ message: 'No autorizado. Token no encontrado.' });
        }

        // 🔑 Verifica y decodifica el token
        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (err) {
            return res.status(401).json({ message: 'Token inválido o expirado.' });
        }

        const userId = decoded.userId;

        // 🧾 Extrae datos del body
        const { eventId, ticketId, quantity} = req.body;

        if (!eventId || !ticketId || !quantity) {
            return res.status(400).json({ message: 'Faltan datos obligatorios (eventId, ticketId o quantity).' });
        }

        // 🎫 Validación del ticket
        const ticket = await Ticket.findByPk(ticketId);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket no encontrado.' });
        }

        // 💰 Cálculo del precio
        const unitPrice = parseFloat(ticket.Price);

        const totalPrice = unitPrice * quantity;

        // 🧾 Crear la orden
        const nuevaOrden = await Order.create({
            UserId: userId,
            EventId: eventId,
            TicketId: ticketId,
            Quantity: quantity,
            TotalPrice: totalPrice.toFixed(2),
            PaymentStatus: 'pending',
            CouponCode:null,
            DiscountPercentage:null,
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


export const verEventosSeleccionados = async (req,res) =>{
    try {
        // 🔒 Verifica que haya token en cookies
        const token = req.cookies?.tokenUsuario;
        if (!token) {
            return res.status(401).json({ message: 'No autorizado. Token no encontrado.' });
        }

        // 🔑 Verifica y decodifica el token
        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (err) {
            return res.status(401).json({ message: 'Token inválido o expirado.' });
        }

        const userId = decoded.userId;

        // 📦 Buscar órdenes con estado pendiente
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
}

export const editarCantidadOrden = async (req, res) => {
    try {
        // 🔒 Verifica token
        const token = req.cookies?.tokenUsuario;
        if (!token) {
            return res.status(401).json({ message: 'No autorizado. Token no encontrado.' });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (err) {
            return res.status(401).json({ message: 'Token inválido o expirado.' });
        }

        const userId = decoded.userId;
        const { orderId, newQuantity } = req.body;

        if (!orderId || !newQuantity || newQuantity <= 0) {
            return res.status(400).json({ message: 'Se requiere orderId y newQuantity válida.' });
        }

        // 🔍 Buscar la orden
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

        // 💸 Obtener el precio del ticket
        const ticket = await Ticket.findByPk(orden.TicketId);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket asociado no encontrado.' });
        }

        const unitPrice = parseFloat(ticket.Price);
        const nuevoTotal = unitPrice * newQuantity;

        // ✏️ Actualizar la orden
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
