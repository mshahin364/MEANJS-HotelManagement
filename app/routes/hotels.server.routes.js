'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var hotels = require('../../app/controllers/hotels.server.controller');

	// Hotels Routes
	app.route('/hotels')
		.get(hotels.list)
		.post(users.requiresLogin, hotels.create);

	app.route('/hotels/:hotelId')
		.get(hotels.read)
		.put(users.requiresLogin, hotels.hasAuthorization, hotels.update)
		.delete(users.requiresLogin, hotels.hasAuthorization, hotels.delete);

	// Finish by binding the Hotel middleware
	app.param('hotelId', hotels.hotelByID);
};
