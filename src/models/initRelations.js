import Ticket from './Ticket/Ticket.js';
import Event from './Eventos/Evento.js';
import User from './Usuario/Usuario.js';
import Review from './Revision/Review.js';

Ticket.belongsTo(Event, { foreignKey: 'EventId' });
Review.belongsTo(User, { foreignKey: 'UserId' });
Event.hasMany(Ticket, { foreignKey: 'EventId' });
User.hasMany(Event, { foreignKey: 'OrganizerId' });

export { Ticket, Event , User, Review};