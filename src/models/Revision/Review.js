import { DataTypes } from 'sequelize';
import sequelize from '../../config/connection.js';

const Review =sequelize.define( 'Review', {
    ReviewId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    EventId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    UserId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        }
    },
    Comment: DataTypes.TEXT
}, {

    tableName: 'Reviews',
    timestamps: false,

});

export default Review;