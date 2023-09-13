if (process.env.NODE_ENV !== "production") {
  require("dotenv").config()
}

const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const flash = require("connect-flash")
const session = require("express-session");

const taskRoutes = require("./routes/tasks");
const userRoutes = require("./routes/users");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const sessionConfig = {
  name: "session",
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 604800000,
    maxAge: 604800000,
    httpOnly: true,
  },
};
app.use(session(sessionConfig));
app.use(flash())


app.use((req, res, next) => { 
    res.locals.currentUser = req.session.user
    res.locals.userId = req.session.user_id
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    next()
})

app.use("/tasks", taskRoutes);
app.use("/", userRoutes);

app.get("/", (req, res) => {
  res.render("home");
});

app.listen(3000, () => {
  console.log("Listening on port 3000!");
});
