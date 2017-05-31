( function() {
  'use strict';
  var inicio = angular.module( 'App.CtrlInicio', [] );
  inicio.controller( 'CtrlInicio', [ '$scope', '$localStorage', '$ionicPopup', '$window', '$ionicPopover', 'Utils', 'CordovaNetwork',
    function( $scope, $localStorage, $ionicPopup, $window, $ionicPopover, Utils, CordovaNetwork ) {
      // ------------------------------------------------------------------------------- RECUPERAR REGRAS CONQUISTAS
      // Update the online status icon based on connectivity
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
      if ( $localStorage.email == "benbaodan@outlook.com" ) {
        $scope.admin = true;
      } else {
        $scope.admin = false;
      }
      var idioma = window.localStorage.getItem( 'lang' );
      var data = new Date();
      var dia = data.getDate();
      var mes = data.getMonth() + 1;
      var ano = data.getFullYear();
      var dataHoje = dia + "/" + mes + "/" + ano;
      var fechaRefreshConquista;
      var fechaFormatada = Date.UTC( data.getFullYear(), data.getMonth(), data.getDate(), 0, 0, 0 );
      $scope.fecha = fechaFormatada;
      var images = [];
      var diasAtualizacao = 0;
      console.log( localStorage.getItem( "fechaAtualizacao" ) );
      atualizarData();

      function atualizarData() {
        Utils.show();
        if ( !localStorage.getItem( "fechaAtualizacao" ) ) {
          localStorage.setItem( "fechaAtualizacao", dataHoje );
          console.log( "no hay fecha" );
          atualizarConquistas();
        }
        if ( !localStorage.getItem( "totalFotosTemporadas" ) ) {
          atualizarConquistas();
        }
        var refDias = firebase.database().ref( 'desafio/configuracaogeral/geral' );
        refDias.once( "value" ).then( function( snapshot ) {
          diasAtualizacao = snapshot.val().diasAtualizacao;
          var dataUltima = localStorage.getItem( "fechaAtualizacao" );
          var diaDataUltimaAtua = Number( dataUltima.substring( 0, dataUltima.indexOf( "/" ) ) );
          var mesAno = dataUltima.substring( dataUltima.indexOf( "/" ) + 1 );
          var mesDataUltimaAtua = Number( mesAno.substring( 0, mesAno.indexOf( "/" ) ) );
          var anoDataUltimaAtual = Number( mesAno.substring( dataUltima.indexOf( "/" ) ) );
          if ( ano === anoDataUltimaAtual ) {
            if ( mes === mesDataUltimaAtua ) {
              if ( dia === diaDataUltimaAtua ) {
                console.log( "noActualiza" );
              } else {
                var totalDias = diaDataUltimaAtua + diasAtualizacao;
                if ( dia >= totalDias ) {
                  console.log( "cabe atualizacao1" );
                  localStorage.setItem( "fechaAtualizacao", dataHoje );
                  atualizarConquistas();
                }
              }
            } else {
              localStorage.setItem( "fechaAtualizacao", dataHoje );
              atualizarConquistas();
            }
          } else {
            localStorage.setItem( "fechaAtualizacao", dataHoje );
            atualizarConquistas();
          }
        } );
        Utils.hide();
      }

      function atualizarConquistas() {
        console.log( "atualizando conquistas" );
        Utils.show();
        var refConquistas = firebase.database().ref( 'desafio/configuracaogeral/conquistas' );
        refConquistas.once( "value" ).then( function( snapshot ) {
          localStorage.setItem( 'conquistas', JSON.stringify( snapshot.val() ) );
          Utils.hide();
        } );
      }
      //
      // ------------------------------------------------------------------------------- SELECIONAR IDIOMA
      $scope.showPopup = function() {
        if ( window.localStorage.getItem( "lang" ) ) {
          console.log( "Idioma selecionado." )
        } else {
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
      // ---------------------------------------------------------------------------------------------- MENU FLOTANTE
      //abrir menuFlotante
      $ionicPopover.fromTemplateUrl( 'templates/popover.html', {
        scope: $scope,
      } ).then( function( popover ) {
        $scope.popover = popover;
      } );
      $scope.cerrarMenu = function() {
        $scope.popover.hide();
      };
    }
  ] ); //ctrl
} )();