/**@file Main file for the application
 * @module app
 * @author Wesley Ferreira
*/

/** Dependencies necessary for the application */

/** Express dependency
 * @external express
 * @see {@link https://expressjs.com/}
 */
var express = require("express");
/**
 * Mongoose dependency
 * @external mongoose
 * @see {@link https://mongoosejs.com/}
 */
var mongoose = require("mongoose");

/**
 *  Http-errors dependency
 * @external createError
 * @see {@link https://www.npmjs.com/package/http-errors}
*/
var createError = require("http-errors");

/**
 * Core module of Node.js
 * @external path
 * @see {@link https://nodejs.org/docs/latest/api/path.html#path_path}
 */
var path = require("path");

/**
 * Cookie-parser dependency 
 * @external cookieParser
 * @see {@link https://www.npmjs.com/package/cookie-parser}
 */
var cookieParser = require("cookie-parser");

/**
 * Morgan dependency
 * @external logger
 * @see {@link https://www.npmjs.com/package/morgan}
 */
var logger = require("morgan");

/**
 * Configuration module for the connection to the db via Mongoose
 * @requires module:config
 * @see {@link module:config}
 * @type {DbConfiguration}*/
var config = require("./config");

var indexRouter = require("./routes/index");
var userRouter = require("./routes/user");

/**
 * Express generator
 * @see external:express 
 */
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

/**Web documentation */
app.use("/docs", express.static('./docs/'));

/**Routes */
app.use("/", indexRouter);
app.use("/user", userRouter);

/**Swagger
 * testing the swagger documentation
 */
const swagger = require('./swagger');
app.use("/apitest", swagger.swaggerUI.serve, swagger.swaggerUI.setup(swagger.swaggerDocs));

/**  Catch 404 and forward to error handler*/
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
