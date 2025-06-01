import Evento from '../models/Eventos/Evento.js';

export const getEventos = async (req, res) => {
    try {
        const eventos = await Evento.findAll();
        res.json(eventos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los eventos' });
    }
}

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
        const evento = await Evento.create(req.body);
        res.status(201).json(evento);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear el evento' });
    }
}

export const updateEvento = async (req, res) => {
    const eventoId = req.params.id;

    try {
        const [updatedRows] = await Evento.update(req.body, {
            where: { EventId: eventoId },
        });

        if (updatedRows === 0) {
            return res.status(404).json({ message: 'Evento no encontrado o sin cambios' });
        }

        res.json({ message: 'Evento actualizado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar el evento' });
    }
}

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

