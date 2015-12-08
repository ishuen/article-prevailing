var app = angular.module('graphui', ['ui.router','ui.bootstrap']);
var menu = [
    {
        "key":"graph1507",
        "title":"人物專訪",
        "url":"",
        "icon":"",
        "open":"",
        "class":"fa fa-newspaper-o",
        "children":[
            {
                "key":"1",
                "title":"讀書不是「唯一」，但卻是「正確」的路。",
                "url":"/graph/1",
                "templateUrl":"/views/partials/graph1507-1.html"
            }
        ]
    },
    {
        "key":"graph1506",
        "title":"美容時尚",
        "url":"",
        "icon":"",
        "open":"",
        "class":"fa icon-handbag",
        "children":[
            {
                "key":"2",
                "title":"風和日麗去野餐！5個穿搭Tips讓你成為動靜皆宜的it Girl",
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
        "class":"fa fa-area-chart",
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
var userdataurl = "https://api.mongolab.com/api/1/databases/improject_database/collections/users?apiKey=ewLJMRQEiyD4sjOletIG_jOF_ps2V5Ko";
var manager=["10203540396229014","100001442165775","100000756017779"];
var drawurl = "https://api.mongolab.com/api/1/databases/improject_database/collections/t1?apiKey=ewLJMRQEiyD4sjOletIG_jOF_ps2V5Ko";
app.controller('graphuiCtrl', function ($scope, $http, $window) {
  var user={};
  var userdata={
    "post": "",
    "event": "",
    "name": "",
    "id": "",
    "time": "" 
  };
  $scope.ifiammanager=false;
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
  $scope.ifinadmin=function(){
    var url = $window.location.href;
    var split = url.split('/');
    if(split[split.length-1].split('-')[0]=="admin")
      return true;
    return false;
  }
  
  $scope.seeotherpost=function(mymenu){
    if(mymenu.key!='admin')
      $scope.checkLogin('login');
  }
  var checkmanager=function(userid){
    if(manager.indexOf(userid)>=0)
      $scope.ifiammanager=true;
    else
      $scope.ifiammanager=false;
  }
  $scope.login=function(){
    var event_type="login";
    console.log('login');
    var userid, username=0;
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
        checkmanager(userdata.id);
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
              $scope.checkliked(userdata); 
            }).
            error(function(data, status, headers, config) {
              console.log('error',status);
            });
        });
      });
    }, {scope: 'user_friends'});
  };

  $scope.checkLogin=function(event_type){
    console.log('incheck');
    if(event_type=="login"){
      $scope.login();
      return;
    }
    FB.getLoginStatus(function(response){
      var time = new Date().getTime();
      FB.api('/me', function(response) {
        var url = $window.location.href;
        var split = url.split('/');
        var postid = parseInt(split[split.length-1]);
        userdata.id=response.id;
        userdata.name=response.name;
        userdata.time = new Date().getTime();
        userdata.event=event_type;
        userdata.post=postid;
        console.log('Name:' + userdata.name + userdata.event);
        console.log('ID:' + userdata.id + '.');
        console.log('Postid:', userdata.post); 
        console.log('Time:', userdata.time); 
        var passdata = angular.copy(userdata); 
        $http.post('/user',passdata).
          success(function(data, status, headers, config) {
            console.log('passing!');
            $scope.checkliked(userdata); 
          }).
          error(function(data, status, headers, config) {
            console.log('error',status);

          });
      }); 
         
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
  $scope.checkliked=function(user){
    console.log('checklikeduser',user);
    
    $http.get(userdataurl).
      success(function(data, status, headers, config) {
        for(var i=0; i<data.length;i++){
          if(data[i].post==user.post && data[i].id==user.id && data[i].event=="like"){
            $scope.liked=true;
            return;
          }
        }
        $scope.liked=false;
        //$scope.liked=data;
        console.log('liked',$scope.liked);
      }).
      error(function(data, status, headers, config) {
        console.log('error',status);

      });
  }
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
    '1':'First Post',
    '2':'Second Post'
  };
  $scope.postid='1';
  function event(action) {
    if(action == "0")
      return "white";
    else if(action == "1") 
      return "steelblue";
    else if(action == "2")
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
    height = 2000 - margin.top - margin.bottom;
    
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
    $http.get(drawurl).
      success(function(drawjson, status, headers, config) {
        console.log('drawjson',drawjson);
        var mydrawjson=[];
        for(var i=0; i<drawjson.length;i++){
          var entry = drawjson[i];
          if(i==0){
            var myroot={"name":"source"};
            mydrawjson.push(myroot);
          }
          if(entry.post==parseInt($scope.postid)){
            delete entry.id;
            delete entry._id;
            delete entry.__v;
            mydrawjson.push(entry);
          }
        }
        console.log('mydrawjson',mydrawjson);
        turnFlat(mydrawjson,treeData);
        root = treeData[0];
        update(root);
      }).
      error(function(data, status, headers, config) {
        console.log('error',status);
      });
    
  }
  $scope.transformdata=function(){
    var postid = {postid:parseInt($scope.postid)}
    console.log('postid',postid);
    $http.post('/transformdata',postid).
      success(function(data, status, headers, config) {
        console.log('transformpassing!');
        drawtopology();
      }).
      error(function(data, status, headers, config) {
        console.log('error',status);
      });

  }
  $scope.transformdata();

});
app.controller('fanCtrl', function ($scope, $http, $window) {
  $scope.fansdata=[];
  var origindata=[];
  $scope.ordercol='-count';
  $scope.options=[
    {key:"login",title:"Visit",value:true},
    {key:"like",title:"Like",value:true},
    {key:"share",title:"Share",value:true},
  ];
  $scope.type=$scope.options[1];
  $scope.pagelist=[];
  $scope.entry=10;
  $http.get(userdataurl).
    success(function(data, status, headers, config) {
      $scope.fansdata=angular.copy(data);
      origindata=angular.copy(data);
      console.log('origindata',origindata);
      $scope.arrangedata($scope.type.key);
      $scope.countpage();
    }).
    error(function(data, status, headers, config) {
      console.log('error',status);
    });
  $scope.pageoption=[10,30,50,100];
  $scope.arrangedata=function(type){
    var idtemp=[];
    var temp=[];
    var mydata = origindata;
    console.log('mydata',mydata);
    for(var i=0; i<mydata.length;i++){
      var entry = mydata[i];
      if(entry.event!=type)
        continue;
      if(idtemp.indexOf(entry.id)<0){
        var defaultdata={
          id:entry.id,
          event:entry.event,
          name:entry.name,
          count:1
        }
        idtemp.push(entry.id);
        temp.push(defaultdata);
      }
      else{
        for(var j=0; j<idtemp.length;j++){
          if(entry.id==idtemp[j])
            temp[j].count++;
        }
      }
    }
    $scope.fansdata=temp;
    $scope.countpage()
    console.log('data',$scope.fansdata);
  }
  $scope.countpage=function(){
    $scope.pagelist=[];
    var pagecount=0;
    var totalpage=$scope.fansdata.length;
    for(var i=0; i<$scope.options.length;i++){
      var key = $scope.options[i].key;
      var value = $scope.options[i].value;
      if(value){
        for(var j=0; j<$scope.fansdata.length;j++){
          var entrydata=$scope.fansdata[j];
          if(key==entrydata.event)
            pagecount++;
          
        }
      }
    }
    var entry;
    var leaving = pagecount%$scope.entry;
    if(pagecount>=$scope.entry){
      if(leaving==0)
        entry=pagecount/$scope.entry;
      else  
        entry=Math.ceil(pagecount/$scope.entry);
    }
    else
       entry=1;
    for(var i=0; i<entry;i++){
      $scope.pagelist.push(i);
    }
    $scope.curpage=0;
    $scope.changepage(0,'page');
  }
  $scope.changepage=function(index,pos){
    if(pos=="pre" && $scope.curpage==0)
      return;
    if(pos=="next" && $scope.curpage==$scope.pagelist.length-1)
      return;

    $scope.start=index*$scope.entry;
    $scope.end=$scope.start+$scope.entry-1;
    $scope.curpage=index;
  }
  $scope.sorting=function(asc){
    var desc = '-'+asc;
    if(!$scope.addingmode){
      var col = $scope.ordercol;
      if(asc==col)
        $scope.ordercol = desc;
      else
        $scope.ordercol = asc;  
    } 
  }

  $scope.issort=function(col){
    var type = $scope.ordercol;
    if(type==col)
        return true;
    return false;
  }

});
app.filter('slice', function() {
    return function(arr, start, end) {
      return (arr || []).slice(start, end);
    };
  });
