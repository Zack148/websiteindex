var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var Redis = require('ioredis');

//Create Client
var redis = new Redis()

var app = express();

//view Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extend: false}));

//Set Static path
app.use(express.static(path.join(__dirname, 'public')))

//Routes

//Home
app.get('/', function(req, res) {
  res.render('index', {title: 'Home'});
});


app.post('/website', async function(req, res) {
  var storeLength = await redis.llen(req.body.list)
  var randomSelect = Math.floor(Math.random() * storeLength);
  var websiteUrl = await redis.lindex(req.body.list, randomSelect);
  res.json(websiteUrl);
});

//Submit link Regex for URL validation, redirect to stop multiple entries from one submit
app.post('/submit', async function(req, res) {
  var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
  var regex = new RegExp(expression);

  if (req.body.newUrl.match(regex)) {
    console.log('Success');
    var push = await redis.lpush(req.body.list, req.body.newUrl);
    res.redirect('/thankyou')
  } else {
    console.log('Unsuccessful');
    res.render('contribute', {
      title: 'Error',
      error: 'Input was not a link.'
    });
  }
})

//Thank you page
app.get('/thankyou', function(req, res) {
  res.render('thankyou', {title: 'Thank You'});
})


//Contribute page
app.get('/contribute', function(req, res) {
  res.render('contribute', {title: 'Contribute'});
})

//About page
app.get('/about', function(req, res) {
  res.render('about', {title: 'About Us'});
})

app.listen(3000, function() {
  console.log('Server Started on Port 3000');
})
