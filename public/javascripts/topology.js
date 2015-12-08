var app = angular.module('graphui', ['ui.router','ui.bootstrap']);

app.controller('topologyCtrl', function ($scope, $http, $window) {

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
  $scope.url = 'http://localhost:8000';
  
  $scope.options={
    1:'First Post',
    2:'Second Post'
  };
  $scope.postid='1';
  $scope.drawtopology=function(){
    d3.json(url, function(error, data) {
      turnFlat(data,treeData);
      root = treeData[0];
      update(root);
    }).header("Content-Type", "application/json");
  }
  $scope.drawtopology();

});
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

var svg = d3.select("body").append("svg")
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
