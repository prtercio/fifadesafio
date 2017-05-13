( function() {
  'use strict';
  var inicio = angular.module( 'App.CtrlInicio', [] );
  inicio.controller( 'CtrlInicio', [ '$scope', '$localStorage', '$ionicPopup', '$window', '$ionicPopover', 'Utils',
    function( $scope, $localStorage, $ionicPopup, $window, $ionicPopover, Utils ) {
      // ------------------------------------------------------------------------------- RECUPERAR REGRAS CONQUISTAS
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
      var fechaFormatada = Date.UTC( data.getFullYear(), data.getMonth(), data.getDate(), 10, 0, 0 );
      $scope.fecha = fechaFormatada;
      console.log( fechaFormatada );
      var images = [];
      if ( localStorage.getItem( "fechaAtualizacao" ) ) {
        if ( localStorage.getItem( "fechaAtualizacao" ) == dataHoje ) {
          console.log( "Já está atualizada" );
        } else {
          atualizarConquistas();
          localStorage.setItem( "fechaAtualizacao", dataHoje );
          atualizarTemporadas();
        }
      } else {
        atualizarConquistas();
        localStorage.setItem( "fechaAtualizacao", dataHoje );
        atualizarTemporadas();
      }

      function atualizarConquistas() {
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

      function atualizarTemporadas() {
        //temporadas
        var ref = firebase.database().ref( 'desafio/desafios/temporadas/oficial' );
        ref.once( "value" ).then( function( snapshot ) {
          $scope.$apply( function() {
            snapshot.forEach( function( minisnapshot ) {
              if ( idioma == "es" ) {
                images.push( {
                  img: minisnapshot.val().img_es,
                  idTorneio: minisnapshot.key
                } );
                localStorage.setItem( 'temporadas', JSON.stringify( images ) );
                // images carousel
              } else if ( idioma == "pt" ) {
                images.push( {
                  img: minisnapshot.val().img_pt,
                  idTorneio: minisnapshot.key
                } );
                localStorage.setItem( 'temporadas', JSON.stringify( images ) );
              }
            } );
          } );
        } );
      }
    }
  ] ); //ctrl
} )();