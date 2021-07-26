angular.module('App')
  .controller('PanierCtrl', function ($scope,PanierFactory,FavorisFactory,baseUrl,AuthFactory,$http,$interval,$location,$anchorScroll,$rootScope,$location,$timeout,$routeParams) {
   
    $scope.baseUrl=baseUrl; 
    $scope.isLoading=false;
    $scope.isVisible=false;
    $scope.showMessage=false;
    $scope.panier=null;
    $scope.tabQuantiteRestantDetail=[];
    $scope.tabQuantiteRestantgros=[];
    $scope.values=[];
    $scope.selectProduct=null;
    $scope.selectedPersonnalizableProduct;
    $scope.modelsInSelectedLot;
    $scope.allModelsOfSelectedLot;
    $scope.newModelSelectedLot=[];
    $scope.estVide=false;
    $rootScope.panierSize=0;
    $rootScope.favoriteSize=0;
    var userLogin=null;
    $scope.tailleDulot;
    $scope.tabValues=[];
    $scope.newTailleDulot;
    $scope.nbPerso=1;
    $scope.total=0;
    $scope.panierDetail=null;
     

    $("html, body").animate({
            scrollTop: 0
    }, 200);
    
    if(FavorisFactory.getFavoris()!=null){
        $scope.favorites=FavorisFactory.getFavoris();
        $rootScope.favoriteSize = $scope.favorites.length;
    }
    
    
    $scope.goToCommande= function(){
      if(AuthFactory.getUser()!=null){
        // $location.path("/commande");
        window.location ="commande.php";

      }
      else{
         
          $("#connection").modal();
      }      
    }

    $scope.convertIntToString= function(val){
      return  val.toString();
    };

    $scope.convertStringToInt= function(val){
      return   parseInt(val);
    };

    $scope.getArray= function(val){
       var tab=[];
       for (var i = 0; i < val; i++) {
         tab[i]={val:""+i+""};
        } 
       return tab;
    };

    
    $scope.getTab= function(val){
     return $scope.getArray(val);
    }


    $scope.totalDetail=function(panierDetail){
      var totalDetail=0; 
      for (var i = 0; i < panierDetail.length; i++) {
        if(panierDetail[i].number<=panierDetail[i].product.quantity){

          if(panierDetail[i].product.retailSale.isInPromotion){
            totalDetail+= panierDetail[i].number * panierDetail[i].product.retailSale.promotionalPrice;
          }
              else{
              totalDetail+= panierDetail[i].number * panierDetail[i].product.retailSale.price;
          }
        }
      }
          return totalDetail;
    }

    $scope.getPanierDetail= function(userLogin){
      $rootScope.panierSize=0;
      $scope.total=0;
      $http.get(baseUrl+"user/panier/detail/"+userLogin).then(function (response) {
        $scope.statut = response.data.statut;
        $scope.isLoading=false;
          if($scope.statut=="200"){
            $scope.isLoading=false;
            $scope.panierDetail=response.data.data.products;
            $scope.total+=$scope.totalDetail($scope.panierDetail);
            $scope.formatPanier=[];
            $scope.numberDetailTab=[]

            
            $scope.tabValuesDetailNumber=new Array();
            for (var i = 0; i < $scope.panierDetail.length; i++) {
              $scope.numberDetailTab.push(parseInt($scope.panierDetail[i].number));
              $scope.formatPanier.push({
                  productId: $scope.panierDetail[i].product.id,
                  number: $scope.panierDetail[i].number,
                  type:$scope.panierDetail[i].type
              });

              $scope.tabValuesDetailNumber[i]=new Array();
               for (j=0;j<$scope.panierDetail[i].product.quantity;j++) {
                 $scope.tabValuesDetailNumber[i][j]={val:j+1};
               }
              
            }

            for(var i=0;i<$scope.panierDetail.length;i++){
              $rootScope.panierSize+=$scope.panierDetail[i].number;  
            }
            $scope.estVide = ($scope.panierDetail.length==0) ? true : false;
          }
          // enregistrement du panier  dans la local storage
          PanierFactory.setPanier($scope.formatPanier);
        }, function () {
          //alert("not ok");
        }).then(function () {
         // alert("fin");
      });     
    }

    $scope.getNotConnectedPanierDetail = function(){
      $rootScope.panierSize=0;
      $scope.isLoading=false;
      $scope.panierDetail=[];
      $scope.formatPanier=[];
      $scope.numberDetailTab=[];
      if(PanierFactory.getPanier()!=null){
             $scope.panierDetail=PanierFactory.getPanier()
      }

      $scope.total+=$scope.totalDetail($scope.panierDetail);

      for(var i=0;i<$scope.panierDetail.length;i++){
              $rootScope.panierSize+=$scope.panierDetail[i].number;  
      }

       $scope.tabValuesDetailNumber=new Array();
            for (var i = 0; i < $scope.panierDetail.length; i++) {
              $scope.numberDetailTab.push(parseInt($scope.panierDetail[i].number));
              $scope.formatPanier.push({
                  productId: $scope.panierDetail[i].product.id,
                  number: $scope.panierDetail[i].number,
                  type:$scope.panierDetail[i].type
              });

              $scope.tabValuesDetailNumber[i]=new Array();
               for (j=0;j<$scope.panierDetail[i].product.quantity;j++) {
                 $scope.tabValuesDetailNumber[i][j]={val:j+1};
               }
              
            }
        $scope.estVide = $scope.panierDetail.length==0? true : false;
      }
    
    $rootScope.initPage=function(){

      // if the user is connected
      if(AuthFactory.getUser()!=null){

        var userLogin=AuthFactory.getUser().login;
        $scope.isLoading=true;

        //recuperation des produits en detail panier
        $scope.getPanierDetail (userLogin);
      }
      else{
        $scope.isLoading=false;
        $scope.getNotConnectedPanierDetail();
      }
    }

    $rootScope.initPage();

    $scope.selectArticle= function(product){
      $scope.selectProduct=product;
    };

    $scope.modifQuantityDetail=function(item){

      var userLogin=null;
      if(AuthFactory.getUser()!=null){
            var userLogin=AuthFactory.getUser().login;
      }

      //envois de la modication du number au serveur
      if(userLogin!=null && item.number){
          $scope.isLoading=true;
          var myobject = {'login':userLogin,'idProduct':item.product.id,'type':"detail",'number':item.number.val};
          Object.toparams = function ObjecttoParams(obj) {
          var p = [];
          for (var key in obj) {
              p.push(key + '=' + encodeURIComponent(obj[key]));
            }
            return p.join('&');
          }

          $http({
            method: "POST",
            url: baseUrl+"user/panier/detail/modifNumber",
            data:Object.toparams(myobject),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
          }).then(function (response) {
            $scope.statut = response.data.statut;
            if($scope.statut=="200"){
              $scope.isLoading=false;
              $rootScope.panierSize=0;
              $scope.total=0;
              $rootScope.initPage();
            }
            // enregistrement dans localstorage

          }, function () {
            alert("not ok");
          }).then(function () {
            // here the end of the request
          });
      } 
      else
      {
        ///alert($scope.panierDetail[0].number.val);
        var panier=[];
        
        for(var i=0; i< $scope.panierDetail.length;i++){
          
                var newProduct={
                  productId:$scope.panierDetail[i].productId,
                  name:$scope.panierDetail[i].name,
                  number:$scope.panierDetail[i].number.val,
                  type: "detail",
                  product:$scope.panierDetail[i].product
                }; 
              panier.push(newProduct);
              
        }


        PanierFactory.setPanier(panier);
        $rootScope.panierSize=0;
        $scope.total=0;
        $rootScope.initPage();
        
      }
    }

    $scope.verifsizeOfLot= function(){
        $scope.newTailleDulot=0;
        for(var i=0; i< $scope.newModelSelectedLot.length;i++){
          $scope.newTailleDulot+= $scope.newModelSelectedLot[i].number.val;
        }
    }    
     
    
    $scope.annulerSuppressionArticleDetail= function(){
     $('#deleteProductDetail').modal('hide');
    }

    $scope.annulerSuppressionArticleGros= function(){
     $('#deleteProductGros').modal('hide');
    }

    $scope.confirmSupprimerArticleDetail=function(){

      var panierLocal=PanierFactory.getPanier();
      
      for (var i = 0; i < panierLocal.length; i++) {
        if($scope.selectProduct.id == panierLocal[i].productId && panierLocal[i].type =="detail"){
          panierLocal.splice(i,1);
        }
      }
     PanierFactory.setPanier(panierLocal);
     $('#deleteProductDetail').modal('hide');

     var userLogin=AuthFactory.getUser();

      if(userLogin!=null){ 

        var myobject = {'login':userLogin.login,'idProduct':$scope.selectProduct.id};
        Object.toparams = function ObjecttoParams(obj) {
        var p = [];
        for (var key in obj) {
              p.push(key + '=' + encodeURIComponent(obj[key]));
        }
        return p.join('&');
        }

        $http({
         method: "POST",
          url: baseUrl+"user/panier/delete/detail",
            data:Object.toparams(myobject),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
              }).then(function (response) {
                $scope.statut = response.data.statut;
                if($scope.statut=="200"){
                  $('#deleteProductDetail').modal('hide');
                  $scope.initPage();
                } else{
            
                } 
              }, function () {
              //$scope.categories=response;
                alert("not ok");
              }).then(function () {
              // here the end of the request
        });
      }else
      {
       
       for (var i = 0; i < $scope.panierDetail.length; i++) {
        if($scope.selectProduct.id == $scope.panierDetail[i].productId && $scope.panierDetail[i].type =="detail"){
           $rootScope.panierSize-=$scope.panierDetail[i].number.val;
           $scope.panierDetail.splice(i,1);
        }
       }
      $scope.estVide = (panierLocal.length==0) ? true : false;
      $scope.getNotConnectedPanierDetail();
    }

    };

    
   $scope.deleteProduct= function(product){
      for (var i = 0; i < $scope.panier.length; i++) {
       if(product.name== $scope.panier[i].product.name && product.type==$scope.panier[i].product.type){
           $rootScope.panierSize-= $scope.panier[i].number;
           $scope.panier.splice(i, 1);
           PanierFactory.setPanier($scope.panier);
           $scope.estVide= (PanierFactory.getPanier().length==0) ? true : false;
           if(AuthFactory.getUser()!=null){
              var userLogin=AuthFactory.getUser().login;
              var myobject = {'login':userLogin,'idProduct':product.id};
              Object.toparams = function ObjecttoParams(obj) {
              var p = [];
              for (var key in obj) {
                p.push(key + '=' + encodeURIComponent(obj[key]));
              }
              return p.join('&');
              }
           
              $http({
               method: "POST",
                url: baseUrl+"user/panier/delete",
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
      }   
    };

 });  