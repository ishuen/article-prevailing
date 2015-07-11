var mongoose = require('mongoose');
var express = require('express');

var db = mongoose.connection;
mongoose.connect('mongodb://improject:im12345@ds041831.mongolab.com:41831/improject_database');
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
  console.log('success connect');
});

process.on('SIGINT', function() {
  db.close(function () {
    console.log('Mongoose disconnected on app termination');
    process.exit(0);
  });
});

/*var Schema = mongoose.Schema;

var postSchema = new mongoose.Schema({
	Title:{type: String, default:'no title'},
	Content:{type: String, default:''},
	PostTime:{type:Date, default: Date.now},
});

var userSchema = new mongoose.Schema({
	UserID:{type:Number, default:''},
	UserName:{type:String, default:''},
});

var friendSchema = new mongoose.Schema({
	UserA:{type:Schema.Types.ObjectId, ref:'userSchema'},
	UserB:{type:Schema.Types.Objected, ref:'userSchema'},
})

var readerSchema = new mongoose.Schema({
	LoginTime:{type:Date, default:''},
	ShareTime:{type:Date, default:''},
	LikeTime:{type:Date, default:''},
	UserData:{type:Schema.Types.Objected, ref:'userSchema'},
	UserStates:{type:Number, default:'0'},
	PostData:{type:Schema.Types.Objected, ref:'postSchema'},
})

mongoose.model('postSchema', postSchema);
mongoose.model('userSchema', userSchema);
mongoose.model('friendSchema', friendSchema);
mongoose.model('readerSchema', readerSchema);*/