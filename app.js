var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

var config = require("./config");

var indexRouter = require("./routes/index");
var userRouter = require("./routes/user");

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

//  const UserSchema = require("./models/User");
//  const newUser = new UserSchema({
//    login: "amaral",
//    password: "senha",
//    experienceDays: 80000,
//    accountPlanType: { _id: "5e8a7c8f03adef5b9981b842" },
//    systems: [{ _id: "5e8a7e34a232365ca08c0cfd" }],
//  });
//  newUser.save().then(() => console.log("user criado")).catch((err)=> console.log(err));

// const SystemSchema  = require('./models/System');
// const newSystem = new SystemSchema({
//   nameSystem: 'Sistema1',
//   category: 'caterogia',
//   microcontroller: [{
//     _id:'5e8a71edd5beb943d91f1866'
//   }],
// });
// newSystem.save().then(() => console.log('meow')).catch((err)=> console.log(err));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/user", userRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
