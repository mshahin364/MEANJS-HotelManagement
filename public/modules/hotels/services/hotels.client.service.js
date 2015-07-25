'use strict';

//Hotels service used to communicate Hotels REST endpoints
angular.module('hotels').factory('Hotels', ['$resource',
	function($resource) {
		return $resource('hotels/:hotelId', { hotelId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);