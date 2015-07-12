var app = angular.module('graphui', ['ui.router','ui.bootstrap']);
var menu = [
    {
        "key":"graph1507",
        "title":"2015-07",
        "url":"",
        "icon":"",
        "open":"",
        "children":[
            {
                "key":"1",
                "title":"去",
                "url":"/graph/1",
                "templateUrl":"/views/partials/graph1507-1.html"
            }
        ]
    },
    {
        "key":"graph1506",
        "title":"2015-06",
        "url":"",
        "icon":"",
        "open":"",
        "children":[
            {
                "key":"2",
                "title":"客",
                "url":"/graph/2",
                "templateUrl":"/views/partials/graph1506-1.html"
            }
        ]
    },
    {
        "key":"admin",
        "title":"Admin",
        "url":"",
        "icon":"",
        "open":"",
        "children":[
            {
                "key":"topology",
                "title":"Topology",
                "url":"/admin-topology",
                "templateUrl":"/views/partials/admin-topology.html"
            },
            {
                "key":"fans",
                "title":"Fans Rank",
                "url":"/admin-fans",
                "templateUrl":"/views/partials/admin-fans.html"
            }
        ]    
    }
];
app.config(function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise("/");
  
  for(var i = 0; i<menu.length;i++){
    var mmenu, smenu, skey, surl, stemplateurl=0;
    mmenu = menu[i];     
    mmenu.open=false;
    if(mmenu.children==null) 
      continue;
      
      for(var j = 0; j<mmenu.children.length;j++){
        smenu = mmenu.children[j];
        skey = mmenu.children[j].key;
        surl = smenu.url;
        stemplateurl = smenu.templateUrl;
        var sconfig = {url:surl, templateUrl: stemplateurl};
        //console.log('sconfig',sconfig);
        $stateProvider.state(mmenu.key+'-'+skey, sconfig); 
      }
      
  }

});
app.controller('graphuiCtrl', function ($scope, $http, $window) {

  for(var i = 0; i<menu.length;i++)
    menu[i].open=false;
  
  $scope.sidemenu = menu;

  $scope.changeroute=function(state){
    $scope.viewroute = state;
  };
  $scope.haschild=function(item){
    if(item.children!=null) 
      return true;
    else
      return false;
  };
  $scope.togglemenu=function(item){
    for(var i = 0; i<$scope.sidemenu.length;i++){
      if(item==$scope.sidemenu[i])
        continue;
      $scope.sidemenu[i].open=false;
    }
    item.open=!item.open;
  };
  $scope.notlog=true;
  $scope.url = 'http://localhost:8000';
  $scope.login=function(event_type){
    var userid, username=0;
    FB.login(function(response) {
      FB.api('/me', function(response) {
        userid=response.id;
        username=response.name;
        var time = new Date().getTime();
        console.log('Name:' + response.name + event_type);
        console.log('ID:' + response.id + '.');
        console.log('Time:', time); 
        
        var url = $window.location.href;
        var split = url.split('/');
        var postid = split[split.length-1];
        var passdata = 
        {
          "post": postid,
          "event": event_type,
          "name": response.name,
          "id": response.id,
          "time": time
        };
        $http.post('/user',passdata).
          success(function(data, status, headers, config) {
            console.log('passing!');
          }).
          error(function(data, status, headers, config) {
            console.log('error',status);
          });
      });
      FB.api('/me/taggable_friends', function(response) {
        
        var tempfriend = response.data;
        var friends=[];
        for(var i = 0; i<tempfriend.length;i++)
          friends.push(tempfriend[i].name);
        console.log('friends',friends);

        var passdata = 
        {
          "id": userid,
          "name": username,
          "friends": friends
        };
        $http.post('/friends',passdata).
          success(function(data, status, headers, config) {
            console.log('passing!');
          }).
          error(function(data, status, headers, config) {
            console.log('error',status);
          });
      });  
    }, {scope: 'user_friends'});
  };

  $scope.checkLogin=function(event_type){
    FB.getLoginStatus(function(response){
      if (response.status === 'connected') {
        var time = new Date().getTime();
        console.log('incheck');

        FB.api('/me', function(response) {
          console.log('Name:' + response.name + event_type);
          console.log('ID:' + response.id + '.');
          console.log('Time:', time); 
          var url = $window.location.href;
          var split = url.split('/');
          var postid = split[split.length-1];
          var passdata = 
          {
            "post": postid,
            "event": event_type,
            "name": response.name,
            "id": response.id,
            "time": time
          };
          $http.post('/user',passdata).
            success(function(data, status, headers, config) {
              console.log('passing!');
            }).
            error(function(data, status, headers, config) {
              console.log('error',status);

            });
        }); 
      }
      else{
        $scope.login('login');
      }     
    }); 
  }; 

  $scope.share = function(){
    console.log('inshare');
    FB.ui(
      {
        method: 'share',
        href: 'https://nuvnzuqxpe.localtunnel.me'
        //href: $window.location.href
      },
      function(response) {
        //console.log('inshare');
        if (response && !response.error_code){
          console.log('response',response);
          $scope.checkLogin('share');     
        }
      }
    );
  };

  $scope.like=function(){
    console.log('inlinke');
    $scope.checkLogin('like');
  }; 
  $scope.logout=function(){
    FB.logout(function(response) {
      
    });
  }
  $scope.logged=function(){
    $scope.notlog=false;
  }

  //$scope.login();

});
