( function() {
  'use strict';
  var inicio = angular.module( 'App.CtrlInicio', [] );
  inicio.controller( 'CtrlInicio', [ '$scope', '$localStorage', '$ionicPopup', '$window', '$ionicPopover', 'Utils', 'CordovaNetwork', '$ionicModal',
    function( $scope, $localStorage, $ionicPopup, $window, $ionicPopover, Utils, CordovaNetwork, $ionicModal ) {
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
          //atualizarConquistas();
        }
        var refDias = firebase.database().ref( 'desafio/configuracaogeral/geral' );
        refDias.once( "value" ).then( function( snapshot ) {
          diasAtualizacao = snapshot.val().diasAtualizacao;
          var dataUltima = localStorage.getItem( "fechaAtualizacao" );
          var diaDataUltimaAtua = Number( dataUltima.substring( 0, dataUltima.indexOf( "/" ) ) );
          var mesAno = dataUltima.substring( dataUltima.indexOf( "/" ) + 1 );
          var mesDataUltimaAtua = Number( mesAno.substring( 0, mesAno.indexOf( "/" ) ) );
          var anoDataUltimaAtual = Number( mesAno.substring( mesAno.indexOf( "/" ) + 1 ) );
          console.log( mesAno, anoDataUltimaAtual, mesDataUltimaAtua, diaDataUltimaAtua );
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
      // Create the login modal that we will use later
      $ionicModal.fromTemplateUrl( 'modalInicio.html', {
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
      $scope.abrirAjuda = function() {
        $scope.modal.show();
        //$( "#prova" ).html( '<img class="redimensionar" src="' + img + '"/>' );
      };
      //--------------------------------------------------------------------------- PUSH
      /*
      const applicationServerPublicKey = 'BNV0EYiMEnl2pkIOifAJceOW-Ze5IrQD0PoMPpF4Uq_BwCGrBJCTAI5Kde7uGx9PpcssX6nyo__14FU44JjfI2c';
      const applicationServerKey = urlB64ToUint8Array( applicationServerPublicKey );
      var swRegistration;
      var isSubscribed;
      if ( 'serviceWorker' in navigator ) {
        navigator.serviceWorker.register( 'service-worker.js' ).then( function( registration ) {
          // Registration was successful
          console.log( 'ServiceWorker registration successful with scope: ', registration.scope );
        } ).catch( function( err ) {
          // registration failed :(
          console.log( 'ServiceWorker registration failed: ', err );
        } );
      }
      if ( 'serviceWorker' in navigator && 'PushManager' in window ) {
        console.log( 'Service Worker and Push is supported' );
        navigator.serviceWorker.register( 'service-worker.js' ).then( function( swReg ) {
          console.log( 'Service Worker is registered', swReg );
          swRegistration = swReg;
          initialiseUI();
        } ).catch( function( error ) {
          console.error( 'Service Worker Error', error );
        } );
      } else {
        console.warn( 'Push messaging is not supported' );
        //pushButton.textContent = 'Push Not Supported';
      }

      function initialiseUI() {
        $scope.inscribir = function() {
          //pushButton.disabled = true;
          if ( isSubscribed ) {
            // TODO: Unsubscribe user
          } else {
            subscribeUser();
          }
        };
        swRegistration.pushManager.getSubscription().then( function( subscription ) {
          isSubscribed = !( subscription === null );
          updateSubscriptionOnServer( subscription );
          if ( isSubscribed ) {
            console.log( 'User IS subscribed.' );
          } else {
            console.log( 'User is NOT subscribed.' );
          }
          updateBtn();
        } );
      }

      function updateBtn() {
        if ( Notification.permission === 'denied' ) {
          $scope.buttonPush = 'Push Messaging Blocked.';
          updateSubscriptionOnServer( null );
          return;
        }
        if ( isSubscribed ) {
          $scope.buttonPush = 'Disable Push Messaging';
        } else {
          $scope.buttonPush = 'Enable Push Messaging';
        }
      }

      function subscribeUser() {
        swRegistration.pushManager.subscribe( {
          userVisibleOnly: true,
          applicationServerKey: applicationServerKey
        } ).then( function( subscription ) {
          console.log( 'User is subscribed:', subscription );
          updateSubscriptionOnServer( subscription );
          isSubscribed = true;
          updateBtn();
        } ).catch( function( err ) {
          console.log( 'Failed to subscribe the user: ', err );
          updateBtn();
        } );
      }

      function updateSubscriptionOnServer( subscription ) {
        // TODO: Send subscription to application server
        //const subscriptionJson = document.querySelector( '.js-subscription-json' );
        //const subscriptionDetails = document.querySelector( '.js-subscription-details' );
        if ( subscription ) {
          console.log( JSON.stringify( subscription ) );
          //subscriptionDetails.classList.remove( 'is-invisible' );
        } else {
          //subscriptionDetails.classList.add( 'is-invisible' );
        }
      }

      function urlB64ToUint8Array( base64String ) {
        const padding = '='.repeat( ( 4 - base64String.length % 4 ) % 4 );
        const base64 = ( base64String + padding ).replace( /\-/g, '+' ).replace( /_/g, '/' );
        console.log( base64 );
        const rawData = window.atob( base64 );
        console.log( rawData );
        const outputArray = new Uint8Array( rawData.length );
        for ( let i = 0; i < rawData.length; ++i ) {
          outputArray[ i ] = rawData.charCodeAt( i );
        }
        return outputArray;
      }
      */
      // Fin Push
    }
  ] ); //ctrl
} )();