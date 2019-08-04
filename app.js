var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

mongoose.connect('mongodb://localhost:27017/myapp', {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");

//SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String
});

var Campground = mongoose.model("Campground", campgroundSchema);


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
	var newCampground = { name: name, image: image};
	
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
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			console.log(err);
		} else {
			res.render("show",{campground: foundCampground});
		}
	})
});

app.listen(8080, function(){
	console.log("Server Started");
});

