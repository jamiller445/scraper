
// apiRoutes.js

const db = require("../models");
const axios = require("axios");
const cheerio = require("cheerio");

let siteURL = "https://www.greaterclevelandfoodbank.org/news";

module.exports = function(app) {

  // Route for saving/updating an Article's associated Note
app.post("/api/notes/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  console.log("req.body= ", req.body);
  db.Note.create(req.body)
    .then(function(dbNote) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for getting all Articles from the db
app.get("/api/articles", function(req, res) {
  // Grab every document in the Articles collection
  db.Article.find({})
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      // console.log("dbArticle ",JSON.stringify(dbArticle));
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/api/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// app.get("/api/notes/:id", function(req, res) {
//   // Grab every article note 
//   db.Article.find({})
//     .then(function(dbArticle) {
//       // If we were able to successfully find Articles, send them back to the client
//       // console.log("dbArticle ",JSON.stringify(dbArticle));
//       res.json(dbArticle);
//     })
//     .catch(function(err) {
//       // If an error occurred, send it to the client
//       res.json(err);
//     });
// });

 

    app.get("/api/scrape", function(req, res) {
        // Make a request via axios for the news section of `ycombinator`
        axios.get(siteURL).then(function(response) {
          // Load the html body from axios into cheerio
        //   console.log("response.data ", response.data);
          res.end(response.data);
          var $ = cheerio.load(response.data);
          // For each element with a "title" class
    
        
          let cnt = 0;
    
          $(".entry").each(function(i, element) {   
            // $("h1").text("News").each(function(i, element) {
            let result = {};
            cnt = cnt + 1;
        console.log("in elem parse count= ", cnt);
        // console.log("elem= ",element);
        // Save the text and href of each link enclosed in the current element
    
            result.title = $(element).find("a").attr("title");
            result.link = $(element).find("a").attr("href");   
            result.details = $(element).find(".details").text();
            result.desc = $(element).children(".details").next().text();

            // console.log("\ntitle= ", result.title, "\nlink= ", result.link, "\ndetails= ", result.details);
            // console.log("desc= ",result.desc);
      
            // If this found element had both a title and a link
            if (result.title && result.link) {
              db.Article.create(result)
              .then(function(dbArticle) {
                // View the added result in the console
                console.log(dbArticle);
              })
              .catch(function(err) {
                // If an error occurred, log it
                console.log(err);
              });  
            }
          });
        });
      
        // Send a "Scrape Complete" message to the browser
        res.send("Scrape Complete");
      });
};