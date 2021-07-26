angular.module('App')
  .controller('CommandeCtrl', function ($scope,PanierFactory,FavorisFactory,baseUrl,AuthFactory,$http,$interval,$location,$anchorScroll,$rootScope,$location,$timeout,$routeParams) {
    
    $scope.baseUrl=baseUrl;
    $scope.hasAdress=true;
    $scope.showForm=false;
    $scope.adresseLivraison = AuthFactory.getUser().adresseLivraison;
    $scope.livraison;
    $scope.maRegion;
    $scope.maVille;
    $scope.villes;
    $scope.paiement;
    $rootScope.favoriteSize=0;
    $rootScope.panierSize=0;
    $scope.matchPatternTel = new RegExp("(^([A-Za-z0-9])+\@([A-Za-z0-9])+\.([A-Za-z]{2,4})$)|(^6[0-9]{8}$)");
    $scope.hasRelais= false;
    $scope.shippingTown=['Yaoundé'];
    $scope.relaisPoint=null;

    /*$scope.localite=[
      {region:"Centre", ville:[{value:"yaounde-mendong"},{value:"yaounde-biyem-assi"},{value:"yaounde-minboman"}]},
      {region:"Littoral", ville:[{value:"douala 1"},{value:"douala 2"},{value:"douala 3"}]},
      {region:"Ouest", ville:[{value:"bafoussam"},{value:"dschang"},{value:"bouda"}]}
    ];*/

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

    $scope.getLocalite = function(){
      $http.get(baseUrl+"localite/all").then(function (response) {
            $scope.statut= response.data.statut;
            if($scope.statut=="200"){
              $scope.localite =response.data.data;
              $scope.maRegion = $scope.localite[0];
              $scope.villes=  $scope.maRegion.villes
              $scope.maVille = $scope.villes[0];
            }
          }, function () {
            //alert("not ok");
          }).then(function () {
           // alert("fin");
      });
    }

    

    $scope.modifRegion= function(){
      for (var i = 0; i < $scope.localite.length; i++) {
         if($scope.maRegion.region==$scope.localite[i].region){
            $scope.villes = $scope.localite[i].villes;
            $scope.maVille = $scope.villes[0];
         }
      }
    };


    if($scope.adresseLivraison!='null'){

      $scope.nom= $scope.adresseLivraison.name;
      $scope.prenom=  $scope.adresseLivraison.firstName;
      $scope.tel1= $scope.adresseLivraison.tel1;
      $scope.tel2= $scope.adresseLivraison.tel2;
      $scope.maRegion = $scope.adresseLivraison.region;
       $scope.maRegion = $scope.adresseLivraison.town;
      $scope.adresse= $scope.adresseLivraison.adresse;
      $scope.isLoading=false;
      
      }else{

         $scope.tel2='';
         $scope.prenom='';
      }


    $scope.hasAdress= $scope.adresseLivraison=="null"? false: true; 


    $scope.hasConfirmAdress=false;
    $scope.isLoading=true;
    $scope.total=0;
    $scope.nbArticles=0;
    $scope.hasConfirmCommand= false;
    $scope.hasConfirmLivraison= false;
    $scope.userLogin=null;
    $scope.produits=[];

    $scope.today = new Date();
    $scope.creationDate = new Date().toISOString().slice(0,10);
    Date.prototype.shiftDays = function(days){    
      days = parseInt(days, 10);
      this.setDate(this.getDate() + days);
      return this;
    }
    $scope.delais=$scope.today.shiftDays(5);
    $scope.livraison={"type": "1",
                      "price":700,
                      "delais":$scope.delais.toISOString().slice(0,10)};

    $scope.paiement={"type": "1"};



    $("html, body").animate({
            scrollTop: 0
    }, 200);
    
    $scope.annulercreationAdresse= function(){
     $('#adresseForm').modal('hide');
    };

    $scope.annulerModifAdresse= function(){
     $('#adresseFormModif').modal('hide');
    };

    $scope.toogleModifyAdress= function(){
      $scope.showForm= !$scope.showForm;
    };

    $scope.totalDetail=function(panierDetail){
       var totalDetail=0; 
       for (var i = 0; i < panierDetail.length; i++) {
          if(panierDetail[i].product.retailSale.isInPromotion){
            totalDetail+= panierDetail[i
            ].number * panierDetail[i].product.retailSale.promotionalPrice;
          }
              else{
              totalDetail+= panierDetail[i].number * panierDetail[i].product.retailSale.price;
          }

        }
          return totalDetail;
    }


    $scope.nbArticle=function(panierDetail){
       var nb=0; 
       for (var i = 0; i < panierDetail.length; i++) {
            nb+= panierDetail[i].number ;
        }
          return nb;
    }



    $scope.getPanierDetail= function(userLogin){
      $http.get(baseUrl+"user/panier/detail/"+userLogin).then(function (response) {
        $scope.statut = response.data.statut;
        $scope.isLoading=false;
          if($scope.statut=="200"){
            $scope.isLoading=false;
            $scope.panierDetail=response.data.data.products;
            $scope.total+=$scope.totalDetail($scope.panierDetail);
            $scope.nbArticles= $scope.nbArticle($scope.panierDetail);
            $scope.formatPanier=[];
            $scope.numberDetailTab=[]

            $scope.mostHeavyProduct = $scope.panierDetail[0];
            for (var i = 1; i < $scope.panierDetail.length; i++) {
                if ($scope.mostHeavyProduct.product.weight < $scope.panierDetail[i].product.weight) {
                  $scope.mostHeavyProduct= $scope.panierDetail[i];
                }
            }



             $scope.fraisLivraison();

            
             $scope.tabValuesDetailNumber=new Array();
            for (var i = 0; i < $scope.panierDetail.length; i++) {
              if($scope.panierDetail[i].number<=$scope.panierDetail[i].product.quantity){
                
                if($scope.panierDetail[i].product.retailSale.isInPromotion){
                  $scope.produits.push({'name':$scope.panierDetail[i].product.name,'quantity':$scope.panierDetail[i].number,'price':$scope.panierDetail[i].product.retailSale.promotionalPrice});
                }
                else{
                  $scope.produits.push({'name':$scope.panierDetail[i].product.name,'quantity':$scope.panierDetail[i].number,'price':$scope.panierDetail[i].product.retailSale.price});
                }
              }

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

            $scope.estVide = ($scope.panierDetail.length==0 && $scope.panierGros.length==0) ? true : false;
           
          }
        }, function () {
          //alert("not ok");
        }).then(function () {
         // alert("fin");
      });     
    }

    $scope.showRelaisModal= function(){
      $http.get(baseUrl+"relais/all").then(function (response) {
        $scope.relais = response.data.data ;
        $scope.relaisVille= $scope.relais[0].ville;
          
        }, function () {
          //alert("not ok");
        }).then(function () {
         // alert("fin");
      });     
    };


    
    $scope.initPage=function(){

        $scope.userLogin=AuthFactory.getUser().login;

        //recuperation des produits en detail panier
        $scope.getPanierDetail ($scope.userLogin);

        $scope.getLocalite();

        $scope.showRelaisModal();

        $scope.isLoading=true;
    }

    $scope.initPage();

    $scope.sendAdress = function () {
      
      var userLogin=null;
      if(AuthFactory.getUser()!=null){
        var userLogin=AuthFactory.getUser().login;
      }
      
      var myobject = {'login':userLogin,'name':$scope.nom,'firstName':$scope.prenom
      ,'tel1':$scope.tel1,'tel2':$scope.tel2,'region':$scope.maRegion.region,'town': $scope.maVille.name,'address':$scope.adresse};

      $scope.isLoading1=true;

     Object.toparams = function ObjecttoParams(obj) {
        var p = [];
        for (var key in obj) {
            p.push(key + '=' + encodeURIComponent(obj[key]));
        }
      return p.join('&');
     }

     $http({
      method: "POST",
      url: $scope.baseUrl+"user/adresseLivraison",
      data:Object.toparams(myobject),
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
     }).then(function (response) {
         $scope.statut = response.data.statut;
         $scope.hasAdress=true;
        if($scope.statut=="200"){

          user= AuthFactory.getUser();
          user.adresseLivraison=response.data.livraisonadresse;
          AuthFactory.setUser(user);
          $scope.adresseLivraison = AuthFactory.getUser().adresseLivraison;
          $scope.isLoading1=false;
          $('#adresseForm').modal('hide');         
        } else{
          
        } 
      }, function () {
        //$scope.categories=response;
        alert("not ok");
      }).then(function () {
      // here the end of the request

      });
    };

    $scope.modifAdress = function () {
      
      var userLogin=null;
      if(AuthFactory.getUser()!=null){
        var userLogin=AuthFactory.getUser().login;
      }
      
      var myobject = {'login':userLogin,'name':$scope.nom,'firstName':$scope.prenom
      ,'tel1':$scope.tel1,'tel2':$scope.tel2,'region':$scope.maRegion.region,'town': $scope.maVille.name,'address':$scope.adresse};

      $scope.isLoading2=true;

     Object.toparams = function ObjecttoParams(obj) {
        var p = [];
        for (var key in obj) {
            p.push(key + '=' + encodeURIComponent(obj[key]));
        }
      return p.join('&');
     }

     $http({
      method: "POST",
      url: $scope.baseUrl+"user/adresseLivraison",
      data:Object.toparams(myobject),
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
     }).then(function (response) {
         $scope.statut = response.data.statut;
        if($scope.statut=="200"){ 
          user= AuthFactory.getUser();
          user.adresseLivraison=response.data.livraisonadresse;
          AuthFactory.setUser(user);
          $scope.nom= $scope.adresseLivraison.name;
          $scope.prenom=  $scope.adresseLivraison.firstName;
          $scope.tel1= $scope.adresseLivraison.tel1;
          $scope.tel2= $scope.adresseLivraison.tel2;
          $scope.region= $scope.adresseLivraison.region;
          $scope.ville= $scope.adresseLivraison.town;
          $scope.adresse= $scope.adresseLivraison.adresse;
          $scope.hasAdress= $scope.adresseLivraison=="null"? false: true;
          $scope.hasConfirmCommand=false;
          $scope.hasConfirmPaiement=false;
          $scope.adresseLivraison = AuthFactory.getUser().adresseLivraison;
          $scope.isLoading2=false;
          $('#adresseFormModif').modal('hide');

        } else{
          
        } 
      }, function () {
        //$scope.categories=response;
        alert("not ok");
      }).then(function () {
      // here the end of the request

      });
    };

    $scope.sendCommand= function(){
       $scope.total+=montantLivraison;
       $scope.isLoading= true;
       var myobject = {'login':$scope.userLogin,'commandDate':$scope.creationDate,'adressL':JSON.stringify($scope.adresseLivraison),'livraison':JSON.stringify($scope.livraison),
       "products":JSON.stringify($scope.produits),'relais':JSON.stringify($scope.relaisPoint)};
       Object.toparams = function ObjecttoParams(obj) {
              var p = [];
              for (var key in obj) {
                  p.push(key + '=' + encodeURIComponent(obj[key]));
                }
                return p.join('&');
       }
       $scope.numCmd="SKJHDJ58454";


       $http({
                method: "POST",
                url: baseUrl+"command",
                data:Object.toparams(myobject),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
              }).then(function (response) {
                $scope.statut = response.data.statut;
                if($scope.statut=="200"){
                  $scope.isLoading= false;
                  PanierFactory.deletePanier();
                  $rootScope.panierSize=0;
                  //$location.path("/commandConfirm");
                  window.location ="succeedCommand.php?cmd="+$scope.numCmd+"&montant="+$scope.total+"&tel="+$scope.adresseLivraison.tel1;
                } else{
              
                } 
              }, function () {
                alert("not ok");
              }).then(function () {
                // here the end of the request
              });
    };

    $scope.changeRelais= function(){

      // calcul du montant de la livraison
      if( $scope.mostHeavyProduct.product.weight ==1){

        for(var i=0; i< $scope.mostHeavyProduct.number;i++){
          if(i==0){
             $scope.montantLivraisonRelais = $scope.point.prix_small;
          }
          else if(i<6){
            $scope.montantLivraisonRelais += $scope.point.prix_small/2;
          }
        }

        var tour= 0;
        for (var i = 0; i <  $scope.panierDetail.length; i++) {
          if ($scope.mostHeavyProduct.product.name != $scope.panierDetail[i].product.name && tour < 6) {
            $scope.montantLivraisonRelais += Math.ceil($scope.point.prix_small/2) * $scope.panierDetail[i].number;
          }
          tour++;
        }
      }

      else if($scope.mostHeavyProduct.product.weight ==2){

          for(var i=0; i< $scope.mostHeavyProduct.number;i++){
            if(i==0){
              $scope.montantLivraisonRelais = $scope.point.prix_medium;
            }
            else if(i<6){
              $scope.montantLivraisonRelais += $scope.point.prix_medium/2;
            }
          }
          

          var tour= 0;
          for (var i = 0; i < $scope.panierDetail.length; i++) {
            if ($scope.mostHeavyProduct.product.name != $scope.panierDetail[i].product.name && tour < 6) {
              $scope.montantLivraisonRelais += Math.ceil($scope.point.prix_medium/2) * $scope.panierDetail[i].number;
            }
            tour++;
          }
      }

      else if($scope.mostHeavyProduct.product.weight ==3){

        for(var i=0; i<$scope.mostHeavyProduct.number;i++){
          if(i==0){
            $scope.montantLivraisonRelais = $scope.point.prix_big;
          }
          else if(i<6){
            $scope.montantLivraisonRelais += $scope.point.prix_big/2;
          }
        }

        var tour = 0;
        for (var i = 0; i < $scope.panierDetail.length; i++) {
          if ( $scope.mostHeavyProduct.product.name !=  $scope.panierDetailr[i].product.name && tour < 6) {
             $scope.montantLivraisonRelais += Math.ceil($scope.point.prix_big/2) *  $scope.panierDetail[i].number;
          }
          tour++;
        }
      }
      
    }

    $scope.chooseRelais=function(){
        $scope.hasRelais=true;
        $scope.relaisPoint=$scope.point;
        $('#relaisModal').modal('hide');
    }

    $scope.initCanHomeShipping=function(){
       
      for (var i=0 ; i < $scope.shippingTown.length; i++) {

           if ($scope.shippingTown[i] == $scope.adresseLivraison.town){
             $scope.canHomeShipping= true;
             $scope.livraisonType="1";
             $scope.montantLivraison = $scope.montantLivraisonDomicile;
             return true
           }
       }
         $scope.canHomeShipping= false; 
         $scope.livraisonType="2";
         $scope.livraison.type='2'
         $scope.paiementType="mobile";
         return true;
    }


    $scope.fraisLivraison=function() {
 
      // calcul du montant de la livraison
      if($scope.mostHeavyProduct.product.weight ==1){

          for(var i=0; i<$scope.mostHeavyProduct.number;i++){
            if(i==0){
              $scope.montantLivraisonDomicile = 1500;
            }
            else if(i<6){
              $scope.montantLivraisonDomicile += 750;
            }
          }

      
          var tour= 0;
          for (var i = 0; i < $scope.panierDetail.length; i++) {

            if ($scope.mostHeavyProduct.product.name != $scope.panierDetail[i].product.name && tour < 6) {
              $scope.montantLivraisonDomicile += Math.ceil(1500/2) * $scope.panierDetail[i].number ;
            }
            tour++;
          }
      }

      else if($scope.mostHeavyProduct.product.weight ==2){

        for(var i=0; i<$scope.mostHeavyProduct.number;i++){
          if(i==0){
            $scope.montantLivraisonDomicile = 2000;
          }
          else if(i<6){
            $scope.montantLivraisonDomicile += 1000;
          }
        }

        var tour = 0;
        for (var i = 0; i < $scope.panierDetail.length; i++) {
          if ($scope.mostHeavyProduct.product.name != $scope.panierDetail[i].product.name && tour < 6) {
            $scope.montantLivraisonDomicile += Math.ceil(2000/2) * $scope.panierDetail[i].number ;
          }
          tour++;
        }
      }

      else if($scope.panierDetail.mostHeavyProduct.product.weight ==3){

        for(var i=0; i< $scope.panierDetail.mostHeavyProduct.number;i++){
          if(i==0){
            $scope.panierDetail.montantLivraisonDomicile = 2500;
          }
          else if(i<6){
            $scope.panierDetail.montantLivraisonDomicile += 1250;
          }
        }

        $scope.panierDetail.montantLivraisonDomicile = 2500 * $scope.panierDetail.mostHeavyProduct.number;
        var tour= 0;
        for (var i = 0; i < $scope.panierDetail.length; i++) {

            if ($scope.mostHeavyProduct.product.name != $scope.panierDetail[i].product.name && tour < 6) {
              $scope.montantLivraisonDomicile += Math.ceil(2500/2) * $scope.panierDetail[i].number ;
            }
            tour++;
        }
      }

    }


    $scope.validateLivraisonMode= function(){

        if ($scope.livraison.type=='1') {
           $scope.montantLivraison=$scope.montantLivraisonDomicile;
           this.livraison.type=1;
           this.livraison.price= $scope.montantLivraisonDomicile;
          
        }
        else{
          $scope.montantLivraison= $scope.montantLivraisonRelais;
          this.livraison.type=2;
          this.livraison.price= $scope.montantLivraisonRelais;
         
        }
    }


 });  
  