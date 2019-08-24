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


router.post("/", isLoggedIn, function(req, res){

	// get data from and add to campgrounds array
	// redirect back to campground page
	var name = req.body.name;
	var image = req.body.image;
	var description = req.body.description;
	var author = {
		id:req.user._id,
		username: req.user.username
	}
	var newCampground = { name: name, image: image, description: description, author: author};
	console.log("hello");
	console.log(req.user);
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

router.get("/new", isLoggedIn, function(req, res){
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

router.get("/:id/edit", checkCampgroundOwnership, function(req, res){
	
		Campground.findById(req.params.id, function(err, foundCampground){
		res.render("edit.ejs", {campground: foundCampground});
		
	});
});

router.put("/:id",checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds/"+req.params.id)
		}
	});
});


router.delete("/:id", checkCampgroundOwnership, function(req, res){
Campground.findByIdAndRemove(req.params.id, function(err){
	if(err){
		res.redirect("/campgrounds");
	} else {
		res.redirect("/campgrounds");
	}

});
});


router.get("/:comments_id/edit", function(req, res){
	res.send("hello");
});


function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

function checkCampgroundOwnership(req, res, next){
	if(req.isAuthenticated()){

		Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			res.redirect("back");
		} else {
				if(foundCampground.author.id.equals(req.user._id)){
				next();
			} else{
			res.redirect("back");
		}

			}
		
	});

	} else {
			res.redirect("back");
	}

}

module.exports = router;