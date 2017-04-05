(function(){
  'use strict';

  var temporadasRankingJogos = angular.module('App.CtrlTemporadasRankingJogos', []);

  temporadasRankingJogos.controller('CtrlTemporadasRankingJogos', [
    '$scope',
    'Utils',
    '$state', 
    '$localStorage', 
    'Popup', 
    '$stateParams', 
    '$window', 
    'idJogos', 
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
      idJogos, 
      $ionicNavBarDelegate,
      dataService
  ){
     
      $ionicNavBarDelegate.showBackButton(true);

  var id = idJogos.substring(0, idJogos.indexOf("|"));
  var keyUsuario = idJogos.substring(idJogos.indexOf("|") + 1);

  //console.log(id, keyUsuario);
  var idJogo = id;

  var itemList=[];
  $scope.suma = 0; 
  var jogosDisputados = 0;
  var pontosSomados = 0;
  var data;
  $scope.verPontos = false;
  $scope.jogo = "jogo"+id; 
  $scope.jogoNome = id;
  $scope.keyUsuario = keyUsuario;
  var idTorneio = dataService.get();
  console.log("key: "+keyUsuario, idTorneio);
  console.log("jogo "+$scope.jogo);


  var resultado = [];

   var refjogos = firebase.database().ref('desafio/desafios/temporadas/oficial/'+idTorneio+'/inscritos/'+keyUsuario+'/jogos').orderByChild('jogo');
    refjogos.once("value").then(function(snapshot) {
      $scope.$apply(function(){
          //$scope.jogos = snapshot.val();
          snapshot.forEach(function(minisnapshot) {
               
               resultado.push({
                "jogo":minisnapshot.val().jogo, 
                "bloqueado":minisnapshot.val().bloqueado, 
                "estado":minisnapshot.val().estado, 
                "pontos":minisnapshot.val().pontos
              })
          });
        });
        $scope.jogos = resultado;  
    });  

    
     var refResumo = firebase.database().ref('desafio/desafios/temporadas/oficial/'+idTorneio+'/inscritos/'+keyUsuario);
    refResumo.once("value").then(function(snapshot) {
      $scope.$apply(function(){
          $scope.resumo = snapshot.val();
          $scope.jogosQuantidade = $scope.resumo.jogados;
          $scope.vitoria = $scope.resumo.vitoria;
          $scope.empate = $scope.resumo.empate;
          $scope.derrota = $scope.resumo.derrota;
          $scope.pontos = $scope.resumo.pontos;
        });     
    });  



  }]); //ctrl
})();