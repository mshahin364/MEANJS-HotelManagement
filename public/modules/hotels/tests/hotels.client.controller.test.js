'use strict';

(function() {
	// Hotels Controller Spec
	describe('Hotels Controller Tests', function() {
		// Initialize global variables
		var HotelsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Hotels controller.
			HotelsController = $controller('HotelsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Hotel object fetched from XHR', inject(function(Hotels) {
			// Create sample Hotel using the Hotels service
			var sampleHotel = new Hotels({
				name: 'New Hotel'
			});

			// Create a sample Hotels array that includes the new Hotel
			var sampleHotels = [sampleHotel];

			// Set GET response
			$httpBackend.expectGET('hotels').respond(sampleHotels);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.hotels).toEqualData(sampleHotels);
		}));

		it('$scope.findOne() should create an array with one Hotel object fetched from XHR using a hotelId URL parameter', inject(function(Hotels) {
			// Define a sample Hotel object
			var sampleHotel = new Hotels({
				name: 'New Hotel'
			});

			// Set the URL parameter
			$stateParams.hotelId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/hotels\/([0-9a-fA-F]{24})$/).respond(sampleHotel);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.hotel).toEqualData(sampleHotel);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Hotels) {
			// Create a sample Hotel object
			var sampleHotelPostData = new Hotels({
				name: 'New Hotel'
			});

			// Create a sample Hotel response
			var sampleHotelResponse = new Hotels({
				_id: '525cf20451979dea2c000001',
				name: 'New Hotel'
			});

			// Fixture mock form input values
			scope.name = 'New Hotel';

			// Set POST response
			$httpBackend.expectPOST('hotels', sampleHotelPostData).respond(sampleHotelResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Hotel was created
			expect($location.path()).toBe('/hotels/' + sampleHotelResponse._id);
		}));

		it('$scope.update() should update a valid Hotel', inject(function(Hotels) {
			// Define a sample Hotel put data
			var sampleHotelPutData = new Hotels({
				_id: '525cf20451979dea2c000001',
				name: 'New Hotel'
			});

			// Mock Hotel in scope
			scope.hotel = sampleHotelPutData;

			// Set PUT response
			$httpBackend.expectPUT(/hotels\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/hotels/' + sampleHotelPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid hotelId and remove the Hotel from the scope', inject(function(Hotels) {
			// Create new Hotel object
			var sampleHotel = new Hotels({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Hotels array and include the Hotel
			scope.hotels = [sampleHotel];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/hotels\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleHotel);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.hotels.length).toBe(0);
		}));
	});
}());