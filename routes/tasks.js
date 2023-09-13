const express = require("express")
const router = express.Router()
const pool = require("../db")
const { isLoggedIn } = require("../middleware/auth")

router.route("/")
    .get(isLoggedIn, async (req, res) => {
        try {
            const tasks = await pool.query("SELECT * FROM todo WHERE user_id = $1 ORDER BY id ASC", [req.session.user_id])
            const rowsNum = tasks.rowCount
            const rows = tasks.rows
            res.render("tasks/home", {rows, rowsNum})
        } catch (e) {
            console.log(e.message)
        }
        
    })
    .post(isLoggedIn, async (req, res) => {
        try {
            console.log(req.body)
            const { taskName, taskDescription, dueDate } = req.body
            const todo = await pool.query("INSERT INTO todo (name, description, due, user_id) VALUES($1, $2, $3, $4)", [taskName, taskDescription, dueDate, req.session.user_id])
            res.redirect("/tasks")
        } catch (e) {
            console.log(e.message)
        }
    })

router.route("/new")
    .get(isLoggedIn, (req, res) => {
        res.render("tasks/new")
    });

router.route("/:id")
    .get(isLoggedIn, async (req, res) => {
        const { id } = req.params
        const task = await pool.query("SELECT * FROM todo WHERE id = $1", [id])
        console.log(task)
        res.render("tasks/details", {task})
    })
    .put(isLoggedIn, async (req, res) => {
        const { taskName, taskDescription, dueDate } = req.body
        const { id } = req.params
        await pool.query("UPDATE todo SET name = $1, description = $2, due = $3 WHERE id = $4", [taskName, taskDescription, dueDate, id])
        res.redirect("/tasks")
    })
    .delete(isLoggedIn, async (req, res) => {
        const { id } = req.params
        pool.query("DELETE FROM todo WHERE id = $1", [id])
        res.redirect("/tasks")
    })

router.get("/:id/edit", isLoggedIn, async(req, res) => {
    const { id } = req.params
    const task = await pool.query("SELECT * FROM todo WHERE id = $1", [id])
    console.log(task)
    res.render("tasks/edit", {task})
})

module.exports = router