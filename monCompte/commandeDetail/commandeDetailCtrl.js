angular.module('App')
  .controller('CommandeDetailCtrl', function ($scope,PanierFactory,FavorisFactory,CommandFactory,baseUrl,AuthFactory,$http,$interval,$location,$anchorScroll,$rootScope,$location,$timeout,$routeParams) {
   
    $scope.baseUrl=baseUrl; 
    $scope.isLoading=false;
    $scope.isVisible=false;
    $scope.showMessage=false;
    $scope.commands =[];
    $scope.isLoading=true;
    $scope.reference;
    $scope.actualCommand;
    $rootScope.panierSize=0;
    $rootScope.favoriteSize=0;


    if(FavorisFactory.getFavoris()!=null){
        $scope.favorites=FavorisFactory.getFavoris();
        $rootScope.favoriteSize= $scope.favorites.length;
    }

    if(PanierFactory.getPanier()!=null){
        $scope.panierDetail=PanierFactory.getPanier();
        for(var i=0;i<$scope.panierDetail.length;i++){
              $rootScope.panierSize+=$scope.panierDetail[i].number;  
        }
    }

    function getUrlVars() {
      var vars = {};
      var parts = decodeURI(window.location.href).replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
      });   
        return vars;
    }

    if (getUrlVars()["reference"]!= undefined ){
       $scope.reference= getUrlVars()["reference"];
    }

    $scope.commands= CommandFactory.getCommand();
    
    for (var i = 0; i < $scope.commands.length; i++) {

         if($scope.commands[i].reference == $scope.reference){
          $scope.actualCommand= $scope.commands[i];
         }
    } 


    $scope.total=function(command){
      var total=0; 
      for (var i = 0; i < command.products.length; i++) { 
        total+= command.products[i].quantity * command.products[i].price;
      }
          return total;
    }

 });  
    
    