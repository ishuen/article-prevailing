var express = require('express');
var FB = require('fb');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'LeaderFinder' });
});

//module.exports = router;
module.exports = function(app){
	app.get('/', function(req, res){	
		res.render('index',{title:'LeaderFinder'});
			
	});

	app.get('/about', function(req, res){
		res.render('about',{title:'LeaderFinder'})
	});
};
