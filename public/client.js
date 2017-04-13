//function to hide results when document loads
$(document).ready(function() {
    $(".search-results").hide();
    getFavoriteRecipes();
});

$('#searchButton').on('click', function(event) {
    event.preventDefault();

    var keyword = $('#ingredient').val();
    if (keyword == "") {
        console.log("Please enter a keyword");
    }
    var cuisine = $('#cuisine-name').val();
    if (cuisine == "") {
        console.log("Please enter a cuisine");
    }
    getRecipesFromBackend(keyword, cuisine);
});

//Function for when the user presses enter to display results
$(document).on('keypress', function(key) {
    if (key.keyCode == 13) {
        var keyword = $('#ingredient').val();
        if (keyword == "") {
            console.log("Please enter a keyword");
        }
        var cuisine = $('#cuisine-name').val();
        if (cuisine == "") {
            console.log("Please enter a cuisine");
        }
        getRecipesFromBackend(keyword, cuisine);
    }
});

function getRecipesFromBackend(keyword, cuisine) {

    $.ajax({
            type: "GET",
            url: "recipe/" + keyword + "/" + cuisine,
            dataType: 'json',
        })
        .done(function(result) {
            // console.log(result);


            $('.recipe-details').html('');
            $.each(result.matches, function(i, matches) {
                var recipeURL = matches.imageUrlsBySize[90].replace("http:", "https:");
                
                var output = '';
                output = '<li>';
                output += '<div class="add-product-to-favorites">';
                output += '<input type="hidden" value="' + matches.sourceDisplayName + '">';
                output += '<button class="favorites"><img src="assets/images/add-to-favorites.png"></button>';
                output += '</div>';
                output += '<div class="recipe-image">';
                output += '<img src="' + recipeURL + '" alt="Recipe image" width="170">';
                output += '</div>';
                output += '<div class="recipe-description">';
                output += '<p>' + matches.sourceDisplayName + '</p>';
                output += '<p><a target="_blank" href=https://www.yummly.com/recipe/' + matches.id + ' >' + matches.recipeName + '</a></p>';
                output += '<p>Cooking time: ' + matches.totalTimeInSeconds / 60 + ' minutes</p>';
                output += '<p>Rating: ' + matches.rating + '</p>';
                output += '</div>';
                output += '</li>';
                $('.recipe-details').append(output);
            });


        })
        .fail(function(jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
}



//clicking the favorites to add the recipe 
$(document).on('click', ".favorites", function(key) {
    var favoriteRecipeName = $(this).closest('li').find('input').val();
    // console.log(favoriteRecipeName);
    addFavoriteRecipe(favoriteRecipeName);
});

//clicking the favorites to delete the favorites 
$(document).on('click', ".delete-favorites", function(key) {
    deleteFavorites();
});
//&moved location to here
//function to get results from api
function getResults(query) {
    //console.log(query);
    var url = '/recipe/' + query;
    $.ajax({
        method: 'GET',
        dataType: 'json',
        url: url,
    }).done(ajaxDone).fail(ifResultsFail);
}


//function to add items 
function addFavoriteRecipe(favoriteRecipeName) {

    // console.log(favoriteRecipeName);

    var favoriteRecipe = {
        recipeName: favoriteRecipeName
    };

    $.ajax({
            method: 'POST',
            dataType: 'json',
            data: favoriteRecipe,
            url: '/favorite-recipes/',
        })
        .done(function(recipe) {
            getFavoriteRecipes();
        })
        // .fail(function(jqXHR, error, errorThrown) {
        //     console.log(jqXHR);
        //     console.log(error);
        //     console.log(errorThrown);
        // });
                .fail(ifResultsFail);

}

//function to delete favorites
function deleteFavorites() {
    console.log("inside delete favorites");
    $.ajax({
            method: 'DELETE',
            dataType: 'json',
            url: '/delete-favorites/',
        })
        .done(function(recipe) {
            getFavoriteRecipes();
        })
        // .fail(function(jqXHR, error, errorThrown) {
        //     console.log(jqXHR);
        //     console.log(error);
        //     console.log(errorThrown);
        // });
        
                .fail(ifResultsFail);

}
//function to get the favorite recipe
function getFavoriteRecipes() {

    $.ajax({
            method: 'GET',
            dataType: 'json',
            url: '/favorite-recipes',
        })
        .done(function(recipes) {
            // console.log(recipes);

            var buildTheHtmlOutput = "";

            $.each(recipes, function(recipesKey, recipesValue) {
                buildTheHtmlOutput += "<li>" + recipesValue.name + "</li>";
            });

            //use the HTML output to show it in the index.html
            $(".favorites-container ul").html(buildTheHtmlOutput);

        })
        // .fail(function(jqXHR, error, errorThrown) {
        //     console.log(jqXHR);
        //     console.log(error);
        //     console.log(errorThrown);
        // });
        
                .fail(ifResultsFail);
}






//function to get the shorten the output
// function sanitizeJSON(unsanitized) {
//     var str = JSON.stringify(unsanitized);
//     var output = str
//         .replace(/\\/g, "-")
//         .replace(/\//g, "-")
//         .replace(/\n/g, "")
//         .replace(/\r/g, "")
//         .replace(/\t/g, "")
//         .replace(/\f/g, "")
//         .replace(/"/g, "")
//         .replace(/'/g, "")
//         .replace(/\®/g, "")
//         .replace(/\&/g, "");
//     return output;
// }
//changed this
//function for showing results
function resultsIntoListItem(output, recipe) {
    var isSale;
    output += '<li>';
    output += '<div class="recipe-container">';
    output += '<div class="title-wrapper"><h3 class="clamp-this">' + sanitizeJSON(recipe.name) + '</h3></div>';
    output += '<img src="' + recipe.image + '">';
    output += '<div class = "recipe-details">';
    if (recipe.customerReviewCount != null) {
        output += '<p class="review-num">' + recipe.customerReviewCount + ' Reviews</p>';
    }
    if (recipe.customerReviewAverage != null) {
        output += '<p class="star-avg">' + recipe.customerReviewAverage + ' Stars</p>';
    }

    if ((recipe.salePrice < recipe.regularPrice) && (recipe.salePrice != null)) {
        output += '<p class="reg-price strikethrough">$' + recipe.regularPrice + '</p>';
        output += '<p class="sale-price highlight">Sale: $' + recipe.salePrice + '</p>';
        isSale = true;
    }
    else {
        output += '<p class="reg-price strong no-sale">$' + recipe.regularPrice + '</p>';
        isSale = false;
    }
    output += '</div>';
    if (isSale == false) {
        output += '<a href="' + recipe.addToCartUrl + '" class="add-to-cart">Add to Cart</a>';
    }
    else {
        output += '<a href="' + recipe.addToCartUrl + '" class="add-to-cart sale-button">Add to Cart</a>';
    }
    output += '</div>';
    output += '</li>';
    return output;
}

//changed this
//function to display results of list items
function resultsIntoListItem(output, recipe) {
    var isSale;
    output += '<li>';
    output += '<div class="recipe-container">';
    output += '<div class="add-recipe-to-favorites">';
    output += '<input type="hidden" value="' + sanitizeJSON(recipe.name) + '">';
    output += '<button class="favorites"><img src="images/add-to-favorites.png"></button>';
    output += '</div>';
    output += '<div class="title-wrapper"><h3 class="clamp-this">' + sanitizeJSON(recipe.name) + '</h3></div>';
    if (recipe.image != null) {
        output += '<img src="' + recipe.image + '">';
    }
    else {
        output += '<img src="images/recipe-image-not-found.gif">';
    }
    output += '<div class = "recipe-details">';
    if (recipe.customerReviewCount != null) {
        output += '<p class="review-num">' + recipe.customerReviewCount + ' Reviews</p>';
    }
    if (recipe.customerReviewAverage != null) {
        output += '<p class="star-avg">' + recipe.customerReviewAverage + ' Stars</p>';
    }

    if ((recipe.salePrice < recipe.regularPrice) && (recipe.salePrice != null)) {
        output += '<p class="reg-price strikethrough">$' + recipe.regularPrice + '</p>';
        output += '<p class="sale-price highlight">Sale: $' + recipe.salePrice + '</p>';
        isSale = true;
    }
    else {
        output += '<p class="reg-price strong no-sale">$' + recipe.regularPrice + '</p>';
        isSale = false;
    }
    output += '</div>';
    if (isSale == false) {
        output += '<a href="' + recipe.addToCartUrl + '" class="add-to-cart">Add to Cart</a>';

    }
    else {
        output += '<a href="' + recipe.addToCartUrl + '" class="add-to-cart sale-button">Add to Cart</a>';

    }
    output += '</div>';
    output += '</li>';
    return output;
}
// //function in case if results fail
function ifResultsFail(jqXHR, error, errorThrown) {
    console.log(jqXHR);
    console.log(error);
    console.log(errorThrown);
}

//function for displaying output
function ajaxDone(result) {
    console.log("ajax done", result);
    var output = '';
    if (result.recipes.length == 0) {
        alert('No Results Found!');
    }
    else {
        if (!result.error && result.recipes) {
            output = result.recipes.reduce(resultsIntoListItem, '');
        }
        else {
            output = 'Unable to access recipes (see browser console for more information)';
        }
        $('.results ul').html(output);
    }
}