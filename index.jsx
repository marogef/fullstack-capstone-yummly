var React = require('react');
var ReactDOM = require('react-dom');

var Person = function() {
    var name = 'Recipes of your choice';
    var imageUrl = 'http://www.supernaturalwiki.com/images/1/15/Zoolander.jpg';
    var job = 'Male model';
    return (
        <div className="Recipes">
            <div className="Recipe-name">{name}</div>
        </div>
    );
};

document.addEventListener('DOMContentLoaded', function() {
    ReactDOM.render(<Recipes />, document.getElementById('app'));
});