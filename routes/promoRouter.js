const express = require('express');

const Promotions = require('../models/promotions');
const cors = require('./cors');

var authenticate = require('../authenticate');

const promoRouter = express.Router();

promoRouter.use(express.json());

promoRouter.route('/')
.options(cors.corsWithOptions, (req, res, next) => {res.sendStatus(200);} )
.get(cors.cors, (req, res, next) =>
{
    Promotions.find({})
    .then((promotions) =>
    {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotions);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) =>
{
    Promotions.create(req.body)
    .then((promotion) =>
    {
        console.log('Promotion Created', promotion);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => 
{
    res.end('Put operation not supported on /promotion');
})

.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) =>
{
    Promotions.remove({})
    .then((resp) =>
    {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

promoRouter.route('/:promoId')
.options(cors.corsWithOptions, (req, res, next) => {res.sendStatus(200);} )
.get(cors.cors, (req, res, next) =>
{
    Promotions.findById(req.params.promoId)
    .then((promotion) =>
    {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) =>
{
    res.statusCode = 403;
    res.end('Post operation not supported no /promotion/'+ req.params.promoId);
})

.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) =>
{
    Promotions.findByIdAndUpdate(req.params.promoId,
                            {$set: req.body},
                            {new: true /*return the updated promotion */})
    .then((promotion) =>
    {
        res.statusCode = 200,
        res.setHeader('Content-Type', 'application/json'),
        res.json(promotion);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) =>
{
    Promotions.findByIdAndRemove(req.params.promoId)
    .then((resp) =>
    {
        res.statusCode = 200,
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = promoRouter;