import { DataTypes } from 'sequelize';
import sequelize from '../../config/connection.js';

const Order =sequelize.define( 'Order',{
    OrderId: {
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
    TicketId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    TotalPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    PaymentStatus: {
        type: DataTypes.ENUM('paid', 'pending', 'refunded'),
        allowNull: false
    },
    CouponCode: DataTypes.STRING(50),
    DiscountPercentage: DataTypes.DECIMAL(5, 2),
    TicketPdfUrl: DataTypes.STRING,
    QrCodeUrl: DataTypes.STRING
}, {
    tableName: 'Orders',
    timestamps: false,

});

export default Order;
