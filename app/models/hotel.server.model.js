'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Hotel Schema
 */
var HotelSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Hotel name',
		trim: true
	},
	address: {
		type: String,
		default: '',
		required: 'Please fill Hotel address',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Hotel', HotelSchema);
