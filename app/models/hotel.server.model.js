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
	description: {
		type: String,
		default: '',
		required: 'Please fill Hotel description',
		trim: true
	},
	phoneNumber: {
		type: String,
		default: '',
		required: 'Please fill Hotel Phone Number',
		trim: true
	},
	emailAddress: {
		type: String,
		default: '',
		required: 'Please fill Hotel Email Address',
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
