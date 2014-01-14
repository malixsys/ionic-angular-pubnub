'use strict';
/**
 * Module dependencies.
 */

var express = require('express'),
  auto = require('./routes/autos'),
  http = require('http'),
  path = require('path'),
  fs = require('fs')
  ;

var config = require(path.join(__dirname, '..', 'config.js'));

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
app.all('/*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  next();
});
app.use(app.router);


// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/autos', auto.list);

app.get('/about' , auto.about);

var server = http.createServer(app);

module.exports = server;

server.use = function () {
  app.use.apply(app, arguments);
};

var path = require('path');
var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;

var PORT = 5000;
var MAX_CONNS = 511;
app.listen(PORT, '0.0.0.0', MAX_CONNS, function(){
  console.log('Listening on port ' + PORT + '...');
  console.log('[PUBNUB] Initializing...');
  var pubnub = require('./pubnub')(config.pubnub.secret_key);
  pubnub.initialize(function(err, data){
    if(err !== null) {
      console.log('[PUBNUB] [ERROR] ', err);
      app.pubnub = false;
      return;
    }
    app.pubnub = data;
    data.status();
  });
});