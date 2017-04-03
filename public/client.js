//function to hide results when document loads
$(document).ready(function() {
    $(".search-results").hide();
    getFavoriteProducts();
});

//Function for when the user presses enter to display results
$(document).on('keypress', function(key) {
    if (key.keyCode == 13) {
        var userInput = $('#search-section').val();
        getResults(userInput);
    }
});

//Fuction when the user clicks to see the results
$(document).on('click', "#userInput", function(key) {
    
    var userInput = $('#search-section').val();
    getResults(userInput);
    $('#search-section').val('');
});

//function to get results from api
function getResults(query) {
    //console.log(query);
    var url = '/product/' + query;
    $.ajax({
        method: 'GET',
        dataType: 'json',
        url: url,
    }).done(ajaxDone).fail(ifResultsFail);
}
//function to get the shorten the output
function sanitizeJSON(unsanitized) {
    var str = JSON.stringify(unsanitized);
    var output = str
        .replace(/\\/g, "-")
        .replace(/\//g, "-")
        .replace(/\n/g, "")
        .replace(/\r/g, "")
        .replace(/\t/g, "")
        .replace(/\f/g, "")
        .replace(/"/g, "")
        .replace(/'/g, "")
        .replace(/\®/g, "")
        .replace(/\&/g, "");
    return output;
}

//function for showing results
function resultsIntoListItem(output, product) {
    var isSale;
    output += '<li>';
    output += '<div class="product-container">';
    output += '<div class="title-wrapper"><h3 class="clamp-this">' + sanitizeJSON(product.name) + '</h3></div>';
    output += '<img src="' + product.image + '">';
    output += '<div class = "product-details">';
    if (product.customerReviewCount != null) {
        output += '<p class="review-num">' + product.customerReviewCount + ' Reviews</p>';
    }
    if (product.customerReviewAverage != null) {
        output += '<p class="star-avg">' + product.customerReviewAverage + ' Stars</p>';
    }

    if ((product.salePrice < product.regularPrice) && (product.salePrice != null)) {
        output += '<p class="reg-price strikethrough">$' + product.regularPrice + '</p>';
        output += '<p class="sale-price highlight">Sale: $' + product.salePrice + '</p>';
        isSale = true;
    }
    else {
        output += '<p class="reg-price strong no-sale">$' + product.regularPrice + '</p>';
        isSale = false;
    }
    output += '</div>';
    if (isSale == false) {
        output += '<a href="' + product.addToCartUrl + '" class="add-to-cart">Add to Cart</a>';
    }
    else {
        output += '<a href="' + product.addToCartUrl + '" class="add-to-cart sale-button">Add to Cart</a>';
    }
    output += '</div>';
    output += '</li>';
    return output;
}
//clicking the favorites to add the product 
$(document).on('click', ".favorites", function(key) {
    var favoriteProductName = $(this).closest('.add-product-to-favorites').find('input').val();
    addFavoriteProduct(favoriteProductName);
});

//clicking the favorites to delete the favorites 
$(document).on('click', ".delete-favorites", function(key) {
    deleteFavorites();
});

//function to add items 
function addFavoriteProduct(favoriteProductName) {

    console.log(favoriteProductName);

    var favoriteProduct = {
        'productName': favoriteProductName
    };

    $.ajax({
            method: 'POST',
            dataType: 'json',
            data: favoriteProduct,
            url: '/favorite-product/',
        })
        .done(function(product) {
            getFavoriteProducts();
        })
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
        .done(function(product) {
            getFavoriteProducts();
        })
        .fail(ifResultsFail);
}
//function to get the favorite product
function getFavoriteProducts() {

    $.ajax({
            method: 'GET',
            dataType: 'json',
            url: '/favorite-products',
        })
        .done(function(products) {
            console.log(products);

            var buildTheHtmlOutput = "";

            $.each(products, function(productsKey, productsValue) {
                buildTheHtmlOutput += "<li>" + productsValue.name + "</li>";
            });

            //use the HTML output to show it in the index.html
            $(".favorites-container ul").html(buildTheHtmlOutput);

        })
        .fail(ifResultsFail);
}



//function to display results of list items
function resultsIntoListItem(output, product) {
    var isSale;
    output += '<li>';
    output += '<div class="product-container">';
    output += '<div class="add-product-to-favorites">';
    output += '<input type="hidden" value="' + sanitizeJSON(product.name) + '">';
    output += '<button class="favorites"><img src="images/add-to-favorites.png"></button>';
    output += '</div>';
    output += '<div class="title-wrapper"><h3 class="clamp-this">' + sanitizeJSON(product.name) + '</h3></div>';
    if (product.image != null) {
        output += '<img src="' + product.image + '">';
    }
    else {
        output += '<img src="images/product-image-not-found.gif">';
    }
    output += '<div class = "product-details">';
    if (product.customerReviewCount != null) {
        output += '<p class="review-num">' + product.customerReviewCount + ' Reviews</p>';
    }
    if (product.customerReviewAverage != null) {
        output += '<p class="star-avg">' + product.customerReviewAverage + ' Stars</p>';
    }

    if ((product.salePrice < product.regularPrice) && (product.salePrice != null)) {
        output += '<p class="reg-price strikethrough">$' + product.regularPrice + '</p>';
        output += '<p class="sale-price highlight">Sale: $' + product.salePrice + '</p>';
        isSale = true;
    }
    else {
        output += '<p class="reg-price strong no-sale">$' + product.regularPrice + '</p>';
        isSale = false;
    }
    output += '</div>';
    if (isSale == false) {
        output += '<a href="' + product.addToCartUrl + '" class="add-to-cart">Add to Cart</a>';

    }
    else {
        output += '<a href="' + product.addToCartUrl + '" class="add-to-cart sale-button">Add to Cart</a>';

    }
    output += '</div>';
    output += '</li>';
    return output;
}
//function in case if results fail
function ifResultsFail(jqXHR, error, errorThrown) {
    console.log(jqXHR);
    console.log(error);
    console.log(errorThrown);
}

//function for displaying output
function ajaxDone(result) {
    console.log("ajax done", result);
    var output = '';
    if (result.products.length == 0) {
        alert('No Results Found!');
    }
    else {
        if (!result.error && result.products) {
            output = result.products.reduce(resultsIntoListItem, '');
        }
        else {
            output = 'Unable to access products (see browser console for more information)';
        }
        $('.results ul').html(output);
    }
}