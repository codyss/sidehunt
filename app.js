var express = require('express');
var app = express();
var path = require('path');
var sass = require('node-sass-middleware');
var favicon = require('serve-favicon');

var swig = require('swig');
var socketio = require('socket.io');
var server = app.listen(process.env.PORT || 3000);
var io = socketio.listen(server);

var routes = require('./routes/');
var router = routes(io);

var chalk = require('chalk');


var bodyParser = require('body-parser');
var morgan = require('morgan');
var bootstrapRouter = require('bootstrap-router');
var _ = require('lodash');

app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
swig.setDefaults({cache: false});

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


swig.setFilter('dateFormatter', function(date){
  return date.toLocaleString('en-US');
});

app.use(morgan('dev'));

app.use(sass({
    /* Options */
    src: path.join(__dirname, 'assets'),
    dest: path.join(__dirname, 'public'),
    debug: true,
    outputStyle: 'compressed',
    prefix:  '/prefix'  // Where prefix is at <link rel="stylesheets" href="prefix/style.css"/> 
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', router);

app.use(function (err, req, res, next) {
    console.log(chalk.magenta('      ' + err.message));
    res.status(err.status || 500).end();
});