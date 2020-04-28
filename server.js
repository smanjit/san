  var
  express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  morgan = require('morgan'),
  bb = require('express-busboy'),
  nano = require('nano')('http://admin:admin123@localhost:5984'),
  fs=require('fs'),
  url = require('url'),
  port = 3018;

  const key = fs.readFileSync('../key.pem');
  const cert = fs.readFileSync('../cert.pem');
  const https = require('https');
  const server = https.createServer({key: key, cert: cert }, app);

var loginController = require('./servercontrollers/login');
var formController = require('./servercontrollers/form');
var validateController = require('./servercontrollers/validateController');

server.listen(port, () => { console.log('listening on 3000') });

//var server=app.listen(port,function(){
 // console.log("magic happens at port " + port);
//})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(morgan('dev'));
app.use('/', express.static(__dirname + '/public/'));
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

app.post('/login',loginController.login);
app.post('/validateuser', validateController.validate);


app.post('/addfteam', formController.addfteam);
app.post('/deletefteam', formController.deletefteam);
app.get('/getfteam', formController.getfteam);
app.post('/addform', formController.addform);
app.post('/deleteform', formController.deleteform);
app.post('/addname', formController.addname);
app.get('/gettypenames', formController.gettypenames);
app.post('/deletename', formController.deletename);
app.post('/delegate', formController.delegate);
app.post('/deletedelegate', formController.deletedelegate);
app.get('/getdelegates', formController.getdelegates);
// app.get('/myteams', formController.myteams);
app.post('/topperformer',formController.topperformer);
app.post('/leadtopperformer',formController.leadtopperformer);
app.get('/export_user',formController.user_export);
app.get('/export_admin',formController.admin_export);
app.get('/export_lead',formController.lead_export);
app.post('/update_user',formController.update_user);




app.get('/userfeed', function(req, res) {
    var callback = function(arr, user) {

      var myforms = {}
      myforms = arr.filter(function(item) {
        return item.userid==user;
      })
      res.send(myforms);
    }
    formController.userfeed(req, res, callback);
  });


  app.get('/leadfeed', function(req, res) {
      var callback = function(arr, user ,teams) {
        console.log(teams);

        var myforms = {}
        var allforms = {}
        myforms = arr.filter(function(item) {
          return item.userid==user;
        })

        var allforms = arr.filter(function(item) {
        return (teams.indexOf(item.fteam) != -1);
        })

        res.send(allforms);
      }
      formController.leadfeed(req, res, callback);
    });


  app.get('/adminfeed', function(req, res) {
      var callback = function(arr, user) {
      var myforms = {}
      myforms = arr.filter(function(item) {
        return item.userid==user;
        })
      res.send(arr);
        }
      formController.adminfeed(req, res, callback);
    });
