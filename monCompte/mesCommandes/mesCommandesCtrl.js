angular.module('App')
  .controller('MesCommandeCtrl', function ($scope,PanierFactory,CommandFactory,FavorisFactory,baseUrl,AuthFactory,$http,$interval,$location,$anchorScroll,$rootScope,$location,$timeout,$routeParams) {
   
    $scope.baseUrl=baseUrl; 
    $scope.isLoading=false;
    $scope.isVisible=false;
    $scope.showMessage=false;
    $scope.commands =[];
    $scope.isLoading=true;
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
   
    if(AuthFactory.getUser()!=null){
        var userLogin=AuthFactory.getUser().login;
    }


    $http.get(baseUrl+"user/command/"+userLogin).then(function (response) {
         $scope.number = response.data.number;
         $scope.commands= response.data.data;
         $scope.formatCommand=[];
         for (var i = 0; i < $scope.commands.length; i++) {   
        $scope.formatCommand.push({
                  'reference': $scope.commands[i].reference,
                  'dateCreation': $scope.commands[i].dateCreation,
                  'isPaided': $scope.commands[i].isPaided,
                  'isShipped':$scope.commands[i].isShipped,
                  'livraisonAdress':$scope.commands[i].livraisonAdress,
                  'products':$scope.commands[i].products,
                  'livraison': $scope.commands[i].livraison,
              });
          }
         CommandFactory.setCommand($scope.formatCommand);
         $scope.isLoading=false;
        }, function () {
          //alert("not ok");
        }).then(function () {
         // alert("fin");
    });     
     
 });  
    
    