import { DataTypes } from 'sequelize';
import sequelize from '../../config/connection.js';

const Notification =sequelize.define( 'Notification',{
    NotificationId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    UserId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    EventId: {
        type: DataTypes.INTEGER,    
        allowNull: false
    },
    Message: DataTypes.TEXT,
    IsRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'Notifications',
    timestamps: false,
});

export default Notification;
