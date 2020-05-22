

var express = require('express');
var bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const mongoose = require("mongoose");
const db = require('./config/database.js');
import { nanoid } from 'nanoid';
const client = require('./models/client.js')
const JWT_OPTIONS = require('./config/jwt.js')

var app = express();
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
//To get data from the angular project
app.use(bodyParser.json({ type: '*' }));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser());

app.listen(process.env.PORT, process.env.IP, function (req, res) {
	    console.log("SERVER STARTED");
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

  app.post('/login', function(req, res){
	user.findOne({DisplayName: req.body.DisplayName}, function(err, USER_OBJ){
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
			  var token = jwt.sign({nickname: req.body.DisplayName, id: USER_OBJ._id, role: USER_OBJ.userType}, privateKEY, JWT_OPTIONS.signOptions)
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
		var newUser = new user({
		  username: req.body.username, 
		  password: BCRYPT_HASH,
		  userType: "user",
		  key: nanoid()
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
