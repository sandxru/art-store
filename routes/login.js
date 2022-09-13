const express = require("express");
const Sequelize = require("sequelize");
const bcrypt = require("bcrypt");

var adminModel = require("../models").Admin;

const {redirectHome, redirectLogin} = require("../middleware/redirect");

var Op = Sequelize.Op;

const router = express.Router();

router.route("/admin/login").get(redirectHome, function (req, res, next) {

    res.render("login");

}).post(function (req, res, next) {

    adminModel.findOne({
        where: {
            email: {
                [Op.eq]: req.body.email
            }
        }
    }).then((user) => {

        if (user) {
            // Have data
            bcrypt.compare(req.body.password, user.password, function (error, result) {
                if (result) {
                    // Login Success
                    req.session.isLoggedIn = true;
                    req.session.userID = user.id;

                    res.redirect("/admin/");
                } else {
                    // Login Not Success
                    res.redirect("/admin/login");
                }
            })
        } else {
            // No data
            res.redirect("/admin/login");
        }

    })
});

//Logout Route
router.get("/admin/logout", redirectLogin, function (req, res, next) {

    req.session.destroy((error) => {

        if (error) {
            res.redirect("/admin");
        }
        res.redirect("/admin/login");
    });
});


// Run once to create a user
router.get("/admin/register", function (req, res, next) {

    adminModel.create({
        name: "Name",
        email: "email@gmail.com",
        password: bcrypt.hashSync("yourpassword", 10)
    }).then((data) => {
        if (data) {
            res.json({
                status: 1,
                message: "Success"
            })
        } else {
            res.json({
                status: 0,
                message: "Error"
            })
        }
    })
})

module.exports = router;