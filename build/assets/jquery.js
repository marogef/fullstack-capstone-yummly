$(document).ready( function() {
	$('#searchButton').on('click', function (event) {
	    event.preventDefault();
	    var keyword = $('#ingredient').val();
	    var cuisine = $('#cuisine-name').val();
	    recipeValidation(keyword,cuisine);
	});
});

var recipeValidation = function(keyword,cuisine) {
	if ((keyword == '') && (cuisine == null)) {
	   	alert('Please enter something in the text box and try again!');
	    $('.recipe-details').html('');
	    return false;
	} else {
		getRecipe(keyword,cuisine);
	}
}

// takes error string and turns it into displayable DOM element
var showError = function(error){
	var errorElem = $('.templates .error').clone();
	var errorText = '<p>' + error + '</p>';
	errorElem.append(errorText);
}

// takes a string of semi-colon separated tags to be searched
// for on StackOverflow
var getRecipe = function(keyword,cuisine) {
	
	var result = $.ajax({
		url: "https://crossorigin.me/http://api.yummly.com/v1/api/recipes?_app_id=6d9e22ab&_app_key=e4270a20949b90bf9cca1017d935f12b&q=" + keyword + "&allowedCuisine[]=cuisine^cuisine-" + cuisine + "&requirePictures=true",
		dataType: "jsonp",
		type: "GET"
		})
	.done(function(result){
		$('.recipe-details').html('');
		$.each(result.matches, function(i, matches) {
			var recipe = '<li><div class="recipe-image"><img src="' +
							matches.imageUrlsBySize[90] + '" alt="Recipe image" width="170"></div><div class="recipe-description"><p>' +
							matches.sourceDisplayName + '</p><p><a target="_blank" href=https://www.yummly.com/recipe/' +
							matches.id + ' >' + matches.recipeName + '</a></p><p>Cooking time: ' + 
							matches.totalTimeInSeconds/60 + ' minutes</p><p>Rating: ' + 
							matches.rating + '</p></div></li>';
			$('.recipe-details').append(recipe);
		});
	})
	.fail(function(jqXHR, error, errorThrown){
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
	});
}

