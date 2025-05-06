import { DataTypes } from 'sequelize';
import sequelize from '../../config/connection.js';

const Ticket =sequelize.define( 'Ticket', {
    TicketId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    EventId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Type: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    Price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    Description: DataTypes.STRING,
    StockAvailable: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {

    tableName: 'Tickets',
    timestamps: false,
});

export default Ticket;