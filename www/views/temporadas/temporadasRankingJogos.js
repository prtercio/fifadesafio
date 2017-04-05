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


  var resultadoJogos = [];

   var refjogos = firebase.database().ref('desafio/desafios/temporadas/oficial/'+idTorneio+'/inscritos/'+keyUsuario).orderByChild('jogo');
    refjogos.once("value").then(function(snapshot) {
      $scope.$apply(function(){
        $scope.comJogos = snapshot.val();
        $scope.jogados = $scope.comJogos.jogados;
        $scope.derrota = $scope.comJogos.derrota;
        $scope.empate = $scope.comJogos.emapte;
        $scope.pontos = $scope.comJogos.pontos;
        $scope.vitoria = $scope.comJogos.vitoria;


        var comJogos = []; 
        comJogos.push($scope.comJogos.jogos);

        for(var key in comJogos[0]){
          resultadoJogos.push({
            "jogo":comJogos[0][key].jogo, 
            "bloqueado":comJogos[0][key].bloqueado, 
            "estado":comJogos[0][key].estado, 
            "pontos":comJogos[0][key].pontos
          });
        }
        $scope.jogos = resultadoJogos;  

        //usando forEach tem que buscar 2 vezes n BD
          //$scope.jogos = snapshot.val();
          /*
          snapshot.forEach(function(minisnapshot) {
               
               resultado.push({
                "jogo":minisnapshot.val().jogo, 
                "bloqueado":minisnapshot.val().bloqueado, 
                "estado":minisnapshot.val().estado, 
                "pontos":minisnapshot.val().pontos
              })
          });
        });
        */
    });  
  });  


    /*
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
        */  
  


  }]); //ctrl
})();