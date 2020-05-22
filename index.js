var express = require('express');
var bodyParser = require("body-parser");
const cors = require("cors");

const PORT = 3000;

var app = express();


//Using Cors
app.use(cors());
app.use(function (req, res, next) {
	    res.setHeader("Access-Control-Allow-Origin", "*");
		    next();
});
//To get data from the angular project
app.use(bodyParser.json({ type: '*' }));
app.use(bodyParser.urlencoded({ extended: false }))

app.listen(PORT, process.env.IP, function (req, res) {
	    console.log("SERVER STARTED");
});


app.get('/', function(res, req) {
	console.log("Hit the home page"); 
});


var KEY = 'ABCD'; 

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
