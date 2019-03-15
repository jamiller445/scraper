//
// scraper.js
//

$(document).ready(function() {
  
  // Setting a reference to the article-container div where all the dynamic content will go
  // Adding event listeners to any dynamically generated "save article"
  // and "scrape new article" buttons
  var articleContainer = $(".article-container");

  // Adding event listeners for dynamically generated buttons for deleting articles,
  // pulling up article notes, saving article notes, and deleting article notes
  // $(document).on("click", ".btn.delete", handleArticleDelete);
  $(document).on("click", ".btn.notes", handleArticleNotes);
  $(document).on("click", ".btn.save", handleNoteSave);
  $(document).on("click", ".btn.note-delete", handleNoteDelete);
  // $(document).on("click", ".btn.save", handleArticleSave);
  // $(document).on("click", ".scrape-new", handleArticleScrape);

  $(document).on("click", "#saved", handleArticleScrape);

  $(document).on("click", ".scrape-new", articleScrape);

  
  // $(".clear").on("click", handleArticleClear);
  // $(".clear").on("click", handleArticleClear);

// // Grab the articles as a json
// $.getJSON("/api/articles", function(data) {
//   // For each one
//   for (var i = 0; i < data.length; i++) {
//     // Display the apropos information on the page
//     $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
//   }
// });

function handleNoteDelete() {
  // This function handles the deletion of notes
  // First we grab the id of the note we want to delete
  // We stored this data on the delete button when we created it
  // var currentArticle = $(this)
  //   .parents(".card")
  //   .data("_id");

  // let noteData = { _headlineId: $(this).data("article")._id, body: newNote };
  

  // console.log("article id=", JSON.stringify(noteData));
  let noteToDelete = $(this).data("_id");
  let articleToUpdate = $(this).data("_aid");
  console.log("article to update= ",articleToUpdate);
  // Perform an DELETE request to "/api/notes/" with the id of the note we're deleting as a parameter
  $.ajax({
    url: "/api/notes/" + noteToDelete,
    method: "DELETE",
    success: function (response) {
      console.log(response);
      bootbox.hideAll();
    },
    error: function (response) {
      console.log("Error: ", response);
    }
    })

  // .then(function() {
  //   // When done, hide the modal
  //   console.log("in handleNoteDelete");
  //   bootbox.hideAll();
  // });
}

function handleNoteSave() {
  // This function handles what happens when a user tries to save a new note for an article
  // Setting a variable to hold some formatted data about our note,
  // grabbing the note typed into the input box
  var noteData;
  var newNote = $(".bootbox-body textarea")
    .val()
    .trim();
  // If we actually have data typed into the note input field, format it
  // and post it to the "/api/notes" route and send the formatted noteData as well
  if (newNote) {
    noteData = { _headlineId: $(this).data("article")._id, body: newNote };
    // noteData = { _headlineId: $(this).data("article")._id, body: "TEST NOTE" };

    console.log("noteData= ", noteData);
    $.post("/api/notes/" + noteData._headlineId, noteData).then(function() {
      // When complete, close the modal
      bootbox.hideAll();
    });
  }
}

function renderNotesList(data) {
  // This function handles rendering note list items to our notes modal
  // Setting up an array of notes to render after finished
  // Also setting up a currentNote variable to temporarily store each note
  var notesToRender = [];
  var currentNote;
  console.log("all note data= ",JSON.stringify(data));
  console.log("notes in renderNotes= ", data.notes);
  if (!data.notes.length) {
    // If we have no notes, just display a message explaining this
    currentNote = $("<li class='list-group-item mb-2'>No notes for this article yet.</li>");
    notesToRender.push(currentNote);
  } else {
    // If we do have notes, go through each one
    for (var i = 0; i < data.notes.length; i++) {
      // Constructs an li element to contain our noteText and a delete button
      currentNote = $("<li class='list-group-item note mb-2'>")
        .text(data.notes[i].body)
        // .append($("<button class='btn btn-danger note-delete ml-3 btn-sm'>x</button>"));
        .append($("<button class='btn btn-danger note-delete ml-3 btn-sm' data-_id=" +
        data.notes[i]._id + " data-_aid=" + 
        data._id + ">x</button>"));
      // Store the note id on the delete button for easy access when trying to delete
      console.log("note del button id= ",data.notes[i]._id);
      // currentNote.children("button").data("_id", data.notes[i]._id);
      // Adding our currentNote to the notesToRender array
      notesToRender.push(currentNote);
    }
  }
  // Now append the notesToRender to the note-container inside the note modal
  $(".note-container").append(notesToRender);
}

function handleArticleNotes(event) {
  // This function handles opening the notes modal and displaying our notes
  // We grab the id of the article to get notes for from the card element the delete button sits inside
  var currentArticle = $(this)
    .parents(".card")
    .data();
  // Grab any notes with this headline/article id

  $.get("/api/articles/" + currentArticle._id).then(function(data) {
    console.log("data from get notes= ", JSON.stringify(data));

    console.log("notes for article 1", JSON.stringify(data.note));
    console.log("number of notes= ", data.note.length);

    // Constructing our initial HTML to add to the notes modal
    let modalText = $("<div class='container-fluid text-center'>").append(
      $("<h4>").text("Notes For Article: " + currentArticle._id),
      $("<hr>"),
      $("<ul class='list-group note-container'>"),
      // $("<textarea placeholder='New Note' rows='4' cols='60' mb-2 mr-3>"),
      $("<textarea class=form-control border placeholder='New Note' rows='4' cols='55'>"),
      $("<button class='btn btn-success btn-sm save mt-2'>Save Note</button>")
    );
    // Adding the formatted HTML to the note modal
    bootbox.dialog({
      message: modalText,
      closeButton: true
    });
    let noteData = {
      _id: currentArticle._id,
      // notes: data.note.body || []
      notes: data.note || []
    };
    // Adding some information about the article and article notes to the save button for easy access
    // When trying to add a new note
    $(".btn.save").data("article", noteData);
    console.log("noteDataFromArticle= ", JSON.stringify(noteData));
    // renderNotesList will populate the actual note HTML inside of the modal we just created/opened
    renderNotesList(noteData);
    // comment below
  });
}

function createCard(article) {
  // This function takes in a single JSON object for an article/headline
  // It constructs a jQuery element containing all of the formatted HTML for the
  // article card
  article.link = "https://www.greaterclevelandfoodbank.org/news/" + article.link;
  var card = $("<div class='card bg-light mt-3'>");
  var cardHeader = $("<div class='card-header'>").append(
    $("<h3>").append(
      $("<a class='article-link' target='_blank' rel='noopener noreferrer'>")
        .attr("href", article.link)
        .text(article.link),
        // $("<a class='btn btn-success btn-sm ml-2 notes'>Notes</a>")
      
      $("<a class='btn btn-success btn-sm ml-2 notes data-_id='" + article._id + ">Notes</a>")
      
    )
  );
//  var cardHeader = $(".card-header").append(article.title); 
//  $("#notes").append("<h2>" + data.title + "</h2>");

  // var cardBody = $("<div class='card-body'>").text(article.title);
  var cardBody = $("<div class='card-body text-dark'>").append(
    "<p><h4>Title:  " + 
    article.title + 
    "</p><p>Description:  " + 
    article.desc + 
    "</p><p>Date:  " + 
    article.details + "</h4></p>");
 

    card.append(cardHeader, cardBody);
    // We attach the article's id to the jQuery element
    // We will use this when trying to figure out which article the user wants to save
    // console.log("article._id= ", article._id);
    // card.data("_id", article._id);
    card.attr("data-_id", article._id);

    // We return the constructed card jQuery element
    return card;
  }

function renderArticles(articles) {
  // This function handles appending HTML containing our article data to the page
  // We are passed an array of JSON containing all available articles in our database
  var articleCards = [];
  // We pass each article JSON object to the createCard function which returns a bootstrap
  // card with our article data inside

  // console.log("articles length ",JSON.stringify(articles));

  for (var i = 0; i < articles.length; i++) {
    articleCards.push(createCard(articles[i]));
  }
  // console.log("articleCards= ",articleCards);

  // Once we have all of the HTML for the articles stored in our articleCards array,
  // append them to the articleCards container
  articleContainer.append(articleCards);
  console.log("\n")
}

function articleScrape(){
  $.get("/api/scrape")
}

function handleArticleScrape() {
  // This function handles the user clicking any "scrape new article" buttons
  $.get("/api/articles").then(function(data) {
    // console.log("data= ",JSON.stringify(data));
    renderArticles(data);
    // If we are able to successfully scrape the NYTIMES and compare the articles to those
    // already in our collection, re render the articles on the page
    // and let the user know how many unique articles we were able to save
    // initPage();
    // bootbox.alert($("<h3 class='text-center m-top-80'>").text(data.message));
    // alert($("<h3 class='text-center m-top-80'>").text(data.message));
    
    // alert($("<h3 class='text-center m-top-80'>").text(data.legth));


  });
}
});
