'use strict';

//Setting up route
angular.module('hotels').config(['$stateProvider',
	function($stateProvider) {
		// Hotels state routing
		$stateProvider.
		state('listHotels', {
			url: '/hotels',
			templateUrl: 'modules/hotels/views/list-hotels.client.view.html'
		}).
		state('createHotel', {
			url: '/hotels/create',
			templateUrl: 'modules/hotels/views/create-hotel.client.view.html'
		}).
		state('viewHotel', {
			url: '/hotels/:hotelId',
			templateUrl: 'modules/hotels/views/view-hotel.client.view.html'
		}).
		state('editHotel', {
			url: '/hotels/:hotelId/edit',
			templateUrl: 'modules/hotels/views/edit-hotel.client.view.html'
		});
	}
]);