'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Order.init({
    cname: DataTypes.STRING,
    delivery: DataTypes.INTEGER,
    status: DataTypes.ENUM('c','p'),
    notes: DataTypes.TEXT,
    photo: DataTypes.STRING,
    frameID: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    contact: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Order',
    timestamps: true
  });
  return Order;
};