'use strict';

angular.module('App',['ui.bootstrap','ngRoute','ngSanitize','720kb.socialshare','djds4rce.angular-socialshare','ng.deviceDetector','ui.router','rzModule','ngFileUpload','satellizer','ui.carousel','ngLocalize'])
.constant('baseUrl', "https://node16375-ounkoun1.hidora.com/backend/web/app_dev.php/")
.run(['Carousel', (Carousel) => {
  Carousel.setOptions({
    arrows: true,
    autoplay: false,
    autoplaySpeed: 3000,
    cssEase: 'ease',
    dots: false,
    easing: 'linear',
    fade: false,
    infinite: true,
    initialSlide: 0,
    slidesToShow: 1,
    slidesToScroll: 1,
    speed: 500,
  });
}])

.directive('starRating',
    function() {
        return {
            restrict : 'A',
            template : '<ul class="rating">'
                     + '    <li ng-repeat="star in stars" ng-class="star" ng-click="toggle($index)">'
                     + '\u2605'
                     + '</li>'
                     + '</ul>',
            scope : {
                ratingValue : '=',
                max : '=',
                onRatingSelected : '&'
            },
            link : function(scope, elem, attrs) {
                var updateStars = function() {
                    scope.stars = [];
                    for ( var i = 0; i < scope.max; i++) {
                        scope.stars.push({
                            filled : i < scope.ratingValue
                        });
                    }
                };
                
                scope.toggle = function(index) {
                    scope.ratingValue = index + 1;
                    scope.onRatingSelected({
                        rating : index + 1
                    });
                };
                
                scope.$watch('ratingValue',
                    function(oldVal, newVal) {
                        if (newVal) {
                            updateStars();
                        }
                    }
                );
            }
        };
    }
)

.directive('ngElevateZoom', function() {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      console.log("Linking");

      //Will watch for changes on the attribute
      attrs.$observe('zoomImage',function(){
        linkElevateZoom();
      })
      
      function linkElevateZoom(){
        //Check if its not empty
        if (!attrs.zoomImage) return;
        element.attr('data-zoom-image',attrs.zoomImage);
        $(element).elevateZoom();
      }
      
      linkElevateZoom();

    }
  };
})

;
