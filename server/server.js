'use strict';
/**
 * Module dependencies.
 */

var express = require('express'),
  routes = require('./routes'),
  user = require('./routes/user'),
  http = require('http'),
  path = require('path'),
  fs = require('fs')
  ;

var app = express();

var modelsPath = path.join(__dirname, 'models');
fs.readdirSync(modelsPath).forEach(function (modelFile) {
  if (~modelFile.indexOf('.js')) {
    require(path.join(modelsPath, modelFile));
  }
});

// all environments
app.use(express.static(path.join(__dirname, '..', 'www')));
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({secret: 'supersecretsauce'}));
app.use(express.methodOverride());
app.use(app.router);


// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

var server = http.createServer(app);

module.exports = server;

server.use = function () {
  app.use.apply(app, arguments);
};

var path = require('path');
var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;

app.listen(9999, '0.0.0.0', 511, function(){
  console.log('Listening on port 9999...')
})