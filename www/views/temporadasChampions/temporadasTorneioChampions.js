( function() {
	'use strict';
	var copas = angular.module( 'App.CtrlTempTorneioChampions', [] );
	copas.controller( 'CtrlTempTorneioChampions', [ '$scope', 'idTorneio', '$localStorage', '$state', '$ionicPopup', '$window', '$ionicLoading', 'dataService',
		function( $scope, idTorneio, $localStorage, $state, $ionicPopup, $window, $ionicLoading, dataService ) {
			if ( $localStorage.account ) {
				$scope.gamertag = $localStorage.account.gamertag;
			} else {
				$scope.gamertag = "Anonimo";
			}
			if ( firebase.auth().currentUser ) {
				$scope.loggedIn = true;
				console.log( "logado" );
			} else {
				$scope.loggedIn = false;
			}
			// ---------------------------------------------------------------------------------- 50 jogos
			var jogos40 = {
				"jogo1": {
					"estado": "Próximo",
					"jogo": 1,
					"pontos": 0,
					"bloqueado": false
				},
				"jogo2": {
					"estado": "Próximo",
					"jogo": 2,
					"pontos": 0,
					"bloqueado": true
				},
				"jogo3": {
					"estado": "Próximo",
					"jogo": 3,
					"pontos": 0,
					"bloqueado": true
				},
				"jogo4": {
					"estado": "Próximo",
					"jogo": 4,
					"pontos": 0,
					"bloqueado": true
				},
				"jogo5": {
					"estado": "Próximo",
					"jogo": 5,
					"pontos": 0,
					"bloqueado": true
				},
				"jogo6": {
					"estado": "Próximo",
					"jogo": 6,
					"pontos": 0,
					"bloqueado": true
				},
				"jogo7": {
					"estado": "Próximo",
					"jogo": 7,
					"pontos": 0,
					"bloqueado": true
				},
				"jogo8": {
					"estado": "Próximo",
					"jogo": 8,
					"pontos": 0,
					"bloqueado": true
				},
				"jogo9": {
					"estado": "Próximo",
					"jogo": 9,
					"pontos": 0,
					"bloqueado": true
				},
				"jogo10": {
					"estado": "Próximo",
					"jogo": 10,
					"pontos": 0,
					"bloqueado": true
				},
				"jogo11": {
					"estado": "Próximo",
					"jogo": 11,
					"pontos": 0,
					"bloqueado": true
				},
				"jogo12": {
					"estado": "Próximo",
					"jogo": 12,
					"pontos": 0,
					"bloqueado": true
				},
				"jogo13": {
					"estado": "Próximo",
					"jogo": 13,
					"pontos": 0,
					"bloqueado": true
				},
				"jogo14": {
					"estado": "Próximo",
					"jogo": 14,
					"pontos": 0,
					"bloqueado": true
				},
				"jogo15": {
					"estado": "Próximo",
					"jogo": 15,
					"pontos": 0,
					"bloqueado": true
				},
				"jogo16": {
					"estado": "Próximo",
					"jogo": 16,
					"pontos": 0,
					"bloqueado": true
				},
				"jogo17": {
					"estado": "Próximo",
					"jogo": 17,
					"pontos": 0,
					"bloqueado": true
				},
				"jogo18": {
					"estado": "Próximo",
					"jogo": 18,
					"pontos": 0,
					"bloqueado": true
				},
				"jogo19": {
					"estado": "Próximo",
					"jogo": 19,
					"pontos": 0,
					"bloqueado": true
				},
				"jogo20": {
					"estado": "Próximo",
					"jogo": 20,
					"pontos": 0,
					"bloqueado": true
				},
				"jogo21": {
					"estado": "Próximo",
					"jogo": 21,
					"pontos": 0,
					"bloqueado": true
				},
				"jogo22": {
					"estado": "Próximo",
					"jogo": 22,
					"pontos": 0,
					"bloqueado": true
				},
				"jogo23": {
					"estado": "Próximo",
					"jogo": 23,
					"pontos": 0,
					"bloqueado": true
				},
				"jogo24": {
					"estado": "Próximo",
					"jogo": 24,
					"pontos": 0,
					"bloqueado": true
				},
				"jogo25": {
					"estado": "Próximo",
					"jogo": 25,
					"pontos": 0,
					"bloqueado": true
				},
				"jogo26": {
					"estado": "Próximo",
					"jogo": 26,
					"pontos": 0,
					"bloqueado": true
				},
				"jogo27": {
					"estado": "Próximo",
					"jogo": 27,
					"pontos": 0,
					"bloqueado": true
				},
				"jogo28": {
					"estado": "Próximo",
					"jogo": 28,
					"pontos": 0,
					"bloqueado": true
				},
				"jogo29": {
					"estado": "Próximo",
					"jogo": 29,
					"pontos": 0,
					"bloqueado": true
				},
				"jogo30": {
					"estado": "Próximo",
					"jogo": 30,
					"pontos": 0,
					"bloqueado": true
				},
				"jogo31": {
					"estado": "Próximo",
					"jogo": 31,
					"pontos": 0,
					"bloqueado": true
				},
				"jogo32": {
					"estado": "Próximo",
					"jogo": 32,
					"pontos": 0,
					"bloqueado": true
				},
				"jogo33": {
					"estado": "Próximo",
					"jogo": 33,
					"pontos": 0,
					"bloqueado": true
				},
				"jogo34": {
					"estado": "Próximo",
					"jogo": 34,
					"pontos": 0,
					"bloqueado": true
				},
				"jogo35": {
					"estado": "Próximo",
					"jogo": 35,
					"pontos": 0,
					"bloqueado": true
				},
				"jogo36": {
					"estado": "Próximo",
					"jogo": 36,
					"pontos": 0,
					"bloqueado": true
				},
				"jogo37": {
					"estado": "Próximo",
					"jogo": 37,
					"pontos": 0,
					"bloqueado": true
				},
				"jogo38": {
					"estado": "Próximo",
					"jogo": 38,
					"pontos": 0,
					"bloqueado": true
				},
				"jogo39": {
					"estado": "Próximo",
					"jogo": 39,
					"pontos": 0,
					"bloqueado": true
				},
				"jogo40": {
					"estado": "Próximo",
					"jogo": 40,
					"pontos": 0,
					"bloqueado": true
				}
			}
			var jsondJogos;
			var totalJogos = 40;
			var keyUser = $localStorage.keyUser;
			$scope.verBtnInscricao = true;
			var gamertag;
			if ( $scope.loggedIn ) {
				gamertag = $localStorage.account.gamertag;
			} else {
				gamertag = "Anonimo";
			}
			$scope.gamertag = gamertag;
			//console.log("------ "+gamertag);
			$scope.sairTorneioVar = false;
			$scope.keyUserInscritoTorneio = "";
			var keyUserInscritoTorneio;
			var ranking = [];
			var ref = firebase.database().ref( 'desafio/desafios/temporadasChampions/oficial/' + idTorneio );
			$scope.keyTorneio = idTorneio;
			var fechaInicio;
			var fechaFinal;
			var gamesInscritos = 0;
			var estatusDesafio = "";
			//------------------------------------------------------------ Data
			var data = new Date();
			var dia = data.getDate();
			var mes = data.getMonth() + 1;
			var ano = data.getFullYear();
			var fechaFormatada = Date.UTC( data.getFullYear(), data.getMonth(), data.getDate(), 0, 0, 0 );
			$scope.terminarDesafio = false;
			//-------------------------------------------------------------
			$scope.cargarDatos = function() {
				ranking = [];
				$ionicLoading.show( {
					template: 'Loading...',
					duration: 3000
				} ).then( function() {
					console.log( "Cargando..." );
				} );
				ref.once( "value" ).then( function( snapshot ) {
					if ( snapshot.val() != null ) {
						$scope.$apply( function() {
							estatusDesafio = snapshot.val().configuracao.estatus;
							console.log( "estatus", estatusDesafio );
							if ( snapshot.val().configuracao.estatus == 'Fechado' ) {
								$scope.terminarDesafio = true;
							}
							$scope.torneio = snapshot.val();
							totalJogos = snapshot.val().configuracao.jogos;
							fechaInicio = snapshot.val().configuracao.dataInicio;
							fechaFinal = snapshot.val().configuracao.dataFim;
							gamesInscritos = snapshot.val().configuracao.inscritos;
							var inscritos = snapshot.val().inscritos;
							$scope.totalInscritos = gamesInscritos;
							for ( var key in inscritos ) {
								//keyUserInscritoTorneio=key;
								ranking.push( {
									"keyUserTorneio": key,
									"gamertag": inscritos[ key ].gamertag,
									"keyUser": inscritos[ key ].key,
									"vitoria": inscritos[ key ].vitoria,
									"pontos": inscritos[ key ].pontos,
									"jogados": inscritos[ key ].jogados,
									"derrota": inscritos[ key ].derrota,
									"empate": inscritos[ key ].empate
								} )
							}
							$scope.resultado = ranking;
							verInscrito( ranking );
							if ( $scope.loggedIn ) {
								for ( var i = 0; i < ranking.length; i++ ) {
									if ( ranking[ i ].gamertag == gamertag ) {
										$scope.sairTorneioVar = true;
										$scope.keyUserInscritoTorneio = ranking[ i ].keyUserTorneio;
										keyUserInscritoTorneio = $scope.keyUserInscritoTorneio;
										//console.log("aqui "+ranking[i].gamertag, keyUserInscritoTorneio);
										cargarJogos();
										break;
									} else {
										$scope.sairTorneioVar = false;
									}
								}
							}
						} );
						var arrayDatos = {
							idTorneio
						};
						//console.log(arrayDatos);
						//armazenar idTorneio
						dataService.set( arrayDatos );
						//console.log("---- "+ dataService.get().idTorneio);
						$ionicLoading.hide();
					} else {
						$scope.nohay = ""
						$ionicLoading.hide();
					}
				} );
			}
			//verificar se está inscrito
			function verInscrito( ranking ) {
				for ( var i = 0; i < ranking.length; i++ ) {
					if ( ranking[ i ].keyUser === keyUser ) {
						$scope.verBtnInscricao = false;
						break;
					}
				}
			}
			$scope.entrarTorneio = function() {
				$ionicLoading.show( {} );
				if ( $scope.loggedIn ) {
					//console.log(keyUser, gamertag, jsondJogos);
					firebase.database().ref().child( 'desafio/desafios/temporadasChampions/oficial/' + idTorneio + '/inscritos/' ).push( {
						key: keyUser,
						gamertag: gamertag,
						jogos: jogos40,
						vitoria: 0,
						pontos: 0,
						jogados: 0,
						derrota: 0,
						empate: 0,
						sequenciaVitoria: 0,
						invencibilidade: 0,
						placarUltimo: 0,
						placarPenultimo: 0,
						placarAntepenultimo: 0,
						golsPro: 0,
						golsContra: 0,
						temporadaAtualVitoria: 0,
						temporadaAtualEmpate: 0,
						temporadaAtualDerrota: 0
					} ).then( function( response ) {
						//console.log("response: "+response);
						$scope.verBtnInscricao = true;
						//console.log( "add cantidad de inscritos" );
						firebase.database().ref().child( 'desafio/desafios/temporadasChampions/oficial/' + idTorneio + '/configuracao' ).update( {
							inscritos: gamesInscritos + 1
						} ).then( function( response ) {
							//console.log( " inscritos add" );
							$ionicLoading.hide( {} );
							$scope.cargarDatos();
							var alertPopup = $ionicPopup.alert( {
								template: '<p align="center"><i class="icon ion-happy-outline verde tamanhoIcon"></i></p><p align="center"><strong>{{"VOCEESTAPARTICIPANDO" | translate}}</strong></p>',
								buttons: [ {
									text: '<b>Ok</b>',
									type: 'button-balanced',
									onTap: function( e ) {}
								} ]
							} );
							alertPopup.then( function( res ) {
								if ( res ) {
									console.log( "fechado" );
								}
							} );
						} );
					} );
				} else {
					var alertPopup = $ionicPopup.alert( {
						title: 'Opps!',
						template: '<p align="center"><i class="icon ion-alert-circled laranja tamanhoIcon"></i></p><p align="center"><strong>{{"ENTRARLOGADO" | translate}}</strong></p>',
						buttons: [ {
							text: '<b>Ok</b>',
							type: 'button-balanced',
							onTap: function( e ) {}
						} ]
					} );
					alertPopup.then( function( res ) {
						if ( res ) {
							console.log( "fechado" );
						}
					} );
					$ionicLoading.hide( {} );
				}
			} // function
			/*
		{
			{"jogo":1, "bloqueado":false, "estado":"Próximo", "pontos":0}
		}
	    */
			$scope.sairTorneio = function() {
				//console.log(" KeyUserInscrito "+$scope.keyUserInscritoTorneio);
				keyUserInscritoTorneio = $scope.keyUserInscritoTorneio;
				var confirmPopup = $ionicPopup.confirm( {
					template: '<p align="center"><i class="icon ion-alert-circled laranja tamanhoIcon"></i></p><p align="center"><strong>{{"SAIRTORNEIO" | translate}}</strong></p>',
					buttons: [ {
						text: 'Cancel',
						//type: 'button-positive',
						onTap: function( e ) {}
					}, {
						text: '<b>Ok</b>',
						type: 'button-balanced',
						onTap: function( e ) {
							//console.log( "ok", e.returnValue );
							confirmarSaida();
						}
					} ]
				} );
				//confirmPopup.then( function( res ) {
				function confirmarSaida() {
					$ionicLoading.show( {} );
					//if ( res ) {
					firebase.database().ref( 'desafio/desafios/temporadasChampions/oficial/' + idTorneio + '/inscritos/' + keyUserInscritoTorneio ).remove();
					firebase.database().ref( 'desafio/desafios/temporadasChampions/oficial/' + idTorneio + '/configuracao' ).update( {
						inscritos: gamesInscritos - 1
					} ).then( function( response ) {
						console.log( 'Eliminado 1' );
						$ionicLoading.hide( {} );
						var alertPopup = $ionicPopup.alert( {
							template: '<p align="center"><i class="icon ion-alert-circled laranja tamanhoIcon"></i></p><p align="center"><strong>Deleted</strong></p>'
						} );
						alertPopup.then( function( res ) {
							if ( res ) {
								$scope.cargarDatos();
								$scope.verBtnInscricao = false;
								$scope.sairTorneioVar = false;
								//$state.go('app.inicio');
								//window.location.reload();
							}
						} );
					} );
					console.log( 'Eliminado' );
					/*
					} else {
						console.log( 'Nao' );
						$ionicLoading.hide( {} );
					}
					*/
				}
				//} );
			}; // function
			/// Jogos
			var resultadoJogos = [];

			function cargarJogos() {
				//console.log("Cargando---" +keyUserInscritoTorneio);
				var refJogos = firebase.database().ref( 'desafio/desafios/temporadasChampions/oficial/' + idTorneio + '/inscritos/' + keyUserInscritoTorneio );
				refJogos.once( 'value' ).then( function( snapshot ) {
					//console.log("Jogos lista "+snapshot.val());
					if ( snapshot.val() != null ) {
						//$scope.$apply(function(){
						$scope.comJogos = snapshot.val();
						$scope.jogados = $scope.comJogos.jogados;
						$scope.derrota = $scope.comJogos.derrota;
						$scope.empate = $scope.comJogos.empate;
						$scope.pontos = $scope.comJogos.pontos;
						$scope.vitoria = $scope.comJogos.vitoria;
						var comJogos = [];
						comJogos.push( $scope.comJogos.jogos );
						for ( var key in comJogos[ 0 ] ) {
							resultadoJogos.push( {
								"jogo": comJogos[ 0 ][ key ].jogo,
								"bloqueado": comJogos[ 0 ][ key ].bloqueado,
								"estado": comJogos[ 0 ][ key ].estado,
								"pontos": comJogos[ 0 ][ key ].pontos,
								"placar": comJogos[ 0 ][ key ].placar,
								"status": comJogos[ 0 ][ key ].status
							} );
						}
						$scope.jogosLista = resultadoJogos;
						/*
				      	$scope.jogosL = {};

						var position;
						var datosReverse = [];

						var suma = resultadoJogos.length+1

				      	for(var i = 50; i--;) {

							position = resultadoJogos[i].jogo;
							console.log(position);
							if(!$scope.jogosL[position]) $scope.jogosL[position] = [];

							$scope.jogosL[position].push ( {"jogo":resultadoJogos[i].jogo, "status":resultadoJogos[i].bloqueado });
							//console.log($scope.jogosL);
						} 
						*/
						//});
					} else {
						console.log( "No 	hay nadie inscrito" );
					}
				} );
			}
			/*
			$scope.reverse = function (array) {
			  var copy = [].concat(array);
			  return copy.reverse();
			};
			*/
		}
	] ); //ctrl
} )();