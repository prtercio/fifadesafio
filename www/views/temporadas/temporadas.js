(function(){
  'use strict';

  var temporadas = angular.module('App.CtrlTemporadas', []);

  temporadas.controller('CtrlTemporadas', [
    '$scope',
    'Utils',
    function(
      $scope,
      Utils
  ){
      var idioma = window.localStorage.getItem('lang');
      /*
      if(idioma == "es"){
        $scope.idioma = 1;        
      } else if(idioma == "pt"){
        $scope.idioma = 0;
      } else {
        $scope.idioma = 2;
      }
      */
      var temporada = "";

      var temp = "";
      Utils.show();

      var ref = firebase.database().ref('desafio/desafios/temporadas/oficial');
      ref.once("value").then(function(snapshot) {
         $scope.$apply(function(){
          $scope.temporadas = snapshot.val();
          snapshot.forEach(function(minisnapshot) {
            $scope.status = minisnapshot.val().configuracao.estatus; 
            var temporada = minisnapshot.val().configuracao.temporada;
            console.log(temporada);
          });
          /*
          if(temp == "Aberto"){
            if($scope.idioma == 0){
             $scope.status = "Aberto";
            } else if($scope.idioma == 1){
            $scope.status = "Abierto";
            } else {
            $scope.status = "Open";          
            }
          } else {
            if(tempa == 0){
             $scope.status = "Fechado";
            } else if($scope.idioma == 1){
            $scope.status = "Cerrado";
            } else {
            $scope.status = "Closed";          
            }
          }
          */
          Utils.hide();
         });
      }); 

      
      
  }]); //ctrl
})();