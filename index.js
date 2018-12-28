const path = require('path');
const flash = require('connect-flash');
// const bodyParser = require('body-parser');
const config = require('config-lite')(__dirname);
const config1 = require('./config/default');
const routes = require('./routes');
const pkg = require('./package');
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const session = require('express-session');
const sharedsession = require('socket.io-express-session');



app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

// session 中间件
/* app.use(session({
  name: config1.session.key,
  secret: config1.session.secret, // 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
  resave: true, // 强制更新 session
  saveUninitialized: false, 
  cookie: {
    maxAge: config1.session.maxAge
  }

}));  */


var sessiontext = session({
  name: config1.session.key,
  secret: config1.session.secret, 
  resave: true, 
  saveUninitialized: true, 
  cookie: {
    maxAge: config1.session.maxAge
  },
});

//设置session
app.use(sessiontext);
io.use(sharedsession(sessiontext)) 


app.use(flash());


/* app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); */
// 处理表单及文件上传的中间件
app.use(require('express-formidable')({
    keepExtensions: true// 保留后缀
}));

// 设置模板全局常量
app.locals.analyze = {
  title: pkg.name,
  description: pkg.description
};

app.use(function (req, res, next) {
  res.locals.user = req.session.user;
  res.locals.success = req.flash('success').toString();
  res.locals.error = req.flash('error').toString();
  next()
});

routes(app);
require('./routes/chat_server')(io);


server.listen(config1.post, function () {
  console.log(pkg.name + ' listening on port '+ config1.post)
});

/* const chat_server = require('./chat_server');
chat_server.listen(io); */
// iframe