angular.module('App').factory('AuthFactory', ['LSFactory', function(LSFactory) {
	
	var userKey = 'user';
	var tokenKey = 'token';
	var keepconnected= 'keepconnected';

	var AuthAPI = {

	isLoggedIn: function() {
		return this.getUser() === null ? false : true;
	},


	getUser: function() {
		return LSFactory.get(userKey);
	},

	setUser: function(user) {
		return LSFactory.set(userKey, user);
	},

	getToken: function() {
		return LSFactory.get(tokenKey);
	},

	setToken: function(token) {
		return LSFactory.set(tokenKey, token);
	},

	getKeepConnected: function() {
		return LSFactory.get(keepconnected);
	},

	setKeepConnected: function(token) {
		return LSFactory.set(keepconnected,token);
	},

	deleteAuth: function() {
		LSFactory.delete(userKey);
		LSFactory.delete(tokenKey);
	}
};
return AuthAPI;
}]);