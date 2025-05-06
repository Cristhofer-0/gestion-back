import Ticket from '../models/Ticket/Ticket.js';

export const getTickets = async (req, res) => {
    try {
        const tickets = await Ticket.findAll();
        res.json(tickets);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los tickets' });
    }
}

export const getTicket = async (req, res) => {
    const ticketId = req.params.id;
    if (isNaN(ticketId)) {
        return res.status(400).json({ message: 'TicketId inválido' });
    }

    try {
        const ticket = await Ticket.findByPk(ticketId);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket no encontrado' });
        }
        res.json(ticket);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener el ticket' });
    }
}

export const createTicket = async (req, res) => {
    try {
        const ticket = await Ticket.create(req.body);
        res.status(201).json(ticket);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear el ticket' });
    }
}

export const updateTicket = async (req, res) => {
    const ticketId = req.params.id;

    try {
        const [updatedRows] = await Ticket.update(req.body, {
            where: { TicketId: ticketId },
        });

        if (updatedRows === 0) {
            return res.status(404).json({ message: 'Ticket no encontrado o sin cambios' });
        }

        res.json({ message: 'Ticket actualizado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar el ticket' });
    }

}

export const deleteTicket = async (req, res) => {
    const ticketId = req.params.id;

    try {
        const deletedRows = await Ticket.destroy({
            where: { TicketId: ticketId },
        });

        if (deletedRows === 0) {
            return res.status(404).json({ message: 'Ticket no encontrado' });
        }

        res.json({ message: 'Ticket eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar el ticket' });
    }
}