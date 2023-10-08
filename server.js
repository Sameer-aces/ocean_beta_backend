const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const users = require("./routes/api/users");
const app = express();
const cors = require("cors");
require("dotenv").config();
var mysql = require("mysql");
var session = require("express-session");
var flash = require("express-flash");
var userRoute = require("./routes/api/users");
var path = require("path");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
app.set("view engine", "ejs");
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
const BASE_URL = process.env.BASE_URL;
const { modelName } = require("./models/User");

const db = require("./config/keys").mongoURI;

app.options("*", cors());
//
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

const corsOptions = {
  origin: process.env.BASE_URL,
  credentials: true,
  allowedHeaders: ["sessionId", "Content-Type"],
  exposedHeaders: ["sessionId"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
}; //
app.use(
  session({
    secret: "123@abcd",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
  })
);
app.use(flash());
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

app.use(cors(corsOptions));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(bodyParser.json());

// const db = process.env.DATABASE;
app.get("/", (req, res) => {
  res.status(201).json("server started");
});

mongoose
  .connect(db, { useNewUrlParser: true })
  .then((res) => console.log("Mongoose Connected"))
  .catch((err) => console.log(err));
app.use(passport.initialize());

require("./config/passport")(passport);
app.use("/api/users", users);
const port = process.env.PORT || 5001;
console.log(port);
app.listen(port, () => console.log(`server running on port ${port}`));
