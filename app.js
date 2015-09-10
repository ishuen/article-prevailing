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
app.post('/user',function(req, res){ 
    var postdata = req.body;
    console.log('postdata',postdata);
    var post = req.body.post;
    var eventtype = req.body.event;
    var username = req.body.name;
    var userid = req.body.id;
    var time = req.body.time;
    dbfunc.userevent(postdata);
    res.end();
});

app.post('/transformdata',function(req, res){ 
    var postid = req.body;
    console.log('postid',postid.postid);
    dbfunc.setParent(postid.postid);
    dbfunc.addLike(postid.postid);
    //dbfunc.userevent(postdata);
    res.end();
});

app.post('/friends',function(req, res){ 
    var frienddata = req.body;
    console.log('friend',frienddata);
    dbfunc.friendlist(frienddata);
    /*
    console.log('postid',postid);
    console.log('eventtype',eventtype);
    console.log('name',username);
    console.log('id',userid);
    console.log('time',time);
    */
    //dbfunc.userevent(postdata);
    res.end();
});


server.listen(8005,'127.0.0.1',function(){
    console.log('HTTP伺服器在 http://127.0.0.1:8005/ 上運行');
});

process.on('SIGINT', function() {
console.log('server close');
  server.close();
  process.exit(0);
});



