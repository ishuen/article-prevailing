FB.login(function(response) {
  FB.api('/me', function(response) {
    var url = $window.location.href;
    var split = url.split('/');
    var postid = parseInt(split[split.length-1]);
    userdata.id=response.id;
    userdata.name=response.name;
    userdata.time = new Date().getTime();
    userdata.event=event_type;
    userdata.post=postid;
    window.user=angular.copy(userdata);
    console.log('Name:' + userdata.name + userdata.event);
    console.log('ID:' + userdata.id + '.');
    console.log('Postid:', userdata.post); 
    console.log('Time:', userdata.time); 
    user = angular.copy(userdata);
    var passdata= angular.copy(userdata);
    console.log('userdata',passdata);
    $http.post('/user',passdata).
      success(function(data, status, headers, config) {
        console.log('userpassing!');
      }).
      error(function(data, status, headers, config) {
        console.log('error',status);
      });
    FB.api('/me/taggable_friends', function(response) {
      
      var tempfriend = response.data;
      console.log('tempfriend',tempfriend);
      var friends=[];
      for(var i = 0; i<tempfriend.length;i++)
        friends.push(tempfriend[i].name);
      console.log('friends',friends);

      var frienddata = 
      {
        "id": user.id,
        "name": user.name,
        "friends": friends
      };
      $http.post('/friends',frienddata).
        success(function(data, status, headers, config) {
          console.log('friendpassing!');
        }).
        error(function(data, status, headers, config) {
          console.log('error',status);
        });
    });  
  });
  
}, {scope: 'user_friends'});