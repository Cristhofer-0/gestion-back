import Notificacion from '../models/Notificacion/Notificacion.js';
import Order from '../models/Order/Order.js';

export const getNotificaciones = async (req, res) => {
    try {
        const notificaciones = await Notificacion.findAll();
        res.json(notificaciones);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los notificaciones' });
    }
}

export const getNotificacion = async (req, res) => {
    const notificacionId = req.params.id;
    if (isNaN(notificacionId)) {
        return res.status(400).json({ message: 'NotificacionId inválido' });
    }

    try {
        const notificacion = await Notificacion.findByPk(notificacionId);
        if (!notificacion) {
            return res.status(404).json({ message: 'Notificación no encontrada' });
        }
        res.json(notificacion);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener la notificación' });
    }
}

export const createNotificacion = async (req, res) => {
    const { EventId, Message } = req.body;

    if (!EventId || !Message) {
        return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    try {
        // 🔍 1. Buscar todos los compradores de entradas pagadas para ese evento
        const compradores = await Order.findAll({
            where: {
                EventId,
                PaymentStatus: 'paid'
            },
            attributes: ['UserId'],
            group: ['UserId']
        });

        if (compradores.length === 0) {
            return res.status(404).json({ message: "No hay compradores para este evento" });
        }

        // 📦 2. Crear notificación para cada comprador
        const notificacionesCreadas = [];

        for (const { UserId } of compradores) {
            const noti = await Notificacion.create({
                UserId,
                EventId,
                Message,
                IsRead: false
            });

            notificacionesCreadas.push(noti);

            // 📡 3. Enviar por socket solo a ese usuario
            global.io.to(String(UserId)).emit("nuevaNotificacion", noti);
        }

        res.status(201).json({
            message: "Notificaciones creadas correctamente",
            notificaciones: notificacionesCreadas
        });
    } catch (error) {
        console.error("❌ Error al crear la notificación:", error);
        res.status(500).json({ message: 'Error al crear la notificación' });
    }
};


export const updateNotificacion = async (req, res) => {
    const notificacionId = req.params.id;

    try {
        const [updatedRows] = await Notificacion.update(req.body, {
            where: { NotificationId: notificacionId },
        });

        if (updatedRows === 0) {
            return res.status(404).json({ message: 'Notificación no encontrada o sin cambios' });
        }

        res.json({ message: 'Notificación actualizada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar la notificación' });
    }
}

export const deleteNotificacion = async (req, res) => {
    const notificacionId = req.params.id;

    try {
        const deletedRows = await Notificacion.destroy({
            where: { NotificationId: notificacionId },
        });

        if (deletedRows === 0) {
            return res.status(404).json({ message: 'Notificación no encontrada' });
        }

        res.json({ message: 'Notificación eliminada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar la notificación' });
    }
}

export const getNotificacionesPorUsuario = async (req, res) => {
    const userId = req.params.userId;

    if (isNaN(userId)) {
        return res.status(400).json({ message: 'UserId inválido' });
    }

    try {
        const notificaciones = await Notificacion.findAll({
            where: { UserId: userId },
            order: [['NotificationId', 'DESC']]
        });

        res.json(notificaciones);
    } catch (error) {
        console.error("❌ Error al obtener notificaciones por usuario:", error);
        res.status(500).json({ message: 'Error al obtener notificaciones del usuario' });
    }
};

export const marcarNotificacionComoLeida = async (req, res) => {
    const id = req.params.id;
    try {
        const [updated] = await Notificacion.update( // ✅ CORRECTO
            { IsRead: true },
            { where: { NotificationId: id } }
        );
        if (updated === 0) {
            return res.status(404).json({ message: "Notificación no encontrada" });
        }
        res.json({ message: "Notificación marcada como leída" });
    } catch (error) {
        console.error("❌ Error al marcar notificación como leída:", error);
        res.status(500).json({ message: "Error interno" });
    }
};

export const marcarTodasNotificacionesComoLeidas = async (req, res) => {
  const userId = req.params.userId;
  console.log("🧪 Backend: marcando todas como leídas para UserId:", userId);

  try {
    const [updatedCount] = await Notificacion.update(
      { IsRead: true },
      { where: { UserId: userId } }
    );

    console.log("✅ Filas actualizadas:", updatedCount);

    if (updatedCount === 0) {
      return res.status(404).json({ message: "No se actualizaron notificaciones" });
    }

    res.json({ message: "Todas las notificaciones marcadas como leídas", updated: updatedCount });
  } catch (error) {
    console.error("❌ Error al marcar todas como leídas:", error);
    res.status(500).json({ message: "Error interno" });
  }
};
