var mongoose = require('mongoose');
var express = require('express');

/*
mongoose.connect(process.env.MONGOLAB_URI, function(err) {
    if (err) return console.error(err);
    else 
        console.log('success');
});
*/


var db = mongoose.connection;
mongoose.connect('mongodb://improject:im12345@ds041831.mongolab.com:41831/improject_database');
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log('success connect');
});


process.on('SIGINT', function() {
  db.close(function () {
    console.log('Mongoose disconnected on app termination');
    process.exit(0);
  });
});


var userSchema = new mongoose.Schema({
  post: Number,
  event: String,
  name: String,
  id: String,
  time: Number
});
var userData = mongoose.model('users', userSchema);

var friendSchema = new mongoose.Schema({
  id: String,
  name: String,
  friends: Array
});
var friendData = mongoose.model('friends', friendSchema);

module.exports.userevent=function(data){
  console.log('inuserevent');
  console.log('data',data)
  var user = new userData(data);
  user.save(function(err, usr) {
    if (err) return console.error(err);
    console.log(user);
  });
}
module.exports.friendlist=function(data){
  console.log('infriend');
  console.log('data',data)
  var list = new userData(data);
  list.save(function(err, usr) {
    if (err) return console.error(err);
    console.log(list);
  });
}
/*
var user1 = new userData({event_type: 'share', user_id:'11111', time:12345 });
user1.save(function(err, usr1) {
 if (err) return console.error(err);
  console.log(user1);
});
*/


