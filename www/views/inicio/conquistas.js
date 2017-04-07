(function(){
  'use strict';

  var inicio = angular.module('App.CtrlConquistas', []);

  inicio.controller('CtrlConquistas', [
    '$scope',
    '$localStorage', 
    '$ionicPopup',
    '$window',
    '$ionicPopover',
    function(
      $scope,
      $localStorage,
      $ionicPopup,
      $window,
      $ionicPopover    
  ){

    	$scope.idioma = localStorage.getItem("lang");
    	
    	$scope.conquistas = JSON.parse(localStorage.getItem('conquistas')) || '[]';
/*
    	for(var key in conquistas){
    		console.log(conquistas[key]);
    	}
    	*/
    	
     	//
    	// ------------------------------------------------------------------------------- SELECIONAR IDIOMA


		// ---------------------------------------------------------------------------------------------- MENU FLOTANTE


  }]); //ctrl
})();