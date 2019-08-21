var express = require("express");
var router = express.Router({mergeParams: true});

var Campground = require("../models/campground");
var Comment = require("../models/comment");

router.get("/", function(req, res){
	//get all campgrounds
	console.log(req.user);

	Campground.find({}, function(err, allcampgrounds){
		if(err){
			console.log(err);
		} else{
			res.render("campgrounds.ejs",{campgrounds: allcampgrounds });

		}
	});
});

router.post("/", function(req, res){

	// get data from and add to campgrounds array
	// redirect back to campground page
	var name = req.body.name;
	var image = req.body.image;
	var description = req.body.description;
	var newCampground = { name: name, image: image, description: description};
	
	Campground.create( newCampground, function(err, campground){
	if(err){
		console.log(err);
	}
	else{
		console.log("new campground created");
	}
	});

	res.redirect("/campgrounds");
	console.log("/campgrounds");
});

router.get("/new", function(req, res){
	console.log("/campgrounds/new");
	res.render("new.ejs");
});


router.get("/:id", function(req, res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		} else {
			console.log(foundCampground)
			res.render("show.ejs",{campground: foundCampground});
		}
	})
});

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

module.exports = router;