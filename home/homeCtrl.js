'use strict';

angular.module('App').controller('HomeCtrl', function (AuthFactory,baseUrl,deviceDetector,PanierFactory,PanierBWMFactory,FavorisFactory,$scope,$http,$interval,$location,$rootScope,$state,$timeout) {
   
    
   $scope.baseUrl=baseUrl;
   $rootScope.panierSize=0;
   $rootScope.favoriteSize=0;
   $rootScope.panierBWMSize=0;
   $scope.slideVisible=false;
   $rootScope.extractedMarque="null";
   $scope.marques=[];
   $rootScope.panierSize=0;
   $rootScope.favoriteSize=0;
   $scope.bestProducts= null;
   $scope.bestTelephonies= null;
   $scope.bannieres= null;


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

    // extraction des banières
   $http.get(baseUrl+"baniere/all").then(function (response) {
      $scope.bannieres= response.data.data; 
    }, function () {
      //("not ok");
      }).then(function () {
    });

   // extraction des meilleurs marques
   $http.get(baseUrl+"marque/best").then(function (response) {
      $scope.statut= response.data.statut;
      $scope.marques= response.data.data;
      $scope.slideVisible= true;
      for(var i=0; i< $scope.marques.length; i++){
        $scope.marques[i].url = $scope.baseUrl;
      }
    }, function () {
      //("not ok");
      }).then(function () {
    });

    // extraction des meilleurs produit
    $http.get(baseUrl+"products/best").then(function (response) {
      $scope.statut= response.data.statut;
      $scope.bestProducts= response.data.data;
    }, function () {
      //("not ok");
      }).then(function () {
    });

    // extraction des meilleurs produit
    $http.get(baseUrl+"product/model/category/best/Telephonie et accessoires").then(function (response) {
      $scope.statut= response.data.statut;
      $scope.bestTelephonies= response.data.data;
    }, function () {
      //("not ok");
      }).then(function () {
    });

    // extraction des meilleurs produit
    $http.get(baseUrl+"product/model/category/best/Informatique").then(function (response) {
      $scope.statut= response.data.statut;
      $scope.bestInformatiques= response.data.data;
    }, function () {
      //("not ok");
      }).then(function () {
    });

    // extraction des meilleurs produit
    $http.get(baseUrl+"product/model/category/best/Tv, audio et photo").then(function (response) {
      $scope.statut= response.data.statut;
      $scope.bestTvs= response.data.data;
    }, function () {
      //("not ok");
      }).then(function () {
    });

    // extraction des meilleurs produit
    $http.get(baseUrl+"product/model/category/best/Beauté et santé").then(function (response) {
      $scope.statut= response.data.statut;
      $scope.bestSantes= response.data.data;
    }, function () {
      //("not ok");
      }).then(function () {
    });

      

   /* 
   $rootScope.choosedCategory="null";
   
   
   $rootScope.idSearchCategory="null";
   $rootScope.nomSearchCategory="Electromenager"
   $rootScope.filterOption="filter-by-popularity";
   $rootScope.filterMinPrice="null";
   $rootScope.filterMaxPrice="null";
   $rootScope.filterMarque="null";
   $rootScope.plusGrandPrix=60000;
   $rootScope.plusPetitPrix=2000;
   $scope.filterValue="plus rescent";
   $scope.choosedSCategory=null;
   $scope.choosedSSCategory=null;
   $rootScope.products=null;
   $rootScope.searchText="";
   $rootScope.panierSize=0;
   
   
   $scope.rubanVisible=false;
   $scope.slideVisible= false;
   
   $rootScope.title=" Ounkoun:Votre centre commercial en ligne - Site d'achats groupés"


  // $scope.route=$location.path();
  /* $timeout(function(){
   // $state.go($location.path());
    $location.path($scope.route);
  },5)*/
   
   
 

  /*$scope.callback = function(response){
    console.log(response);
    alert('share callback');
  }*/
   
 /* var vm = this;
  vm.data = deviceDetector;
  if(vm.data.device=="android"){
      document.location.href="http://www.mondomaine.com";
  };*/


  


   /*$scope.taillePanier=function(panier){
     var taille=0;
    for (var i = 0; i < panier.length; i++) {
          taille+= parseInt(panier[i].number)    
    }
    return taille;
  }*/

  /*$scope.deconnecter= function(){
      $rootScope.isConnected=false;
      AuthFactory.deleteAuth();
      PanierFactory.deletePanier();
      PanierBWMFactory.deletePanier();
      FavorisFactory.deleteFavoris();
      $rootScope.panierSize=0;
      $rootScope.panierBWMSize=0;
      $rootScope.favoriteSize=0;
      $location.path("/");
  };*/
  
   //initialisation du nombre d'element dans les favoris
   /*if(FavorisFactory.getFavoris()!=null){
        $rootScope.favoriteSize=FavorisFactory.getFavoris().length;
   }*/
   
  // initialisation du nombre d'elements dans le panier
  /* if(PanierFactory.getPanier()!=null){
      var panier= PanierFactory.getPanier();
      $rootScope.panierSize=  $scope.taillePanier(PanierFactory.getPanier());
   }*/

   // initialisation du nombre d'elements dans le panier BWM
   /*if(PanierBWMFactory.getPanier()!=null){
      var panierBWM= PanierBWMFactory.getPanier();
      $rootScope.panierBWMSize=  $scope.taillePanier(PanierBWMFactory.getPanier());
   }*/
   
   
   // connection a l'entree de l'application
    /*$rootScope.token=null;
    $rootScope.log_login=null;
    
    if(AuthFactory.getKeepConnected()){
     $rootScope.token= AuthFactory.getToken();
     $rootScope.user= AuthFactory.getUser();
    }
    else{
      $scope.deconnecter();
    }

    if($rootScope.token!= null){
        $rootScope.isConnected=true;
    }
    else{
      $rootScope.isConnected=false;
    }
*/
  
   

  /*$scope.stopSearch=function(){
      $timeout(function () {
        $scope.rubanVisible=false;
         $scope.products=[];
      }, 1000);
  }

  $scope.connect = function(activeNav){
    $rootScope.isConnected=true;
  };

  $scope.disconnect = function(activeNav){
     $rootScope.isConnected=false;
  };

  $scope.search = function (searchText) {
      $state.go('recherche');
  };

  $scope.view = function() {
      $state.go('produit');
  };
*/
  
    
});
