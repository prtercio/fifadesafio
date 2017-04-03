(function(){
  'use strict';

  var temporadas = angular.module('App.CtrlTemporadas', []);

  temporadas.controller('CtrlTemporadas', [
    '$scope',
    function(
      $scope
  ){
      var idioma = window.localStorage.getItem('lang');
      if(idioma == "es"){
        $scope.idioma = 1;        
      } else {
        $scope.idioma = 0;
      }

    var ref = firebase.database().ref('desafio/desafios/temporadas/oficial');
    ref.once("value").then(function(snapshot) {
       $scope.$apply(function(){
        $scope.temporadas = snapshot.val();
       });
    }); 

  }]); //ctrl
})();