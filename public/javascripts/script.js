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
                "title":"First Post",
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
                "title":"Second Post",
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
app.config(function($stateProvider, $urlRouterProvider,$controllerProvider) {

  $urlRouterProvider.otherwise("/");
  app.controllerProvider = $controllerProvider;
  
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
    console.log('login');
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
        var postid = parseInt(split[split.length-1]);
        if(typeof postid!="number")
          return;
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
            console.log('userpassing!');
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
          var postid = parseInt(split[split.length-1]);
          if(typeof postid!="number")
            return;
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
app.controller('topologyCtrl', function ($scope, $http, $window) {
  $scope.options={
    1:'First Post',
    2:'Second Post'
  };
  $scope.postid='1';
  function event(action) {
    if(action == "login")
      return "white";
    else if(action == "like") 
      return "steelblue";
    else if(action == "share")
      return "seagreen";
    else
      return "black";
  }

  var treeData = [];

  function turnFlat(data,treeData) {
    // *********** Convert flat data into a nice tree ***************
    // create a name: node map
    var dataMap = data.reduce(function(map, node) {
      map[node.name] = node;
      return map;
    }, {});

    // create the tree array
    data.forEach(function(node) {
      // add to parent
      var parent = dataMap[node.parent];
      if (parent) {
        // create child array if it doesn't exist
        (parent.children || (parent.children = []))
          // add node to child array
          .push(node);
      } else {
        // parent is null or missing
        treeData.push(node);
      }
    });
  }

  // ************** Generate the tree diagram  *****************
  var margin = {top: 20, right: 120, bottom: 20, left: 120},
    width = 960 - margin.right - margin.left,
    height = 500 - margin.top - margin.bottom;
    
  var i = 0;

  var tree = d3.layout.tree()
    .size([height, width]);

  var diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.y, d.x]; });

  var svg = d3.select("#topology").append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var url = "https://api.mongolab.com/api/1/databases/improject/collections/tryGraph?apiKey=R0klghAs8ttRla8MDvCfqAt_p8-2YmMu";


  function update(source) {

    // Compute the new tree layout.
    var nodes = tree.nodes(root).reverse(),
      links = tree.links(nodes);

    // Normalize for fixed-depth.
    nodes.forEach(function(d) { d.y = d.depth * 180; });

    // Declare the nodes…
    var node = svg.selectAll("g.node")
      .data(nodes, function(d) { return d.id || (d.id = ++i); });

    // Enter the nodes.
    var nodeEnter = node.enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { 
        return "translate(" + d.y + "," + d.x + ")"; });

    nodeEnter.append("circle")
      .attr("r", 10)
      .style("stroke", "DimGray")
      .style("fill", function(d) { return event(d.status); /* return d._children ? "lightsteelblue" : "#fff"; */});

    nodeEnter.append("text")
      .attr("x", function(d) { 
        return d.children || d._children ? -13 : 13; })
      .attr("dy", ".35em")
      .attr("text-anchor", function(d) { 
        return d.children || d._children ? "end" : "start"; })
      .text(function(d) { return d.name; })
      .style("fill-opacity", 1);

    // Declare the links…
    var link = svg.selectAll("path.link")
      .data(links, function(d) { return d.target.id; });

    // Enter the links.
    link.enter().insert("path", "g")
      .attr("class", "link")
  //      .style("stroke", function(d) { return d.target.level; })
      .attr("d", diagonal);

  }
  var drawtopology=function(){
    d3.json(url, function(error, data) {
      turnFlat(data,treeData);
      root = treeData[0];
      update(root);
    }).header("Content-Type", "application/json");
  }
  $scope.transformdata=function(){
    var postid = {postid:parseInt($scope.postid)}
    console.log('postid',postid);
    $http.post('/transformdata',postid).
      success(function(data, status, headers, config) {
        console.log('passing!');
        drawtopology();
      }).
      error(function(data, status, headers, config) {
        console.log('error',status);
      });

  }
  $scope.transformdata();

});
