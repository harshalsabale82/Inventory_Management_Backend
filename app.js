var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var CORS=require('cors');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const empMapping=require("./routes/EmployeeAction");
const event= require('./routes/eventDetails');
const expense= require('./routes/expense')
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json({limit:'20mb'}));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(CORS());
app.use('/uploads',express.static('uploads'))


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/employee',empMapping);
app.use('/event',event);
app.use('/expense',expense);


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
