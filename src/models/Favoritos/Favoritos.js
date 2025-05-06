import { DataTypes } from 'sequelize';
import sequelize from '../../config/connection.js';

const Favorite =sequelize.define( 'Favorite',{
    FavoriteId: {
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
    }
}, {
    tableName: 'Favorites',
    timestamps: false,
});

export default Favorite;