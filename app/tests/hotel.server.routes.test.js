'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Hotel = mongoose.model('Hotel'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, hotel;

/**
 * Hotel routes tests
 */
describe('Hotel CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Hotel
		user.save(function() {
			hotel = {
				name: 'Hotel Name'
			};

			done();
		});
	});

	it('should be able to save Hotel instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Hotel
				agent.post('/hotels')
					.send(hotel)
					.expect(200)
					.end(function(hotelSaveErr, hotelSaveRes) {
						// Handle Hotel save error
						if (hotelSaveErr) done(hotelSaveErr);

						// Get a list of Hotels
						agent.get('/hotels')
							.end(function(hotelsGetErr, hotelsGetRes) {
								// Handle Hotel save error
								if (hotelsGetErr) done(hotelsGetErr);

								// Get Hotels list
								var hotels = hotelsGetRes.body;

								// Set assertions
								(hotels[0].user._id).should.equal(userId);
								(hotels[0].name).should.match('Hotel Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Hotel instance if not logged in', function(done) {
		agent.post('/hotels')
			.send(hotel)
			.expect(401)
			.end(function(hotelSaveErr, hotelSaveRes) {
				// Call the assertion callback
				done(hotelSaveErr);
			});
	});

	it('should not be able to save Hotel instance if no name is provided', function(done) {
		// Invalidate name field
		hotel.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Hotel
				agent.post('/hotels')
					.send(hotel)
					.expect(400)
					.end(function(hotelSaveErr, hotelSaveRes) {
						// Set message assertion
						(hotelSaveRes.body.message).should.match('Please fill Hotel name');
						
						// Handle Hotel save error
						done(hotelSaveErr);
					});
			});
	});

	it('should be able to update Hotel instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Hotel
				agent.post('/hotels')
					.send(hotel)
					.expect(200)
					.end(function(hotelSaveErr, hotelSaveRes) {
						// Handle Hotel save error
						if (hotelSaveErr) done(hotelSaveErr);

						// Update Hotel name
						hotel.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Hotel
						agent.put('/hotels/' + hotelSaveRes.body._id)
							.send(hotel)
							.expect(200)
							.end(function(hotelUpdateErr, hotelUpdateRes) {
								// Handle Hotel update error
								if (hotelUpdateErr) done(hotelUpdateErr);

								// Set assertions
								(hotelUpdateRes.body._id).should.equal(hotelSaveRes.body._id);
								(hotelUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Hotels if not signed in', function(done) {
		// Create new Hotel model instance
		var hotelObj = new Hotel(hotel);

		// Save the Hotel
		hotelObj.save(function() {
			// Request Hotels
			request(app).get('/hotels')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Hotel if not signed in', function(done) {
		// Create new Hotel model instance
		var hotelObj = new Hotel(hotel);

		// Save the Hotel
		hotelObj.save(function() {
			request(app).get('/hotels/' + hotelObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', hotel.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Hotel instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Hotel
				agent.post('/hotels')
					.send(hotel)
					.expect(200)
					.end(function(hotelSaveErr, hotelSaveRes) {
						// Handle Hotel save error
						if (hotelSaveErr) done(hotelSaveErr);

						// Delete existing Hotel
						agent.delete('/hotels/' + hotelSaveRes.body._id)
							.send(hotel)
							.expect(200)
							.end(function(hotelDeleteErr, hotelDeleteRes) {
								// Handle Hotel error error
								if (hotelDeleteErr) done(hotelDeleteErr);

								// Set assertions
								(hotelDeleteRes.body._id).should.equal(hotelSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Hotel instance if not signed in', function(done) {
		// Set Hotel user 
		hotel.user = user;

		// Create new Hotel model instance
		var hotelObj = new Hotel(hotel);

		// Save the Hotel
		hotelObj.save(function() {
			// Try deleting Hotel
			request(app).delete('/hotels/' + hotelObj._id)
			.expect(401)
			.end(function(hotelDeleteErr, hotelDeleteRes) {
				// Set message assertion
				(hotelDeleteRes.body.message).should.match('User is not logged in');

				// Handle Hotel error error
				done(hotelDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Hotel.remove().exec();
		done();
	});
});