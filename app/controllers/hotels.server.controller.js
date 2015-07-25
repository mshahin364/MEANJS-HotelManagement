'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Hotel = mongoose.model('Hotel'),
	_ = require('lodash');

/**
 * Create a Hotel
 */
exports.create = function(req, res) {
	var hotel = new Hotel(req.body);
	hotel.user = req.user;

	hotel.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(hotel);
		}
	});
};

/**
 * Show the current Hotel
 */
exports.read = function(req, res) {
	res.jsonp(req.hotel);
};

/**
 * Update a Hotel
 */
exports.update = function(req, res) {
	var hotel = req.hotel ;

	hotel = _.extend(hotel , req.body);

	hotel.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(hotel);
		}
	});
};

/**
 * Delete an Hotel
 */
exports.delete = function(req, res) {
	var hotel = req.hotel ;

	hotel.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(hotel);
		}
	});
};

/**
 * List of Hotels
 */
exports.list = function(req, res) { 
	Hotel.find().sort('-created').populate('user', 'displayName').exec(function(err, hotels) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(hotels);
		}
	});
};

/**
 * Hotel middleware
 */
exports.hotelByID = function(req, res, next, id) { 
	Hotel.findById(id).populate('user', 'displayName').exec(function(err, hotel) {
		if (err) return next(err);
		if (! hotel) return next(new Error('Failed to load Hotel ' + id));
		req.hotel = hotel ;
		next();
	});
};

/**
 * Hotel authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.hotel.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
