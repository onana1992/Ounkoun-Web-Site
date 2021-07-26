angular.module('App').factory('PanierFactory', ['LSFactory', function(LSFactory) {
	
	var panierKey = 'panier';
	var PanierAPI = {

	getPanier: function() {
		return LSFactory.get(panierKey);
	},

	setPanier: function(panier) {
		return LSFactory.set(panierKey, panier);
	},

	deletePanier: function() {
		LSFactory.delete(panierKey);
	}
};

return PanierAPI;
}]);