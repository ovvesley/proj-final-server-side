/**@file Main file for the application
 * @module app
 * @author Wesley Ferreira
*/

/** Dependencies necessary for the application */
require('dotenv').config()
var express = require("express");
var mongoose = require("mongoose");
var createError = require("http-errors");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");

var config = require("./config");
const swagger = require('./swagger');

var indexRouter = require("./routes/index");
var userRouter = require("./routes/user");
var signupRouter = require("./routes/services/signup");
var loginRouter = require("./routes/services/login");
var microcontrollerRouter = require("./routes/microcontroller"); 

var app = express();

const url = config.mongoUrl;
const connect = mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

connect
  .then(
    (db) => {
      let { host, port, name } = db.connection;

      console.log(`Database connected correctly to Server`);
      console.log("--------------------------------------");
      console.log(`HOST =\t${host}; \nPORT =\t${port}; \nNAME =\t${name};`);
      console.log("--------------------------------------");
    },
    (err) => {
      console.error(
        "❌ Database NOT connected correctly to Server: ",
        err.message
      );
    }
  )
  .catch((err) => {
    console.error(
      "❌ Database NOT connected correctly to Server: ",
      err.message
    );
  });

/**View engine setup */
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

/**Routes */
app.use("/", indexRouter);
app.use("/user", userRouter);
app.use("/signUp", signupRouter);
app.use("/login", loginRouter);
app.use("/microcontroller", microcontrollerRouter); 

/**Swagger*/
app.use("/docs/swagger-doc", swagger.swaggerUI.serve, swagger.swaggerUI.setup(swagger.swaggerDocs));


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

/**  Error handler */
app.use(function (err, req, res, next) {
  /** set locals, only providing error in development */
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  /**  render the error page */
  res.status(err.status || 500);
  res.render("error");
});

/**Application generator (express) */
module.exports = app;
