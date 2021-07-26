angular.module('App')
.controller('ActivationCompteCtrl', function (AuthFactory,baseUrl,$timeout,$scope,$http,$interval,$location,$rootScope,$routeParams){
  
  $scope.baseUrl=baseUrl;
	$scope.isLoading=false;
	$scope.login=$routeParams["login"];
	$scope.code=null;
	$scope.codeIncorect= false;
  $scope.infoGuide=true;
  $scope.infoEchec=false;

  function getUrlVars() {
            var vars = {};
            var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
                vars[key] = value;
            });   
                return vars;
  }

  $scope.login = getUrlVars()["id"];

  $timeout(function () {
      $scope.infoGuide=false; 
  },5000);

	$scope.sendCoundown = function () {
    
    var myobject = {'login':$scope.login};
    Object.toparams = function ObjecttoParams(obj) {
      var p = [];
      for (var key in obj) {
            p.push(key + '=' + encodeURIComponent(obj[key]));
      }
      return p.join('&');
    }

     $http({
      method: "POST",
      url: $scope.baseUrl+"user/timer",
      data:Object.toparams(myobject),
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
     }).then(function (response) {
         $scope.statut = response.data.statut;
         
      }, function () {
      }).then(function () {
      // here the end of the request

      });
  }

  $scope.sendCoundown();
 
	$scope.activerCompte = function () {
    
    var myobject = {'login':$scope.login,'code':$scope.code};
    $scope.isLoading=true;
    Object.toparams = function ObjecttoParams(obj) {
      var p = [];
      for (var key in obj) {
            p
            .push(key + '=' + encodeURIComponent(obj[key]));
      }
      return p.join('&');
    }

     $http({
      method: "POST",
      url: $scope.baseUrl+"user/validation",
      data:Object.toparams(myobject),
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
     }).then(function (response) {
         $scope.statut = response.data.statut;
         if($scope.statut=="200"){
            $scope.id=response.data.response.login;
            $scope.cutSpeudo = response.data.response.pseudo.split(" ")[0];
            $rootScope.user={
              'pseudo': $scope.cutSpeudo,
              'login':response.data.response.login,
              'name':response.data.response.name,
              'firstName':response.data.response.firstName,
              'id':response.data.response.id,
              'dateDeNaiss':response.data.response.dateDeNaiss.date,
              'sexe':response.data.response.sex,
              'adresseLivraison': "null"
            };

            $rootScope.token={
              'value':response.data.response.token.value,
            };

           AuthFactory.setUser($rootScope.user);
           AuthFactory.setToken($rootScope.token);
           $rootScope.isConnected=true;
           $scope.stop();

           window.location = "index.php";      
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
      }).then(function () {
      // here the end of the request

      });
  }

  $scope.counter = 180;
  var stopped;   
  $scope.countdown = function() {
    stopped = $timeout(function() {
       console.log($scope.counter);
     $scope.counter--;
     if($scope.counter==0){
        $scope.stop();
        window.location = "inscription.php";
     }else{
      $scope.countdown();
     }    
        
    }, 1000);
  };
   
    
  $scope.stop = function(){
   $timeout.cancel(stopped);
  }

  $scope.countdown();

});
