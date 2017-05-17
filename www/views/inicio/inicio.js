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
          atualizarTemporadas();
        }
        if ( !localStorage.getItem( "totalFotosTemporadas" ) ) {
          atualizarTemporadas();
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
                console( "abc", dia, totalDias );
                if ( dia >= totalDias ) {
                  console.log( "cabe atualizacao1" );
                  localStorage.setItem( "fechaAtualizacao", dataHoje );
                  atualizarConquistas();
                  atualizarTemporadas();
                }
              }
            } else {
              localStorage.setItem( "fechaAtualizacao", dataHoje );
              atualizarConquistas();
              atualizarTemporadas();
            }
          } else {
            localStorage.setItem( "fechaAtualizacao", dataHoje );
            atualizarConquistas();
            atualizarTemporadas();
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

      function atualizarTemporadas() {
        console.log( "atualizando temporadas" );
        //temporadas
        Utils.show();
        var totalFotos = 0;
        var ref = firebase.database().ref( 'desafio/desafios/temporadas/oficial' );
        ref.once( "value" ).then( function( snapshot ) {
          $scope.$apply( function() {
            snapshot.forEach( function( minisnapshot ) {
              if ( idioma == "es" ) {
                images.push( {
                  img: minisnapshot.val().img_es,
                  idTorneio: minisnapshot.key
                } );
                totalFotos++;
                window.localStorage.setItem( 'temporadas', JSON.stringify( images ) );
                window.localStorage.setItem( "totalFotosTemporadas", totalFotos );
                // images carousel
              } else if ( idioma == "pt" ) {
                images.push( {
                  img: minisnapshot.val().img_pt,
                  idTorneio: minisnapshot.key
                } );
                totalFotos++;
                window.localStorage.setItem( 'temporadas', JSON.stringify( images ) );
                window.localStorage.setItem( "totalFotosTemporadas", totalFotos );
              }
            } );
          } );
          Utils.hide();
        } );
      }
    }
  ] ); //ctrl
} )();