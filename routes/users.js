const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users")
const { isLoggedIn } = require("../middleware/auth")

router.route("/signup")
    .get((req, res) => {
        res.render("users/signup")
    })
    .post(usersController.registerUser);

router.route('/signin')
    .get((req, res) => {
        res.render("users/login")
    })
    .post(usersController.loginUser);

router.post('/logout', usersController.logoutUser);


module.exports = router;
