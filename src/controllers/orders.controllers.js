import Ticket from '../models/Ticket/Ticket.js';
import Order from '../models/Order/Order.js';
import Event from '../models/Eventos/Evento.js';

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

//AGREGAR AL CARRITO
export const crearOrdenCompleta = async (req, res) => {
    try {
        const userId = req.user.userId; // viene del middleware
        const { eventId, tickets } = req.body;

        if (!eventId || !tickets || tickets.length === 0) {
            return res.status(400).json({
                message: 'Faltan datos obligatorios (eventId o tickets).'
            });
        }

        const ordenesCreadas = [];

        for (const ticket of tickets) {
            if (ticket.cantidad > 0) {
                const totalPrice = (parseFloat(ticket.precioUnitario) * ticket.cantidad).toFixed(2);

                const nuevaOrden = await Order.create({
                    UserId: userId,
                    EventId: eventId,
                    TicketId: ticket.ticketId,
                    Quantity: ticket.cantidad,
                    TotalPrice: totalPrice,
                    PaymentStatus: 'pending', // 👈 siempre como pendiente
                    CouponCode: null,
                    DiscountPercentage: null,
                    TicketPdfUrl: null,
                    QrCodeUrl: null
                });

                ordenesCreadas.push(nuevaOrden);
            }
        }

        if (ordenesCreadas.length === 0) {
            return res.status(400).json({
                message: 'No se crearon órdenes porque no había tickets válidos.'
            });
        }

        res.status(201).json({
            message: 'Órdenes creadas exitosamente',
            ordenes: ordenesCreadas
        });

    } catch (error) {
        console.error("Error al crear la orden completa:", error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

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

//HISTORIAL COMPRAS
export const historialCompras = async (req, res) => {
    try {
        const userId = req.user.userId; // viene del middleware

        if (!userId) {
            return res.status(400).json({
                message: 'Falta el ID de usuario.'
            });
        }

        // Busca las órdenes pagadas e incluye la info de Event y Ticket
        const ordenesPagadas = await Order.findAll({
            where: {
                UserId: userId,
                PaymentStatus: 'paid'
            },
            include: [
                {
                    model: Event,
                    attributes: ['EventId', 'Title', 'Description', 'BannerUrl']
                },
                {
                    model: Ticket,
                    attributes: ['Price', 'Type']
                }
            ],
            attributes: ['OrderId', 'Quantity', 'TotalPrice', 'OrderDate']
        });

        if (!ordenesPagadas || ordenesPagadas.length === 0) {
            return res.status(404).json({
                message: 'No se encontraron órdenes pagadas.'
            });
        }

        // Mapea la respuesta a la estructura que necesitas
        const mappedOrdenes = ordenesPagadas.map(order => ({
            id: order.OrderId,
            title: order.Event.Title,
            description: order.Event.Description,
            image: order.Event.BannerUrl || '/placeholder.svg?height=400&width=600',
            quantity: order.Quantity,
            price: Number(order.Ticket.Price),
            totalPrice:Number(order.TotalPrice),
            type: order.Ticket.Type,
            date: order.OrderDate ? order.OrderDate.toISOString() : null
        }));

        res.status(200).json({
            message: 'Órdenes pagadas encontradas',
            
            ordenes: mappedOrdenes
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


        // Busca las órdenes pendientes e incluye la info de Event y Ticket
        const ordenesPendientes = await Order.findAll({
            where: {
                UserId: userId,
                PaymentStatus: 'pending'
            },
            include: [
                {
                    model: Event,
                    attributes: ['EventId', 'Title', 'Description', 'BannerUrl']
                },
                {
                    model: Ticket,
                    attributes: ['Price', 'Type']
                }
            ],
            attributes: ['OrderId', 'Quantity', 'TotalPrice']
        });

        // Mapea la respuesta para que tenga la estructura deseada
        const mappedOrdenes = ordenesPendientes.map(order => ({
            id: order.OrderId,
            title: order.Event.Title,
            description: order.Event.Description,
            image: order.Event.BannerUrl || '/placeholder.svg?height=400&width=600',
            quantity: order.Quantity,
            price: Number(order.Ticket.Price),
            type: order.Ticket.Type
        }));

        res.status(200).json({
            message: 'Órdenes pendientes encontradas',
            ordenes: mappedOrdenes
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