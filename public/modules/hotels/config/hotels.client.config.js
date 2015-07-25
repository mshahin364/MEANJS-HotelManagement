'use strict';

// Configuring the Articles module
angular.module('hotels').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Hotels', 'hotels', 'dropdown', '/hotels(/create)?');
		Menus.addSubMenuItem('topbar', 'hotels', 'List Hotels', 'hotels');
		Menus.addSubMenuItem('topbar', 'hotels', 'New Hotel', 'hotels/create');
	}
]);