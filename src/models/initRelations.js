import Ticket from './Ticket/Ticket.js';
import Event from './Eventos/Evento.js';
import User from './Usuario/Usuario.js';

Ticket.belongsTo(Event, { foreignKey: 'EventId' });
Event.hasMany(Ticket, { foreignKey: 'EventId' });
User.hasMany(Event, { foreignKey: 'OrganizerId' });

export { Ticket, Event , User};