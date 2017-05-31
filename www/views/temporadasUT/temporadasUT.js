( function() {
  'use strict';
  var temporadasUT = angular.module( 'App.CtrlTemporadasUT', [] );
  temporadasUT.controller( 'CtrlTemporadasUT', [ '$scope', 'Utils', 'CordovaNetwork',
    function( $scope, Utils, CordovaNetwork ) {
      window.addEventListener( 'online', updateIndicator );
      window.addEventListener( 'offline', updateIndicator );

      function updateIndicator() {
        // Show a different icon based on offline/online
        CordovaNetwork.isOnline().then( function( isConnected ) {
          if ( isConnected === true ) {
            console.log( "conectado" );
            var alertPopup = $ionicPopup.alert( {
              template: '<p align="center"><i class="icon ion-happy verdeBalanced tamanhoIcon"></i></p><p align="center"><strong>{{"INTERNETON" | translate}}</strong></p>',
              buttons: [ {
                text: '<b>Ok</b>',
                type: 'button-balanced',
                onTap: function( e ) {}
              } ]
            } );
            alertPopup.then( function( res ) {
              if ( res ) {
                console.log( "fechado" );
              }
            } );
          } else {
            var alertPopup = $ionicPopup.alert( {
              template: '<p align="center"><i class="icon ion-alert-circled laranja tamanhoIcon"></i></p><p align="center"><strong>{{"INTERNETOFF" | translate}}</strong></p>',
              buttons: [ {
                text: '<b>Ok</b>',
                type: 'button-energized',
                onTap: function( e ) {}
              } ]
            } );
            alertPopup.then( function( res ) {
              if ( res ) {
                console.log( "fechado" );
              }
            } );
          }
        } );
      }
      $scope.items = [];
      var idioma = window.localStorage.getItem( 'lang' );
      var images = [];
      cargarTemporadas();

      function cargarTemporadas() {
        //var totalDesafios = window.localStorage.getItem( "totalFotosTemporadas" );
        Utils.show();
        var ref = firebase.database().ref( 'desafio/desafios/temporadasUT/oficial' );
        ref.once( "value" ).then( function( snapshot ) {
          $scope.$apply( function() {
            images = [];
            $scope.items = [];
            $scope.temporadas = snapshot.val();
            var numSnap = snapshot.numChildren();
            var totalDesafios = 0;
            snapshot.forEach( function( minisnapshot ) {
              totalDesafios++;
              $scope.status = minisnapshot.val().configuracao.estatus;
              $scope.temporadaInicial = minisnapshot.val().configuracao.temporada;
              var temporada = minisnapshot.val().configuracao.temporada;
              if ( idioma == "es" ) {
                images.push( {
                  img: minisnapshot.val().img_es,
                  desc: minisnapshot.val().nome,
                  url: minisnapshot.key
                } );
                // images carousel
              } else if ( idioma == "pt" ) {
                images.push( {
                  img: minisnapshot.val().img_pt,
                  desc: minisnapshot.val().nome,
                  url: minisnapshot.key
                } );
              }
            } );
            $scope.items = $scope.items.concat( images );
          } );
          Utils.hide();
        } );
      }
      $scope.atualizarTemporadas = function() {
        cargarTemporadas();
      }
    }
  ] ); //ctrl
} )();