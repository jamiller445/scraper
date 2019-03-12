
//  htmlRoutes.js

const db = require("../models");

module.exports = function(app) {

var axios = require("axios");
var cheerio = require("cheerio");
var mongojs = require("mongojs");

// let siteURL = "https://www.greaterclevelandfoodbank.org/news";

// Main route


app.get("/", function(req, res) {
    res.send(index.html);
  });

};
