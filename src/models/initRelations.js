import Ticket from './Ticket/Ticket.js';
import Event from './Eventos/Evento.js';

Ticket.belongsTo(Event, { foreignKey: 'EventId' });
Event.hasMany(Ticket, { foreignKey: 'EventId' });

export { Ticket, Event };