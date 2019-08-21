var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");

// Comments New
router.get("/new", isLoggedIn,function(req, res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, campground){
		if(err){
			console.log(err);
		}
			else {
				console.log(campground);
				res.render("comments/new.ejs", {campground : campground});
	
			}
		})
	});

// Comments Create
router.post("/", isLoggedIn, function(req, res){
	Campground.findById(req.params.id,function(err, campground){
		if(err){
			console.log(err);
			
		} else{
			
			Comment.create(req.body.comment, function(err, comment){

				if(err){
					console.log(err);
				} else {
					campground.comments.push(comment);
					campground.save();
					res.redirect("/campgrounds/"+ campground._id);
				}
			});
		}
	});
});

//middleware
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

module.exports = router;