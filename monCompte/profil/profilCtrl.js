angular.module('App')
.controller('ProfilCtrl', function ($scope,AuthFactory,FavorisFactory,PanierFactory,baseUrl,$http,$interval,$location,$rootScope,$routeParams){
  	
    $scope.baseUrl = baseUrl;
    $scope.isLoading=false;
    $scope.isInSucceed=false;
  	$scope.matchPatternLogin = new RegExp("(^([A-Za-z0-9])+\@([A-Za-z0-9])+\.([A-Za-z]{2,4})$)|(^6[0-9]{8}$)");
  	$scope.loginIsEmail= true;
    $rootScope.favoriteSize=0;
    $rootScope.panierSize=0;

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

    
    $scope.annulerModifInfoPerso= function(){
     $('#infoPersoForm').modal('hide');
    };
  	
    $scope.pad= function(n){
      var valeur= (n < 10) ? ("0"+n) : ""+n+"";
      return valeur;
    };

    $scope.tabJour=["01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21"
    ,"22","23","24","25","26","27","28","29","30","31"];

    $scope.tabMois=["01","02","03","04","05","06","07","08","09","10","11","12"];

    $scope.tabAnne=[];

    for (var i = 1900; i < 2017; i++) {
      $scope.tabAnne.push(""+i+"");
    }
    
    $scope.user= AuthFactory.getUser();
    $scope.modif_nom=$scope.user.name;
    $scope.modif_prenom=$scope.user.firstName;
    $scope.modif_sexe=$scope.user.sexe;;
    var date= new Date( $scope.user.dateDeNaiss);
    $scope.modif_annee= $scope.pad(date.getFullYear());
    $scope.modif_jour= $scope.pad(date.getDate());
    $scope.modif_mois= $scope.pad(date.getMonth() +1);
    
    
    $scope.modifierProfil = function () {

      $scope.dateDeNaiss=$scope.modif_annee+"-"+$scope.modif_mois+"-"+$scope.modif_jour;
 	    var myobject = {'login': $scope.user.login,'name':$scope.modif_nom
 	    ,'firstName':$scope.modif_prenom,'sex':$scope.modif_sexe,'dateDeNaiss':$scope.dateDeNaiss};
      $scope.isLoading3=true;
      $scope.isInSucceed=false;

	    Object.toparams = function ObjecttoParams(obj) {
        var p = [];
        for (var key in obj) {
            p.push(key + '=' + encodeURIComponent(obj[key]));
        }
      return p.join('&');
	   }

	   $http({
		  method: "POST",
		  url: baseUrl+"user/update",
		  data:Object.toparams(myobject),
		  headers: {'Content-Type': 'application/x-www-form-urlencoded'}
	   }).then(function (response) {
    	  $scope.isLoading3=false;
        $scope.isInSucceed=true;
        $('#infoPersoForm').modal('hide');
        $scope.statut = response.data.statut;
        
        if($scope.statut=="200"){
         
         $rootScope.user= AuthFactory.getUser();
         $rootScope.user.pseudo= response.data.response.pseudo.split(" ")[0];
         $rootScope.user.login=response.data.response.login;
         $rootScope.user.name=response.data.response.name;
         $rootScope.user.firstName=response.data.response.firstName;
         $rootScope.user.id=response.data.response.id;
         $rootScope.user.dateDeNaiss=response.data.response.birthDate;
         $rootScope.user.sexe=response.data.response.sex;
         $scope.user=$rootScope.user;
         AuthFactory.setUser($rootScope.user);

         $rootScope.token={
           'value':response.data.response.token.value,
         };
         AuthFactory.setToken($rootScope.token);
          //$location.path("/");        
        } else{
          $scope.isLoading3 =false;
         // $scope.isLoading=true;
        } 

      }, function () {
        //$scope.categories=response;
        alert("not ok");
      }).then(function () {
      // here the end of the request

      });
    }
      

 });


   