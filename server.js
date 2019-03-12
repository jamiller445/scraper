// Dependencies
const express = require("express");
// var mongojs = require("mongojs");
const mongoose = require("mongoose");
// Require axios and cheerio. This makes the scraping possible
const axios = require("axios");
const cheerio = require("cheerio");
const logger = require("morgan");


// Initialize Express
var app = express();

// Set the app up with morgan.
// morgan is used to log our HTTP Requests. By setting morgan to 'dev'
// the :status token will be colored red for server error codes,
// yellow for client error codes, cyan for redirection codes,
// and uncolored for all other codes.
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// include htmlRoute

require("./routes/htmlRoutes")(app);
require("./routes/apiRoutes")(app);

// Database configuration
mongoose.connect("mongodb://localhost/scraper", { useNewUrlParser: true });

// Listen on port 8080
// app.listen(3000, function() {
  app.listen(8080, function() {
    console.log("App running on port 8080!");
  });

