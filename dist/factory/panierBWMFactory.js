angular.module('App').factory('PanierBWMFactory', ['LSFactory', function(LSFactory) {
	
	var panierKey = 'panierBWM';
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