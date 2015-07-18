var mongoose = require('mongoose');

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

var postnum = 1;//POSTNUMBER!!!
var userdatas = new mongoose.Schema({
	post:{type: Number},
	event:{type: String},
	name:{type: String},
	id:{type: String},
	time:{type: Number},
});
var temp1 = new mongoose.Schema({
	id:{type: String},
	post:{type: Number},
	name:{type: String},
	parent:{type: String},
	status:{type: Number},
})
var user = mongoose.model('user',userdatas);
var t1 = mongoose.model('t1', temp1);

var query = user.find({'event':'like', 'post': postnum }).sort({'time':'ascending'});
query.select('id');
query.lean().exec(function (err, docs) {
  if (err) return handleError(err);
  else{
	var likes = docs;
	console.log('likes:');
	console.log(likes);
	var query = t1.find({'post':postnum});
	query.lean().exec(function (err, docs) {
	  if (err) return handleError(err);
	  else{
		  var par = docs;
		  console.log('par:');
		  console.log(par);
		  var count = likes.length;
		  var tempL = likes.pop();
		  var tempP = par.pop();
		  while(count!= 0){
			if(tempL.id == tempP.id && (tempP.status == 0 ||tempP.status == 2)){
				  tempP.status++;
				  t1.findByIdAndUpdate(tempP._id,{$set:{'status':tempP.status}},function (err, docs) {
  					if (err) return handleError(err);
  				      	else{
  				      		console.log(docs);
						console.log('endupdate');
	      				  	
  				      	}
				});
	  			console.log(tempP._id);
			  	tempL = likes.pop();
			  	tempP = par.pop();
	  			count--;
			  }
			  else{
				  par.unshift(tempP);
				  tempP = par.pop();
			  }
			  
				
		  }
		  
	  }
	  console.log('end searching');
	})
  }	  	
  console.log('end searching');
})

