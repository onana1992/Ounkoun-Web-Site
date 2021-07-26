<!DOCTYPE html>
<html lang="en" ng-app="App" >
<head>
    <meta charset="utf-8">
    <meta name="viewport"    content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
    <meta http-equiv="Pragma" content="no-cache" />
    <meta http-equiv="Expires" content="0" />
    <title><?php echo $_GET['nom'];?></title>
    <script type="text/javascript">
        
        function getUrlVars() {
          var vars = {};
          var parts = decodeURI(window.location.href).replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
            vars[key] = value;
          });   
            return vars;
        }

        if(screen.width<800){
            window.location="https://www.ounkoun.com/m/#/vendeur/"+getUrlVars()["nom"];
        }
    </script>
    <?php 
           
           $url = "https://node16375-ounkoun1.hidora.com/backend/web/app_dev.php/boutique/one/";
           $url =$url.''.urlencode($_GET['nom']);
           // echo urldecode(utf8_decode ($url));  
           //echo $url;
           
           $client = curl_init( $url);
           curl_setopt($client,CURLOPT_RETURNTRANSFER,true);
           curl_setopt($client,CURLOPT_BINARYTRANSFER,true);
           $response = curl_exec( $client);
            
           $result = json_decode($response);
           $imageUrl= "https://node16375-ounkoun1.hidora.com/backend/web/app_dev.php/image/".$result->data->idImage;
           $url= "https://www.ounkoun.com/boutique.php?nom=".$_GET['nom'];
           $description= "Retrouver la boutique ".$_GET['nom']." sur Ounkoun. Commander en toute sécurité et faite vous Livrer dans de brefs delais";
    ?>
    
    <meta property="og:description" content="la description"/>
    <meta property="og:image" content="<?php echo $imageUrl ; ?>" />

    <meta property="og:url"                content="<?php echo $url;?>" />
    <meta property="og:type"               content="article" />
    <meta property="og:title"              content="<?php echo "Retrouver la boutique ".$_GET['nom'];?>" />
    <meta property="og:description"        content="<?php echo $description;?>" />
    <meta property="og:image"              content="<?php echo $imageUrl ; ?>" />   
    <link rel="shortcut icon" href="assets/images/logo4.gif">
    <link rel="stylesheet" media="screen" href="http://fonts.googleapis.com/css?family=Open+Sans:300,400,700">
    <link rel="stylesheet" href="dist/styles/ext/bootstrap/dist/css/bootstrap.min.css">
    <link href="styles/ext/fontawesome-free-5.3.1-web/css/all.css" rel="stylesheet" >
    <link href="dist/styles/ext/fontawesome-free-5.3.1-web/css/all.css" rel="stylesheet" type="text/css">

    <!-- Custom styles for our template -->
    <link rel="stylesheet" href="dist/styles/ext/bootstrap/dist/css/bootstrap-theme.css" media="screen">
    <link rel="stylesheet" href="dist/styles/ext/rzslider.css" />
    <link rel="stylesheet" href="dist/styles/ext/jquery.webui-popover.css" />
    <link rel="stylesheet" href="//cdn.datatables.net/1.10.15/css/jquery.dataTables.min.css">
    <link rel="stylesheet" href="dist/style/ext/jquery.dataTables.min.css">  
    <link rel="stylesheet" href="dist/scripts/ext/ui-carousel-master/dist/ui-carousel.css">

    <link rel="stylesheet" href="app.css">
    <link rel="stylesheet" href="nav/nav.css">
    <link rel="stylesheet" href="foot/foot.css">
    <link rel="stylesheet" href="Boutique/boutiqueStyle.css">

    <script src="dist/scripts/ext/jquery.js"></script>
    <script src="dist/scripts/ext/jquery.dataTables.min.js"></script>
    <script src="dist/scripts/ext/angular.js"></script>
    <script src="dist/scripts/ext/ui-bootstrap-tpls.js"></script>
    <script src="dist/scripts/ext/angular-sanitize.js"></script>
    <script src="dist/scripts/ext/bootstrap.js"></script>
    <script src="dist/scripts/ext/angular.js"></script>
    <script src="dist/scripts/ext/angular-datatables.min.js"></script>
    <script src="dist/scripts/ext/angular-animate.js"></script>
    <script src="dist/scripts/ext/ui-bootstrap-tpls.js"></script>
    <script src="dist/scripts/ext/angular-sanitize.js"></script>
    <script src="dist/scripts/ext/rzslider.js"></script>
    <script src="dist/scripts/ext/angular-route.js"></script>
    <script src="dist/scripts/ext/angular-ui-router.min.js"></script>
    <script src="dist/scripts/ext/ng-file-upload-shim.min.js"></script>
    <script src="dist/scripts/ext/ng-file-upload.min.js"></script>
    <script src="dist/scripts/ext/angular-socialshare.js"></script>
    <script src="dist/scripts/ext/jquery.webui-popover.js"></script>
    <script src="dist/scripts/ext/angular-ezplus.js" ></script>
    <script src="dist/scripts/ext/satellizer.js"></script>
    <script src="dist/scripts/ext/test.js"></script>
    <script src="dist/scripts/ext/ng-device-detector.js"></script>
    <script src="dist/scripts/ext/re-tree.js" ></script>
    <script src="dist/scripts/ext/angular-localization.js"></script>
    <script src="dist/scripts/ext/ui-carousel-master/dist/ui-carousel.js"></script>

    <script src="app.js"></script>
    <script src="MainController.js"></script>
    <script src="nav/navCtrl.js"></script>
    <script src="boutique/boutiqueCtrl.js"></script>

    <script src="dist/factory/LSFactory.js"></script>
    <script src="dist/factory/authFactory.js"></script>
    <script src="dist/factory/panierFactory.js"></script>
    <script src="dist/factory/panierBWMFactory.js"></script>
    <script src="dist/factory/favorisFactory.js"></script>
    <script src="dist/factory/commandFactory.js"></script>
</head>

<body>
    <div ng-include="'nav/nav.html'"> 
    </div>

    <a href="#" class="scrollToTop" shape="text-decoration:none;" style="color:gray; "/>
        <div style="background-color: #416998; color:white;font-size:25px; border: 1px solid #416998;border-radius: 50%; height:40px; width: 40px;"> <i style="position: relative; top:3px;"  class="fa fa-arrow-up"></i>
        </div> 
    </a>
        
    <div>
        <div ng-include="'boutique/boutiqueView.html'"></div>
    </div>

    </div>
    

    <script>
        !function ($) {
            $(function(){
              // carousel demo
              $('#bs-carousel').carousel()
            })
        }(window.jQuery)
    </script>
    <script type="text/javascript">
            $(document).ready(function(){
        
                //Check to see if the window is top if not then display button
                 $(window).scroll(function(){
                    if ($(this).scrollTop() > 100) {
                        $('.scrollToTop').fadeIn();
                    } else {
                        $('.scrollToTop').fadeOut();
                    }
                });
        
                //Click event to scroll to top
                $('.scrollToTop').click(function(){
                    $('html, body').animate({scrollTop : 0},400);
                    return false;
                });
                
            });

            $(window).scroll(function(){
            if ($(window).scrollTop() >= 40) {
               $('#nav-menu').addClass('fixed-header');
            }
            else {
               $('#nav-menu').removeClass('fixed-header');
            }
            });
    </script>
</body>
</html>