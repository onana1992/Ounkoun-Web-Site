angular.module('App')
.controller('ChangerPasswordCtrl', function ($scope,AuthFactory,PanierFactory,FavorisFactory,$timeout,baseUrl,$http,$interval,$location,$rootScope,$routeParams){
    
   
    $scope.baseUrl=baseUrl;
    $scope.matchPatternLogin = new RegExp("(^([A-Za-z0-9])+\@([A-Za-z0-9])+\.([A-Za-z]{2,4})$)|(^6[0-9]{8}$)");
    $scope.modif_old_password=null;
    $scope.modif_new_password=null;
    $scope.modif_new_rePassword=null;
    $scope.disable= true;
    $scope.isLoading=false;
    $scope.isSucceed=false;
    $scope.isNotSucceed=false;
    $scope.user= AuthFactory.getUser();
    $scope.login=$scope.user.login;
    $scope.infoEchec=false;
    $scope.infoSucces=false;
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
  
    $scope.closeInfoEchec=function(){
      $scope.infoEchec=false;
    }

    $scope.closeInfoSucces=function(){
      $scope.infoEchec=false;
    }

    $scope.$watch('modif_new_rePassword', function (newValue) {
        
        if($scope.modif_new_password==$scope.modif_new_rePassword && $scope.modif_new_password!=null && $scope.modif_new_rePassword!=null){
          $scope.disable=false;
        }

        else{
           $scope.disable=true;
        }
    });


    $scope.$watch('$scope.modif_new_password', function (newValue) {
        //alert($scope.rePassword);
        if($scope.modif_new_password==$scope.modif_new_rePassword && $scope.modif_new_password!=null && $scope.modif_new_rePassword!=null){
          $scope.disable=false;
        }

        else{
           $scope.disable=true;
        }
    });

   $scope.modifierPassword = function () {
      
      
      var myobject = {'login':$scope.login,'oldPassword':$scope.modif_old_password,'newPassword':$scope.modif_new_password
      };

      $scope.isLoading=true;
      $scope.isSucceed=false;
      $scope.isNotSucceed=false;

     Object.toparams = function ObjecttoParams(obj) {
        var p = [];
        for (var key in obj) {
            p.push(key + '=' + encodeURIComponent(obj[key]));
        }
      return p.join('&');
     }

     $http({
      method: "POST",
      url: baseUrl+"user/modifyPassword",
      data:Object.toparams(myobject),
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
     }).then(function (response) {
         $scope.statut = response.data.statut;
         
        if($scope.statut=="200"){
          $scope.isLoading=false;
          $scope.infoSucces=true;
          $timeout(function () {
          $scope.infoSucces=false; 
          },5000);       
        } else{
          
          $scope.isLoading=false;
          $scope.infoEchec=true;
          $timeout(function () {
          $scope.infoEchec=false; 
          },5000);          
        } 
      }, function () {
        //$scope.categories=response;
        alert("not ok");
      }).then(function () {
      // here the end of the request

      });
  }
      

 });


   