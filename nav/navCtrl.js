angular.module('App')
  .controller('NavCtrl', function ($scope,baseUrl,$timeout,AuthFactory,FavorisFactory,PanierFactory,PanierBWMFactory,$http,$interval,$location,$rootScope) {
    

    $scope.baseUrl=baseUrl;
    $scope.resterConnecter=true;
    $rootScope.nbPerso=0;
    $scope.searchCat1="Toutes les categories";
    $rootScope.searchCat="null";
    $scope.status=0;
    $scope.products=[];
    $scope.categories=[];
    $scope.searchCategories=[];
    $scope.searchMarques=[];
    $scope.size;
    $scope.isLoading =false;
    $scope.isNotSucceed;
    $scope.log_login;
    $scope.log_password;
    $rootScope.favoriteSize = 0;
    $rootScope.panierSize=0;
    $rootScope.favoriteSize=0;
    $rootScope.panierBWMSize=0;
    $scope.localPanier=[];
    $scope.diffPanier=[];
    $scope.dbPanier=[];
    $scope.localPanierBWM=[];
    $scope.diffPanierBWM=[];
    

    // connection a l'entree de l'application
    $rootScope.token=null;
    $rootScope.log_login=null;
    
    /*if(AuthFactory.getKeepConnected()){
     $rootScope.token= AuthFactory.getToken();
     $rootScope.user= AuthFactory.getUser();
    }
    else{
      $scope.deconnecter();
    }*/

    $scope.launch = function (text,cat) {
      //$scope.filterOption=valeur;
      if(text!=""){
        window.location ="recherche.php?text="+text+"&cat="+cat;
      }
    }

    $scope.stopSearch=function(){
      $timeout(function () {
        $scope.rubanVisible=false;
         $scope.products=[];
      }, 600);
    }

     $rootScope.user= AuthFactory.getUser();
    if($rootScope.user!= null){
        $rootScope.isConnected=true;
    }
    else{
      $rootScope.isConnected=false;
    }

    $scope.research= function (text) {
      if(text.length>0){
          // extraction des produits et marque
          $http.get(baseUrl+"product/model/search/"+text+"/1/filter-by-popularity/null/null/null/null").then(function (response) {
          $scope.statut= response.data.statut;
          $scope.products=[];
          $scope.products= response.data.data.products;
          $scope.searchCategories= response.data.data.categories;
          $scope.searchMarques= response.data.data.marques;
          $scope.size=response.data.data.size; 
          }, function () {
          
          }).then(function () {
            //alert("fin");
          });
      }else{
         $scope.products=[];
      }
    };

    $scope.taillePanier=function(panier){
     var taille=0;
      for (var i = 0; i < panier.length; i++) {
          taille+= parseInt(panier[i].number)    
      }
      return taille;
    }

    $scope.goToFavoris= function () {
      if(AuthFactory.getUser()==null){
          $("#connection").modal();
      }
      else
      {
         window.location="favoris.php";
 
      }
    }

    // choose filter function
    $scope.goToregistration = function () {
       $('#connection').modal('hide');
    }

    // choose filter function
    $scope.goTorecover = function () {
      $('#avis').modal('hide');
      $timeout(function () {
          window.location = "recoverPassword.php?";

      }, 300);
      
    }

    $scope.goToPanierBWM= function(){
        $location.path("/panierBWM");
    }

    $scope.deconnecter= function(){
      $rootScope.isConnected=false;
      AuthFactory.deleteAuth();
      PanierFactory.deletePanier();
      PanierBWMFactory.deletePanier();
      FavorisFactory.deleteFavoris();
      $rootScope.panierSize=0;
      $rootScope.panierBWMSize=0;
      $rootScope.favoriteSize=0;
      window.location ="index.php";
    }
 
    $scope.connecter= function(){
     
      $scope.isLoading =true;
      $scope.isNotSucceed=false;
      $http.get(baseUrl+"user/log/"+$scope.log_login+"/"+$scope.log_password).then(function (response) {

        $scope.statut = response.data.statut;
        if($scope.statut=="200"){

          $scope.isLoading =false;
          $scope.isNotSucceed=false;
          var adresse="null";

          //gestion de l'adresse de livraison
          if(response.data.response.livraisonAddress!="null"){
            adresse=response.data.response.livraisonAddress;
          }

          // gestion des favoris
          $scope.favorites=response.data.response.favorites;
          $rootScope.favoriteSize = $scope.favorites.length;
          var mesfavoris=[]
          for (var i = 0; i < $scope.favorites.length; i++) {
            mesfavoris[i]={
                  'name':$scope.favorites[i].product.name,
            };
          }
          FavorisFactory.setFavoris(mesfavoris);

          // gestion du panier 
          var paniers= response.data.response.panier;
          $rootScope.panierSize = $scope.taillePanier(paniers);
          $scope.dbPanier=[]; 
          for(var i = 0; i < paniers.length; i++) {
            var newProduct={
              productId:paniers[i].product.id,
              name:paniers[i].name,
              number:paniers[i].number,
              type: paniers[i].type,
              product:paniers
            };
            $scope.dbPanier.push(newProduct);
          }
          $scope.localPanier=[];
          $scope.diffPanier=[];

          if(PanierFactory.getPanier()!=null){
            $scope.localPanier=PanierFactory.getPanier()
          }

          for(var i=0; i< $scope.localPanier.length; i++){
            var trouver= false;
              for(var j=0; j< $scope.dbPanier.length; j++){
                  if($scope.dbPanier[j].productId==$scope.localPanier[i].productId && 
                        $scope.dbPanier[j].type==$scope.localPanier[i].type)
                  {
                        $scope.dbPanier[j].number+= $scope.localPanier[i].number;
                        $scope.diffPanier.push($scope.localPanier[i]);
                        trouver= true;
                  }    
              }

              if(trouver==false){
                  $scope.dbPanier.push($scope.localPanier[i]);
                    $scope.diffPanier.push($scope.localPanier[i]);
                }
          }

          $rootScope.panierSize = $scope.taillePanier($scope.dbPanier);

          // enregistrement du nouveau panier
          PanierFactory.setPanier($scope.dbPanier);
          var userLogin=response.data.response.login;
      
          // enregistrement des articles additifs
          for(var i=0; i< $scope.diffPanier.length;i++){
            var userLogin=response.data.response.login;
            if($scope.diffPanier[i].type=="gros"){

              var myobject = {'login':userLogin,'number':$scope.diffPanier[i].number,'iscustomized':false,'type':"gros","lotQuantity":$scope.diffPanier[i].product.wholeSale.lotQuantity,"name":$scope.diffPanier[i].name,"product":JSON.stringify($scope.diffPanier[i])};
              Object.toparams = function ObjecttoParams(obj) {
                var p = [];
                for (var key in obj) {
                  p.push(key + '=' + encodeURIComponent(obj[key]));
                }
                return p.join('&');
              }

              $http({
                method: "POST",
                url: baseUrl+"user/panier/gros",
                data:Object.toparams(myobject),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
              }).then(function (response) {
                $scope.statut = response.data.statut;
                if($scope.statut=="200"){
                } 
                else{ 
                } 
              }, function () {
                  //  alert("not ok");
              }).then(function () {
                    // here the end of the request
                  });
            }
            else
            {
              // article additif en detail
              var myobject = {'login':userLogin,'idProduct':$scope.diffPanier[i].productId,'type':"detail",'number':$scope.diffPanier[i].number};
              Object.toparams = function ObjecttoParams(obj) {
                var p = [];
                for (var key in obj) {
                        p.push(key + '=' + encodeURIComponent(obj[key]));
                }
                        return p.join('&');
              }

                $http({
                method: "POST",
                url: baseUrl+"user/panier/detail",
                data:Object.toparams(myobject),
                      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
              }).then(function (response) {
                $scope.statut = response.data.statut;
                if($scope.statut=="200"){
                } else{
                } 
              }, function () {
                //      alert("not ok");
              }).then(function () {
                    // here the end of the request
              });


            }

          }

          //gestion panierBWM

          var panierBWMs= response.data.response.panierBWM;
          $rootScope.panierBWMSize = $scope.taillePanier(panierBWMs);
          $scope.dbPanierBWM=[]; 
          for (var i = 0; i < panierBWMs.length; i++) {
            var newProduct={
              productId:panierBWMs[i].product.id,
              name:panierBWMs[i].name,
              number:panierBWMs[i].number,
              product:panierBWMs
            };
            $scope.dbPanierBWM.push(newProduct);
          }
          $scope.localPanierBWM=[];
          $scope.diffPanierBWM=[];

          if(PanierBWMFactory.getPanier()!=null){
            $scope.localPanierBWM=PanierBWMFactory.getPanier();
          }

          for(var i=0; i< $scope.localPanierBWM.length; i++){
            var trouver= false;
              for(var j=0; j< $scope.dbPanierBWM.length; j++){
                  if($scope.dbPanierBWM[j].productId==$scope.localPanierBWM[i].productId )
                  {
                        $scope.dbPanierBWM[j].number+= $scope.localPanierBWM[i].number;
                        $scope.diffPanierBWM.push($scope.localPanierBWM[i]);
                        trouver= true;
                  }    
              }

              if(trouver==false){
                  $scope.dbPanierBWM.push($scope.localPanierBWM[i]);
                    $scope.diffPanierBWM.push($scope.localPanierBWM[i]);
                }
          }

          $rootScope.panierBWMSize = $scope.taillePanier($scope.dbPanierBWM);

          // enregistrement du nouveau panier
          PanierBWMFactory.setPanier($scope.dbPanierBWM);
          var userLogin=response.data.response.login;
      
          // enregistrement des articles additifs
          for(var i=0; i< $scope.diffPanierBWM.length;i++){

            var userLogin=response.data.response.login;
        
            var myobject = {'login':userLogin,'idProduct':$scope.diffPanierBWM[i].productId,'type':"BWM",'number':$scope.diffPanierBWM[i].number};
            Object.toparams = function ObjecttoParams(obj) {
              var p = [];
              for (var key in obj) {
                      p.push(key + '=' + encodeURIComponent(obj[key]));
              }
                      return p.join('&');
            
            }

                $http({
                method: "POST",
                url: baseUrl+"user/panier/BWM",
                data:Object.toparams(myobject),
                      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
              }).then(function (response) {
                $scope.statut = response.data.statut;
                if($scope.statut=="200"){
                } else{
                } 
              }, function () {
                      alert("not ok");
              }).then(function () {
                    // here the end of the request
              });
            }

            $rootScope.isConnected=true;
            $scope.cutSpeudo = response.data.response.pseudo.split(" ")[0];
            $rootScope.user={
              'type':'standart',
              'pseudo':$scope.cutSpeudo,
              'login':response.data.response.login,
              'name':response.data.response.name,
              'firstName':response.data.response.firstName,
              'id':response.data.response.id,
              'dateDeNaiss':response.data.response.dateDeNaiss.date,
              'sexe':response.data.response.sex,
              'adresseLivraison':adresse
            };

            $rootScope.token={
              'value':response.data.response.token.value,
            };

            AuthFactory.setUser($rootScope.user);
            AuthFactory.setToken($rootScope.token); 
            AuthFactory.setKeepConnected($scope.resterConnecter); 
            $('#connection').modal('hide');

            $timeout(function () {
             window.location ="index.php";
            }, 300);
  
    }

    else{
      $scope.isLoading =false;
      $scope.isNotSucceed=true; 
    }
        
      }, function () {
        //alert("not ok");
      }).then(function () {
       // alert("fin");
       
      });
        
  }

});
