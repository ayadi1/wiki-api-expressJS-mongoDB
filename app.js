const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const _ = require("lodash");
// use body Parser
app.use(bodyParser.urlencoded({ extended: true }));

// set view engine to ejs
app.set("view engine", "ejs");

// use static file
app.use(express.static("public"));

// conect to db
mongoose.connect("mongodb://localhost:27017/wikiDB");

const ArticlesSchema = new mongoose.Schema({
  title: String,
  contant: String,
});

const Articles = mongoose.model("Article", ArticlesSchema);
//TODO ////////////////////////////////////////////////////////edit single article////////
// get singel article
app.route("/articles/:title")
.get( (req, res) => {
  const articleNAme = _.lowerCase(req.params.title);
  Articles.find({ title: articleNAme }, (err, article) => {
    if (err) {
      res.send(err);
    } else {
      if (article.length > 0) {
        res.send(article);
      } else {
        res.json({ errurCode: 404, err: true, msg: "article not found" });
      }
    }
  });
})

// put singel article
.put( (req, res) => {
  const articleTitle = _.lowerCase(req.params.title);
  const newTitle = req.body.title;
  const newContant = req.body.contant;
  console.log(newTitle);
  Articles.updateOne(
    { title: articleTitle },
    { title: newTitle, contant: newContant },
    (err, result) => {
      console.log(result);
      if (!err) {
        res.json({ mgs: "article was updated", err: false });
      } else {
        res.send(err);
      }
    }
  );
})

.delete( (req, res) => {
  const articleTitle = _.lowerCase(req.params.title);
  Articles.deleteOne({ title: articleTitle }, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      console.log();
      if (result.deletedCount > 0) {
        res.json({ msg: "article was deleted", err: false });
      } else {
        res.json({ errurCode: 404, err: true, msg: "article not found" });
      }
    }
  });
})

.patch( (req, res) => {
  const articleTitle = req.params.title;

  const newContant = req.body;
  console.log(newContant);
  Articles.updateOne(
    { title: articleTitle },
    { $set: newContant },
    (err, result) => {
      if (err) {
        res.send(err);
      } else {
        console.log(result);
        if (result.modifiedCount > 0) {
          res.json({ msg: "article was updated", err: false });
        } else {
          res.json({ errurCode: 404, err: true, msg: "article not found" });
        }
      }
    }
  );
});

//TODO //////////////////////////////////////// edit all articles //////////////////////////////////////
app
  .route("/articles") //hundel http request
  .get((req, res) => {
    //get all articles
    Articles.find((err, data) => {
      if (!err) {
        res.send(data);
      } else {
        res.send(err);
      }
    });
  })
  .delete((req, res) => {
    //delete all articles
    Articles.deleteMany((err, result) => {
      if (err) {
        res.send(err);
      } else {
        console.log(result);
        res.json({ msg: "articles was deleted", err: false });
      }
    });
  })
  .post((req, res) => {
    //add new articles by post request
    const aTitle = _.lowerCase(req.body.title);
    const aContant = _.lowerCase(req.body.contant);
    console.log(req.body);
    const newArticle = new Articles({
      title: aTitle,
      contant: aContant,
    });
    newArticle.save((err) => {
      if (!err) {
        res.json({ err: false, msg: "article added" });
      } else {
        res.send(err);
      }
    });
  });

app.listen("3000", () => {
  console.log("your server is up");
});
