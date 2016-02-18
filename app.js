var express = require('express');
var app = express();
var path = require('path');
var sass = require('node-sass-middleware');
var favicon = require('serve-favicon');

var swig = require('swig');
var socketio = require('socket.io');
var server = app.listen(process.env.PORT || 3001);

var routes = require('./routes/');

var chalk = require('chalk');


var bodyParser = require('body-parser');
var morgan = require('morgan');
var _ = require('lodash');

// app.engine('html', swig.renderFile);
// var indexPath = path.join(__dirname, '.views/index.html')
// app.setValue('index', indexPath)

// app.set('view engine', 'html');
// app.set('views', __dirname + '/views');
// swig.setDefaults({cache: false});

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


// swig.setFilter('dateFormatter', function(date){
//   return date.toLocaleString('en-US');
// });

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
app.use(express.static(path.join(__dirname, 'browser')));
app.use(express.static(path.join(__dirname, 'node_modules')));


// var session = require('express-session');

// app.use(session({
//     // this mandatory configuration ensures that session IDs are not predictable
//     secret: 'hunting'
// }));

// app.use(function (req, res, next) {
//     console.log('session', req.session);
//     next();
// });

app.use('/', routes);

app.use(function (err, req, res, next) {
    console.log(chalk.magenta('      ' + err.message));
    res.status(err.status || 500).end();
});