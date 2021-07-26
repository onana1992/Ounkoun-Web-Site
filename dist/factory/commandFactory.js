angular.module('App').factory('CommandFactory', ['LSFactory', function(LSFactory) {
	
	var commandKey = 'command';
	var CommandAPI = {

	getCommand: function() {
		return LSFactory.get(commandKey);
	},

	setCommand: function(command) {
		return LSFactory.set(commandKey, command);
	},

	deleteCommand: function() {
		LSFactory.delete(commandKey);
	}
};

return CommandAPI;
}]);