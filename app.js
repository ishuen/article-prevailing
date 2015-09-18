var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var handleError = require('errorhandler');
var path = require('path');
var fs = require('fs');
var dbfunc = require('./db.js');
var app = express();
var server = http.createServer(app);

app.use(express.static(__dirname));
app.use(express.static('/public/images'));
app.use(express.static('/public/stylesheets'));
app.use(express.static('/public/javascripts'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8000');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});

app.get('/',function(req, res){
    console.log('success');
    res.sendFile(__dirname + '/views/index.html'); 

});
app.get('/fandata',function(req, res){ 
    dbfunc.fandata(req,res);
});
app.post('/user',function(req, res){ 
    var userdata = req.body;
    console.log('userdata',userdata);
    dbfunc.userevent(userdata);
    res.end();
});

app.post('/transformdata',function(req, res){ 
    var postid = req.body;
    console.log('postid',postid.postid);
    dbfunc.setParent(postid.postid);
    //setTimeout(dbfunc.addLike(postid.postid), 5000);
    res.end();
});

app.post('/friends',function(req, res){ 
    var frienddata = req.body;
    dbfunc.friendlist(req.body);
    console.log('friend',frienddata);
    res.end();
});
app.post('/checkliked',function(req, res){ 
    dbfunc.checkliked(req,res);
});


server.listen(8005,'127.0.0.1',function(){
    console.log('HTTP伺服器在 http://127.0.0.1:8005/ 上運行');
});

process.on('SIGINT', function() {
console.log('server close');
  server.close();
  process.exit(0);
});



