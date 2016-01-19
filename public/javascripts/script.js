var app = angular.module('graphui', ['ui.router','ui.bootstrap','ngAnimate']);
var menu = [
    {
        "key":"graph1507",
        "title":"人物專訪",
        "url":"",
        "icon":"",
        "open":"",
        "class":"fa fa-video-camera",
        "children":[
            {
                "key":"1",
                "title":"翟本喬找員工　有三種人一定不用",
                "desc":"面試時不用花俏考題，僅要求未來員工要有「找出新解答」的能力；但有三種人一律不用──說謊、吹牛、自以為是，他說：「是不是嘴砲型，其實還滿容易看出來的。",
                "url":"/graph/1",
                "templateUrl":"/views/partials/graph1507-1.html",
                "pic":"http://static.ettoday.net/images/1118/d1118474.jpg"
            }
        ]
    },
    {
        "key":"graph1508",
        "title":"時事評論",
        "url":"",
        "icon":"",
        "open":"",
        "class":"fa fa-newspaper-o",
        "children":[
            {
                "key":"2",
                "title":"觀點：巴黎如何避免下一次恐怖襲擊？",
                "desc":"巴黎一向以花都、時尚之都、浪漫之都著稱於世。然而2015年，巴黎卻成為全球矚目的恐怖之都。",
                "url":"/graph/2",
                "templateUrl":"/views/partials/graph1508-1.html",
                "pic":"http://ichef-1.bbci.co.uk/news/ws/660/amz/worldservice/live/assets/images/2015/11/14/151114212740_bataclan_512x288_getty_nocredit.jpg"
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
                "key":"3",
                "title":"風和日麗去野餐！5個穿搭Tips讓你成為動靜皆宜的it Girl",
                "desc":"女孩子總是對於野餐有許多嚮往～像是夢幻的野餐單品、精緻的美食小點、三五好友再加上晴朗的藍天白雲，都是完美野餐不可或缺的元素呢！除此之外，美美的野餐穿搭對於女孩們來說也是個重要的關鍵！今天妞編輯就是要來告訴大家幾個野餐穿搭的Tips給所有想去野餐的妞妞參考，想要成為動靜皆宜的時尚it girl，就接著看下去囉～",
                "url":"/graph/3",
                "templateUrl":"/views/partials/graph1506-1.html",
                "pic":"http://www.niusnews.com/upload/imgs/default/15AugM/0828C/11.png"
            }
        ]
    },
    {
        "key":"admin",
        "title":"Administration",
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
var manager=["10203998599603812","1017611864963543","965798553455336"];

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
  var openmenu=function(){
    var url = $window.location.href;
    var split = url.split('/');
    if(split[split.length-1].split('-')[0]=="admin")
      return;
    var postno = split[split.length-1];

    for(var i=0; i<$scope.sidemenu.length;i++){
      var smenu = $scope.sidemenu[i];
      if(smenu.key=='admin')
        continue;
      for(var j=0; j<smenu.children.length;j++){
        var child = smenu.children[j];
        if(postno == child.key){
          $scope.cursmenu=child;
          child.open=true;
          child.active=true;
          $scope.sidemenu[i].open=true;
          $scope.sidemenu[i].active=true;
          break;
        }
      }
    }
  }
  openmenu();
  $scope.clicksmenu=function(menu,smenu){
    if($scope.cursmenu!=null)
      $scope.cursmenu.active=false;

    for(var i = 0; i<menu.children.length;i++){
      if(smenu==menu.children[i])
        continue;    
      menu.children[i].open=false;
      menu.children[i].active=false;
    }
    smenu.open=!smenu.open;
    smenu.active=!smenu.active;
    $scope.cursmenu = smenu;
  }
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
      $scope.sidemenu[i].active=false;
    }
    item.open=!item.open;
    item.active=!item.active;
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
  $scope.username="";
  $scope.login=function(){
    var event_type="login";
    var userid, username=0;
    FB.login(function(response) {
      FB.api('/me', function(response) {
        var url = $window.location.href;
        var split = url.split('/');
        userdata.id=response.id;
        checkmanager(userdata.id);
        var postid = parseInt(split[split.length-1]);
        console.log('userid',response.id);
        if(response.id==null){
          $scope.notlog=true;
          return;
        }
        $scope.username=response.name;
        userdata.name=response.name;
        userdata.time = new Date().getTime();
        userdata.event=event_type;
        userdata.post=postid;
        
        if(split[split.length-1].split('-')[0]=='admin')
          return; 
        user = angular.copy(userdata);
        var passdata= angular.copy(userdata);
        $http.post('/user',passdata).
          success(function(data, status, headers, config) {
          }).
          error(function(data, status, headers, config) {
          });
        FB.api('/me/friends', function(response) {
          var friend = response.data;
          var frienddata = 
          {
            "id": user.id,
            "name": user.name,
            "friends": friend
          };
          $http.post('/friends',frienddata).
            success(function(data, status, headers, config) {
              $scope.checkliked(userdata);
              $scope.notlog=false;
            }).
            error(function(data, status, headers, config) {
            });
        });
      });
    }, {scope: 'user_friends'});
  };

  $scope.checkLogin=function(event_type){
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
        var passdata = angular.copy(userdata); 
        $http.post('/user',passdata).
          success(function(data, status, headers, config) {
            $scope.checkliked(userdata); 
          }).
          error(function(data, status, headers, config) {

          });
      }); 
         
    }); 
  }; 

  $scope.share = function(){
    var url = $window.location.href;
    var split = url.split('/');
    var title="";
    var pic="";
    var desc="";
    var postid = split[split.length-1];
    url ="https://mysterious-temple-7266.herokuapp.com/#/graph/"+postid;
    for(var i=0; i<$scope.sidemenu.length;i++){
      var category = $scope.sidemenu[i];
      if(category.key=="admin")
        break;
      for(var j=0; j<category.children.length;j++){
        var post = category.children[j];
        if(postid == post.key){
          pic = post.pic;
          title = post.title;
          desc = post.desc;
          break;
        }
      }
    }

    
    FB.ui({
      method: 'share_open_graph',
      action_type: 'og.likes',
      action_properties: JSON.stringify({
          object:{
            title:title,
            url:url,
            image:pic,
            description:desc
          }
      })
    }, function(response){
      $scope.checkLogin('share');
    });
    

  };

  $scope.like=function(){
    $scope.checkLogin('like');
  }; 
  $scope.checkliked=function(user){
    
    $http.get(userdataurl).
      success(function(data, status, headers, config) {
        for(var i=0; i<data.length;i++){
          if(data[i].post==user.post && data[i].id==user.id && data[i].event=="like"){
            $scope.liked=true;
            return;
          }
        }
        $scope.liked=false;
      }).
      error(function(data, status, headers, config) {

      });
  }
  $scope.logout=function(){
    $scope.notlog=true;
    FB.logout(function(response) {
      // user is now logged out
    });
  }


  //$scope.login();

});
app.controller('topologyCtrl', function ($scope,$q, $http, $window, $timeout, $uibModal) {
  $scope.options={
    1:'讀書不是「唯一」，但卻是「正確」的路。',
    2:'觀點：巴黎如何避免下一次恐怖襲擊？',
    3:'風和日麗去野餐！5個穿搭Tips讓你成為動靜皆宜的it Girl'
  };
  $scope.postid='1';
  var drawurl = "https://api.mongolab.com/api/1/databases/improject_database/collections/t1?apiKey=ewLJMRQEiyD4sjOletIG_jOF_ps2V5Ko";

  function declaration(){
    //treeData = [];
    // ************** Generate the tree diagram  *****************
    margin = {top: 20, right: 120, bottom: 20, left: 120},
      width = 960 - margin.right - margin.left,
      height = 500 - margin.top - margin.bottom;
    
    i = 0;

    tree = d3.layout.tree()
      .size([height, width]);

    diagonal = d3.svg.diagonal()
      .projection(function(d) { return [d.y, d.x]; });

    // clear old graph
    d3.select('#topology').select("svg").remove();
    // create new graph
    svg = d3.select('#topology').append("svg:svg")
      .attr("width", width + margin.right + margin.left)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  }
  function event(action) {
    if(action == "0")
      return "DarkGoldenRod";
    else if(action == "1") 
      return "steelblue";
    else if(action == "2")
      return "seagreen";
    else if(action == "3")
      return "black";
    else
      return "OrangeRed";
  }

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


  function update(source) {
    // Compute the new height, function counts total children of root node and sets tree height accordingly.
    // This prevents the layout looking squashed when new nodes are made visible or looking sparse when nodes are removed
    // This makes the layout more consistent.
    var levelWidth = [1];
    var childCount = function(level, n) {

      if (n.children && n.children.length > 0) {
        if (levelWidth.length <= level + 1) levelWidth.push(0);

        levelWidth[level + 1] += n.children.length;
        n.children.forEach(function(d) {
          childCount(level + 1, d);
        });
      }
    };
    childCount(0, root);
    var newHeight = d3.max(levelWidth) * 35; // 25 pixels per line  
    tree = tree.size([newHeight, width]);
    d3.select('#topology').select("svg").attr("height", newHeight + 30);  // addtional 30 pixel for the half-cut last node
    
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
      .attr("r", 8)
      .style("stroke", function(d) { return event(d.status);})
      .style("fill", "White"); ;

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
      .attr("d", diagonal); 
  }
  var drawtopology=function(){
    
    declaration('#topology');
    d3.json(drawurl, function(error, data) {
      for(var i=0; i<data.length;i++){
        var entry = data[i];
        delete entry.id;
        delete entry._id;
        delete entry.__v;
      }
      var myroot={"name":"source","parent":"none"};
      data.unshift(myroot);
      var treeData=[];
      turnFlat(data,treeData);
      root = treeData[0];
      update(root);
    }).header("Content-Type", "application/json");
    
  }

  $scope.transformdata=function(){
    var postid = {postid:parseInt($scope.postid)}
    $http.post('/transformdata',postid).
      success(function(data, status, headers, config) {
        drawtopology();
      }).
      error(function(data, status, headers, config) {
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
  $scope.type=$scope.options[0];
  $scope.entry=10;
  $scope.limitpagegroup=10;
  $scope.pageoption=[10,20,30,50];
  $scope.pagecount=1;
  $scope.entrycount=0;
  $http.get(userdataurl).
    success(function(data, status, headers, config) {
      $scope.fansdata=angular.copy(data);
      origindata=angular.copy(data);
      $scope.arrangedata($scope.type.key);
      $scope.countpage();
    }).
    error(function(data, status, headers, config) {
    });
  $scope.arrangedata=function(type){
    var idtemp=[];
    var temp=[];
    var mydata = origindata;
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
  }
  $scope.setpagelist=function(){
      var pagelist=[];
      if($scope.curpage==undefined)
        return;
      if($scope.limitpagegroup>$scope.pagecount){
        for(var i=0; i<$scope.pagecount;i++)
          pagelist.push(i);
      }
      else{
        var pos = Math.floor($scope.curpage/$scope.limitpagegroup);
        var end = $scope.limitpagegroup*(pos+1);
        if($scope.pagecount-pos*$scope.limitpagegroup<$scope.limitpagegroup)
          end = $scope.limitpagegroup*pos+$scope.pagecount%$scope.limitpagegroup;
        for(var i=$scope.limitpagegroup*pos;i<end;i++){
          if(i>$scope.entrycount-1)
            break;
          pagelist.push(i);
        }
        
     }   
     return pagelist;

    }

    $scope.countpage=function(){
      $scope.entrycount=0;
      var totalpage=$scope.fansdata.length;
      for(var i=0; i<$scope.options.length;i++){
        var key = $scope.options[i].key;
        var value = $scope.options[i].value;
        if(value){
          for(var j=0; j<$scope.fansdata.length;j++){
            var entrydata=$scope.fansdata[j];
            if(key==entrydata.event)
              $scope.entrycount++;
            
          }
        }
      }
      var leaving = $scope.entrycount%$scope.entry;
      if($scope.entrycount>=$scope.entry){
        if(leaving==0)
          $scope.pagecount=$scope.entrycount/$scope.entry;
        else
          $scope.pagecount=Math.ceil($scope.entrycount/$scope.entry);
      }
      else
        $scope.pagecount=1;
      $scope.curpage=0;
      $scope.changepage(0,'page');
      $scope.setpagelist();
    }
    $scope.changepage=function(page,type){
      if(type=="pre" && $scope.curpage==0)
        return;
      if(type=="next" && $scope.curpage>=$scope.pagecount-1)
        return;
      if(type=="pre")
        $scope.curpage-=1;
      else if(type=="next")
        $scope.curpage+=1;
      else{
        $scope.curpage=page;
      }
      var pos = Math.floor($scope.curpage/$scope.limitpagegroup);
      var leave = $scope.curpage%$scope.entrycount;
      $scope.start=$scope.curpage*$scope.entry;
      $scope.end=$scope.start+$scope.entry;    
      
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

