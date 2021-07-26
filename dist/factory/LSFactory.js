angular.module('App').factory('LSFactory', [function() {
	var LSAPI = {

		clear: function() {
			return localStorage.clear();
		},

		message: function() {
			alert("auth service");
		},

		get: function(key) {
			return JSON.parse(localStorage.getItem(key));
		},

		set: function(key, data) {
			return localStorage.setItem(key, 
			JSON.stringify(data));
		},

		delete: function(key) {
			return localStorage.removeItem(key);
		},

		getAll: function() {
			var books = [];
			var items = Object.keys(localStorage);
			for (var i = 0; i < items.length; i++) {
				if (items[i] !== 'user' || items[i] != 'token') {
					books.push(JSON.parse(localStorage[items[i]]));
				}
			}
			return books;
		}
    };
		return LSAPI;
}]);