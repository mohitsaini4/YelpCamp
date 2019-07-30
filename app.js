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

Campground.create(
	{
		name:"Salmon",
		image:"https://pixabay.com/get/57e8d0424a5bae14f6da8c7dda793f7f1636dfe2564c704c732b7ed5904bc05e_340.jpg"
	}
	, function(err, campground){
	if(err){
		console.log(err);
	}
	else{
		console.log("new campground created");
	}

	});

var campgrounds = [
	{name: "creek", image: "https://pixabay.com/get/52e3d5404957a514f6da8c7dda793f7f1636dfe2564c704c732b78dd9048c558_340.jpg"}, 
	{name: "creek", image: "https://pixabay.com/get/52e3d5404957a514f6da8c7dda793f7f1636dfe2564c704c732b78dd9048c558_340.jpg"}
	
	]

app.get("/", function(req, res){
	res.render("landing.ejs");
});

app.get("/campgrounds", function(reg, res){
	

	res.render("campgrounds.ejs",{campgrounds: campgrounds});

});

app.post("/campgrounds", function(req, res){

	// get data from and add to campgrounds array
	// redirect back to campground page
	var name = req.body.name;
	var image = req.body.image;
	var newCampground = { name: name, image: image};
	campgrounds.push(newCampground);
	res.redirect("/campgrounds");
	console.log("/campgrounds");
});

app.get("/campgrounds/new", function(req, res){
	console.log("/campgrounds/new");
	res.render("new.ejs");
});


app.listen(8080, function(){
	console.log("Server Started");
});

