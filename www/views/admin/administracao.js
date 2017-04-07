(function(){
  'use strict';

  var admin = angular.module('App.CtrlAdministracao', []);

  admin.controller('CtrlAdministracao', [
    '$scope',
    '$localStorage', 
    '$ionicPopup',
    '$window',
    '$ionicPopover',
    'Utils',
    'Popup',
    function(
      $scope,
      $localStorage,
      $ionicPopup,
      $window,
      $ionicPopover,
      Utils,
      Popup    
  ){
    
    var letras = [];
    $scope.buscarUltimaLetra = function(){	
  	var refLetra = firebase.database().ref('desafio/configuracaogeral/conquistas/conquistasTemporadas/vitoria/pt');
	    refLetra.once("value").then(function(snapshot) {
	        
	        snapshot.forEach(function(minisnapshot) {
	        	letras.push(minisnapshot.val().letra)
	        });
	        console.log(letras[letras.length-1]);
	        $scope.ultimaLetra = "A última letra enviada foi "+letras[letras.length-1];
	    });
	}


    	$scope.enviarConquista = function(conquista){
    		var idioma = conquista.idioma;
    		var pontos = conquista.pontos;
    		var letra = conquista.letra;
    		var titulo = conquista.titulo;
    		var descricao = conquista.descricao;

    		  firebase.database().ref('desafio/configuracaogeral/conquistas/conquistasTemporadas/vitoria/'+idioma).push({
                descricao: descricao,
                letra: letra,
                pontos: pontos,
                titulo: titulo
              }).then(function(response) {
                Utils.message(Popup.successIcon, Popup.accountCreateSuccess)
                  .then(function() {
                    console.log("Enviou", response);
                    $scope.buscarUltimaLetra();
                  })
                  .catch(function() {
                    console.log("Nao Enviou");
                  });

              });

    	}

  }]); //ctrl
})();
