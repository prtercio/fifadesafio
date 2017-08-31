( function() {
	'use strict';
	var TorneiosCopa = angular.module( 'App.CtrlTorneiosCopa', [] );
	TorneiosCopa.controller( 'CtrlTorneiosCopa', [ '$scope', 'Utils', '$state', '$localStorage', 'Popup', '$stateParams', '$ionicModal', '$ionicPopup', 'PopupFactory', 'PopupFactoryBuscar', 'PopupFactoryAddTorneio', 'CordovaNetwork',
		function( $scope, Utils, $state, $localStorage, Popup, $stateParams, $ionicModal, $ionicPopup, PopupFactory, PopupFactoryBuscar, PopupFactoryAddTorneio, CordovaNetwork ) {
			//var keyUsuario = $localStorage.keyUser;
			// de 4, 8, 16
			window.addEventListener( 'online', updateIndicator );
			window.addEventListener( 'offline', updateIndicator );

			function updateIndicator() {
				// Show a different icon based on offline/online
				CordovaNetwork.isOnline().then( function( isConnected ) {
					if ( isConnected === true ) {
						console.log( "conectado" );
						var alertPopup = $ionicPopup.alert( {
							template: '<p align="center"><i class="icon ion-happy verdeBalanced tamanhoIcon"></i></p><p align="center"><strong>{{"INTERNETON" | translate}}</strong></p>',
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
					} else {
						var alertPopup = $ionicPopup.alert( {
							template: '<p align="center"><i class="icon ion-alert-circled laranja tamanhoIcon"></i></p><p align="center"><strong>{{"INTERNETOFF" | translate}}</strong></p>',
							buttons: [ {
								text: '<b>Ok</b>',
								type: 'button-energized',
								onTap: function( e ) {}
							} ]
						} );
						alertPopup.then( function( res ) {
							if ( res ) {
								console.log( "fechado" );
							}
						} );
					}
				} );
			}
			var gamertag = "";
			if ( $localStorage.account ) {
				$scope.logado = true;
				$scope.gamertag = gamertag;
				gamertag = $localStorage.account.gamertag
			} else {
				$scope.logado = false;
				$scope.gamertag = "Anomimo";
			}
			var keyUsuario = "";
			var keyUsuarioCreadorTorneio = "";
			var gtSemEspacio = "";
			if ( gamertag ) {
				keyUsuario = sustituirValorString( gamertag, '%20' );
				gtSemEspacio = keyUsuario;
				/*
				var gtEspacio = String( gamertag );
				var gtSemEspacio = String( gtEspacio.replace( /\s/g, '%20' ) );
				keyUsuario = gtSemEspacio;
				*/
			}
			var caracteres = "0123456789abcdefghijlmnopqrstuvxzkywABCDEFGHIJLMNOPQRSTUVXZKYW-";
			var longitud = 6;
			var refTorneios = firebase.database().ref( 'desafio/torneios/matamata/' + keyUsuario );
			var novaDataFimUtc = new Date();
			var dataFormatada = Date.UTC( novaDataFimUtc.getFullYear(), novaDataFimUtc.getMonth(), novaDataFimUtc.getDate(), novaDataFimUtc.getMinutes(), novaDataFimUtc.getSeconds(), 0 );
			var torneios = [];
			var gamertagParaBuscar = "";
			var chaveParaBuscar = "";
			$scope.verTorneio = true;
			$scope.keyUsuarioCriador = "";
			var localStorageTorneioAdicionado = [];
			var torneioEncontradoEstado = false;
			var icon = 0;
			var numeroDeParticipantesNovoMata = 0;

			function getRandomArbitrary( min, max ) {
				return Math.floor( Math.random() * ( max - min ) + min );
			}

			function sustituirValorString( valor, stg ) {
				var gtEspacio = String( valor );
				var gtSemEspacio = String( gtEspacio.replace( /\s/g, stg ) );
				return gtSemEspacio;
			}
			$scope.listarTorneio = function() {
				//verTorneiosOutros();
				if ( $scope.gamertag != "Anomimo" ) {
					torneios = [];
					Utils.show();
					refTorneios.once( "value" ).then( function( snapshot ) {
						$scope.$apply( function() {
							var snap = snapshot.val();
							var config = snapshot.val();
							if ( snap == null ) {
								$scope.verTorneio = false;
							} else {
								$scope.verTorneio = true;
							}
							keyUsuarioCreadorTorneio = snapshot.key;
							$scope.keyUsuarioCriador = keyUsuarioCreadorTorneio;
							if ( keyUsuario == keyUsuarioCreadorTorneio ) $scope.esCriado = true;
							for ( var key in snap ) {
								torneios.push( {
									"nome": snap[ key ].configuracao.nome,
									"senha": key,
									"data": snap[ key ].configuracao.data,
									"participantes": snap[ key ].configuracao.participantes,
									"icon": snap[ key ].configuracao.icon
								} );
							}
							$scope.torneios = torneios;
							Utils.hide();
						} );
					} );
				} else {
					console.log( "Nao pode criar" );
				}
			}
			$scope.verNumParticipantesSeleccionados = function( numPartSel ) {
				console.log( numPartSel );
				numeroDeParticipantesNovoMata = numPartSel;
			}
			$scope.crearNovo = function() {
				var nome = "";
				$scope.data = {}
				var myPopup = PopupFactory.getPopup( $scope );
				// An elaborate, custom popup
				myPopup.then( function( res ) {
					console.log( 'nome', res );
					nome = res;
					if ( nome == "" ) {
						console.log( res, "No vazio" )
					} else if ( numeroDeParticipantesNovoMata > 1 ) {
						if ( res != undefined ) enviarNovoTorneio();
					} else {
						console.log( res, "No envia" )
					}
				} );
				var torneio4 = {
					jogo1: {
						jogador1: {
							jogador: "Tercio",
							result: 1,
							vencedor: 3
						},
						jogador2: {
							jogador: "Lucas",
							result: 2,
							vencedor: 3
						}
					},
					jogo2: {
						jogador1: {
							jogador: "pedro",
							result: 3,
							vencedor: 3
						},
						jogador2: {
							jogador: "Juan",
							result: 4,
							vencedor: 3
						}
					}
				};

				function enviarNovoTorneio() {
					var icon = getRandomArbitrary( 1, 50 );
					Utils.show();
					if ( $scope.logado == true ) {
						var senha = rand_code( caracteres, longitud );
						var datos = {
							nome: nome,
							data: dataFormatada,
							participantes: numeroDeParticipantesNovoMata,
							icon: icon,
							iniciado: false,
							matamata: "iniciado",
							admnis: {
								principal: {
									key: $localStorage.keyUser,
									gamertag: gamertag
								}
							}
						}
						firebase.database().ref( 'desafio/torneios/matamata/' + gtSemEspacio + '/' + senha + '/configuracao' ).push( {
							nome: 0
						} ).then( function( response ) {
							console.log( "estrutura preparada" );
							firebase.database().ref( 'desafio/torneios/matamata/' + gtSemEspacio + '/' + senha ).update( {
								configuracao: datos
							} ).then( function( response ) {
								//$scope.modal.hide();
								Utils.hide();
								$scope.listarTorneio();
							} );
						} );
					}
				}
			}
			//gerador de senha
			function rand_code( chars, lon ) {
				var code = "";
				for ( var x = 0; x < lon; x++ ) {
					var rand = Math.floor( Math.random() * chars.length );
					code += chars.substr( rand, 1 );
				}
				return code;
			}
			$scope.onItemDelete = function( item ) {
				var confirmPopup = $ionicPopup.confirm( {
					template: '<p align="center"><i class="icon ion-alert-circled laranja tamanhoIcon"></i></p><p align="center"><strong>{{"SAIRTORNEIOTODOS" | translate}}</strong></p>',
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

				function confirmarSaida() {
					if ( keyUsuario == keyUsuarioCreadorTorneio ) {
						firebase.database().ref( 'desafio/torneios/matamata/' + keyUsuario + "/" + item ).remove().then( function( response ) {
							console.log( "se eliminó" );
							$scope.listarTorneio();
						} );
					}
				}
			}
			$scope.buscarTorneio = function() {
				if ( !torneioEncontradoEstado ) {
					if ( $scope.valor == null ) {
						$scope.valor = {}
					} else {
						if ( gamertagParaBuscar.indexOf( "%20" ) == -1 ) {} else {
							gamertagParaBuscar = substituirVazios( gamertagParaBuscar, " ", "%20" );
						}
						$scope.valor = {
							gamertag: gamertagParaBuscar,
							chave: chaveParaBuscar
						}
					}
				} else {
					$scope.valor = {}
					torneioEncontradoEstado = false;
				}
				var gamertagChave = "";
				var myPopup = PopupFactoryBuscar.getPopup( $scope );
				// An elaborate, custom popup
				myPopup.then( function( res ) {
					console.log( "aqui es res", res );
					gamertagChave = res;
					if ( !res ) {
						gamertagParaBuscar = "";
						chaveParaBuscar = "";
					} else {
						if ( res != undefined ) buscarTorneioChaveIgual();
					}
				} );

				function buscarTorneioChaveIgual() {
					if ( $localStorage.torneiosAdicionados ) {
						console.log( "1 Ver aqui" );
						console.log( $localStorage.torneiosAdicionados );
						var torneioArmazenados = $localStorage.torneiosAdicionados;
						console.log( "torneioArmazenados", torneioArmazenados.length )
						if ( torneioArmazenados.length != 0 ) {
							console.log( "2Ver aqui" );
							for ( var i = 0; i < torneioArmazenados.length; i++ ) {
								if ( torneioArmazenados[ i ].keyTorneio == gamertagChave.chave ) {
									console.log( "3 Ver aqui" );
									var alertPopup = $ionicPopup.alert( {
										template: '<p align="center"><i class="icon ion-alert-circled laranja tamanhoIcon"></i></p><p align="center"><strong>{{"TORNEIOJAFOIADICIONADO" | translate}}</strong></p>',
										buttons: [ {
											text: '<b>Ok</b>',
											type: 'button-energized',
											onTap: function( e ) {}
										} ]
									} );
									alertPopup.then( function( res ) {
										if ( res ) {
											console.log( "fechado" );
										}
									} );
									break;
								} else {
									console.log( "4 Ver aqui" );
									buscarTorneioChaveNovo();
									break;
								}
							}
						} else {
							console.log( "5 Ver aqui" );
							buscarTorneioChaveNovo();
						}
					} else {
						console.log( "6 Ver aqui" );
						buscarTorneioChaveNovo();
					}
				}

				function buscarTorneioChaveNovo() {
					Utils.show();
					var gtSemProceso = String( gamertagChave.gamertag );
					if ( gtSemProceso.indexOf( " " ) == -1 ) {
						gamertagParaBuscar = gtSemProceso;
						console.log( "1", gamertagParaBuscar );
					} else {
						gamertagParaBuscar = String( gtSemProceso.replace( /\s/g, '%20' ) );
						console.log( "2", gamertagParaBuscar );
					}
					chaveParaBuscar = gamertagChave.chave;
					firebase.database().ref( 'desafio/torneios/matamata/' + gamertagParaBuscar + '/' + chaveParaBuscar ).once( "value" ).then( function( snapshot ) {
						Utils.hide();
						if ( snapshot.val() ) {
							var datosTorneio = snapshot.val().configuracao.nome;
							$scope.torneioencontrado = datosTorneio;
							var myPopup = PopupFactoryAddTorneio.getPopup( $scope );
							var novoGT = "";
							if ( gamertagParaBuscar.indexOf( "%20" ) == -1 ) {
								novoGT = gamertagParaBuscar;
							} else {
								novoGT = substituirVazios( gamertagParaBuscar, " ", "%20" );
							}
							// An elaborate, custom popup
							myPopup.then( function( res ) {
								console.log( "resAdd", res );
								if ( res != undefined ) {
									localStorageTorneioAdicionado.push( {
										"nome": snapshot.val().configuracao.nome,
										"data": snapshot.val().configuracao.data,
										"participantes": snapshot.val().configuracao.participantes,
										"gamertag": novoGT,
										"keyUsuario": gamertagParaBuscar,
										"keyTorneio": snapshot.key,
										"icon": snapshot.val().configuracao.icon
									} );
									adicionarTorneioOutros();
								}
							} );
						} else {
							var alertPopup = $ionicPopup.alert( {
								template: '<p align="center"><i class="icon ion-alert-circled laranja tamanhoIcon"></i></p><p align="center"><strong>{{"VERIFICARDATOS" | translate}}</strong></p>',
								buttons: [ {
									text: '<b>Ok</b>',
									type: 'button-energized',
									onTap: function( e ) {}
								} ]
							} );
							alertPopup.then( function( res ) {
								if ( res ) {
									console.log( "fechado" );
								}
							} );
						}
					} );
				}

				function adicionarTorneioOutros() {
					$localStorage.torneiosAdicionados = localStorageTorneioAdicionado;
					var datosGuardados = $localStorage.torneiosAdicionados;
					console.log( "adicionarTorneioOutros", datosGuardados );
					$scope.valor = {}
					torneioEncontradoEstado = true;
					verTorneiosOutros();
				}
			}

			function verTorneiosOutros() {
				if ( $localStorage.torneiosAdicionados ) {
					if ( $localStorage.torneiosAdicionados.length != 0 ) {
						$scope.verTorneiosOutros = true;
						$scope.torneiosAdicionados = $localStorage.torneiosAdicionados;
					} else {
						$scope.verTorneiosOutros = false;
					}
				} else {
					$scope.verTorneiosOutros = false;
				}
			}
			$scope.onItemDeleteTorneioAdicionado = function( item ) {
				var arraytorneioAdd = $localStorage.torneiosAdicionados;
				console.log( "aqui elimna", item );
				arraytorneioAdd.splice( item, 1 );
				console.log( arraytorneioAdd );
				verTorneiosOutros();
			}

			function substituirVazios( valor, novo, stg ) {
				var cadena = valor;
				var str = String( stg );
				var total = 30;
				var novaCadena = "";
				console.log( cadena.indexOf( "99" ) );
				for ( var i = 0; i < total; i++ ) {
					if ( cadena.indexOf( str ) != -1 ) {
						novaCadena = cadena.replace( str, novo );
						cadena = novaCadena;
					} else {
						return novaCadena;
						break;
					}
				}
			}
			// Create the login modal that we will use later
			$ionicModal.fromTemplateUrl( 'modalTorneio.html', {
				scope: $scope
			} ).then( function( modal ) {
				$scope.modal = modal;
			} );
			// Triggered in the login modal to close it
			$scope.closeLogin = function() {
				$scope.modal.hide();
				//img = "";
			};
			// Open the login modal
			$scope.abrirAjuda = function() {
				$scope.modal.show();
				//$( "#prova" ).html( '<img class="redimensionar" src="' + img + '"/>' );
			};
		}
	] ); //ctrl
	TorneiosCopa.factory( "PopupFactory", function( $ionicPopup ) {
		var cancel = false;

		function getPopup( scope ) {
			return $ionicPopup.show( {
				//template: '<p align="center"><i class="icon ion-ribbon-b verdeBold  tamanhoIcon"></i></p>' + '<p align="center"><strong>{{"CRIARNOVO" | translate}}</strong></p>' + '<input type="text" placeholder="{{"NOMEGAMERTAG"| translate}}" ng-model="data.nome">',
				templateUrl: 'popup-novotorneio.html',
				scope: scope,
				buttons: [ {
					text: '<i class="icon ion-close-round"></i>',
					type: 'button-stable',
					onTap: function( e ) {
						cancel = true
					}
				}, {
					text: '<i class="icon ion-plus-round"></i>',
					type: 'button-balanced',
					onTap: function( e ) {
						if ( !scope.data.nome ) {
							//don't allow the user to close unless he enters wifi password
							e.preventDefault();
						} else {
							return scope.data.nome;
						}
					}
				}, ]
			} )
		}
		if ( cancel == false ) {
			return {
				getPopup: getPopup
			};
		}
	} );
	TorneiosCopa.factory( "PopupFactoryBuscar", function( $ionicPopup ) {
		var cancel = false;

		function getPopup( scope ) {
			return $ionicPopup.show( {
				//template: '<p align="center"><i class="icon ion-ribbon-b verdeBold  tamanhoIcon"></i></p>' + '<p align="center"><strong>{{"CRIARNOVO" | translate}}</strong></p>' + '<input type="text" placeholder="{{"NOMEGAMERTAG"| translate}}" ng-model="data.nome">',
				templateUrl: 'popup-buscartorneio.html',
				scope: scope,
				buttons: [ {
					text: '<i class="icon ion-close-round"></i>',
					type: 'button-stable',
					onTap: function( e ) {
						cancel = true
					}
				}, {
					text: '<i class="icon ion-search"></i>',
					type: 'button-balanced',
					onTap: function( e ) {
						if ( !scope.valor ) {
							console.log( scope.valor );
							e.preventDefault();
						} else {
							return scope.valor;
						}
					}
				}, ]
			} )
		}
		if ( cancel == false ) {
			return {
				getPopup: getPopup
			};
		}
	} );
	TorneiosCopa.factory( "PopupFactoryAddTorneio", function( $ionicPopup ) {
		var cancel = false;

		function getPopup( scope ) {
			return $ionicPopup.show( {
				//template: '<p align="center"><i class="icon ion-ribbon-b verdeBold  tamanhoIcon"></i></p>' + '<p align="center"><strong>{{"CRIARNOVO" | translate}}</strong></p>' + '<input type="text" placeholder="{{"NOMEGAMERTAG"| translate}}" ng-model="data.nome">',
				templateUrl: 'popup-adicionartorneio.html',
				scope: scope,
				buttons: [ {
					text: '<i class="icon ion-close-round"></i>',
					type: 'button-stable',
					onTap: function( e ) {
						cancel = true
					}
				}, {
					text: '<i class="icon ion-plus-round"></i>',
					type: 'button-balanced',
					onTap: function( e ) {
						if ( !scope.valor ) {
							console.log( scope.valor );
							e.preventDefault();
						} else {
							return scope.valor;
						}
					}
				}, ]
			} )
		}
		if ( cancel == false ) {
			return {
				getPopup: getPopup
			};
		}
	} );
} )();