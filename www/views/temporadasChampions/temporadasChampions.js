( function() {
  'use strict';
  var temporadasChampions = angular.module( 'App.CtrlTemporadasChampions', [] );
  temporadasChampions.controller( 'CtrlTemporadasChampions', [ '$scope', 'Utils', 'CordovaNetwork', '$ionicModal',
    function( $scope, Utils, CordovaNetwork, $ionicModal ) {
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
        var ref = firebase.database().ref( 'desafio/desafios/temporadasChampions/oficial' );
        ref.once( "value" ).then( function( snapshot ) {
          $scope.$apply( function() {
            images = [];
            $scope.items = [];
            $scope.temporadas = snapshot.val();
            var numSnap = snapshot.numChildren();
            snapshot.forEach( function( minisnapshot ) {
              $scope.status = minisnapshot.val().configuracao.estatus;
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
      // Create the login modal that we will use later
      $ionicModal.fromTemplateUrl( 'modalTemporadasChampions.html', {
        scope: $scope
      } ).then( function( modal ) {
        $scope.modal = modal;
      } );
      // Triggered in the login modal to close it
      $scope.closeLogin = function() {
        $scope.modal.hide();
        //img = "";
      };
      // Open the login modal
      $scope.login = function() {
        $scope.modal.show();
        //$( "#prova" ).html( '<img class="redimensionar" src="' + img + '"/>' );
      };
    }
  ] ); //ctrl
} )();