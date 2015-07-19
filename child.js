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
var temp1 = new mongoose.Schema({
	id:{type: String},
	post:{type: Number},
	name:{type: String},
	parent:{type: String},
	status:{type: Number},
})
var temp2 = new mongoose.Schema({
	id:{type: String},
	post:{type: Number},
	name:{type: String},
	child:{type: Array},
	status:{type: Number},
})
var t1 = mongoose.model('t1', temp1);
var t2 = mongoose.model('t2', temp2);

 var query = t2.remove({'post': postnum}, function (err,docs) {
  if (err) return handleError(err);
});

var query = t1.find({'post':postnum});
query.lean().exec(function (err, docs) {
  if (err) return handleError(err);
  else{
	var par = docs;
	for(var i = 0; i < par.length; i++){
		var chi = new Array();
		for(var j = 0; j < par.length; j++){
			if(par[j].parent == par[i].name){
				var temp = par[j].name;
				chi.unshift(temp);
				//console.log(chi);
			}
			  
		}
	var toAdd ={
		id:par[i].id,
		post:postnum,
		name:par[i].name,
		child:chi,
		status:par[i].status,
	};
	console.log(toAdd);
	var t = new t2(toAdd);
	t.save( function(err, data){
		if (err) return handleError(err); 

	});      
	  }
  }
  console.log('end searching');
})
