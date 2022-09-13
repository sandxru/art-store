const express = require("express");
const { Model, Sequelize } = require("sequelize");

//Cloudinary Setup
var cloudinary = require("cloudinary").v2;
cloudinary.config({
    cloud_name: 'yourusername',
    api_key: 'YOUR-KEY',
    api_secret: 'YOUR_SECRET'
});

// Load model
var orderModel = require("../models").Order;

var Op = Sequelize.Op;

const { redirectHome, redirectLogin } = require("../middleware/redirect");

const router = express.Router();

//New Order Route
router.route("/admin/new-order").get(redirectLogin, function (req, res, next) {
    res.render("admin/new-order");
}).post(function (req, res, next) {


        var imageOne = req.files.image;
        //imageOne.mv("./public/uploads/" + imageOne.name);
        //console.log(imageOne);
        cloudinary.uploader.upload(imageOne.tempFilePath, function (err, result) {
            console.log("Error: ", err);
            console.log("Result: ", result);
            orderModel.create({
                cname: req.body.cname,
                delivery: req.body.dmethod,
                notes: req.body.notes,
                photo: result.secure_url,
                frameID: req.body.frame,
                price: req.body.price,
                contact: req.body.contactf
            }).then((order) => {

                res.redirect("/admin/new-order");

            });
        });
});

//All Order Route
router.get("/admin/all-order", redirectLogin, async function (req, res, next) {

    var all_orders = await orderModel.findAll();

    res.render("admin/all-order", {
        orders: all_orders
    });
});

//Pending Order Route
router.get("/admin/pending-order", redirectLogin, async function (req, res, next) {

    var pending_order = await orderModel.findAll({
        where: {
            status: {
                [Op.eq]: 'p'
            }
        }
    });

    res.render("admin/pending-order", {
        orders: pending_order
    });

});

//Completed Order Route
router.get("/admin/completed-order", redirectLogin, async function (req, res, next) {

    var completed_order = await orderModel.findAll({
        where: {
            status: {
                [Op.eq]: 'c'
            }
        }
    });

    res.render("admin/completed-order", {
        orders: completed_order
    });

});

//Edit Order Route
router.route("/admin/edit-order/:orderId").get(redirectLogin, async function (req, res, next) {

    var order_data = await orderModel.findOne({
        where: {
            id: {
                [Op.eq]: req.params.orderId
            }
        }
    });

    res.render("admin/edit-order", {
        order: order_data
    });
}).post(function (req, res, next) {
    if (!req.files) {
        //Not updating image
        orderModel.update({
            cname: req.body.cname,
            delivery: req.body.dmethod,
            notes: req.body.notes,
            frameID: req.body.frame,
            price: req.body.price,
            contact: req.body.contactf
        }, {
            where: {
                id: {
                    [Op.eq]: req.params.orderId
                }
            }
        }).then((order) => {

            res.redirect("/admin/edit-order/" + req.params.orderId);

        });

    } else {
        //Upladating image
        var imageOne = req.files.image;
        //imageOne.mv("./public/uploads/" + imageOne.name);
        //console.log(imageOne);
        cloudinary.uploader.upload(imageOne.tempFilePath, function (err, result) {
            console.log("Error: ", err);
            console.log("Result: ", result);
            orderModel.update({
                cname: req.body.cname,
                delivery: req.body.dmethod,
                notes: req.body.notes,
                photo: result.secure_url,
                frameID: req.body.frame,
                price: req.body.price,
                contact: req.body.contactf
            }, {
                where: {
                    id: {
                        [Op.eq]: req.params.orderId
                    }
                }
            }).then((order) => {

                res.redirect("/admin/edit-order/" + req.params.orderId);

            });
        });


    }
});

// Delete Order Route
router.post("/admin/delete-order/:orderId", function (req, res, next) {

    orderModel.findOne({
        where: {
            id: {
                [Op.eq]: req.body.order_id
            }
        }
    }).then((data) => {
        if (data) {
            //have
            orderModel.destroy({
                where: {
                    id: {
                        [Op.eq]: req.body.order_id
                    }
                }
            }).then((status) => {
                res.redirect("/admin/all-order");
            })
        } else {
            //have not
            res.redirect("/admin/all-order");
        }
    });
});

// Change Order Route - Pending -> Completed
router.post("/admin/change-order/:orderId", function (req, res, next) {

    orderModel.findOne({
        where: {
            id: {
                [Op.eq]: req.body.order_id
            }
        }
    }).then((data) => {
        if (data) {
            //have
            orderModel.update({
                status: 'c'
            }, {
                where: {
                    id: {
                        [Op.eq]: req.params.orderId
                    }
                }
            }).then((status) => {
                res.redirect("/admin/all-order");
            })
        } else {
            //have not
            res.redirect("/admin/all-order");
        }
    });
});

// Change Order Route - Completed -> Pending
router.post("/admin/changet-order/:orderId", function (req, res, next) {
    orderModel.findOne({
        where: {
            id: {
                [Op.eq]: req.body.order_idt
            }
        }
    }).then((data) => {
        if (data) {
            //have
            orderModel.update({
                status: 'p'
            }, {
                where: {
                    id: {
                        [Op.eq]: req.params.orderId
                    }
                }
            }).then((status) => {
                res.redirect("/admin/all-order");
            })
        } else {
            //have not
            res.redirect("/admin/all-order");
        }
    });
});

module.exports = router;