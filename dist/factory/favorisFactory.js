angular.module('App').factory('FavorisFactory', ['LSFactory', function(LSFactory) {
	var favoryKey = 'favoris';
	var FavoryAPI = {
		getFavoris: function() {
			return LSFactory.get(favoryKey);
		},

		setFavoris: function(favori) {
			return LSFactory.set(favoryKey, favori);
		},

		deleteFavoris: function() {
			LSFactory.delete(favoryKey);
		}
	};

	return FavoryAPI ;
}]);