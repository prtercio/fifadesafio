(function(){
  'use strict';

  var temporadasRankingJogos = angular.module('App.CtrlTemporadasRankingJogosDetalhe', []);

  temporadasRankingJogos.controller('CtrlTemporadasRankingJogosDetalhe', [
    '$scope',
    'Utils',
    '$state', 
    '$localStorage', 
    'Popup', 
    '$stateParams', 
    '$window', 
    'idJogoDetalhe', 
    '$ionicNavBarDelegate',
    'dataService',
    function(
      $scope,
      Utils,
      $state, 
      $localStorage, 
      Popup, 
      $stateParams, 
      $window, 
      idJogoDetalhe, 
      $ionicNavBarDelegate,
      dataService
  ){
     

      $ionicNavBarDelegate.showBackButton(true);

  var id = idJogoDetalhe.substring(0, idJogoDetalhe.indexOf("|"));
  var keyUsuario = idJogoDetalhe.substring(idJogoDetalhe.indexOf("|") + 1);
  //console.log(id, keyUsuario);
  var idJogo = id;

  var itemList=[];
  $scope.suma = 0; 
  var jogosDisputados = 0;
  var pontosSomados = 0;
  var data;
  var key = keyUsuario;
  $scope.verPontos = false;
  $scope.chat = "jogo"+idJogo; 
  $scope.jogoNome = "Jogo "+idJogo;
  var idTorneio = dataService.get();
    
    var refjogos = firebase.database().ref('desafio/desafios/temporadas/oficial/'+idTorneio+'/inscritos/'+keyUsuario+'/jogos/'+$scope.chat);
    refjogos.once("value").then(function(snapshot) {
      $scope.detalheJogo = snapshot.val();  
    });

  }]); //ctrl
})();