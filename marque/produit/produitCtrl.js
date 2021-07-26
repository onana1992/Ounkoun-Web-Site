angular.module('App')
  .controller('ProduitCtrl', function ($scope,PanierFactory,baseUrl,AuthFactory,FavorisFactory,$http,$interval,$location,$anchorScroll,$rootScope,$location,$timeout,$routeParams) {
    
    $scope.baseUrl=baseUrl;
    $scope.isLoading=true;
    $scope.isVisible=false;
    $scope.produit=null;
    $scope.showMessage_ajout_detail=false;
    $scope.showMessage_ajout_gros=false;
    
    $scope.selectedProduct=null;
    $scope.SelectedProduct=null;
    $scope.showMessage=false;
    $scope.tabDetailQuantite= [];
    $scope.tabGrosQuantite= [];
    $scope.retailQuantity="1";
    $scope.wholeQuantity="1";
    $scope.data_delayed = {}
    $scope.retailQuantity={"val":0};
    $scope.grosQuantity={"val":0};
    $scope.rating = 1;
    $scope.rating1 = 1;
    $scope.sendingRating = 1;
    $scope.commentaire="";
    $rootScope.favoriteSize=0;
    $rootScope.panierSize=0;

    if(FavorisFactory.getFavoris()!=null){
        $scope.favorites=FavorisFactory.getFavoris();
        $rootScope.favoriteSize = $scope.favorites.length;
    }

    if(PanierFactory.getPanier()!=null){
        $scope.panierDetail=PanierFactory.getPanier();
        for(var i=0;i<$scope.panierDetail.length;i++){
              $rootScope.panierSize+=$scope.panierDetail[i].number;  
        }
    }

    function getUrlVars() {
      var vars = {};
      var parts = decodeURI(window.location.href).replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
      });   
        return vars;
    }

    if (getUrlVars()["nom"]!= undefined ){
      $scope.selectedProductName=$scope.categorie= getUrlVars()["nom"];
    }
  
    $scope.changeImage= function(idBigImage){
       
      $scope.data_delayed.small_image = baseUrl+"image/"+idBigImage;
      $scope.data_delayed.large_image = baseUrl+"image/"+idBigImage;
      $("#zoom_01").data('zoom-image', baseUrl+"image/"+idBigImage).elevateZoom({
               responsive: true,
               zoomType: "lens", 
               containLensZoom: true
      }); 
    }
    

    var userLogin=null;
    if(AuthFactory.getUser()!=null){
          userLogin=AuthFactory.getUser().login;
    }

     $scope.rateFunction = function(rating) {
      $scope.rating = rating;
     // alert('You selected - ' + rating+' stars');
    };

    $scope.initPage= function(){

      // extraction des donnee
      $http.get(baseUrl+"product/model/"+$scope.selectedProductName).then(function (response) {
        $scope.statut= response.data.statut;
        $scope.selectedProduct = response.data.data.product;
        $scope.isLoading=false;

         // autres modeles
        $http.get(baseUrl+"product/models/"+$scope.selectedProduct.productName).then(function (response) { 

            //this.response = data.data;
            $scope.otherModels=[];    
            $scope.otherModels = response.data.data.product;
           
              for( var i=0;i< $scope.otherModels.length;i++){
                  if( $scope.otherModels[i].name == $scope.selectedProductName){
                    $scope.otherModels.splice(i,1);
                  }
            } 

        }, function () {
          alert("not ok");
          }).then(function () {

        });

        /*$scope.data_delayed = {
          small_image: baseUrl+"image/"+$scope.selectedProduct.idBigImage1,
          large_image: baseUrl+"image/"+$scope.selectedProduct.idBigImage1
        }*/

         $scope.data_delayed = {}
  
        $timeout(function(){
          $scope.data_delayed = {
            small_image: baseUrl+"image/"+$scope.selectedProduct.idBigImage1,
            large_image: baseUrl+"image/"+$scope.selectedProduct.idBigImage1
          }
        }, 1000);

        
        $scope.tabValuesDetailNumber = new Array();
        for (var i = 0; i < $scope.selectedProduct.quantity ; i++) {
          $scope.tabValuesDetailNumber[i]={val:i+1}; 
        }
        $scope.retailQuantity=$scope.tabValuesDetailNumber[0];


        $scope.tabValuesGrosNumber = new Array();
        if($scope.selectedProduct.quantity>=$scope.selectedProduct.wholeSale.lotQuantity){
          for (var i = 0; i < $scope.selectedProduct.quantity/$scope.selectedProduct.wholeSale.lotQuantity ; i++) {
            $scope.tabValuesGrosNumber[i]={val:i+1}; 
          }
          $scope.grosQuantity=$scope.tabValuesGrosNumber[0];
        }



        $scope.getActiveRetailSale= function (){
          if($scope.selectedProduct.retailSale=="null"){
            return "nonactive"
          }
          else{
            return "active"
          }
        };

        $scope.getActiveWholeSale= function (){
          if($scope.selectedProduct.wholeSale=="null"){
            return "active"
          }
          else{
            return "nonactive"
          }

        };     
      }, function () {
        alert("not ok");
        }).then(function () {
      });

        // autres produit du modèles
    }

    $scope.initPage();
    


  // ajout d'un produit dans le panier
  $scope.acheterEndetail = function (produit) {

    if(produit.isVirtual){
          $scope.showModalSize(produit);
    }
    else
    {
  
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
    
      if(parseInt(number)+$scope.retailQuantity.val<= parseInt(produit.quantity)){ 
        $scope.showMessage_ajout_detail=true; 
        var newProduct={
          productId:produit.id,
          name:produit.name,
          number:number + $scope.retailQuantity.val,
          type: "detail",
          product:produit
        };

        panier.push(newProduct);
        PanierFactory.setPanier(panier);
        $rootScope.panierSize+= $scope.retailQuantity.val;
        $('#taille').modal('hide');

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
            var myobject = {'login':userLogin,'idProduct':produit.id,'type':"detail",'number':$scope.retailQuantity.val};
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
      } 
    };

    $scope.ajouterFavoris= function (produit) {
        $scope.selectedProduct=produit;
        $scope.favoris=[];

        if(AuthFactory.getUser()==null){
            $("#connection").modal();
        }

        else{
          if( FavorisFactory.getFavoris()!=null){
            $scope.favoris=FavorisFactory.getFavoris();
            // si le produit est dja dans les favoris
            for (var i = 0; i < $scope.favoris.length; i++) {
                if ($scope.favoris[i].name == produit.name) {
                  return;
                }
            }
          }
          
          $scope.showMessage_ajout_favori=true;
          $scope.newfavoris={
              'name':$scope.selectedProduct.name,
          };

          $scope.favoris.push($scope.newfavoris);
          FavorisFactory.setFavoris( $scope.favoris);
          $rootScope.favoriteSize+=1;

          // $location.hash("categories");
          //$anchorScroll();
          $("html, body").animate({
            scrollTop: 0
          }, 200); 
          $timeout(function () {
            $scope.showMessage_ajout_favori=false; 
          }, 4000);

           var userLogin=null;
           if(AuthFactory.getUser()!=null){
            var userLogin=AuthFactory.getUser().login;
           }

           if(userLogin!=null){

              var myobject = {'login':userLogin,'idProduct':produit.id};
              Object.toparams = function ObjecttoParams(obj) {
                var p = [];
                for (var key in obj) {
                  p.push(key + '=' + encodeURIComponent(obj[key]));
                }
                return p.join('&');
              }

              $http({
                method: "POST",
                url: baseUrl+"user/favorite",
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
        }
    };

    $scope.sendNotation =function(){
      var myobject = {'idModel':  $scope.selectedProduct.id,'note': $scope.rating};

      Object.toparams = function ObjecttoParams(obj) {
          var p = [];
            for (var key in obj) {
              p.push(key + '=' + encodeURIComponent(obj[key]));
            }
            return p.join('&');
      }

      $scope.isLoadingNotation=true;
        $http({
          method: "POST",
          url: baseUrl+"product/model/note",
          data:Object.toparams(myobject),
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(function (response) {
            $scope.statut = response.data.statut;
            if($scope.statut=="200"){
              $scope.isLoadingNotation=false;
              $('#avis').modal('hide');
              $scope.isLoaded=false;
              $scope.initPage();


            } else{
              
            } 
        }, function () {
                alert("not ok");
            }).then(function () {
                // here the end of the request
        });
    };

    $scope.sendComment =function(){
      var user=AuthFactory.getUser();
      var myobject = {'idModel':$scope.selectedProduct.id,'login': user.login,
      'name':user.name, 'firstName':user.firstName, 'valeur':$scope.commentaire};

      Object.toparams = function ObjecttoParams(obj) {
        var p = [];
        for (var key in obj) {
                  p.push(key + '=' + encodeURIComponent(obj[key]));
        }
        return p.join('&');
      }

      $scope.isLoadingNotation=true;
      $http({
        method: "POST",
        url: baseUrl+"product/model/comment",
        data:Object.toparams(myobject),
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      }).then(function (response) {
        $scope.statut = response.data.statut;
        if($scope.statut=="200"){
            $scope.isLoadingNotation=false;
            $('#avis').modal('hide');
        }
        else{
              
        } 
      }, function () {
        alert("not ok");
      }).then(function () {
                // here the end of the request
      });
    };

    $scope.showModalSize = function (produit) {

      $("#taille").modal();
      $scope.isLoadingSizeModal = true;

      $http.get(baseUrl+"product/models/"+produit.productName).then(function (response) {
          $scope.otherModels=[];    
          $scope.otherModels = response.data.data.product;
          $scope.isLoadingSizeModal = false;
            //this.isLoading = false;
          for( var i=0;i< $scope.otherModels.length;i++){
                if( $scope.otherModels[i].name == produit.name){
                    $scope.otherModels.splice(i,1);
                }
          }
        }, function () {
          }).then(function () {
      });

    }
   
});

   
    
    
    
