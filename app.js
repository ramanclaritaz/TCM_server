require('rootpath')();

var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var cors = require('cors')
var expressJwt = require('express-jwt');

var db = require('./shared/config')
var config = db.config;
console.log("CONFIG");
console.log(config);


app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function (req, res, next) {
  res.json({msg: 'This is CORS-enabled for all origins!'})
})

// use JWT auth to secure the api, the token can be passed in the authorization header or querystring
app.use(expressJwt({
  secret: config.secret,
  credentialsRequired: true,
  getToken: function (req) {
      if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
          return req.headers.authorization.split(' ')[1];
      } else if (req.query && req.query.token) {
          return req.query.token;
      }
      return null;
  }
}).unless({ path: ['/api/authenticate', '/api/register','/api/password/forgot'] }));

app.use(function (err, req, res, next) {
  console.log("err");    
    if (err.name === 'UnauthorizedError') {
      console.log(err);
      return res.status(401).send(err);
      // return res.status(401).send({
      //   success: false,
      //   status:err.status,
      //   message: err.code
      // });
    }
  });

// Get the API route ...
var api = require('./routes/api.route')
app.use('/api', api);
// start server
var port = process.env.NODE_ENV === 'production' ? 80 : 4000;
var server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});

module.exports = app;
