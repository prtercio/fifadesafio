(function(){
  'use strict';

  var inicio = angular.module('App.CtrlInicio', []);

  inicio.controller('CtrlInicio', [
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

    	// ------------------------------------------------------------------------------- RECUPERAR REGRAS CONQUISTAS

    	if($localStorage.email == "benbaodan@outlook.com"){
    		$scope.admin = true;
    	} else {
    		$scope.admin = false;
    	}
    	var data = new Date();
    	var dia = data.getDate();
    	var mes = data.getMonth()+1;
    	var ano = data.getFullYear();
    	var dataHoje = dia+"/"+mes+"/"+ano;
    	var fechaRefreshConquista;

    	if(localStorage.getItem("fechaAtualizacao")){
    		if(localStorage.getItem("fechaAtualizacao") == dataHoje){
    			console.log("Já está atualizada");
    		} else {
    			atualizarConquistas();
    			localStorage.setItem("fechaAtualizacao", dataHoje);
    		}
    	} else {
    		atualizarConquistas ();
    		localStorage.setItem("fechaAtualizacao", dataHoje);
    	}

    	function atualizarConquistas (){
    		var refConquistas = firebase.database().ref('desafio/configuracaogeral/conquistas');
		      refConquistas.once("value").then(function(snapshot) {
		        var conquistas = [];
		          console.log(snapshot.val());  
		          localStorage.setItem('conquistas',JSON.stringify(snapshot.val()));
		          console.log( localStorage.getItem('conquistas'));

		      });
    	}
    	
     	//
    	// ------------------------------------------------------------------------------- SELECIONAR IDIOMA
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

		// ---------------------------------------------------------------------------------------------- MENU FLOTANTE

		//abrir menuFlotante
	      $ionicPopover.fromTemplateUrl('templates/popover.html', {
	          scope: $scope,
	      }).then(function(popover) {
	          $scope.popover = popover;
	      });

	      $scope.cerrarMenu = function(){
	         $scope.popover.hide();
	      };


  }]); //ctrl
})();

 