angular.module('App')
  .controller('CategorieCtrl', function ($scope,AuthFactory,FavorisFactory,baseUrl,PanierFactory,PanierBWMFactory,FavorisFactory,$http,$interval,$location,$anchorScroll,$rootScope,$location,$timeout,$routeParams) {
    
    $scope.baseUrl=baseUrl;
    $scope.currentPage='1'; 
    $scope.rating = 1;
    $scope.rating1 = 1;
    $scope.sendingRating = 1;
    $rootScope.favoriteSize=0;
    $rootScope.panierSize=0;
    $scope.maxSize1 = 2;
    

    $scope.encode = function (val) {
      return encodeURI(val);
    }

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

    if (getUrlVars()["cat"]!= undefined ){
      $scope.categorie= getUrlVars()["cat"];
    }

   

    /*if (getUrlVars()["page"]!= undefined ){
      $scope.currentPage= getUrlVars()["page"];
      $scope.selectedPage= getUrlVars()["page"];
    }
    else{
      $scope.currentPage='1'; 
    }*/
    

    if (getUrlVars()["filter"]!= undefined ){
        $scope.filterOption=getUrlVars()["filter"];
        $scope.filterValue=getUrlVars()["filter"];
    }
    else{
      $scope.filterOption="filter-by-popularity";
      $scope.filterValue="filter-by-popularity"; 
    }

    if (getUrlVars()["minprice"]!= undefined ){
        $scope.filterMinPrice=getUrlVars()["minprice"];
    }
    else{
      $scope.filterMinPrice="null"; 
    }

    if (getUrlVars()["maxprice"]!= undefined ){
        $scope.filterMaxPrice=getUrlVars()["maxprice"];
    }
    else{
      $scope.filterMaxPrice="null"; 
    }

    if (getUrlVars()["marque"]!= undefined ){
        $scope.filterMarque=getUrlVars()["marque"];
    }
    else{
      $scope.filterMarque="null"; 
    }

    $scope.select = function (product) {
      $scope.selectedProduct=product;
       if(AuthFactory.getUser()==null){
            $("#connection").modal();
        }
        else
        {
           $("#avis").modal();
        }
    }


     $scope.rateFunction = function(rating) {
      $scope.rating = rating;
     // alert('You selected - ' + rating+' stars');
    };


    $rootScope.slider = {
        minValue: 0,
        maxValue: 6000,
        options: {
          precision: 1,
          //ceil: $rootScope.plusGrandPrix,
          translate: function(value) {
            return 'FCFA ' + value;
          },
          onEnd: function(sliderId, modelValue, highValue, pointerType){
            $scope.filterMinPrice=modelValue;
            $scope.filterMaxPrice=highValue;
            window.location ="categorie.php?cat="+$scope.categorie+"&filter="+$scope.filterOption+"&minprice="+$scope.filterMinPrice+"&maxprice="+$scope.filterMaxPrice+"&marque="+$scope.filterMarque;
         }
        }
    };
    

    $scope.init = function () {

      $scope.isLoaded=false;
      // extraction des categories
      
      $http.get(baseUrl+"category/"+$scope.categorie).then(function (response) {
        $scope.statut= response.data.statut;
        $rootScope.choosedCategory = response.data.data;
      }, function () {
        }).then(function () {
      });

      //extraction des  produits

      $http.get(baseUrl+"product/model/category/"+$scope.categorie+"/"+$scope.currentPage+"/"+$scope.filterOption+"/"+$scope.filterMinPrice+"/"+$scope.filterMaxPrice+"/"+$scope.filterMarque).then(function (response) {
      $scope.statut= response.data.statut;

        $timeout(function () {
          $scope.extractedMarque = response.data.data.marque;
          for(var i=0; i< $scope.extractedMarque.length; i++){
            $scope.extractedMarque[i].url = $scope.baseUrl;
            $scope.extractedMarque[i].category = $routeParams["cat"];
        }},100);

        $scope.products= response.data.data.products;
        $scope.size=response.data.data.size;
        $scope.isLoaded=true;
       
        $timeout(function () {

           if($scope.filterMinPrice=="null"){
            $rootScope.slider.minValue=parseInt(response.data.data.plusPetitPrix);
           }else{
            $rootScope.slider.minValue=parseInt($scope.filterMinPrice);
           }

           if($scope.filterMaxPrice=="null"){
            $rootScope.slider.maxValue=parseInt(response.data.data.plusGrandPrix);
           }else{
            $rootScope.slider.maxValue=parseInt($scope.filterMaxPrice);
           }
     
           $rootScope.slider.options.ceil=parseInt(response.data.data.plusGrandPrix);
           $rootScope.slider.options.floor=parseInt(response.data.data.plusPetitPrix);
        
        }, 600);
       
       
      }, function () {

        }).then(function () {  
          
      });
    }

    $scope.init();

    // choose filter function
    $scope.chooseFilter = function (valeur) {
      $scope.filterOption=valeur;
      window.location = "categorie.php?cat="+$scope.categorie+"&filter="+$scope.filterOption+"&minprice="+$scope.filterMinPrice+"&maxprice="+$scope.filterMaxPrice+"&marque="+$scope.filterMarque;
    }

    $scope.chooseMarque = function (marque) {
      $scope.filterMarque= marque;
      $scope.currentPage=1;
      window.location = "categorie.php?cat="+$scope.categorie+"&filter="+$scope.filterOption+"&minprice="+$scope.filterMinPrice+"&maxprice="+$scope.filterMaxPrice+"&marque="+$scope.filterMarque;
    };

    $scope.setPage = function (pageNo) {
      $scope.currentPage = pageNo;
    };

    $scope.pageChanged = function() {
     $scope.init();
    }


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
      }
    };


    // ajout d'un produit dans le panierBWM
    $scope.acheterEnBWM = function (produit) {
      $scope.selectedProduct=produit;
      var panierBWM=[];
      var number=0;

      if(PanierBWMFactory.getPanier()!=null){
          var panierBWM= PanierBWMFactory.getPanier();
      }

 
      //si le produit figure deja dans le panier BWM
      for (var i = 0; i < panierBWM.length; i++) {
        if(panierBWM[i].productId == produit.id ){
            var number= panierBWM[i].number;
            panierBWM.splice(i, 1);
        }
      }
    
      if(number+1<=produit.quantity){ 
        $scope.showMessage_ajout_BWM=true; 
        var newProduct={
          productId:produit.id,
          name:produit.name,
          number:number + 1,
          type: "detail",
          product:produit
        };
         
        panierBWM.push(newProduct);
        PanierBWMFactory.setPanier(panierBWM);
        $rootScope.panierBWMSize+= 1;


        $("html, body").animate({
            scrollTop: 0
          }, 200);

        $timeout(function () {
          $scope.showMessage_ajout_BWM=false; 
        }, 10000);  

        var userLogin=null;
        if(AuthFactory.getUser()!=null){
          var userLogin=AuthFactory.getUser().login;
         }

        //enregistrement en bd si connecter
        if(userLogin!=null){
            var myobject = {'login':userLogin,'idProduct':produit.id,'number':1};
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
        }else{
          $scope.showMessage_ajout_BMW_denied=true;

          $("html, body").animate({
              scrollTop: 0
            }, 200);

          $timeout(function () {
            $scope.showMessage_ajout_BWM_denied=false; 
          }, 10000);
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

    $scope.acheterEnBuyWithMe =function(produit){
      $location.path("/buyWithMeCommande/"+produit.name+"/"+produit.productName);
    };

    $scope.sendNotation =function(){
      var myobject = {'idModel':$scope.selectedProduct.id,'note': $scope.rating};

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
              $scope.init();
              }  
            }, function () {
                alert("not ok");
            }).then(function () {
                // here the end of the request
            });
    };

    $scope.sendComment =function(){
            var userLogin=AuthFactory.getUser();
            var myobject = {'idModel':$scope.selectedProduct.id,'login': userLogin.login,
            'name':userLogin.name, 'firstName':userLogin.firstName, 'valeur':$scope.commentaire};

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
                } else{
              
                } 
            }, function () {
                alert("not ok");
            }).then(function () {
                // here the end of the request
            });
    };



  });
