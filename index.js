

var express = require('express');
var bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const fs = require('fs');
const jwt = require('jsonwebtoken')
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const db = require('./config/database.js');
const nanoid = require('nanoid');
const client = require('./models/client.js')
const JWT_OPTIONS = require('./config/jwt.js')
const privateKEY  = fs.readFileSync('./keys/private.key', 'utf8');
const publicKEY  = fs.readFileSync('./keys/public.key', 'utf8');
var app = express();
var uuid = require('uuid-random');
mongoose.Promise = global.Promise; 
app.use(express.static("styles"));

mongoose.connect(db.mongoURI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useCreateIndex: true}) //Changed this line to link to a database file instead of having everything in one file to provide quick and easy access for further work
    .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

//Using Cors
app.use(cors());
app.use(function (req, res, next) {
	    res.setHeader("Access-Control-Allow-Origin", "*");
		    next();
});

app.use(express.static("styles"));
app.set('view engine', 'ejs');
//To get data from the angular project
app.use(bodyParser.json({ type: '*' }));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser());

app.listen(3000, process.env.IP, function (req, res) {
		console.log("SERVER STARTED");
		console.log(process.env.PORT)
});


app.get('/', function(res, req) {
	console.log("Hit the home page");
	res.send("The server is running");
});


app.get('/login', function(req, res){
	if(req.cookies.access_token!=undefined){
	  jwt.verify(req.cookies.access_token, publicKEY, JWT_OPTIONS.verifyOptions, function(err, decodedToken){
		if(err){
		  console.log(err)
		  res.clearCookie('access_token').redirect('/login')
		}
		else{
			res.redirect('/home')
		}
	  })
	}
	else{
	  res.render('login')
	}
  })
  app.get('/register', function(req, res){
	if(req.cookies.access_token!=undefined){
	  jwt.verify(req.cookies.access_token, publicKEY, JWT_OPTIONS.verifyOptions, function(err, decodedToken){
		if(err){
		  console.log(err)
		  res.clearCookie().redirect('/login')
		}
		else{
		  res.redirect('/home')
		}
	  })
	}
	else{
	  res.render('register')
	}
  })
  app.post('/login', function(req, res){
	client.findOne({username: req.body.username}, function(err, USER_OBJ){
	  if(err){
		console.log(err)
	  }
	  else{
		bcrypt.compare(req.body.password, USER_OBJ.password, function(err, BCRYPT_RES){
		  if(err){
			console.log(err)
		  }
		  else{
			if(BCRYPT_RES==true){
			  var token = jwt.sign({nickname: req.body.username, id: USER_OBJ._id, role: USER_OBJ.userType}, privateKEY, JWT_OPTIONS.signOptions)
			  console.log("jwt generated")
			  res.cookie('access_token', token, {expires: new Date(Date.now() + 24 * 60 * 60 * 1000)})
			  activeUsers = activeUsers + 1;
			  if(USER_OBJ.userType == 'admin'){
				res.redirect('/admindash')
			  }
			  else{
				res.redirect('/home')
			  }
  
			}
			else{
			  console.log("Authentication Failed")
			  res.redirect('/login')
			}
		  }
		})
	  }
	})
  })

app.post('/register', function(req, res){
	bcrypt.hash(req.body.password, 9, function(err, BCRYPT_HASH){
	  if(err){
		console.log(err)
		res.redirect(500, '/register')
	  }
	  else{
		var keys = uuid();
		var newUser = new client({
		  username: req.body.username, 
		  password: BCRYPT_HASH,
		  userType: "user",
		  key: keys
		})
  
		newUser.save(function(err, obj){
		  if(err){
			console.log(err)
		  }
		  else{
			console.log("Successful User Registration. Proceed to login")
			console.log(obj.key)
			console.log(obj)
			res.redirect('/login')
		  }
		})
	  }
	})
  })
  




app.post('/api/contactform/', function(req, res) {
	console.log("Got the request")
	console.log(req.body)
	if(req.body.authkey == KEY) {
		res.send("Success"); 
	}
	else {
		res.send("Failed"); 
	}
});


app.get('/logout', function(req, res){
	console.log("Getting the logout method and clearing cookies")
	res.clearCookie('access_token').redirect('/login')
  })
  