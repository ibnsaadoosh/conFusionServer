const mongoose = require('mongoose');

var favoriteSchema = new mongoose.Schema({
    userID: 
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    dishes: 
    [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Dish'
        }        
    ]
}, 
{
    timestamps: true
});

var Favorites = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorites;