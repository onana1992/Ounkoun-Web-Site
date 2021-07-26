angular.module('App')
.controller('InitPasswordConfirmCtrl', function (AuthFactory,$scope,$http,$interval,baseUrl, $timeout,$location,$rootScope,$routeParams){


  $scope.isLoading=false;
  $scope.isFinish=false;
  $scope.code;
  $scope.loginNonValide= false;
  $scope.infoGuide=true;
  $scope.infoEchec=false;
  $scope.baseUrl=baseUrl;

  function getUrlVars() {
      var vars = {};
      var parts = decodeURI(window.location.href).replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
      });   
        return vars;
    }

    if (getUrlVars()["login"]!= undefined ){
      $scope.login= getUrlVars()["login"];
    }

  $timeout(function () {
          $scope.infoGuide=false; 
  },5000); 
  

  $scope.confirmInitPassword = function () {
    
     var myobject = {'login':$scope.login,'code':$scope.code,'password': $scope.password};

     Object.toparams = function ObjecttoParams(obj) {
        var p = [];
        for (var key in obj) {
            p.push(key + '=' + encodeURIComponent(obj[key]));
        }
      return p.join('&');
     }


     $http({
      method: "POST",
      url: $scope.baseUrl+"user/passRecover/confirm",
      data:Object.toparams(myobject),
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
     }).then(function (response) {
        $scope.statut = response.data.statut;
        $scope.isLoading=false;
        if($scope.statut=="200"){
          $scope.isFinish=true;  
        }
        else{
          
          $scope.infoEchec=true;
          $timeout(function () {
          $scope.infoEchec=false; 
          },5000);
          
        }   

      }, function () {
        //$scope.categories=response;
        alert("not ok");
          $scope.isLoading=false;
      }).then(function () {
          
    

      });
  };

});
