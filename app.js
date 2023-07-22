const express = require("express");
const body_parser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engjine", "ejs");

app.use(body_parser.urlencoded({
    extended : true
}));

app.use(express.static("public"));


mongoose.connect("mongodb+srv://<login>:<pass>@cluster0.8bdimyq.mongodb.net/wikiDB?retryWrites=true&w=majority")

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);

app.route("/articles")
    .get((req,res)=>{
        Article.find({}).then((found_article)=>{
            res.send(found_article);
        }).catch((err)=>{
            res.send(err);
        })
    })
    .post((req, res)=>{
        const new_article = new Article({
            title: req.body.title,
            content: req.body.content
        });
        new_article.save().then(()=>{
            console.log("success!")
        }).catch((err)=>{
            console.log(err);
        });
    })
    .delete((req, res)=>{
        Article.deleteMany({}).then(()=>{
            console.log("Deleted with success!");
        }).catch((err)=>{
            console.log(err);
        })
    });

///////////////////////specific ariticle///////////////////


app.route("/articles/:article_title")

.get((req, res)=>{
    Article.findOne({title: req.params.article_title}).then((found_article)=>{
        if (found_article)
        {
            res.send(found_article);
        }
        else
        {
            res.send("No articles matching that title was found");
        }
    })
})

.put((req, res)=>{
    Article.updateOne(
        {
            title: req.params.article_title
        },
        {
            title: req.body.title, content: req.body.content
        })
    .then(()=>{
        console.log("successfully updated!");
    }).catch((err)=>{
        console.log(err);
    })
})
.patch((req, res)=>{
    Article.updateOne((
    {
        title: req.params.article_title
    },
    {
        $set : req.body
    })).then(()=>{
        console.log("Patch operation success!")
    }).catch((err)=>{
        console.log(err);
    })
})
.delete((req, res)=>{
    Article.deleteOne(
        {title: req.params.article_title}
    ).then(()=>{
        console.log("deleted successfully!");
    }).catch((err)=>{
        console.log(err);
    })
});

app.listen(3000, ()=>{
    console.log("Server stated on port 3000");
});
