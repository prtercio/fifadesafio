( function() {
  'use strict';
  var config = angular.module( 'App.CtrlConfiguracao', [] );
  config.controller( 'CtrlConfiguracao', [ '$scope', '$localStorage', '$ionicPopup', '$window', '$ionicPopover',
    function( $scope, $localStorage, $ionicPopup, $window, $ionicPopover ) {
      $scope.idioma = localStorage.getItem( "lang" );
      if ( $localStorage.account.gamertag ) {
        $scope.gamertag = $localStorage.account.gamertag;
        $scope.email = $localStorage.account.email;
        $scope.imagem = $localStorage.account.imagem;
      }
      $scope.showPopup = function() {
        $ionicPopup.show( {
          template: '',
          title: 'Language',
          scope: $scope,
          buttons: [ {
            text: 'Portugues',
            onTap: function( e ) {
              return 'pt';
            }
          }, {
            text: 'Español',
            onTap: function( e ) {
              return 'es';
            }
          } ]
        } ).then( function( res ) {
          console.log( 'Tapped!', res );
          if ( res === "pt" ) {
            window.localStorage.setItem( "lang", "pt" );
            $window.location.reload( true );
          } else {
            window.localStorage.setItem( "lang", "es" );
            $window.location.reload( true );
          }
        }, function( err ) {
          console.log( 'Err:', err );
        }, function( msg ) {
          console.log( 'message:', msg );
        } );
      }
    }
  ] ); //ctrl
} )();