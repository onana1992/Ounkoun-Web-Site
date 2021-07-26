angular.module('App')
  .controller('AdresseLivraisonCtrl', function ($scope,PanierFactory,FavorisFactory,baseUrl,AuthFactory,$http,$interval,$location,$anchorScroll,$rootScope,$location,$timeout,$routeParams) {
    
    $scope.baseUrl=baseUrl;
    $scope.hasAdress=true;
    $scope.showForm=false;
    $scope.matchPatternTel = new RegExp("^6[0-9]{8}$");
    $scope.adresseLivraison = AuthFactory.getUser().adresseLivraison;
    $scope.maRegion;
    $scope.maVille;
    $scope.villes;
    $rootScope.favoriteSize=0;
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

    
    $http.get(baseUrl+"localite/all").then(function (response) {
          $scope.statut= response.data.statut;
          if($scope.statut=="200"){
            $scope.localite =response.data.data;
            $scope.maRegion = $scope.localite[0];
            $scope.villes=  $scope.maRegion.villes
            $scope.maVille = $scope.villes[0];
          }
        }, function () {
          //alert("not ok");
        }).then(function () {
         // alert("fin");
    });    
    
    
    
    $scope.modifRegion= function(){
      for (var i = 0; i < $scope.localite.length; i++) {
         if($scope.maRegion.region==$scope.localite[i].region){
            $scope.villes = $scope.localite[i].villes;
            $scope.maVille = $scope.villes[0];
         }
      }
    };


    if($scope.adresseLivraison!='null'){

      $scope.nom= $scope.adresseLivraison.name;
      $scope.prenom=  $scope.adresseLivraison.firstName;
      $scope.tel1= $scope.adresseLivraison.tel1;
      $scope.tel2= $scope.adresseLivraison.tel2;
      $scope.maRegion = $scope.adresseLivraison.region;
       $scope.maRegion = $scope.adresseLivraison.town;
      $scope.adresse= $scope.adresseLivraison.adresse;
      $scope.isLoading=false;
      
    }else{

       $scope.tel2='';
       $scope.prenom='';
    }

    $scope.hasAdress= $scope.adresseLivraison=="null"? false: true;

    $scope.annulercreationAdresse= function(){
     $('#adresseForm').modal('hide');
    };

    $scope.annulerModifAdresse= function(){
     $('#adresseFormModif').modal('hide');
    };

    $scope.toogleModifyAdress= function(){
      $scope.showForm= !$scope.showForm;
    };

     $scope.modifAdress = function () {


     }

    $scope.sendAdress = function () {
      
      var userLogin=null;
      if(AuthFactory.getUser()!=null){
        var userLogin=AuthFactory.getUser().login;
      }
      
      var myobject = {'login':userLogin,'name':$scope.nom,'firstName':$scope.prenom
      ,'tel1':$scope.tel1,'tel2':$scope.tel2,'region':$scope.maRegion.region,'town': $scope.maVille.name,'address':$scope.adresse};

      $scope.isLoading2=true;

     Object.toparams = function ObjecttoParams(obj) {
        var p = [];
        for (var key in obj) {
            p.push(key + '=' + encodeURIComponent(obj[key]));
        }
      return p.join('&');
     }

     $http({
      method: "POST",
      url: $scope.baseUrl+"user/adresseLivraison",
      data:Object.toparams(myobject),
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
     }).then(function (response) {
         $scope.statut = response.data.statut;
         $scope.isLoading=false;
         $scope.hasAdress=true;
        if($scope.statut=="200"){

          user= AuthFactory.getUser();
          user.adresseLivraison=response.data.livraisonadresse;
          $scope.adresse=response.data.livraisonadresse;
          AuthFactory.setUser(user);
          $scope.nom= $scope.adresseLivraison.name;
          $scope.prenom=  $scope.adresseLivraison.firstName;
          $scope.tel1= $scope.adresseLivraison.tel1;
          $scope.tel2= $scope.adresseLivraison.tel2;
          $scope.region= $scope.adresseLivraison.region;
          $scope.ville= $scope.adresseLivraison.town;
          $scope.adresse= $scope.adresseLivraison.adresse;
          $scope.adresseLivraison = AuthFactory.getUser().adresseLivraison;
          $scope.isLoading2=false;
          $('#adresseForm').modal('hide');
          
        } else{
          
        } 
      }, function () {
        //$scope.categories=response;
        alert("not ok");
      }).then(function () {
      // here the end of the request

      });
    };

    $scope.modifAdress = function () {
      
      var userLogin=null;
      if(AuthFactory.getUser()!=null){
        var userLogin=AuthFactory.getUser().login;
      }
      
      var myobject = {'login':userLogin,'name':$scope.nom,'firstName':$scope.prenom
      ,'tel1':$scope.tel1,'tel2':$scope.tel2,'region':$scope.maRegion.region,'town': $scope.maVille.name,'address':$scope.adresse};

      $scope.isLoading2=true;

     Object.toparams = function ObjecttoParams(obj) {
        var p = [];
        for (var key in obj) {
            p.push(key + '=' + encodeURIComponent(obj[key]));
        }
      return p.join('&');
     }

     $http({
      method: "POST",
      url: $scope.baseUrl+"user/adresseLivraison",
      data:Object.toparams(myobject),
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
     }).then(function (response) {
         $scope.statut = response.data.statut;
        if($scope.statut=="200"){
          user= AuthFactory.getUser();
          user.adresseLivraison=response.data.livraisonadresse;
          $scope.adresse=response.data.livraisonadresse;
          AuthFactory.setUser(user);
          $scope.nom= $scope.adresseLivraison.name;
          $scope.prenom=  $scope.adresseLivraison.firstName;
          $scope.tel1= $scope.adresseLivraison.tel1;
          $scope.tel2= $scope.adresseLivraison.tel2;
          $scope.region= $scope.adresseLivraison.region;
          $scope.ville= $scope.adresseLivraison.town;
          $scope.adresse= $scope.adresseLivraison.adresse;
          $scope.hasAdress= $scope.adresseLivraison=="null"? false: true;
          $scope.adresseLivraison = AuthFactory.getUser().adresseLivraison;
          $scope.isLoading2=false;
          $('#adresseFormModif').modal('hide');

        } else{
          
        } 
      }, function () {
        //$scope.categories=response;
        alert("not ok");
      }).then(function () {
      // here the end of the request

      });
    };

 });  
  