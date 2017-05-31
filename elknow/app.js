var express = require('express');
var path = require('path');
var orm = require('orm');
var consts = require('./const.js');
var modelsFunc = require('./models.js');

// var favicon = require('serve-favicon');
// var logger = require('morgan');

var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var sign = require('./routes/sign');
var upload = require('./routes/upload');
var knows = require('./routes/knows');
var comment = require('./routes/comment');
var collect = require('./routes/collect');
var course = require('./routes/course');

var app = express();


// 使用静态文件
app.use(express.static('public'));
// // view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// cookie session json
app.use(cookieParser('secret'));
app.use(bodyParser.json());

app.use(session({
    secret: 'elknow',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false}
}))

// 跨域
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', true);
    if (req.method == 'OPTIONS') {
        res.writeHead(200, {
            'Content-type': 'text/html'
        });
        res.end('options OK');
        return;
    }
    else {
        next();
    }
})

app.use(orm.express(consts.dbConfig, {
	define: function (db, models, next) {
        let model = modelsFunc(db);
		models.user = model.user;
        models.knows = model.knows;
        models.db = db;
        models.collect = model.collect;
        models.comment = model.comment;
        models.course = model.course;
		next();
	}
}));


app.use('/', index);
app.use('/upload', upload);
app.use('/users', users);
app.use('/sign', sign);
app.use('/knows', knows);
app.use('/comment', comment);
app.use('/collect', collect);
app.use('/course', course);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
