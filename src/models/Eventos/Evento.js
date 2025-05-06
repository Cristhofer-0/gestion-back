import { DataTypes } from 'sequelize';
import sequelize from '../../config/connection.js';

const Event =sequelize.define( 'Event',{
    EventId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    OrganizerId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Title: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    Description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    StartDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    EndDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    Address: DataTypes.STRING,
    Latitude: DataTypes.DECIMAL(10, 7),
    Longitude: DataTypes.DECIMAL(10, 7),
    Visibility: {
        type: DataTypes.ENUM('public', 'private', 'invite-only'),
        allowNull: false
    },
    Categories: DataTypes.STRING,
    BannerUrl: DataTypes.STRING,
    VideoUrl: DataTypes.STRING,
    Status: {
        type: DataTypes.ENUM('draft', 'pending_approval', 'published', 'cancelled'),
        defaultValue: 'draft'
    },
    Capacity: DataTypes.INTEGER
}, {
    tableName: 'Events',
    timestamps: false
});

export default Event;

