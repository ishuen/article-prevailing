var mongoose = require('mongoose');

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
var postnum = 1;//POSTNUMBER!!!
var userdatas = new mongoose.Schema({
	post:{type: Number},
	event:{type: String},
	name:{type: String},
	id:{type: String},
	time:{type: Number},
});
var friends = new mongoose.Schema({
	id:{type: String},
	name: {type: String},
	friends:{type: Array},
})
var temp1 = new mongoose.Schema({
	id:{type: String},
	post:{type: Number},
	name:{type: String},
	parent:{type: String},
	status:{type: Number},
})
var user = mongoose.model('user',userdatas);
var friend = mongoose.model('friend', friends);
var t1 = mongoose.model('t1', temp1);
//first time
var uLogin = user.find({'event':'login', 'post':postnum}).sort({'time':'ascending'});
uLogin.select('id name time');
uLogin.lean().exec(function (err,docs) {
  if (err) return handleError(err);
  else{
	  var uL = docs;
	  var uShare = user.find({'event':'share', 'post':postnum}).sort({'time':'ascending'});
	  uShare.select('id time');
	  uShare.lean().exec(function (err, docs) {
	    if (err) return handleError(err);
	    else{
		    var uS = docs;
		    var uLS = new Array(); //login and share
		    var uLO = new Array(); //login only
		    var tempL = uL.pop(); //first login
		    var tempS = uS.pop();//first share
		    //console.log('uS' + uS.length);
		    //console.log('uL' + uL.length);
		    while(uS.length >=0 && tempL != undefined && tempS != undefined){
			    if(tempL.id == tempS.id){
				    //console.log('uS.length:'+uS.length);
				    var match = new Object();
				    match.id = tempL.id;
				    match.name = tempL.name;
				    match.loginTime = tempL.time;
				    match.shareTime = tempS.time;
				    match.parent = 'source';
				    match.status = 2;
				    uLS.unshift(match);
				    //console.log(match);
				    if(uS.length != 0){
					    tempL = uL.pop();
					    tempS = uS.pop();
				    }
				    else
					    break;	    
			    }
			    else if(tempL.id != tempS.id){	    
				    uL.unshift(tempL);
				    tempL = uL.pop();
			    }
		    }
		    tempL = uL.pop();
		    while(uL.length >= 0 && tempL != undefined){ //basic setting for the user only login
			    var dismatch = new Object();
			    dismatch.id = tempL.id;
			    dismatch.name = tempL.name;
			    dismatch.loginTime = tempL.time;
			    dismatch.parent = 'source';
			    dismatch.status = 0;
			    uLO.unshift(dismatch);
			    //console.log(dismatch);
			    //console.log('uL' + uL.length);
			    tempL = uL.pop();
		    } 
		    
		    for(var i = 1; i < uLS.length; i++){ //skip the definitely link to source user
			    var uLtime = uLS[i].loginTime;
			    //console.log('uName:'+uLS[i].name);
			    //console.log('uParent:'+uLS[i].parent);
			    //console.log('uLtime: '+uLtime);
			    var uFrd = friend.find({'id':uLS[i].id});
			    uFrd.lean().exec(function (err, docs) {
			      if (err) return handleError(err);
			      else{
				      if(docs!=''){
					      //console.log(docs[0].name);
					      var beTN = docs[0].name;
					      //console.log(docs[0].friends); //friend list of certain user
					      var beTest = docs[0].friends.slice();
					      var toTest = uLS.slice();

					      for(var j = i-1; j>=0; j--){
						      //console.log('i = '+ i);
						      var n = 0;
						      //console.log('toTest:'+toTest[j].name);
						      while(n<=beTest.length && beTest[n]!= undefined){
							      if(toTest[j].name == beTest[n]){
								      //console.log(toTest[i].parent);
								      var k = 0;
								      while( k < uLS.length){
									      if(uLS[k].name == beTN){
										      uLS[k].parent = beTest[n];
										      //console.log(uLS[k]);
										      break;
									      }
									      k++;
								      }
								      //toTest[i].parent = beTest[n];
								      //console.log('same:'+beTest[n]);
								      break;
							      }
							//console.log('beTest:'+beTest[n]);	      
							      n++;
								      	
						      }
						      //console.log('parent:'+uLS[i].parent);
					      }//end of finding parent for share-user
					      //console.log(uLS);
					      var boo = 0;
					      for(var j = 0; j < uLO.length; j++){
						      var oLtime = uLO[j].loginTime;
						      //console.log('oName: '+ uLO[j].name);
			  			      //console.log('oParent:'+uLO[j].parent);
			  			      //console.log('oLtime: '+oLtime);
			  			      var oFrd = friend.find({'id':uLO[j].id});
			  			      oFrd.lean().exec(function (err, docs) {
			  			      	if (err) return handleError(err);
							else{
								if(docs!=''){
									//console.log(docs[0].name);
									var beTn = docs[0].name;
									//console.log(docs[0].friends);
									var beTe = docs[0].friends.slice();
									var toTe = uLO.slice();
									for(var k = uLS.length-1; k >= 0; k--){
										var m = 0;
										while(m<= beTe.length && beTe[m]!= undefined){
											//console.log('k = '+ k);
											if(uLS[k].name == beTe[m]){
												//console.log('same:'+uLS[k].name);
												var t = 0
												while(t<toTe.length){
													if(toTe[t].name == beTn && toTe[t].loginTime > uLS[k].shareTime){
														uLO[t].parent = uLS[k].name;
														//console.log(uLO[t]);
													        var query = t1.remove({'name': uLO[t].name}, function (err,docs) {
													         if (err) return handleError(err);
														 //console.log('remove:'+docs);
													       });
				  			  						      	var tmp1 ={
				  			  							      id:uLO[t].id,
														      post:postnum,
				  			  							      name:uLO[t].name,
				  			  							      parent:uLO[t].parent,
				  			  							      status:uLO[t].status,
				  			  						      	};
				  									      	console.log(tmp1);
				  			  					      		var t = new t1(tmp1);
				  			  					      		t.save( function(err, data){
				  			  					      			if (err) return handleError(err);
							
				  			  					      		});
														break;
													}
													else if(toTe[t].name == beTn && toTe[t].loginTime <= uLS[k].shareTime){
														t = toTe.length;
													}
													t++;
												}
											}
											m++;
										}
										
										}
									}
									//console.log(uLO);
			  					      	
								}
								if(j == uLO.length && boo == 0){
									for(var p = 0; p < uLO.length; p++){
	  		  						      var tmp1 ={
	  		  							      id:uLO[p].id,
										      post:postnum,
	  		  							      name:uLO[p].name,
	  		  							      parent:uLO[p].parent,
	  		  							      status:uLO[p].status,
	  		  						      };
	  								      console.log(tmp1);
	  		  					      		var t = new t1(tmp1);
	  		  					      		t.save( function(err, data){
	  		  					      			if (err) return handleError(err);
						
	  		  					      		});
									}
			  					      	for(var p = 0; p < uLS.length; p++){
			  						      var tmp1 ={
			  							      id:uLS[p].id,
										      post:postnum,
			  							      name:uLS[p].name,
			  							      parent:uLS[p].parent,
			  							      status:uLS[p].status,
			  						      };
									      	console.log(tmp1);
			  					      		var t = new t1(tmp1);
			  					      		t.save( function(err, data){
			  					      			if (err) return handleError(err); 
							
			  					      		});
			  					      	}
			  					      	
								      boo = 1;
							         }
							 
							
						        });
					      }
				      }
			      }
			      //console.log('end searching');
			    })
	
		    }
		    
	    }	
	    //console.log('end searching');
	  })
      	
  }	
  //console.log('end searching');
})
