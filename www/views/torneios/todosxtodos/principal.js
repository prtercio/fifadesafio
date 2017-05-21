( function() {
  'use strict';
  var temporadasRankingJogos = angular.module( 'App.CtrlTorneiosTodos', [] );
  temporadasRankingJogos.controller( 'CtrlTorneiosTodos', [ '$scope', 'Utils', '$state', '$localStorage', 'Popup', '$stateParams', '$ionicModal', '$ionicPopup', 'PopupFactory',
    function( $scope, Utils, $state, $localStorage, Popup, $stateParams, $ionicModal, $ionicPopup, PopupFactory ) {
      var keyUsuario = $localStorage.keyUser;
      var keyUsuarioCreadorTorneio = "";
      var caracteres = "0123456789abcdefABCDEF?@+!:;=<>";
      var longitud = 6;
      var refTorneios = firebase.database().ref( 'desafio/torneios/todosxtodos/' + keyUsuario );
      var novaDataFimUtc = new Date();
      var dataFormatada = Date.UTC( novaDataFimUtc.getFullYear(), novaDataFimUtc.getMonth(), novaDataFimUtc.getDate() + 1, 0, 0, 0 );
      var torneios = [];
      if ( $localStorage.account ) {
        $scope.logado = true;
        $scope.gamertag = $localStorage.account.gamertag;
      } else {
        $scope.logado = false;
        $scope.gamertag = "visitante";
      }
      $scope.listarTorneio = function() {
        torneios = [];
        Utils.show();
        refTorneios.once( "value" ).then( function( snapshot ) {
          $scope.$apply( function() {
            var snap = snapshot.val();
            keyUsuarioCreadorTorneio = snapshot.key;
            if ( keyUsuario == keyUsuarioCreadorTorneio ) $scope.esCriado = true;
            for ( var key in snap ) {
              torneios.push( {
                "key": key,
                "nome": snap[ key ].configuracao.nome,
                "senha": snap[ key ].configuracao.senha,
                "data": snap[ key ].configuracao.data,
                "participantes": snap[ key ].configuracao.participantes
              } );
            }
            console.log( torneios );
            $scope.torneios = torneios;
            Utils.hide();
          } );
        } );
      }
      $scope.crearNovo = function() {
        var nome = "";
        $scope.data = {}
        var myPopup = PopupFactory.getPopup( $scope );
        // An elaborate, custom popup
        myPopup.then( function( res ) {
          console.log( 'nome', res );
          nome = res;
          if ( nome == "" ) {
            console.log( res, "No vazio" )
          } else {
            if ( res != undefined ) enviarNovoTorneio();
          }
        } );
        /*
        var myPopup = $ionicPopup.show( {
          templateUrl: 'popup-novotorneio.html',
          scope: $scope,
          buttons: [ {
            text: 'Cancel',
            onTap: function( e ) {}
          }, {
            text: '<b>Ok</b>',
            type: 'button-balanced',
            onTap: function( e ) {
              nome = $scope.nomeNovo;
              console.log( nome );
            }
          }, ]
        } );
        myPopup.then( function( res ) {
          alert( "you tapped: " + res );
        } );
        */
        function enviarNovoTorneio() {
          if ( $scope.logado == true ) {
            var senha = rand_code( caracteres, longitud );
            var datos = {
              nome: nome,
              senha: senha,
              data: dataFormatada
            }
            firebase.database().ref( 'desafio/torneios/todosxtodos/' + keyUsuario ).push( {
              configuracao: datos,
              ranking: "",
              rodadas: ""
            } ).then( function( response ) {
              //$scope.modal.hide();
              Utils.hide();
              $scope.listarTorneio();
            } );
          }
        }
      }
      //gerador de senha
      function rand_code( chars, lon ) {
        var code = "";
        for ( var x = 0; x < lon; x++ ) {
          var rand = Math.floor( Math.random() * chars.length );
          code += chars.substr( rand, 1 );
        }
        return code;
      }
      $scope.onItemDelete = function( item ) {
        var confirmPopup = $ionicPopup.confirm( {
          template: '<p align="center"><i class="icon ion-alert-circled laranja tamanhoIcon"></i></p><p align="center"><strong>{{"SAIRTORNEIOTODOS" | translate}}</strong></p>',
          buttons: [ {
            text: 'Cancel',
            //type: 'button-positive',
            onTap: function( e ) {}
          }, {
            text: '<b>Ok</b>',
            type: 'button-balanced',
            onTap: function( e ) {
              //console.log( "ok", e.returnValue );
              confirmarSaida();
            }
          } ]
        } );

        function confirmarSaida() {
          if ( keyUsuario == keyUsuarioCreadorTorneio ) {
            firebase.database().ref( 'desafio/torneios/todosxtodos/' + keyUsuario + "/" + item ).remove().then( function( response ) {
              console.log( "se eliminó" );
              $scope.listarTorneio();
            } );
          }
        }
      }
    }
  ] ); //ctrl
  temporadasRankingJogos.factory( "PopupFactory", function( $ionicPopup ) {
    var cancel = false;

    function getPopup( scope ) {
      return $ionicPopup.show( {
        //template: '<p align="center"><i class="icon ion-ribbon-b verdeBold  tamanhoIcon"></i></p>' + '<p align="center"><strong>{{"CRIARNOVO" | translate}}</strong></p>' + '<input type="text" placeholder="{{"NOMEGAMERTAG"| translate}}" ng-model="data.nome">',
        templateUrl: 'popup-novotorneio.html',
        scope: scope,
        buttons: [ {
          text: 'Cancel',
          type: 'button-stable',
          onTap: function( e ) {
            cancel = true
          }
        }, {
          text: '<b>Save</b>',
          type: 'button-balanced',
          onTap: function( e ) {
            if ( !scope.data.nome ) {
              //don't allow the user to close unless he enters wifi password
              e.preventDefault();
            } else {
              return scope.data.nome;
            }
          }
        }, ]
      } )
    }
    if ( cancel == false ) {
      return {
        getPopup: getPopup
      };
    }
  } );
} )();