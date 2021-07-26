angular.module('App')
.controller('RecoverPasswordCtrl', function (AuthFactory,baseUrl,$timeout,$scope,$http,$interval,$location,$rootScope,$routeParams){
 
  $scope.baseUrl=baseUrl;
  $scope.isLoading=false;
  $scope.login=$routeParams["login"];
  $scope.code=null;
  $scope.codeIncorect= false;
  $scope.infoGuide=true;
  $scope.infoEchec=false;
  $scope.hasSend=false;
  $scope.matchPatternLogin = new RegExp("(^([A-Za-z0-9])+\@([A-Za-z0-9])+\.([A-Za-z]{2,4})$)|(^6[0-9]{8}$)");



  
  $scope.sendPassword = function () {
    var myobject = {'login':$scope.login};
    $scope.isLoading=true;
    Object.toparams = function ObjecttoParams(obj) {
      var p = [];
      for (var key in obj) {
            p.push(key + '=' + encodeURIComponent(obj[key]));
      }
      return p.join('&');
    }

     $http({
      method: "POST",
      url: $scope.baseUrl+"user/passRecover/code",
      data:Object.toparams(myobject),
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
     }).then(function (response) {
         $scope.statut = response.data.statut;
         if($scope.statut=="200"){
            $scope.hasSend=true;
            $scope.isLoading=false; 
            window.location ="recoverPasswordConfirm.php?login="+$scope.login;   
         }
        else{         
          $scope.infoEchec=true;
          $timeout(function () {
          $scope.infoEchec=false; 
          },5000);
          $scope.isLoading=false;    
        } 
      }, function () {
        //$scope.categories=response;
        //alert("not ok");
      }).then(function () {
      // here the end of the request

      });
  }


});
