( function() {
  'use strict';
  var temporadasRankingJogos = angular.module( 'App.CtrlTorneiosTodos', [] );
  temporadasRankingJogos.controller( 'CtrlTorneiosTodos', [ '$scope', 'Utils', '$state', '$localStorage', 'Popup', '$stateParams', '$ionicModal',
    function( $scope, Utils, $state, $localStorage, Popup, $stateParams, $ionicModal ) {
      var keyUsuario = $localStorage.keyUser;
      var caracteres = "0123456789abcdefABCDEF?@+!:;=<>";
      var longitud = 6;
      var refTorneios = firebase.database().ref( 'desafio/torneios/todosxtodos/' + keyUsuario );
      var novaDataFimUtc = new Date();
      var dataFormatada = Date.UTC( novaDataFimUtc.getFullYear(), novaDataFimUtc.getMonth(), novaDataFimUtc.getDate() + 1, 0, 0, 0 );
      var torneios = [];
      $scope.listarTorneio = function() {
        refTorneios.once( "value" ).then( function( snapshot ) {
          $scope.$apply( function() {
            var snap = snapshot.val();
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
          } );
        } );
      }
      $scope.crearNovo = function( nome ) {
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
          $scope.modal.hide();
          $scope.listarTorneio();
        } );
      }
      // Create the login modal that we will use later
      $ionicModal.fromTemplateUrl( 'templates/novoTorneio.html', {
        scope: $scope
      } ).then( function( modal ) {
        $scope.modal = modal;
      } );
      // Triggered in the login modal to close it
      $scope.closeLogin = function() {
        $scope.modal.hide();
      };
      // Open the login modal
      $scope.login = function() {
        $scope.modal.show();
      };

      function rand_code( chars, lon ) {
        var code = "";
        for ( var x = 0; x < lon; x++ ) {
          var rand = Math.floor( Math.random() * chars.length );
          code += chars.substr( rand, 1 );
        }
        return code;
      }
      $scope.onItemDelete = function( item ) {
        console.log( item );
      }
    }
  ] ); //ctrl
} )();