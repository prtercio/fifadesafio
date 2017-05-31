( function() {
  'use strict';
  var imagenDirectiva = angular.module( 'App.CtrlImageDirectiva', [] );
  imagenDirectiva.directive( 'imgWithLoading', function() {
    return {
      restrict: 'E',
      template: '<div/>',
      transclude: false,
      replace: true,
      scope: {
        imgSrc: '@'
      },
      link: function( scope, element, attrs ) {
        console.log( 'imgWithLoading init: source="' + scope.imgSrc + '"' );
        setHeight();
        var img = angular.element( new Image() );
        var unbind1 = img.on( 'load', function( evt ) {
          console.log( 'image loaded: ' + img.attr( 'src' ) );
          stopLoadingCSS();
        } );
        var unbind2 = img.on( 'error', function( evt ) {
          console.log( 'imgWithLoading error Loading ' + scope.imgSrc );
          element.removeClass( attrs.spinnerClass );
        } );
        //only define src here, after binding events
        //notice src is retrieve from attrs because scope.imgSrc may be undefined yet
        img.attr( 'src', attrs.imgSrc );
        startLoadingCSS();
        element.append( img );
        element.addClass( 'imgWithLoading' );
        //watch for changes
        var unbind3 = scope.$watch( 'imgSrc', function( newVal, oldVal ) {
          if ( newVal === img.attr( 'src' ) ) return;
          startLoadingCSS();
          setHeight();
          img.attr( 'src', newVal );
          console.log( 'imgWithLoading: imgSrc mudou: ' + newVal );
          console.log( 'imgWithLoading: imgSrc antigo: ' + oldVal );
        } );
        scope.$on( 'destroy', function() {
          console.log( 'imgWithLoading: unbinding...' );
          unbind1();
          unbind2();
          unbind3();
        } );
        // ------- LOCAL FUNCTIONS --------------------------------
        function startLoadingCSS() {
          img.css( {
            visibility: 'hidden'
          } );
          element.addClass( attrs.spinnerClass );
        }

        function stopLoadingCSS() {
          img.css( {
            visibility: 'visible'
          } );
          element.removeClass( attrs.spinnerClass );
        }

        function setHeight() {
          var w = element.prop( 'offsetWidth' );
          var h = attrs.heightMultiplier * w;
          if ( w && h ) {
            element.css( 'height', h + 'px' );
            //if (!scope.$$phase) scope.$apply();
            console.log( 'imgWithLoading: [width x height] set to [' + w + ' x ' + h + ']' );
          } else {
            console.log( 'imgWithLoading: height NOT set' );
          }
        }
      }
    };
  } );
} )();