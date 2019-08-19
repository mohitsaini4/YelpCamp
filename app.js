var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campground");
var seedDB = require("./seeds.js");


mongoose.connect('mongodb://localhost:27017/myapp', {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");

seedDB();
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
			res.render("show.ejs",{campground: foundCampground});
		}
	})
});

app.listen(8080, function(){
	console.log("Server Started");
});

