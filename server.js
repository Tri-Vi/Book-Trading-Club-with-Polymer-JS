const compression = require('compression');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const session = require('express-session');
const morgan = require('morgan');
const passport = require('passport');
const flash = require('connect-flash');
const favicon = require('serve-favicon');
const path = require('path');
const mysql = require('mysql');


const port = process.env.PORT || 3000;

const app = express();

app.use(compression());
//app.set('view engine', ejs);
app.set('views', './views');
app.use(express.static('public'));
app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(function(req, res, next){
  res.locals.user = req.users;
  next();
})

//DB
// const Sequelize = require('sequelize');
// const sequelize = new Sequelize('mydb', 'root', 'root', {
//   host: 'localhost',
//   dialect: 'mysql',
//   operatorsAliases: false,
//
//   pool: {
//     max: 5,
//     min: 0,
//     acquire: 30000,
//     idle: 10000
//   }
// });

// sequelize
//   .authenticate()
//   .then(() => {
//     console.log('Connection has been established successfully.');
//   })
//   .catch(err => {
//     console.error('Unable to connect to the database:', err);
//   });

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "mydb"
});

con.connect(function(err){
  if(err) throw err;
  console.log('DB connected');
})

var User = require('./models/user.js');

//Passport Config
// require('./config/passport.js')(passport);

//Route
var auth = require('./routes/auth.js');
app.use('/auth', auth);
var profile = require('./routes/profile.js');
app.use('/profile', profile);


app.get('/', function(req, res){
  app.sendFile('index.html');
})

app.listen(port, function(err){
  if(err) throw err;
  console.log('Listening on port 3000');
})
