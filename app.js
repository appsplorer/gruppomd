var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin/index');


var app = express();
const session = require('express-session');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const passport = require('passport');
require("./config/passport")(passport)
app.use(express.urlencoded({ extended: true }));
//mongoose
/*
mongoose.connect('mongodb://localhost:27017/admin',
{useNewUrlParser: true, useUnifiedTopology : true})
.then(() => console.log('connected,,'))
.catch((err)=> console.log(err)); */

try {
  mongoose.connect('mongodb://localhost:27017/admin', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    }, () =>
    console.log("connected your db"));
} catch (error) {
  console.log("could not connect");
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret : 'secret',
  resave : true,
  saveUninitialized : true
 }));
 app.use(passport.initialize());
 app.use(passport.session());

 //use flash
 app.use(flash());
 app.use((req,res,next)=> {
   res.locals.success_msg = req.flash('success_msg');
   res.locals.error_msg = req.flash('error_msg');
   res.locals.error  = req.flash('error');
   res.locals.user = req.session.user;
 next();
 })

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(function(req, res, next) {
  res.locals.authchk=req.isAuthenticated();
  next();
  });
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');

});

module.exports = app;
