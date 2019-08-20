var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campground");
var seedDB = require("./seeds.js");
var Comment = require("./models/comment");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./models/user");


mongoose.connect('mongodb://localhost:27017/myapp', {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));

seedDB();
app.use(require("express-session")({
	secret: "My name is mohit Saini",
	resave:false,
	saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



//SCHEMA SETUP
app.get("/", function(req, res){
	res.render("landing.ejs");
});

app.get("/campgrounds", function(reg, res){
	//get all campgrounds
	Campground.find({}, function(err, allcampgrounds){
		if(err){
			console.log(err);
		} else{
			res.render("campgrounds.ejs",{campgrounds: allcampgrounds});

		}
	});
});

app.post("/campgrounds", function(req, res){

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

app.get("/campgrounds/new", function(req, res){
	console.log("/campgrounds/new");
	res.render("new.ejs");
});

app.get("/campgrounds/:id", function(req, res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		} else {
			console.log(foundCampground)
			res.render("show.ejs",{campground: foundCampground});
		}
	})
});

//// comments routes

app.get("/campgrounds/:id/comments/new", function(req, res){
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

app.post("/campgrounds/:id/comments", function(req, res){
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


////++++++++++
app.get("/register", function(req, res){
	res.render("register.ejs");
});

app.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			console.log(err);
			return res.render("register.ejs");	
			}
		passport.authenticate("local")(req, res, function(){
			res.redirect("/campgrounds");
		});	
	});
});

//show login form
app.get("/login", function(req, res){
	res.render("login");
});

app.post("/login", passport.authenticate("local",
	{
		successRedirect: "/campgrounds",
	 	failureRedirect:"/login"
	}), function(req, res){

});

app.get("/logout", function(req, res){
	req.logout();
	res.redirect("/campgrounds");
});

app.listen(8080, function(){
	console.log("Server Started");
});

