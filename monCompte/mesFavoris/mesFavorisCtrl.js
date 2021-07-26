angular.module('App')
  .controller('FavoriteCtrl', function ($scope,$timeout,baseUrl,AuthFactory,FavorisFactory,PanierFactory,$http,$interval,$location,$rootScope,$location) {
    
    $scope.baseUrl=baseUrl;
    $scope.isLoading=true;
    $scope.isVisible=false;
    $scope.produit=null;
    $scope.favorites=null;
    $scope.estVide=false;
    $rootScope.panierSize=0;

    // recuperation de l'id
    var userLogin=null;
    if(AuthFactory.getUser()!=null){
        var userLogin=AuthFactory.getUser().login;
    }

    if(PanierFactory.getPanier()!=null){
        $scope.panierDetail=PanierFactory.getPanier();
        for(var i=0;i<$scope.panierDetail.length;i++){
              $rootScope.panierSize+=$scope.panierDetail[i].number;  
        }
    }

    
    //recuperation des favoris
    $http.get(baseUrl+"user/favorite/"+userLogin).then(function (response) {
        $scope.statut = response.data.statut;
        
        if($scope.statut=="200"){
          $scope.isLoading=false;
          $scope.favorites=response.data.data.favorites;
          $rootScope.favoriteSize = $scope.favorites.length;
          $scope.mesfavoris=[];
          $scope.estVide= ($scope.favorites.length==0) ? true : false;
          for (var i = 0; i < $scope.favorites.length; i++) {
                $scope.mesfavoris[i]={
                  'name':$scope.favorites.product.name,
                  'idPhoto':$scope.favorites.product.idImage,
                  'retailSale':$scope.favorites.product.retailSale,
                  'wholeSale':$scope.favorites.product.sswholeSale
                };
          }
          FavorisFactory.deleteFavoris();
          FavorisFactory.setFavoris($scope.mesfavoris);
        }

    }, function () {
        //alert("not ok");
      }).then(function () {
       // alert("fin");
       
    });

    $scope.selectArticle= function(product){
        $scope.selectProduct=product;
    };

    $scope.annulerSuppressionArticleDetail= function(){
       $('#deleteProductDetail').modal('hide');
    }

  // supression d'un favoris
  $scope.confirmSupprimerArticleDetail= function(){
    for (var i = 0; i <  $scope.favorites.length; i++) {
      if($scope.favorites[i].product.name==$scope.selectProduct.name){
        $scope.favorites.splice(i, 1);
        $('#deleteProductDetail').modal('hide');
        $scope.estVide= ($scope.favorites.length==0) ? true : false;
        $scope.mesfavoris=[]
        for (var i = 0; i < $scope.favorites.length; i++) {
                $scope.mesfavoris[i]={
                  'name':$scope.favorites[i].product.name,
                  'idPhoto':$scope.favorites[i].product.idImage,
                  'retailSale':$scope.favorites[i].product.retailSale,
                  'wholeSale':$scope.favorites[i].product.wholeSale
                };
        }

        $rootScope.favoriteSize-=1;
        FavorisFactory.deleteFavoris();
        FavorisFactory.setFavoris($scope.mesfavoris);
        var myobject = {'login':userLogin,'idProduct':$scope.selectProduct.id};
          //$scope.isLoading=true;
          Object.toparams = function ObjecttoParams(obj) {
            var p = [];
            for (var key in obj) {
              p.push(key + '=' + encodeURIComponent(obj[key]));
            }
            return p.join('&');
          }

          $http({
            method: "POST",
            url: baseUrl+"user/favorite/delete",
            data:Object.toparams(myobject),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
          }).then(function (response) {
            $scope.statut = response.data.statut;
            if($scope.statut=="200"){
            } else{
          
            } 
          }, function () {
            //$scope.categories=response;
            alert("not ok");
          }).then(function () {
            // here the end of the request

          });
        }
      }
  };

  // ajout d'un produit dans le panier

    $scope.acheterEndetail = function (produit) {
      $scope.selectedProduct=produit;
      var panier=[];
      var number=0;

      if(PanierFactory.getPanier()!=null){
          var panier= PanierFactory.getPanier();
      }

      //si le produit figure deja dans le panier
      for (var i = 0; i < panier.length; i++) {
        if(panier[i].productId == produit.id && panier[i].type=="detail"){
            var number= panier[i].number;
            panier.splice(i, 1);
        }
      }
    
      if(number+1<=produit.quantity){ 
        $scope.showMessage_ajout_detail=true; 
        var newProduct={
          productId:produit.id,
          name:produit.name,
          number:number + 1,
          type: "detail",
          product:produit
        };

        panier.push(newProduct);
        PanierFactory.setPanier(panier);
        $rootScope.panierSize+= 1;


        $("html, body").animate({
            scrollTop: 0
          }, 200);

        $timeout(function () {
          $scope.showMessage_ajout_detail=false; 
        }, 10000);  

        var userLogin=null;
        if(AuthFactory.getUser()!=null){
          var userLogin=AuthFactory.getUser().login;
         }

        //enregistrement en bd si connecter
        if(userLogin!=null){
            var myobject = {'login':userLogin,'idProduct':produit.id,'type':"detail",'number':1};
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
              alert("not ok");
            }).then(function () {
              // here the end of the request
            });
        }
        }else{
          $scope.showMessage_ajout_detail_denied=true;

          $("html, body").animate({
              scrollTop: 0
            }, 200);

          $timeout(function () {
            $scope.showMessage_ajout_detail_denied=false; 
          }, 10000);
       } 
    };

});
