'use strict';

// Hotels controller
angular.module('hotels').controller('HotelsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Hotels',
	function($scope, $stateParams, $location, Authentication, Hotels) {
		$scope.authentication = Authentication;

		// Create new Hotel
		$scope.create = function() {
			// Create new Hotel object
			var hotel = new Hotels ({
				name: this.name
			});

			// Redirect after save
			hotel.$save(function(response) {
				$location.path('hotels/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Hotel
		$scope.remove = function(hotel) {
			if ( hotel ) { 
				hotel.$remove();

				for (var i in $scope.hotels) {
					if ($scope.hotels [i] === hotel) {
						$scope.hotels.splice(i, 1);
					}
				}
			} else {
				$scope.hotel.$remove(function() {
					$location.path('hotels');
				});
			}
		};

		// Update existing Hotel
		$scope.update = function() {
			var hotel = $scope.hotel;

			hotel.$update(function() {
				$location.path('hotels/' + hotel._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Hotels
		$scope.find = function() {
			$scope.hotels = Hotels.query();
		};

		// Find existing Hotel
		$scope.findOne = function() {
			$scope.hotel = Hotels.get({ 
				hotelId: $stateParams.hotelId
			});
		};
	}
]);