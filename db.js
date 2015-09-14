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
  console.log('data',data);
  userData.find({'name':data.name, 'event':'login','post':data.post}, function (err, docs) {
    console.log('docs',docs);
    if(docs.length==0){
      var myuser = new userData(data);
      myuser.save(function(err, usr) {
        if (err) return console.error(err);
        //console.log(user);
      });
    }
  });
  
}
module.exports.friendlist=function(data){
  console.log('infriend');
  console.log('data',data);
  friendData.find({'id':data.id, 'name':data.name}, function (err, docs) {
    console.log('docs',docs);
    if(docs.length==0){
      var list = new friendData(data);
        list.save(function(err, usr) {
          if (err) return console.error(err);
        });
    }
    else
      friendData.update({'id':data.id, 'name':data.name, 'friends':data.friends})
  });
  
}
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
module.exports.setParent=function(postnum){
  console.log('insetParent');
  var query = user.find({'post':postnum, 'event':'login'}).sort({'time':'ascending'});
  query.lean().exec(function(err,docs){
    if(err) return handleError(err);
    else{
      var logIn = docs;
      //console.log(logIn);
      var query2 = t1.find({'post':postnum}).sort({'_id':'ascending'});
      query2.lean().exec(function (err, docs){
        if(err) return handleError(err);
        else{
          var par = docs;
          //console.log(par);
          if(par[0] == undefined){
            console.log('no previous data');
                    var uShare = user.find({'event':'share', 'post':postnum}).sort({'time':'ascending'});
                    uShare.select('id time');
                    uShare.lean().exec(function (err, docs) {
                      if (err) return handleError(err);
                      else{
                        var uS = docs;
                        var uLS = new Array(); //login and share
                        var uLO = new Array(); //login only
                        var tempL = logIn.pop(); //first login
                        var tempS = uS.pop();//first share
                        while(uS.length >=0 && tempL != undefined && tempS != undefined){
                          if(tempL.id == tempS.id){
                            var match = new Object();
                            match.id = tempL.id;
                            match.name = tempL.name;
                            match.loginTime = tempL.time;
                            match.shareTime = tempS.time;
                            match.parent = 'source';
                            match.status = 2;
                            uLS.unshift(match);
                            if(uS.length != 0){
                              tempL = logIn.pop();
                              tempS = uS.pop();
                            }
                            else
                              break;      
                          }
                          else if(tempL.id != tempS.id){      
                            logIn.unshift(tempL);
                            tempL = logIn.pop();
                          }
                        }
                        tempL = logIn.pop();
                        while(logIn.length >= 0 && tempL != undefined){ //basic setting for the user only login
                          var dismatch = new Object();
                          dismatch.id = tempL.id;
                          dismatch.name = tempL.name;
                          dismatch.loginTime = tempL.time;
                          dismatch.parent = 'source';
                          dismatch.status = 0;
                          uLO.unshift(dismatch);
                          tempL = logIn.pop();
                        } 
                        for(var i = 1; i < uLS.length; i++){ //skip the definitely link to source user
                          var uLtime = uLS[i].loginTime;
                          var uFrd = friend.find({'id':uLS[i].id});
                          uFrd.lean().exec(function (err, docs) {
                            if (err) return handleError(err);
                            else{
                              if(docs!=''){
                                var beTN = docs[0].name;
                                var beTest = docs[0].friends.slice();
                                var toTest = uLS.slice();
                                for(var j = i-1; j>=0; j--){
                                  var n = 0;
                                  while(n<=beTest.length && beTest[n]!= undefined){
                                    if(toTest[j].name == beTest[n]){
                                      var k = 0;
                                      while( k < uLS.length){
                                        if(uLS[k].name == beTN){
                                          uLS[k].parent = beTest[n];
                                          break;
                                        }
                                        k++;
                                      }
                                      break;
                                    }
                                    n++;
                                  }
                                }//end of finding parent for share-user
                                var boo = 0;
                                for(var j = 0; j < uLO.length; j++){
                                  var oLtime = uLO[j].loginTime;
                                    var oFrd = friend.find({'id':uLO[j].id});
                                    oFrd.lean().exec(function (err, docs) {
                                      if (err) return handleError(err);
                              else{
                                if(docs!=''){
                                  var beTn = docs[0].name;
                                  var beTe = docs[0].friends.slice();
                                  var toTe = uLO.slice();
                                  for(var k = uLS.length-1; k >= 0; k--){
                                    var m = 0;
                                    while(m<= beTe.length && beTe[m]!= undefined){
                                      if(uLS[k].name == beTe[m]){
                                        var t = 0
                                        while(t<toTe.length){
                                          if(toTe[t].name == beTn && toTe[t].loginTime > uLS[k].shareTime){
                                            uLO[t].parent = uLS[k].name;
                                            var query = t1.findOne({'name':uLO[t].name});
                                            query.exec(function(err, docs){
                                              if(err) return handleError(err);
                                              else{
                                          if(docs != null){
                                            var ID = docs._id;
                                                          t1.findByIdAndUpdate(ID,{$set:{'parent':uLO[t].parent}},function (err, docs) {
                                                          if (err) return handleError(err);
                                                                else{
                                                                  console.log(docs.name + ' '+uLO[t].parent+'endupdate');
                                                              }
                                                        });
                                          }
                                              }
                                            })
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
                          })
                        }
                      } 
                    })   
          }
          else if(logIn.length == par.length){
            console.log('no update');
          }
          else{
            console.log('need to add some tuple');
            var s = 0;
            var tempL = logIn.pop();
            var tempP = par.pop();
            while(s == 0){
              if(tempL.id == tempP.id && par.length!=0){
                tempL = logIn.pop();
                tempP = par.pop();
              }
              else if(tempL.id == tempP.id && par.length == 0){
                s = 1;
              }
              else{
                logIn.unshift(tempL);
                tempL = logIn.pop();
              }
            }
            console.log('logIn: ');
            console.log(logIn);
            var query3 = user.find({'post':postnum, 'event':'share'}).sort({'time':'ascending'});
            query3.select('id name time');
            query3.lean().exec(function(err,uS){
              if(err) return handleError(err);
              else{
                console.log('uS:');
                console.log(uS);
                for (var i = 0; i<logIn.length; i++){
                  var query4 = friend.find({'id':logIn[i].id});
                  query4.lean().exec(function (err, docs){
                          if (err) return handleError(err);
                        else if (docs != undefined){
                          var test = docs[0].id;
                          var frd = docs[0].friends.slice();
                            console.log('frd:');
                            console.log(frd);
                      var sta = 0;
                      var pare = 'source';
                      var tName;
                      for(var j = uS.length-1; j >= 0; j--){
                        for(var k = 0; k < frd.length; k++){
                          if(uS[j].id == frd[k].id){
                            for(var m = 0; m <= i; m++){
                              if(logIn[m].id == test){
                                tName = logIn[m].name;
                                if(logIn[m].time > uS[j].time){
                                            pare = uS[j].name;
                                  break;
                                } 
                              }
                            }
                          }
                          else if(uS[j].id == test){
                            tName = uS[j].name;
                            sta = 2;
                          }
                        }
                      }
                      if(pare == 'source'){
                        for(var m = 0; m < logIn.length; m++){
                          if(logIn[m].id == test){
                            tName = logIn[m].name;
                          }
                        }
                      }
                                      /*var tmp ={
                                  id:test,
                              post:postnum,
                                  name:tName,
                        parent:pare,
                        status:sta,
                                      };
                      console.log('tmp:');
                                  console.log(tmp);
                                    var t = new t1(tmp);
                                    t.save( function(err, data){
                                      if (err) return handleError(err); 
                                    });*/
                      //
                      var update = t1.findOne({'id':test});
                      update.exec(function(err, docs){
                        if(err) return handleError(err);
                        else{
                          var ID = docs._id;
                                  t1.findByIdAndUpdate(ID,{$set:{'parent':pare, 'status':sta}},function (err, docs) {
                                  if (err) return handleError(err);
                                        else{
                                          console.log(docs.name + 'endupdate');
                                        }
                                });
                        }
                      })
                      //
                        }
                        else{
                            console.log('docs content:' + docs +'no need to update');
                        }
        
                      })
                      var addNode = new Object();
                      addNode.id = logIn[i].id;
                      addNode.name = logIn[i].name;
                      addNode.post = postnum;
                      addNode.parent = 'source';
                      addNode.status = 0;
                          var t = new t1(addNode);
                          t.save( function(err, data){
                          if (err) return handleError(err); 
                  else 
                    console.log('node added');
                        });
                }
              }
            })
          }
        }
      })
    } 
  })

};
module.exports.addLike=function(postnum){

  var query = user.find({'event':'like', 'post': postnum }).sort({'time':'ascending'});
  query.select('id');
  query.lean().exec(function (err, docs) {
//    if (err) return handleError(err);
//    else{
    var likes = docs;
    //console.log('likes:');
    //console.log(likes);
    var query = t1.find({'post':postnum});
    query.lean().exec(function (err, docs) {
//      if (err) return handleError(err);
//      else{
        var par = docs;
        //console.log('par:');
        //console.log(par);
        var count = likes.length;
        var tempL = likes.pop();
        var tempP = par.pop();
        while(count!= 0){
        if(tempL.id == tempP.id && (tempP.status == 0 ||tempP.status == 2)){
            tempP.status++;
            t1.findByIdAndUpdate(tempP._id,{$set:{'status':tempP.status}},function (err, docs) {
//              if (err) return handleError(err);
//                    else{
                      console.log(tempP.id + '_status: '+tempP.status);
              console.log('endupdate');
                    
//                    }
          });
            //console.log(tempP._id);
            tempL = likes.pop();
            tempP = par.pop();
            count--;
          }
          else if(tempL.id == tempP.id && (tempP.status == 1 ||tempP.status == 3)){
                tempL = likes.pop();
                  tempP = par.pop();
            count--;
            console.log('already updated');
          }
          else{
            par.unshift(tempP);
            tempP = par.pop();
          }
        
        
        }
      
//      }
      console.log('end searching');
    })
//    }     
  })
  
};