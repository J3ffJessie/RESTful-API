//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//Database connection and creation of new DB
mongoose.connect("mongodb://localhost:27017/wikiDB", {
  //mongodb+srv://jeff-admin:breanna1@wikidb-jzzb8.mongodb.net/wikiDB  
  useNewUrlParser: true,
  useUnifiedTopology: true
});

//framework for articles collection
const articleSchema = {
  title: String,
  content: String
};

//building out the retrieval portion
const Article = mongoose.model("Article", articleSchema);

/////////////////////////////////////REQUESTS TARGETING ALL ARTICLES///////////////////////////////////////////////////////

//route chaining to clean up the code using app.route()
app.route("/articles")

  .get(function (req, res) {
    Article.find(function (err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      };
    });
  })

  .post(function (req, res) {

    //setup for adding new articles by creating the variable that will store the data
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });

    //allowing the information to be saved to the DB instead of just floating into space
    newArticle.save(function (err) {
      if (!err) {
        res.send("Successfully added a new article to DB");
      } else {
        res.send(err);
      }
    });
  })

  .delete(function (req, res) {
    Article.deleteMany(function (err) {
      if (!err) {
        res.send("Successfully deleted all articles.");
      } else {
        res.send(err);
      }
    });
  });


  /////////////////////////////////////REQUESTS TARGETING ALL ARTICLES///////////////////////////////////////////////////////


//chain route for specific article retrieval

app.route("/articles/:articleTitle")

.get(function(req, res){
  Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
    if (foundArticle){
      res.send(foundArticle);
    } else {
      res.send("No article matching that title found.");
    }
  });
})

.put(function(req, res){
  Article.update(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    {overwrite: true},
    function(err){
      if(!err){
        res.send("Successfully updated article in DB");
      }
    }
  );
})

.patch(function(req, res){
  Article.update(
    {title: req.params.articleTitle},
    {$set: req.body},
    function(err){
      if (!err) {
        res.send("Successfully updated the article with your provided changes.");
      }else{
        res.send(err);
      }
    }
  );
})

.delete(function(req,res){
  Article.deleteOne(
    {title: req.body.title},
    function(err){
      if (!err){
        res.send("Successfully deleted the requested article from the DB.");
      }else{
        res.send(err);
      }
    }
  );
});


app.listen(3000, function () {
  console.log("Server started on port 3000");
});