import Ticket from './Ticket/Ticket.js';
import Event from './Eventos/Evento.js';
import User from './Usuario/Usuario.js';
import Review from './Revision/Review.js';
import Notification from './Notificacion/Notificacion.js';

Ticket.belongsTo(Event, { foreignKey: 'EventId' });

Notification.belongsTo(User, { foreignKey: 'UserId' });
User.hasMany(Notification, { foreignKey: 'UserId' });


Notification.belongsTo(Event, { foreignKey: 'EventId' });
Event.hasMany(Notification, { foreignKey: 'EventId' });
Review.belongsTo(User, { foreignKey: 'UserId' });
Event.hasMany(Ticket, { foreignKey: 'EventId' });
User.hasMany(Event, { foreignKey: 'OrganizerId' });

export { Ticket, Event , User, Review, Notification};