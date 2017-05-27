( function() {
	'use strict';
	var copas = angular.module( 'App.CtrlTempTorneio', [] );
	copas.controller( 'CtrlTempTorneio', [ '$scope', 'idTorneio', '$localStorage', '$state', '$ionicPopup', '$window', '$ionicLoading', 'dataService',
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

			function getWeekNumber( d ) {
				// Copy date so don't modify original
				d = new Date( +d );
				d.setHours( 0, 0, 0, 0 );
				// Set to nearest Thursday: current date + 4 - current day number
				// Make Sunday's day number 7
				d.setDate( d.getDate() + 4 - ( d.getDay() || 7 ) );
				// Get first day of year
				var yearStart = new Date( d.getFullYear(), 0, 1 );
				// Calculate full weeks to nearest Thursday
				var weekNo = Math.ceil( ( ( ( d - yearStart ) / 86400000 ) + 1 ) / 7 );
				// Return array of year and week number
				//return [ d.getFullYear(), weekNo ];
				return weekNo;
			}
			var result = getWeekNumber( new Date() );
			console.log( result );
			/* rango de semana
			function rangeWeek( dateStr ) {
				if ( !dateStr ) dateStr = new Date().getTime();
				var dt = new Date( dateStr );
				dt = new Date( dt.getFullYear(), dt.getMonth(), dt.getDate() );
				dt = new Date( dt.getTime() - ( dt.getDay() > 0 ? ( dt.getDay() - 1 ) * 1000 * 60 * 60 * 24 : 6 * 1000 * 60 * 60 * 24 ) );
				return {
					start: dt,
					end: new Date( dt.getTime() + 1000 * 60 * 60 * 24 * 7 - 1 )
				};
			}
			*/
			$scope.semana1 = "Semana 1";
			$scope.semana2 = false;
			$scope.semana3 = false;
			$scope.semana4 = false;
			$scope.semana5 = false;
			var rangoSemana1 = "";
			var rangoSemana2 = "";
			var rangoSemana3 = "";
			var rangoSemana4 = "";
			var rangoSemana5 = "";
			var semana1 = true;
			var semana2 = false;
			var semana3 = false;
			var semana4 = false;
			var semana5 = false;
			var semanaInicio = 0;
			var quantidadeSemanas = 0;
			var rangoDatas = [];
			// ---------------------------------------------------------------------------------- 50 jogos
			var jogos50 = {
				"semana1": {
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
					}
				},
				"semana2": {
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
					}
				},
				"semana3": {
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
					}
				},
				"semana4": {
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
				},
				"semana5": {
					"jogo41": {
						"estado": "Próximo",
						"jogo": 41,
						"pontos": 0,
						"bloqueado": true
					},
					"jogo42": {
						"estado": "Próximo",
						"jogo": 42,
						"pontos": 0,
						"bloqueado": true
					},
					"jogo43": {
						"estado": "Próximo",
						"jogo": 43,
						"pontos": 0,
						"bloqueado": true
					},
					"jogo44": {
						"estado": "Próximo",
						"jogo": 44,
						"pontos": 0,
						"bloqueado": true
					},
					"jogo45": {
						"estado": "Próximo",
						"jogo": 45,
						"pontos": 0,
						"bloqueado": true
					},
					"jogo46": {
						"estado": "Próximo",
						"jogo": 46,
						"pontos": 0,
						"bloqueado": true
					},
					"jogo47": {
						"estado": "Próximo",
						"jogo": 47,
						"pontos": 0,
						"bloqueado": true
					},
					"jogo48": {
						"estado": "Próximo",
						"jogo": 48,
						"pontos": 0,
						"bloqueado": true
					},
					"jogo49": {
						"estado": "Próximo",
						"jogo": 49,
						"pontos": 0,
						"bloqueado": true
					},
					"jogo50": {
						"estado": "Próximo",
						"jogo": 50,
						"pontos": 0,
						"bloqueado": true
					}
				}
			}
			var jogos30 = {
				"semana1": {
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
					}
				},
				"semana2": {
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
					}
				},
				"semana3": {
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
					}
				}
			}
			var jogos10 = {
				"semana1": {
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
					}
				},
				"semana2": {
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
					}
				}
			}
			var jsondJogos;
			$scope.bloqueado = "Bloqueado";
			var totalJogos = 0;
			var keyUser = $localStorage.keyUser;
			$scope.verBtnInscricao = true;
			var gamertag;
			if ( $scope.loggedIn ) {
				gamertag = $localStorage.account.gamertag;
			} else {
				gamertag = "Anonimo";
			}
			$scope.verPrimeiroJogo = false;
			$scope.gamertag = gamertag;
			//console.log("------ "+gamertag);
			$scope.sairTorneioVar = false;
			$scope.keyUserInscritoTorneio = "";
			var keyUserInscritoTorneio;
			var ranking = [];
			var ref = firebase.database().ref( 'desafio/desafios/temporadas/oficial/' + idTorneio );
			$scope.keyTorneio = idTorneio;
			var temporadaInicial = 0;
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
			console.log( fechaFormatada );

			function retornarSemanas( semanaInicial ) {
				var semanaAtual = getWeekNumber( new Date( fechaFormatada ) )
				if ( semanaAtual == semanaInicial ) {
					console.log( "semanaatual", semanaAtual );
					console.log( "semanaInicial", semanaInicial );
					console.log( "comeca esta semana" );
				} else {
					console.log( "semanaatual", semanaAtual );
					console.log( "semanaInicial", semanaInicial );
					console.log( "nao comeca" );
				}
			}

			function retornarRangoData( data ) {
				var novaData = new Date( data );
				var novoDia = novaData.getDate() + 1;
				var novoMes = novaData.getMonth() + 1;
				var novoAno = novaData.getFullYear();
				var rangodeSemanas = [];
				rangodeSemanas.push( {
					"semana1": novoDia + "/" + novoMes + "/" + novoAno + " - " + retornarFormatoData( addDays( data, 7 ) ),
					"semana2": retornarFormatoData( addDays( data, 8 ) ) + " - " + retornarFormatoData( addDays( data, 14 ) ),
					"semana3": retornarFormatoData( addDays( data, 15 ) ) + " - " + retornarFormatoData( addDays( data, 21 ) ),
					"semana4": retornarFormatoData( addDays( data, 22 ) ) + " - " + retornarFormatoData( addDays( data, 28 ) ),
					"semana5": retornarFormatoData( addDays( data, 29 ) ) + " - " + retornarFormatoData( addDays( data, 35 ) ),
					"dataAbertura0": data,
					"dataAbertura1": addDays( data, 8 ),
					"dataAbertura2": addDays( data, 15 ),
					"dataAbertura3": addDays( data, 22 ),
					"dataAbertura4": addDays( data, 29 )
				} );
				return rangodeSemanas;
			}

			function addDays( date, days ) {
				var result = new Date( date );
				result.setDate( result.getDate() + days );
				return result;
			}

			function retornarFormatoData( data ) {
				var dr = new Date( data );
				var mes = dr.getMonth() + 1;
				return dr.getDate() + "/" + mes + "/" + dr.getFullYear();
			}
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
							temporadaInicial = snapshot.val().configuracao.temporada;
							fechaInicio = snapshot.val().configuracao.dataInicio;
							semanaInicio = getWeekNumber( new Date( fechaInicio ) ) + 1;
							retornarSemanas( semanaInicio );
							rangoDatas.push( retornarRangoData( fechaInicio ) );
							console.log( rangoDatas );
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
							idTorneio,
							temporadaInicial
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
			// determinar cantidad de jogos
			function recuperar( total ) {
				var num = parseInt( total );
				switch ( num ) {
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

			function recuperarQtdSemana( _jogos ) {
				var quantSemanas = 0;
				if ( _jogos == 50 ) {
					quantSemanas = 5;
				} else if ( _jogos == 30 ) {
					quantSemanas = 3
				} else {
					quantSemanas = 5;
				}
				return quantSemanas;
			}
			$scope.entrarTorneio = function() {
				//console.log("ABC--- "+temporadaInicial);
				$ionicLoading.show( {} );
				if ( $scope.loggedIn ) {
					recuperar( totalJogos );
					//console.log(keyUser, gamertag, jsondJogos);
					firebase.database().ref().child( 'desafio/desafios/temporadas/oficial/' + idTorneio + '/inscritos/' ).push( {
						key: keyUser,
						gamertag: gamertag,
						jogos: jsondJogos,
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
						temporadaAtual: temporadaInicial,
						temporadaAtualVitoria: 0,
						temporadaAtualEmpate: 0,
						temporadaAtualDerrota: 0
					} ).then( function( response ) {
						//console.log("response: "+response);
						$scope.verBtnInscricao = true;
						//console.log( "add cantidad de inscritos" );
						firebase.database().ref().child( 'desafio/desafios/temporadas/oficial/' + idTorneio + '/configuracao' ).update( {
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
					firebase.database().ref( 'desafio/desafios/temporadas/oficial/' + idTorneio + '/inscritos/' + keyUserInscritoTorneio ).remove();
					firebase.database().ref( 'desafio/desafios/temporadas/oficial/' + idTorneio + '/configuracao' ).update( {
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
			var resultadoTodosJogos = [];
			var quantidadeJogosSemanais = 0;

			function cargarJogos() {
				quantidadeJogosSemanais = totalJogos / recuperarQtdSemana( totalJogos );
				//console.log("Cargando---" +keyUserInscritoTorneio);
				var refJogos = firebase.database().ref( 'desafio/desafios/temporadas/oficial/' + idTorneio + '/inscritos/' + keyUserInscritoTorneio );
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
						$scope.temporadaAtual = $scope.comJogos.temporadaAtual;
						var comJogos = [];
						snapshot.forEach( function( minisnapshot ) {
							resultadoTodosJogos = minisnapshot.val();
							procesarResultadoSemana1();
						} );
					} else {
						console.log( "No 	hay nadie inscrito" );
					}
				} );
			}

			function formatarDataAbertura( data ) {
				var novaDataAbertura = Date.UTC( data.getFullYear(), data.getMonth(), data.getDate(), 0, 0, 0 );
				return novaDataAbertura;
			}

			function procesarResultadoSemana1() {
				if ( fechaFormatada >= rangoDatas[ 0 ][ 0 ].dataAbertura0 ) {
					var resultadoJogos = [];
					var result = resultadoTodosJogos;
					for ( var key in result ) {
						if ( key === "semana1" ) {
							$scope.semana1 = "Semana 1 : " + rangoDatas[ 0 ][ 0 ].semana1;
							for ( var obj in result[ key ] ) {
								resultadoJogos.push( {
									"semana": key,
									"jogo": result[ key ][ obj ].jogo,
									"bloqueado": result[ key ][ obj ].bloqueado,
									"estado": result[ key ][ obj ].estado,
									"pontos": result[ key ][ obj ].pontos,
									"placar": result[ key ][ obj ].placar,
									"status": result[ key ][ obj ].status
								} );
								for ( var i = 0; i < resultadoJogos.length; i++ ) {
									if ( i + 1 === quantidadeJogosSemanais ) {
										if ( resultadoJogos[ i ].bloqueado === false ) {
											semana2 = true;
											$scope.semana2Ver = semana2;
											$scope.semana2 = "Semana 2";
											procesarResultadoSemana2();
										}
									}
								}
							}
							$scope.jogosLista = resultadoJogos;
						}
					}
				} else {
					console.log( "data nao é igual é menor" );
					$scope.verPrimeiroJogo = true;
				}
			}

			function procesarResultadoSemana2() {
				if ( fechaFormatada >= formatarDataAbertura( rangoDatas[ 0 ][ 0 ].dataAbertura1 ) ) {
					var resultadoJogos2 = [];
					var resul = resultadoTodosJogos;
					for ( var key in resul ) {
						if ( key === "semana2" ) {
							$scope.semana2 = "Semana 2 : " + rangoDatas[ 0 ][ 0 ].semana2;
							for ( var obj in resul[ key ] ) {
								resultadoJogos2.push( {
									"semana": key,
									"jogo": resul[ key ][ obj ].jogo,
									"bloqueado": resul[ key ][ obj ].bloqueado,
									"estado": resul[ key ][ obj ].estado,
									"pontos": resul[ key ][ obj ].pontos,
									"placar": resul[ key ][ obj ].placar,
									"status": resul[ key ][ obj ].status
								} );
								for ( var i = 0; i < resultadoJogos2.length; i++ ) {
									if ( i + 1 === quantidadeJogosSemanais ) {
										if ( resultadoJogos2[ i ].bloqueado === false ) {
											semana3 = true;
											$scope.semana3Ver = semana3;
											$scope.semana3 = "Semana 3";
											if ( recuperarQtdSemana( totalJogos ) > 2 ) {
												procesarResultadoSemana3();
											}
										}
									}
								}
							}
							$scope.jogosLista1 = resultadoJogos2;
						}
					}
				} else {
					console.log( "Nao verá segunda semana" );
					$scope.semana2 = "Semana 2 : " + rangoDatas[ 0 ][ 0 ].semana2;
				}
			}

			function procesarResultadoSemana3() {
				if ( fechaFormatada >= formatarDataAbertura( rangoDatas[ 0 ][ 0 ].dataAbertura2 ) ) {
					var resultadoJogos = [];
					var result = resultadoTodosJogos;
					for ( var key in result ) {
						if ( key === "semana3" ) {
							$scope.semana3 = "Semana 3 : " + rangoDatas[ 0 ][ 0 ].semana3;
							for ( var obj in result[ key ] ) {
								resultadoJogos.push( {
									"semana": key,
									"jogo": result[ key ][ obj ].jogo,
									"bloqueado": result[ key ][ obj ].bloqueado,
									"estado": result[ key ][ obj ].estado,
									"pontos": result[ key ][ obj ].pontos,
									"placar": result[ key ][ obj ].placar,
									"status": result[ key ][ obj ].status
								} );
								for ( var i = 0; i < resultadoJogos.length; i++ ) {
									if ( i + 1 === quantidadeJogosSemanais ) {
										if ( resultadoJogos[ i ].bloqueado === false ) {
											semana4 = true;
											$scope.semana4Ver = semana4;
											$scope.semana4 = "Semana 4";
											if ( recuperarQtdSemana( totalJogos ) > 3 ) {
												procesarResultadoSemana4();
											}
										}
									}
								}
							}
							$scope.jogosLista2 = resultadoJogos;
						}
					}
				} else {
					console.log( "Nao mostrara 3" );
				}
			}

			function procesarResultadoSemana4() {
				if ( fechaFormatada >= formatarDataAbertura( rangoDatas[ 0 ][ 0 ].dataAbertura3 ) ) {
					var resultadoJogos = [];
					var result = resultadoTodosJogos;
					for ( var key in result ) {
						if ( key === "semana4" ) {
							$scope.semana4 = "Semana 4 : " + rangoDatas[ 0 ][ 0 ].semana4;
							for ( var obj in result[ key ] ) {
								resultadoJogos.push( {
									"semana": key,
									"jogo": result[ key ][ obj ].jogo,
									"bloqueado": result[ key ][ obj ].bloqueado,
									"estado": result[ key ][ obj ].estado,
									"pontos": result[ key ][ obj ].pontos,
									"placar": result[ key ][ obj ].placar,
									"status": result[ key ][ obj ].status
								} );
								for ( var i = 0; i < resultadoJogos.length; i++ ) {
									if ( i + 1 === quantidadeJogosSemanais ) {
										if ( resultadoJogos[ i ].bloqueado === false ) {
											semana5 = true;
											$scope.semana4Ver = semana4;
											$scope.semana4 = "Semana 4";
											procesarResultadoSemana5();
										}
									}
								}
							}
							$scope.jogosLista3 = resultadoJogos;
						}
					}
				} else {
					console.log( "nao mostrara 4" );
				}
			}

			function procesarResultadoSemana5() {
				if ( fechaFormatada >= formatarDataAbertura( rangoDatas[ 0 ][ 0 ].dataAbertura4 ) ) {
					var resultadoJogos = [];
					var result = resultadoTodosJogos;
					for ( var key in result ) {
						if ( key === "semana5" ) {
							$scope.semana5 = "Semana 5 : " + rangoDatas[ 0 ][ 0 ].semana5;
							for ( var obj in result[ key ] ) {
								resultadoJogos.push( {
									"semana": key,
									"jogo": result[ key ][ obj ].jogo,
									"bloqueado": result[ key ][ obj ].bloqueado,
									"estado": result[ key ][ obj ].estado,
									"pontos": result[ key ][ obj ].pontos,
									"placar": result[ key ][ obj ].placar,
									"status": result[ key ][ obj ].status
								} );
							}
							$scope.jogosLista4 = resultadoJogos;
						}
					}
				} else {
					console.log( "nao mostrara 5" );
				}
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