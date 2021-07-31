const e = require('express');
const express = require('express'); 
var authenticate = require('../authenticate');

const Favorites = require('../models/favorite');
const Leaders = require('../models/leaders');
const cors = require('./cors');

const favoriteRouter = express.Router();
favoriteRouter.use(express.json());

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res, next) => {res.sendStatus(200);} )

.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorites.find({userID: req.user._id})
    .populate('userID')
    .populate('dishes')
    .then((favorites) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({userID: req.user._id})
    .then((favorite) => {
        if(favorite != null)
        {
            req.body.map((dish) => {
                if(favorite.dishes.indexOf(dish._id) === -1)
                {
                    favorite.dishes = favorite.dishes.concat(dish._id);
                }
            });
            favorite.save()
            .then((favorite) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            }, (err) => next(err))
            .catch((err) => next(err));
        }
        
        else
        {
            dishes = [];
            req.body.map((dihs) => {
                dishes = dishes.concat(dihs._id);
            });
            Favorites.create({userID: req.user._id, dishes: dishes})
            .then((favorite) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            }, (err) => next(err))
            .catch((err) => next(err));
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})

.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.remove({userID: req.user._id})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
})

favoriteRouter.route('/:dihsId')
.options(cors.corsWithOptions, (req, res, next) => {res.sendStatus(200);} )

.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({userID: req.user._id})
    .then((favorite) => {
        if(favorite != null)
        {
            if(favorite.dishes.indexOf(req.params.dihsId) === -1)
            {
                favorite.dishes = favorite.dishes.concat(req.params.dihsId);
                favorite.save()
                .then((favorite) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                }, (err) => next(err))
                .catch((err) => next(err));
            }
            else
            {
                res.statusCode = 403;
                res.setHeader('Content-Type', 'application/json');
                res.json({success: 'false', msg: 'dish already exists in your favorites'});
            }
        }
        else
        {
            dishes = [];
            dishes = dishes.concat(req.params.dihsId);
            console.log(dishes);
            Favorites.create({userID: req.user._id, dishes: dishes})
            .then((favorite) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            }, (err) => next(err))
            .catch((err) => next(err));
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})

.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({userID: req.user._id})
    .then((favorite) => {
        favorite.dishes = favorite.dishes.filter((dish) => {dish !== req.params.dihsId});
        favorite.save()
        .then((favorite) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorite);
        }, (err) => next(err))
        .catch((err) => next(err));
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = favoriteRouter;