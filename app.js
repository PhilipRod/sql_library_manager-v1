var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const sequelize = require('./models').sequelize;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// Connection Testing
(async ()=>{
  await sequelize.sync()
  
  try{
    await sequelize.authenticate
    console.log("connection to database is successful")
  }
  catch (error) {
    console.error("connection to database wasnt successful", error)
  }
})();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404,"The Page is not found"));
});

// error handler
app.use(function(err, req, res, next) {
  console.error('Error:',err.message);  

  // render the error page
  res.status(err.status || 500);
  if (err.status === 404) {
    res.render('not-found', { error: err, title: err.message });
  }else{
    err.status = 500;
    res.render('error', { error: err, title: err.message });
  }
  res.render('error');

});



app.listen(3001, ()=>{
  console.log("listening on 3000")
})

module.exports = app;
