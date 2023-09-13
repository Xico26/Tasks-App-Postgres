const {Pool, Client} = require("pg")
const { host } = require("pg/lib/defaults")

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    database: "tasksapp_jvip",
    port: 5432
})

module.exports = pool
