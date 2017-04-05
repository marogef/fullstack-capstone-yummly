/* STEP 1 - load external resources*/
//for express
var express = require('express');
var bodyParser = require('body-parser');
var events = require('events');
// var path=require('path');

//for the db
var mongoose = require('mongoose');
var config = require('./config');
var Recipe = require('./models/recipe');

//for api
var unirest = require('unirest');

/* STEP 2 - initialize the app*/
var app = express();

// serves static files and uses json bodyparser
app.use(bodyParser.json());
app.use(express.static('public'));

app.use(bodyParser.urlencoded({
    extended: true
}));

/* STEP 3 - creating objects and constructors*/
var runServer = function(callback) {
    mongoose.connect(config.DATABASE_URL, function(err) {
        if (err && callback) {
            return callback(err);
        }

        app.listen(config.PORT, function() {
            console.log('Listening on localhost:' + config.PORT);
            if (callback) {
                callback();
            }
        });
    });
};

if (require.main === module) {
    runServer(function(err) {
        if (err) {
            console.error(err);
        }
    });
};


//external api call function
var getRecipes = function (keyword, cuisine, args) {
    var emitter = new events.EventEmitter();
    unirest.get("http://api.yummly.com/v1/api/recipes?_app_id=6d9e22ab&_app_key=e4270a20949b90bf9cca1017d935f12b&q=" + keyword + "&allowedCuisine[]=cuisine^cuisine-" + cuisine + "&requirePictures=true")
        .qs(args)
        //after api call we get the response inside the "response" parameter
        .end(function (response) {
            //success scenario
            if (response.ok) {
                emitter.emit('end', response.body);
            }
            //failure scenario
            else {
                emitter.emit('error', response.code);
            }
        });
    return emitter;
};



/* STEP 4 - defining the local api end points*/

//api call between the view and the controller
app.get('/recipe/:keyword/:cuisine', function(request, response) {
    //console.log(request.params.recipe_name);
    
    //request.params.cuisine = "Italian";
    if (request.params.keyword == "") {
        response.json("Specify a keyword");
    }
    if (request.params.cuisine == "") {
        response.json("Specify a cuisine");
    }
    else {
        var recipeDetails = getRecipes (request.params.keyword, request.params.cuisine, {
        contentType: "application/json",
        async: false,
        dataType: "json"
});

        //get the data from the first api call
        recipeDetails.on('end', function(item) {
            //console.log(item);
            response.json(item);
        });

        //error handling
        recipeDetails.on('error', function(code) {
            response.sendStatus(code);
        });
    }
});

app.post('/favorite-recipes', function(req, res) {
    Recipe.create({
        name: req.body.recipeName
    }, function(err, recipes) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        res.status(201).json(recipes);
    });
});
app.get('/favorite-recipes', function(req, res) {
    Recipe.find(function(err, recipes) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        res.status(200).json(recipes);
    });
});

app.delete('/delete-favorites', function (req, res) {
    Recipe.remove(req.params.id, function (err, items) {
        if (err)
            return res.status(404).json({
                message: 'Item not found.'
            });

        res.status(200).json(items);
    });
});

/* STEP 6 - start and run the server*/
exports.app = app;
exports.runServer = runServer;
app.listen(process.env.PORT, process.env.IP);