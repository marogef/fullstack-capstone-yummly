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


//api call between the server and best buy api   
var getRecipes = function(recipe_name) {
    
    //console.log("inside the getrecipes function");
    
    var emitter = new events.EventEmitter();
    
    //https://www.npmjs.com/package/bestbuy
    var bby = require('yummly')('c3c9925e2332619d733e4d365ff2f08c');
    bby.recipes('(search=' + recipe_name + ')', {pageSize: 10}, function(err, data) {
      if (err) {
          console.warn(err);
          emitter.emit('api call retuned error:', err);
      }
      else if (data.total === 0) {
          console.log('No recipes found');
          emitter.emit('No recipes found', err);
      }
      else {
          console.log('Found %d recipes. First match "%s" is $%d', data.total, data.recipes[0].name, data.recipes[0].salePrice);
          emitter.emit('end', data);
      }
    });
    
    return emitter;
};

/* STEP 4 - defining the local api end points*/

//api call between the view and the controller
app.get('/recipe/:recipe_name', function(request, response) {
    //console.log(request.params.recipe_name);
    if (request.params.recipe_name == "") {
        response.json("Specify a recipe name");
    }
    else {
        var recipeDetails = getrecipes(request.params.recipe_name);

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

// app.post('/favorite-recipe', function(req, res) {
//     recipe.create({
//         name: req.body.recipeName
//     }, function(err, recipes) {
//         if (err) {
//             return res.status(500).json({
//                 message: 'Internal Server Error'
//             });
//         }
//         res.status(201).json(recipes);
//     });
// });
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

// app.delete('/delete-favorites', function (req, res) {
//     recipe.remove(req.params.id, function (err, items) {
//         if (err)
//             return res.status(404).json({
//                 message: 'Item not found.'
//             });

//         res.status(200).json(items);
//     });
// });

/* STEP 6 - start and run the server*/
exports.app = app;
exports.runServer = runServer;
app.listen(process.env.PORT, process.env.IP);