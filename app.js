var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");

var campgrounds = [
	{name: "creek", image: "https://pixabay.com/get/5fe8d1434852b108f5d084609620367d1c3ed9e04e50744f712d7ad09044c2_340.jpg"}, 
	{name: "hill", image: "https://pixabay.com/get/57e2d54b4852ad14f6da8c7dda793f7f1636dfe2564c704c732b79d5934acc5f_340.jpg"}, 
	{name: "creek", image: "https://pixabay.com/get/5fe8d1434852b108f5d084609620367d1c3ed9e04e50744f712d7ad09044c2_340.jpg"}, 
	{name: "hill", image: "https://pixabay.com/get/57e2d54b4852ad14f6da8c7dda793f7f1636dfe2564c704c732b79d5934acc5f_340.jpg"}, 
	{name: "creek", image: "https://pixabay.com/get/5fe8d1434852b108f5d084609620367d1c3ed9e04e50744f712d7ad09044c2_340.jpg"}, 
	{name: "hill", image: "https://pixabay.com/get/57e2d54b4852ad14f6da8c7dda793f7f1636dfe2564c704c732b79d5934acc5f_340.jpg"}, 
	{name: "creek", image: "https://pixabay.com/get/5fe8d1434852b108f5d084609620367d1c3ed9e04e50744f712d7ad09044c2_340.jpg"}, 
	{name: "hill", image: "https://pixabay.com/get/57e2d54b4852ad14f6da8c7dda793f7f1636dfe2564c704c732b79d5934acc5f_340.jpg"}, 
	{name: "mountain", image: "https://pixabay.com/get/57e8d3444855a914f6da8c7dda793f7f1636dfe2564c704c732b79d5934acc5f_340.jpg"}
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

