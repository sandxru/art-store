const express = require("express");
//const { Model } = require("sequelize");
const Sequelize = require("sequelize");

const {sequelize} = require('../models') //Directory to models - This is the instance 
//const Sequelize = require('sequelize') // This the classed sequelize

var Op = Sequelize.Op;

// Load model
var orderModel = require("../models").Order;

const { redirectHome, redirectLogin } = require("../middleware/redirect");

const router = express.Router();

router.get("/admin", redirectLogin, async function (req, res, next) {

    var pending_orders = await orderModel.count({
        where: {
            status: {
                [Op.eq]: 'p'
            }
        }
    });

    var completed_orders = await orderModel.count({
        where: {
            status: {
                [Op.eq]: 'c'
            }
        }
    });

    var total_orders = await orderModel.count();

    // var total_price = await orderModel.findAll({
    //     // I need to calculate the sum from the all the values of the Price Colmun
    //   });

    //var total_price = await sequelize.query('Select SUM(price) From Orders', {type:QueryTypes.SELECT}).succeess
    const total_price = await orderModel.findAll({
        attributes: [
           [sequelize.fn('sum', sequelize.col('price')), 'total_price']
         ]
     })

res.render("admin/dashboard", {
    ordersP: pending_orders,
    ordersC: completed_orders,
    ordersT: total_orders,
    priceT: total_price
});

});



module.exports = router;