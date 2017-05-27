( function() {
  'use strict';
  var temporadasRankingJogos = angular.module( 'App.CtrlTemporadasRankingJogos', [] );
  temporadasRankingJogos.controller( 'CtrlTemporadasRankingJogos', [ '$scope', 'Utils', '$state', '$localStorage', 'Popup', '$stateParams', '$window', 'idJogos', '$ionicNavBarDelegate', 'dataService',
    function( $scope, Utils, $state, $localStorage, Popup, $stateParams, $window, idJogos, $ionicNavBarDelegate, dataService ) {
      $ionicNavBarDelegate.showBackButton( true );
      var id = idJogos.substring( 0, idJogos.indexOf( "|" ) );
      var keyUsuario = idJogos.substring( idJogos.indexOf( "|" ) + 1 );
      //console.log(id, keyUsuario);
      var idJogo = id;
      var itemList = [];
      $scope.suma = 0;
      var jogosDisputados = 0;
      var pontosSomados = 0;
      var data;
      $scope.verPontos = false;
      $scope.jogo = "jogo" + id;
      $scope.jogoNome = id;
      $scope.keyUsuario = keyUsuario;
      var idTorneio = String( dataService.get().idTorneio );
      console.log( "id Torneio " + idTorneio );
      var temporadaInicial = String( dataService.get().temporadaInicial );
      console.log( dataService.get() );
      var resultadoJogos = [];
      var refjogos = firebase.database().ref( 'desafio/desafios/temporadas/oficial/' + idTorneio + '/inscritos/' + keyUsuario ).orderByChild( 'jogo' );
      refjogos.once( "value" ).then( function( snapshot ) {
        $scope.$apply( function() {
          $scope.comJogos = snapshot.val();
          $scope.jogados = $scope.comJogos.jogados;
          $scope.derrota = $scope.comJogos.derrota;
          $scope.empate = $scope.comJogos.empate;
          $scope.pontos = $scope.comJogos.pontos;
          $scope.vitoria = $scope.comJogos.vitoria;
          $scope.temporadaAtual = $scope.comJogos.temporadaAtual;
          var comJogos = [];
          comJogos.push( $scope.comJogos.jogos );
          for ( var key in comJogos[ 0 ] ) {
            console.log( "-----", key );
            for ( var obj in comJogos[ 0 ][ key ] ) {
              resultadoJogos.push( {
                "jogo": comJogos[ 0 ][ key ][ obj ].jogo,
                "bloqueado": comJogos[ 0 ][ key ][ obj ].bloqueado,
                "estado": comJogos[ 0 ][ key ][ obj ].estado,
                "pontos": comJogos[ 0 ][ key ][ obj ].pontos,
                "placar": comJogos[ 0 ][ key ][ obj ].placar,
                "status": comJogos[ 0 ][ key ][ obj ].status,
                "semana": key
              } );
            }
          }
          $scope.jogos = resultadoJogos;
          var novosDatos = {
            "idTorneio": idTorneio,
            "keyUsuario": keyUsuario,
            "semanas": $scope.comJogos.jogos
          }
          dataService.set( novosDatos );
        } );
      } );
    }
  ] ); //ctrl
} )();