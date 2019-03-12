// Dependencies
const express = require("express");
// var mongojs = require("mongojs");
const mongoose = require("mongoose");
// Require axios and cheerio. This makes the scraping possible
const axios = require("axios");
const cheerio = require("cheerio");
const logger = require("morgan");

const PORT = process.env.PORT || 8080;

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

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scraper";

// Database configuration
// mongoose.connect("mongodb://localhost/scraper", { useNewUrlParser: true });
mongoose.connect(MONGODB_URI);

// Listen on port 8080
// app.listen(3000, function() {
  app.listen(PORT, function() {
    console.log("App running on port 8080!");
  });


