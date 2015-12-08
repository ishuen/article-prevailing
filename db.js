var mongoose = require('mongoose');
var express = require('express');
var sync = require('sync');

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
var temp1 = new mongoose.Schema({
  id:{type: String},
  post:{type: Number},
  name:{type: String},
  parent:{type: String},
  status:{type: Number},
})
var user = mongoose.model('users',userSchema);
var friend = mongoose.model('friends', friendSchema);
var t1 = mongoose.model('t1', temp1);


module.exports.userevent=function(data){
  userData.find({'name':data.name, 'event':data.event,'post':data.post}, function (err, docs) {
    if(docs.length==0){
      var myuser = new userData(data);
      myuser.save(function(err, usr) {
        if (err) return console.error(err);
      });
    }
  });
  
}
module.exports.friendlist=function(data){

  friendData.find({'id':data.id, 'name':data.name}, function (err, docs) {
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

/*
用法：
setNode(postnum);
*/
var findFriend=function(temp, login, share){
  var query = friend.find({'id':temp.id});
  query.lean().exec(function(err,docs){
    if(err) return handleError(err);
    else{
      if(docs[0] != undefined && docs[0]!= ' '){
        var frd = new Array();
        var par;
        var boo = 0;
        frd = docs[0].friends.slice();
        var last = login.length - 1;
        for(var i = last; i>=0; i--){
          if(login[i].id == temp.id){
            last = i;
            break;
          }
        }
        if(last > 0){
          last--;
          var ref = new Array();
          while(frd[0] != undefined){
            var tmp = frd.pop();
            for(var i = 0; i < share.length; i++){
              if(tmp.id == share[i].id){
                ref.unshift(tmp);
              }
            }
          }
          if(ref[0] != undefined){
            for(var i = last; i >= 0; i--){
              for(var j = 0; j < ref.length; j++){
                if(login[i].id == ref[j].id){
                  par = ref[j].name;
                  boo = 1;
                  break;
                }
              }
              if(boo == 1)
                break;
            }
            if(par != undefined){
              temp.parent = par;
            }
          }
        }
        //console.log(temp);
        /*var t = new t1(temp);
        t.save( function(err, data){
        if (err) return handleError(err);
        });*/
      }
      /*else{
        console.log(temp);
        var t = new t1(temp);
        t.save( function(err, data){
        if (err) return handleError(err);
        });
      }*/
      console.log(temp);
      var t = new t1(temp);
      t.save( function(err, data){
      if (err) return handleError(err);
      });
    }
  })
}
var checkAndDel=function(id, arr){
  if(arr.length == 1){
    if(id == arr[0].id)
      arr.pop();
  }
  else if(arr.length > 1){
    for(var i = 0; i < arr.length; i++){
      if(i == 0 && id == arr[i].id){
        arr.shift();
        return arr;
      }
      else if(i != 0 && id == arr[i].id){
        for(var j = i; j > 0; j--){
          arr[j] = arr[j - 1];
        }
        arr.shift();
        return arr;
      }
    }
    return arr;
  }
  return arr;
}
module.exports.setNode=function(postnum,res){
  var query = t1.remove({}, function (err,docs) {
    if (err) return handleError(err);
  });
  var query = user.find({'post':postnum}).sort({'time':'ascending'});
  query.lean().exec(function(err,docs){
    if(err) return handleError(err);
    else{
      var login = new Array();
      var like = new Array();
      var share = new Array();
      while(docs[0] != undefined){
        var temp = docs.pop();
        if(temp.event == "login")
        login.unshift(temp);
        else if(temp.event == "like")
          like.unshift(temp);
        else if(temp.event == "share")
          share.unshift(temp);
      }
      var share1 = new Array();
      share1 = share.slice();
      for(var i = 0; i < login.length; i++){
        var temp = new Object();
        temp.id = login[i].id;
        temp.name = login[i].name;
        temp.status = 0;
        temp.parent = 'source';
        var oriL = like.length;
        var oriS = share.length;
        var like2 = new Array();
        like2 = checkAndDel(temp.id, like);
        if(oriL > like2.length){
          temp.status = temp.status + 1;
          like = like2.slice();
        }
        var share2 = new Array();
        share2 = checkAndDel(temp.id, share);
        if(oriS > share2.length){
          temp.status = temp.status + 2;
          share = share2.slice();
        }
        var p1 = function(temp, login, share1){
          return new Promise(function(resolve, reject){
            resolve(findFriend(temp, login, share1));
          });
        };
        p1(temp, login, share1).then(function(){
          //console.log('sync');
        }).catch(function(error){
          console.log(error);
        });
      }
    }
  })
  res.end();
}
