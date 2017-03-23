var express = require('express');
var path = require('path');
var logger = require('morgan');
var ApiRouter = require('./router');
var app = express();

module.exports = function(me, config) {
  app.set('json spaces', 4);
  app.use(logger('dev'));
  app.use(express.static(path.join(__dirname, 'public')));

  // Allow Ajax GET calls
  app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    next();
  });

  app.use('/', (new ApiRouter(me, config.modules, config.settings)).router);

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // error handlers

  // development error handler
  // will print stacktrace
  if (app.get('env') === 'development') {
    app.use(function(err, req, res) {
      res.status(err.status || 500);
      res.json({
        message: err.message,
        error: err,
      });
    });
  }

  // production error handler
  // no stacktraces leaked to user
  app.use(function(err, req, res) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: {},
    });
  });

  return app;
};
