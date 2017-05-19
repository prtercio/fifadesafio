( function() {
  'use strict';
  var temporadasRankingJogos = angular.module( 'App.CtrlTorneiosTodosDetalhes', [] );
  temporadasRankingJogos.controller( 'CtrlTorneiosTodosDetalhes', [ '$scope', 'Utils', '$state', '$localStorage', 'Popup', '$stateParams', 'idTorneio',
    function( $scope, Utils, $state, $localStorage, Popup, $stateParams, idTorneio ) {
      var keyUsuario = $localStorage.keyUser;
      var ranking = [];
      var rodadas = [];
      var games = "";
      var refTorneio = firebase.database().ref( 'desafio/torneios/todosxtodos/' + keyUsuario + '/' + idTorneio );
      refTorneio.once( "value" ).then( function( snapshot ) {
        $scope.$apply( function() {
          games = snapshot.val().ranking;
          for ( var key in games ) {
            ranking.push( {
              "gamer": games[ key ].gamer,
              "jogos": games[ key ].jogos,
              "pontos": games[ key ].pontos,
              "vitoria": games[ key ].vitoria,
              "empate": games[ key ].empate,
              "derrota": games[ key ].derrota,
              "golsPro": games[ key ].golsPro,
              "golsContra": games[ key ].golsContra
            } );
          }
          $scope.torneio = ranking;
          $scope.rodadas = snapshot.val().rodadas;
          console.log( snapshot.val().rodadas );
        } );
      } );
    }
  ] ); //ctrl
} )();