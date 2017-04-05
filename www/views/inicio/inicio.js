(function(){
  'use strict';

  var inicio = angular.module('App.CtrlInicio', []);

  inicio.controller('CtrlInicio', [
    '$scope',
    '$localStorage', 
    '$ionicPopup',
    '$window',
    function(
      $scope,
      $localStorage,
      $ionicPopup,
      $window    
  ){
     
    	$scope.showPopup = function() {
		    if(window.localStorage.getItem("lang")){
		      console.log("Idioma selecionado.")
		    } else {
		    $ionicPopup.show({
		    	template: '',
		    	title: 'Language',
		    	scope: $scope,
		    	buttons: [
		    	{ text: 'Portugues', onTap: function(e) { return 'pt'; } },
		    	{ text: 'Español', onTap: function(e) { return 'es'; } }

		    	]
		    }).then(function(res) {
		    	console.log('Tapped!', res);
		    	if(res === "pt"){
		    		window.localStorage.setItem("lang", "pt");
		    		$window.location.reload(true);
		    	} else {
		    		window.localStorage.setItem("lang", "es");
		    		$window.location.reload(true);
		    	}
		    }, function(err) {
		    	console.log('Err:', err);
		    }, function(msg) {
		    	console.log('message:', msg);
		    });
		  }
		}

  }]); //ctrl
})();

 