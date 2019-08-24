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
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					campground.comments.push(comment);
					campground.save();
					res.redirect("/campgrounds/"+ campground._id);
				}
			});
		}
	});
});


router.get("/:comments_id/edit", function(req, res){
	Comment.findById(req.params.comments_id, function(err, foundComment){
		if(err){
			console.log(err);

		} else {
			res.render("editcomment.ejs", { campground_id:req.params.id, comment : foundComment});

		}
	});
	
});

router.put("/:comments_id", function(req, res){
	Comment.findByIdAndUpdate(req.params.comments_id, req.body.comment, function(err, updatedComment){
		if(err){
			res.redirect("back");
		} else {
			res.redirect("/campgrounds/"+req.params.id);
		}
	})
});

router.delete("/:comment_id", function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect("back");
		} else {
			res.redirect("/campgrounds/"+req.params.id);
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