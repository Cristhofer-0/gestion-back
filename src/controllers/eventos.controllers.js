import Evento from '../models/Eventos/Evento.js';
import Order from '../models/Order/Order.js';
import Notification from '../models/Notificacion/Notificacion.js';

export const getEventos = async (req, res) => {
    try {
        const eventos = await Evento.findAll();
        const hoy = new Date();

        await Promise.all(
            eventos.map(async (evento) => {
                try {
                    const fechaFin = new Date(evento.EndDate);

                    if (!fechaFin || isNaN(fechaFin)) return;

                    if (fechaFin < hoy && evento.Status === 'published') {
                        evento.Status = 'draft';
                        await evento.save();
                    }
                } catch (innerError) {
                    console.error("Error al actualizar estado del evento:", innerError);
                }
            })
        );

        res.json(eventos);
    } catch (error) {
        console.error("Error general en getEventos:", error);
        res.status(500).json({ message: 'Error al obtener los eventos' });
    }
};



export const getEvento = async (req, res) => {
    const eventoId = req.params.id;
    if (isNaN(eventoId)) {
        return res.status(400).json({ message: 'EventoId inválido' });
    }

    try {
        const evento = await Evento.findByPk(eventoId);
        if (!evento) {
            return res.status(404).json({ message: 'Evento no encontrado' });
        }
        res.json(evento);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener el evento' });
    }
}

export const createEvento = async (req, res) => {
  try {
    // Convertir las fechas string a objetos Date si es necesario
    const eventoData = { ...req.body }

    if (eventoData.StartDate && typeof eventoData.StartDate === "string") {
      eventoData.StartDate = new Date(eventoData.StartDate)
    }

    if (eventoData.EndDate && typeof eventoData.EndDate === "string") {
      eventoData.EndDate = new Date(eventoData.EndDate)
    }

    const evento = await Evento.create(eventoData)
    res.status(201).json(evento)
  } catch (error) {
    console.error("Error al crear evento:", error)
    res.status(500).json({ message: "Error al crear el evento", error: error.message })
  }
}


export const updateEvento = async (req, res) => {
    const eventoId = req.params.id;

    try {
        console.log("Recibido en backend:", req.body) 

        const [updatedRows] = await Evento.update(req.body, {
            where: { EventId: eventoId },
        });

        if (updatedRows === 0) {
            return res.status(404).json({ message: 'Evento no encontrado o sin cambios' });
        }

        // 🔍 Obtener el evento actualizado
        const eventoActualizado = await Evento.findByPk(eventoId);

        // 🧾 Obtener todos los usuarios que tienen órdenes para este evento
        const orders = await Order.findAll({
            where: { EventId: eventoId },
            attributes: ['UserId'],
            group: ['UserId'], // Evita notificaciones duplicadas por usuario
        });

        // 🔔 Crear una notificación para cada usuario
        const notificaciones = orders.map(order => ({
            UserId: order.UserId,
            EventId: eventoId,
            Message: `El evento "${eventoActualizado.Title}" ha sido modificado. Revisa los cambios.`,
            IsRead: false,
        }));

        await Notification.bulkCreate(notificaciones);

        res.json({ message: 'Evento actualizado y notificaciones generadas' });
    } catch (error) {
        console.error("❌ Error al actualizar evento o generar notificaciones:", error);
        res.status(500).json({ message: 'Error al actualizar evento', error });
    }
};

export const deleteEvento = async (req, res) => {
    const eventoId = req.params.id;

    try {
        const deletedRows = await Evento.destroy({
            where: { EventId: eventoId },
        });

        if (deletedRows === 0) {
            return res.status(404).json({ message: 'Evento no encontrado' });
        }

        res.json({ message: 'Evento eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar el evento' });
    }
}

export const getEventosByOrganizador = async (req, res) => {
    const organizadorId = req.params.organizadorId;

    if (!organizadorId) {
        return res.status(400).json({ message: 'organizadorId es requerido' });
    }

    try {
        // Suponiendo que tu modelo tiene un campo OrganizerId o similar
        const eventos = await Evento.findAll({
            where: { OrganizerId: organizadorId }
        });

        res.json(eventos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los eventos del organizador' });
    }
};

