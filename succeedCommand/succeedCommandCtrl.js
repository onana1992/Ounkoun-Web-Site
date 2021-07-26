angular.module('App')
  .controller('ConfirmationCommandeCtrl', function ($scope,PanierFactory,FavorisFactory,baseUrl,AuthFactory,$http,$interval,$location,$anchorScroll,$rootScope,$location,$timeout,$routeParams) {
    
    $rootScope.favoriteSize=0;
    $rootScope.panierSize=0;
    $scope.rN;
    $scope.rI;
    $scope.rMt;
    $scope.rT;

    if(PanierFactory.getPanier()!=null){
        $scope.panierDetail=PanierFactory.getPanier();
        for(var i=0;i<$scope.panierDetail.length;i++){
              $rootScope.panierSize+=$scope.panierDetail[i].number;  
        }
    }

    if(FavorisFactory.getFavoris()!=null){
        $scope.favorites=FavorisFactory.getFavoris();
        $rootScope.favoriteSize = $scope.favorites.length;
    }

    
    $scope.name=null;
    $scope.firstName;
      if(AuthFactory.getUser()!=null){
            $scope.name=AuthFactory.getUser().name;
            $scope.firstName=AuthFactory.getUser().firstName;
            $scope.rN = $scope.firstName + " " + $scope.name;
    }

    function getUrlVars() {
      var vars = {};
      var parts = decodeURI(window.location.href).replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
      });   
        return vars;
    }

    if (getUrlVars()["cmd"]!= undefined ){
      $scope.rI = getUrlVars()["cmd"];
    }

    if (getUrlVars()["montant"]!= undefined ){
      $scope.rMt = getUrlVars()["montant"];
    }

    if (getUrlVars()["tel"]!= undefined ){
      $scope.rT= getUrlVars()["tel"];
    }
   
    
 });  
  