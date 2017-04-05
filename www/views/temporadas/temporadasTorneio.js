(function(){
  'use strict';

  var copas = angular.module('App.CtrlTempTorneio', []);

  copas.controller('CtrlTempTorneio', [
    '$scope',
    'idTorneio',
    '$localStorage',
    '$state',
    '$ionicPopup',
    '$window',
    '$ionicLoading',
    'dataService',
    function(
      $scope,
      idTorneio,
      $localStorage,
      $state,
      $ionicPopup,
      $window,
      $ionicLoading,
      dataService
  ){

    	if(firebase.auth().currentUser) {
	        $scope.loggedIn = true;
	        console.log("logado");
	      } else {
	        $scope.loggedIn = false;       
	        
	      }
    	
    	// ---------------------------------------------------------------------------------- 50 jogos
    	var jogos50 = {
		    "jogo1":{"estado":"Próximo","jogo":1,"pontos":0, "bloqueado":false},
		    "jogo2":{"estado":"Próximo","jogo":2,"pontos":0, "bloqueado":true},
		    "jogo3":{"estado":"Próximo","jogo":3,"pontos":0, "bloqueado":true},
		    "jogo4":{"estado":"Próximo","jogo":4,"pontos":0, "bloqueado":true},
		    "jogo5":{"estado":"Próximo","jogo":5,"pontos":0, "bloqueado":true},
		    "jogo6":{"estado":"Próximo","jogo":6,"pontos":0, "bloqueado":true},
		    "jogo7":{"estado":"Próximo","jogo":7,"pontos":0, "bloqueado":true},
		    "jogo8":{"estado":"Próximo","jogo":8,"pontos":0, "bloqueado":true},
		    "jogo9":{"estado":"Próximo","jogo":9,"pontos":0, "bloqueado":true},
		    "jogo10":{"estado":"Próximo","jogo":10,"pontos":0, "bloqueado":true},
		    "jogo11":{"estado":"Próximo","jogo":11,"pontos":0, "bloqueado":true},
		    "jogo12":{"estado":"Próximo","jogo":12,"pontos":0, "bloqueado":true},
		    "jogo13":{"estado":"Próximo","jogo":13,"pontos":0, "bloqueado":true},
		    "jogo14":{"estado":"Próximo","jogo":14,"pontos":0, "bloqueado":true},
		    "jogo15":{"estado":"Próximo","jogo":15,"pontos":0, "bloqueado":true},
		    "jogo16":{"estado":"Próximo","jogo":16,"pontos":0, "bloqueado":true},
		    "jogo17":{"estado":"Próximo","jogo":17,"pontos":0, "bloqueado":true},
		    "jogo18":{"estado":"Próximo","jogo":18,"pontos":0, "bloqueado":true},
		    "jogo19":{"estado":"Próximo","jogo":19,"pontos":0, "bloqueado":true},
		    "jogo20":{"estado":"Próximo","jogo":20,"pontos":0, "bloqueado":true},
		    "jogo21":{"estado":"Próximo","jogo":21,"pontos":0, "bloqueado":true},
		    "jogo22":{"estado":"Próximo","jogo":22,"pontos":0, "bloqueado":true},
		    "jogo23":{"estado":"Próximo","jogo":23,"pontos":0, "bloqueado":true},
		    "jogo24":{"estado":"Próximo","jogo":24,"pontos":0, "bloqueado":true},
		    "jogo25":{"estado":"Próximo","jogo":25,"pontos":0, "bloqueado":true},
		    "jogo26":{"estado":"Próximo","jogo":26,"pontos":0, "bloqueado":true},
		    "jogo27":{"estado":"Próximo","jogo":27,"pontos":0, "bloqueado":true},
		    "jogo28":{"estado":"Próximo","jogo":28,"pontos":0, "bloqueado":true},
		    "jogo29":{"estado":"Próximo","jogo":29,"pontos":0, "bloqueado":true},
		    "jogo30":{"estado":"Próximo","jogo":30,"pontos":0, "bloqueado":true},
		    "jogo31":{"estado":"Próximo","jogo":31,"pontos":0, "bloqueado":true},
		    "jogo32":{"estado":"Próximo","jogo":32,"pontos":0, "bloqueado":true},
		    "jogo33":{"estado":"Próximo","jogo":33,"pontos":0, "bloqueado":true},
		    "jogo34":{"estado":"Próximo","jogo":34,"pontos":0, "bloqueado":true},
		    "jogo35":{"estado":"Próximo","jogo":35,"pontos":0, "bloqueado":true},
		    "jogo36":{"estado":"Próximo","jogo":36,"pontos":0, "bloqueado":true},
		    "jogo37":{"estado":"Próximo","jogo":37,"pontos":0, "bloqueado":true},
		    "jogo38":{"estado":"Próximo","jogo":38,"pontos":0, "bloqueado":true},
		    "jogo39":{"estado":"Próximo","jogo":39,"pontos":0, "bloqueado":true},
		    "jogo40":{"estado":"Próximo","jogo":40,"pontos":0, "bloqueado":true},
		    "jogo41":{"estado":"Próximo","jogo":41,"pontos":0, "bloqueado":true},
		    "jogo42":{"estado":"Próximo","jogo":42,"pontos":0, "bloqueado":true},
		    "jogo43":{"estado":"Próximo","jogo":43,"pontos":0, "bloqueado":true},
		    "jogo44":{"estado":"Próximo","jogo":44,"pontos":0, "bloqueado":true},
		    "jogo45":{"estado":"Próximo","jogo":45,"pontos":0, "bloqueado":true},
		    "jogo46":{"estado":"Próximo","jogo":46,"pontos":0, "bloqueado":true},
		    "jogo47":{"estado":"Próximo","jogo":47,"pontos":0, "bloqueado":true},
		    "jogo48":{"estado":"Próximo","jogo":48,"pontos":0, "bloqueado":true},
		    "jogo49":{"estado":"Próximo","jogo":49,"pontos":0, "bloqueado":true},
		    "jogo50":{"estado":"Próximo","jogo":50,"pontos":0, "bloqueado":true}
		  }

		var jogos30 = {
			"jogo1":{"estado":"Próximo","jogo":1,"pontos":0, "bloqueado":false},
		    "jogo2":{"estado":"Próximo","jogo":2,"pontos":0, "bloqueado":true},
		    "jogo3":{"estado":"Próximo","jogo":3,"pontos":0, "bloqueado":true},
		    "jogo4":{"estado":"Próximo","jogo":4,"pontos":0, "bloqueado":true},
		    "jogo5":{"estado":"Próximo","jogo":5,"pontos":0, "bloqueado":true},
		    "jogo6":{"estado":"Próximo","jogo":6,"pontos":0, "bloqueado":true},
		    "jogo7":{"estado":"Próximo","jogo":7,"pontos":0, "bloqueado":true},
		    "jogo8":{"estado":"Próximo","jogo":8,"pontos":0, "bloqueado":true},
		    "jogo9":{"estado":"Próximo","jogo":9,"pontos":0, "bloqueado":true},
		    "jogo10":{"estado":"Próximo","jogo":10,"pontos":0, "bloqueado":true},
		    "jogo11":{"estado":"Próximo","jogo":11,"pontos":0, "bloqueado":true},
		    "jogo12":{"estado":"Próximo","jogo":12,"pontos":0, "bloqueado":true},
		    "jogo13":{"estado":"Próximo","jogo":13,"pontos":0, "bloqueado":true},
		    "jogo14":{"estado":"Próximo","jogo":14,"pontos":0, "bloqueado":true},
		    "jogo15":{"estado":"Próximo","jogo":15,"pontos":0, "bloqueado":true},
		    "jogo16":{"estado":"Próximo","jogo":16,"pontos":0, "bloqueado":true},
		    "jogo17":{"estado":"Próximo","jogo":17,"pontos":0, "bloqueado":true},
		    "jogo18":{"estado":"Próximo","jogo":18,"pontos":0, "bloqueado":true},
		    "jogo19":{"estado":"Próximo","jogo":19,"pontos":0, "bloqueado":true},
		    "jogo20":{"estado":"Próximo","jogo":20,"pontos":0, "bloqueado":true},
		    "jogo21":{"estado":"Próximo","jogo":21,"pontos":0, "bloqueado":true},
		    "jogo22":{"estado":"Próximo","jogo":22,"pontos":0, "bloqueado":true},
		    "jogo23":{"estado":"Próximo","jogo":23,"pontos":0, "bloqueado":true},
		    "jogo24":{"estado":"Próximo","jogo":24,"pontos":0, "bloqueado":true},
		    "jogo25":{"estado":"Próximo","jogo":25,"pontos":0, "bloqueado":true},
		    "jogo26":{"estado":"Próximo","jogo":26,"pontos":0, "bloqueado":true},
		    "jogo27":{"estado":"Próximo","jogo":27,"pontos":0, "bloqueado":true},
		    "jogo28":{"estado":"Próximo","jogo":28,"pontos":0, "bloqueado":true},
		    "jogo29":{"estado":"Próximo","jogo":29,"pontos":0, "bloqueado":true},
		    "jogo30":{"estado":"Próximo","jogo":30,"pontos":0, "bloqueado":true}
		}

		var jogos10 = {
			"jogo1":{"estado":"Próximo","jogo":1,"pontos":0, "bloqueado":false},
		    "jogo2":{"estado":"Próximo","jogo":2,"pontos":0, "bloqueado":true},
		    "jogo3":{"estado":"Próximo","jogo":3,"pontos":0, "bloqueado":true},
		    "jogo4":{"estado":"Próximo","jogo":4,"pontos":0, "bloqueado":true},
		    "jogo5":{"estado":"Próximo","jogo":5,"pontos":0, "bloqueado":true},
		    "jogo6":{"estado":"Próximo","jogo":6,"pontos":0, "bloqueado":true},
		    "jogo7":{"estado":"Próximo","jogo":7,"pontos":0, "bloqueado":true},
		    "jogo8":{"estado":"Próximo","jogo":8,"pontos":0, "bloqueado":true},
		    "jogo9":{"estado":"Próximo","jogo":9,"pontos":0, "bloqueado":true},
		    "jogo10":{"estado":"Próximo","jogo":10,"pontos":0, "bloqueado":true}
		}  	

		var jsondJogos;
    	
    	var totalJogos = 0;
    	var keyUser = $localStorage.keyUser;
    	$scope.verBtnInscricao = true;
    	var gamertag;
    	if($scope.loggedIn){
	    	gamertag = $localStorage.account.gamertag;
	    } else {
	    	gamertag = "Guest";
	    }
    	$scope.gamertag = gamertag;
    	$scope.sairTorneioVar = false;
    	$scope.keyUserInscritoTorneio = "";
    	var keyUserInscritoTorneio;

    	var ranking = [];
    	var ref = firebase.database().ref('desafio/desafios/temporadas/oficial/'+idTorneio);

    	$scope.keyTorneio = idTorneio;

    	//armazenar idTorneio
    	dataService.set(idTorneio);

    	$scope.cargarDatos = function(){
    		$ionicLoading.show({
		      template: 'Loading...',
		      duration: 3000
		    }).then(function(){
		       console.log("The loading");
		    });
		    ref.once("value").then(function(snapshot) {
		    	if(snapshot.val() != null){
			       $scope.$apply(function(){
			        $scope.torneio = snapshot.val();
			       	//console.log(snapshot.val().inscritos);
				       totalJogos = snapshot.val().configuracao.jogos;
				       var inscritos = snapshot.val().inscritos;
				       for(var key in inscritos){
				       	keyUserInscritoTorneio=key;
				       	  ranking.push({
			                "keyUserTorneio":key, 
			                "gamertag": inscritos[key].gamertag,
			                "keyUser": inscritos[key].key,
			                "vitoria": inscritos[key].vitoria,
			                "pontos": inscritos[key].pontos,	
			                "jogados": inscritos[key].jogados,
			                "derrota": inscritos[key].derrota,
			                "empate": inscritos[key].empate	               
			              })
				       }
				       $scope.resultado = ranking;
				       verInscrito(ranking);
				       if($scope.loggedIn){
					       for(var i = 0; i < ranking.length; i++){
					       	if(ranking[i].gamertag == gamertag){
					       		$scope.sairTorneioVar = true;				       		
					      		$scope.keyUserInscritoTorneio = ranking[i].keyUserTorneio;
					       		cargarJogos();
					       		break;
					       	} else {
					       		$scope.sairTorneioVar = false;
					       	}
					       	
					       }
					   }
			       });
			       $ionicLoading.hide();
			   	}else{
			   		$scope.nohay = "Ainda nao há inscritos neste torneio. Voce pode ser o primeiro!"
			   		$ionicLoading.hide();
			   	}
		    });
		}

	    //verificar se está inscrito
	    function verInscrito (ranking){
		    for(var i = 0; i < ranking.length; i++){
		    	 if(ranking[i].keyUser === keyUser){
				    $scope.verBtnInscricao = false;
				    break;
				 }	
		    }
		}
	   

	    // determinar cantidad de jogos
	    function recuperar (total){
	    	var num = parseInt(total);
	    	switch(num) {
			    case 50:
			        jsondJogos = jogos50;
			        break;
			    case 30:
			         jsondJogos = jogos30;
			        break;
			    default:
			         jsondJogos = jogos10;
			}
		}

	    $scope.entrarTorneio = function(){
	    	if($scope.loggedIn){
		    	recuperar (totalJogos);

			    console.log(keyUser, gamertag, jsondJogos);
			  
			    firebase.database().ref().child('desafio/desafios/temporadas/oficial/'+idTorneio+'/inscritos/').push({
			    	key:keyUser,
			    	gamertag:gamertag,
	  				jogos:jsondJogos,
	  				vitoria:0,
	  				pontos:0,
	  				jogados:0,
	  				derrota:0,
	  				empate:0
	            }).then(function(response) {
	              	console.log("response: "+response);
	              	$scope.verBtnInscricao = true;
	              	$scope.cargarDatos();	              	
	            }); 
            } else {
            	var alertPopup = $ionicPopup.alert({
					title: 'Opps!',
					template: 'Para entrar neste desafio vc deve está logado.'
				});

				alertPopup.then(function(res) {
				    if(res){
				    	console.log("fechado");
				    }
				});
	        }        
			
	    }  // function

	    /*
		{
			{"jogo":1, "bloqueado":false, "estado":"Próximo", "pontos":0}
		}
	    */

	    $scope.sairTorneio = function(){
	    	console.log(" KeyUserInscrito "+$scope.keyUserInscritoTorneio);
	    	keyUserInscritoTorneio = $scope.keyUserInscritoTorneio;

			var confirmPopup = $ionicPopup.confirm({
				title: 'Confirmacao',
				template: 'Voce tem certeza que quer sair deste torneio?'
			});

			confirmPopup.then(function(res) {
				if(res) {
				    firebase.database().ref('desafio/desafios/temporadas/oficial/'+idTorneio+'/inscritos/'+keyUserInscritoTorneio).remove();
			    
				    console.log('Sim');	 

					   var alertPopup = $ionicPopup.alert({
					     title: 'Ok',
					     template: 'Eliminado.'
					   });

					   alertPopup.then(function(res) {
					     if(res){
					     	$scope.cargarDatos();
							$scope.verBtnInscricao = false;
							//$state.go('app.inicio');
							window.location.reload();
					     }
					   });
					
					        
				} else {
				    console.log('Nao');
				}
			});
		}; // function



	    /// Jogos
	    var resultadoJogos = [];
	    function cargarJogos(){
		    var refJogos = firebase.database().ref('desafio/desafios/temporadas/oficial/'+idTorneio+'/inscritos/'+keyUserInscritoTorneio);
		    refJogos.once('value').then(function(snapshot) {
		    	if(snapshot.val() != null){
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
			    		
			    		/*
			    		var todosJogos = comJogos[0];
			    		todosJogos.forEach(function(minisnapshot) {
				          	   resultadoJogos.push({
				                "jogo":minisnapshot.val().jogo, 
				                "bloqueado":minisnapshot.val().bloqueado, 
				                "estado":minisnapshot.val().estado, 
				                "pontos":minisnapshot.val().pontos
				              });
				          });
				      	//});
				      	*/
				      	$scope.jogosLista = resultadoJogos;  
				      });
		    	} else {
		    		console.log("No hay nadie inscrito");
		    		
		    	}	    	
		    });
		}

  }]); //ctrl
})();