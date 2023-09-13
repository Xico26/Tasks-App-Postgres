const pool = require("../db")
const bcrypt = require("bcrypt")

module.exports.registerUser = async (req, res) => {
    try {
        const { email, name, password } = req.body
        const salt = await bcrypt.genSalt(12);
        const hash = await bcrypt.hash(password, salt);
        const data = await pool.query(
            "INSERT INTO users(email, name, password) VALUES ($1, $2, $3)",
            [email, name, hash]
        );
        const users = await pool.query("SELECT * FROM users WHERE email = $1", [email])
        const user = users.rows[0]
        req.session.user_id = user.id
        req.session.user = user
        res.redirect("/tasks")
    } catch (e) {
        console.log(e);
    }
  };

module.exports.loginUser = async (req, res) => {
    const { email, password } = req.body
    const foundUsers = await pool.query("SELECT * FROM users WHERE email = $1", [email])
    const foundUser = foundUsers.rows[0]
    if (!foundUser) {
        req.flash("error", "Username or password incorrect.")
        return res.redirect("/signin")
    }
    const hashedPwd = foundUser.password
    const validUser = await bcrypt.compare(password, hashedPwd)
    if (!validUser) {
        req.flash("error", "Username or password incorrect.")
        return res.redirect("/signin")
    }
    if (validUser) {
        req.session.user_id = foundUser.id
        req.session.user = foundUser
        console.log(req.session.user)
        res.redirect("/tasks")
    } else {
        res.redirect("/login")
    } 
}

module.exports.logoutUser = (req, res) => {
    req.session.user_id = null
    req.session.user = null
    res.redirect("/")
}