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


export const crearOrderDelUsuario = async (req, res) => {
    try {

        const { userId, eventId, ticketId, quantity } = req.body;

        // Validación básica
        if (!userId || !eventId || !ticketId || !quantity) {
            return res.status(400).json({ message: 'Faltan datos obligatorios.' });
        }

        const ticket = await Ticket.findByPk(ticketId);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket no encontrado.' });
        }

        const unitPrice = parseFloat(ticket.Price);
        const totalPrice = unitPrice * quantity;

        // Crear la orden
        const nuevaOrden = await Order.create({
            UserId: userId,
            EventId: eventId,
            TicketId: ticketId,
            Quantity: quantity,
            TotalPrice: totalPrice.toFixed(2),
            PaymentStatus: 'pending'
        });


        res.status(201).json({
            message: 'Orden creada exitosamente',
            order: nuevaOrden
        });
    }
    catch (error) {
        console.error("Errror al crear la orden", error)
        res.status(500).json({ message: 'Error interno del servidor' })
    }

}