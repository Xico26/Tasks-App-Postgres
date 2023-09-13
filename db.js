const {Pool, Client} = require("pg")
const { host } = require("pg/lib/defaults")

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: "localhost",
    database: "tasksapp",
    port: 5432
})

module.exports = pool