

var express = require('express');
var bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const mongoose = require("mongoose");
const db = require('./config/database.js');
import { nanoid } from 'nanoid';


const PORT = 3000;

var app = express();
mongoose.Promise = global.Promise; 


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


app.post('/login', function(req, res) {

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
