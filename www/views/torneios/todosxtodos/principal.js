( function() {
  'use strict';
  var temporadasRankingJogos = angular.module( 'App.CtrlTorneiosTodos', [] );
  temporadasRankingJogos.controller( 'CtrlTorneiosTodos', [ '$scope', 'Utils', '$state', '$localStorage', 'Popup', '$stateParams',
    function( $scope, Utils, $state, $localStorage, Popup, $stateParams ) {
      var keyUsuario = $localStorage.keyUser;
      var refTorneios = firebase.database().ref( 'desafio/torneios/todosxtodos/' + keyUsuario );
      refTorneios.once( "value" ).then( function( snapshot ) {
        $scope.$apply( function() {
          $scope.torneios = snapshot.val();
        } );
      } );
    }
  ] ); //ctrl
} )();