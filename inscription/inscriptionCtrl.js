angular.module('App')
.controller('InscriptionCtrl', function ($scope,$http,baseUrl, $timeout,$interval,$location,$rootScope,$routeParams){
    
    $scope.baseUrl=baseUrl;
    $scope.matchPatternLogin = new RegExp("(^([A-Za-z0-9])+\@([A-Za-z0-9])+\.([A-Za-z]{2,4})$)|(^6[0-9]{8}$)");
    $scope.loginIsEmail= true;
    $scope.nom=null;
    $scope.prenom="";
    $scope.sexe="H";
    $scope.jour="01";
    $scope.mois="01";
    $scope.annee="1940";
    $scope.login;
    $scope.password=null;
    $scope.rePassword=null;
    $scope.resterConnecter=true;
    $scope.disable= false;
    $scope.compteExistant =false;
    $scope.isLoading=false;
    $scope.infoGuide=true;
    $scope.infoEchec=false;
    


    $timeout(function () {
          $scope.infoGuide=false; 
    },5000); 

    $scope.tabJour=["01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21"
    ,"22","23","24","25","26","27","28","29","30","31"];

    $scope.tabMois=["01","02","03","04","05","06","07","08","09","10","11","12"];

    $scope.tabAnne=[];

    for (var i = 1940; i < 2008; i++) {
      $scope.tabAnne.push(""+i+"");
    }

    function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
    }

    $scope.closeInfoGuide=function(){
      $scope.infoGuide=false;
    }

    $scope.closeInfoEchec=function(){
      $scope.infoEchec=false;
    }

    $scope.closeInfoSucces=function(){
      $scope.infoSucces=false;
    }

    $scope.sendSms=function(numero,message){
      var donne={"outboundSMSMessageRequest":{"address": "tel:+237"+numero,"senderAddress":"tel:+237699494380","outboundSMSTextMessage":{"message":message}}};
      $http({
          method: "POST",
          url: "https://api.orange.com/smsmessaging/v1/outbound/tel%3A%2B237699494380/requests",
          data:donne,
          headers: {'Content-Type': 'application/json','Authorization':'Bearer v8Rv5va9FiKhZi7BaPyOGsUTX2R9'}
       }).then(function (response) {
        if($scope.statut=="200"){
           
         }
      }, function () {
        //$scope.categories=response;
        alert("not ok 1");
      }).then(function () {
      // here the end of the request

      });  
    };

    $scope.send = function () {

      if (/^([A-Za-z0-9])+\@([A-Za-z0-9])+\.([A-Za-z]{2,4})$/.test($scope.login)) {
         $scope.loginIsEmail= true;
      } 

      else {
         $scope.loginIsEmail= false;
      }

    };


   $scope.creerUtilisateur = function () {
      $scope.isLoading=true;

      if (/^([A-Za-z0-9])+\@([A-Za-z0-9])+\.([A-Za-z]{2,4})$/.test($scope.login)) {
         $scope.loginIsEmail= true;
      } 

      else {
         $scope.loginIsEmail= false;
      }

     

      var activationNumber=randomString(4, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
      $scope.dateDeNaiss=$scope.annee+"-"+$scope.mois+"-"+$scope.jour;
      var myobject = {'loginIsEmail':$scope.loginIsEmail,'login':$scope.login,'plainPassword':$scope.password,'name':$scope.nom
      ,'firstName':$scope.prenom,'sex':$scope.sexe,'dateDeNaiss':$scope.dateDeNaiss,'activationNumber':activationNumber};

      

     Object.toparams = function ObjecttoParams(obj) {
        var p = [];
        for (var key in obj) {
            p.push(key + '=' + encodeURIComponent(obj[key]));
        }
      return p.join('&');
     }

     $http({
      method: "POST",
      url: $scope.baseUrl+"user/registration",
      data:Object.toparams(myobject),
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
     }).then(function (response) {
        $scope.statut = response.data.statut;
        $scope.isLoading=false;
        if($scope.statut=="200"){
          $scope.id=response.data.response.login;
          $scope.compteExistant=false;
          if(!$scope.loginIsEmail){
            $scope.sendSms($scope.login,$scope.nom+"! Bienvenue sur Ounkoun votre code est d'activation est :"+activationNumber);
          }
             window.location = "activation.php?id="+$scope.id;        
        } else{
          
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
  }
      

 });


   