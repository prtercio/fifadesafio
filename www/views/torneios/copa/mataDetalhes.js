( function() {
  'use strict';
  var torneioMataMata = angular.module( 'App.CtrlTorneiosMataDetalhes', [] );
  torneioMataMata.controller( 'CtrlTorneiosMataDetalhes', [ '$scope', 'Utils', '$state', '$localStorage', 'Popup', '$stateParams', 'idTorneioKeyUsuario', 'PopupEditarJogoMata', '$ionicPopup', 'CordovaNetwork', '$ionicModal', '$ionicPopover', 'PopupFactoryAddEditor', '$ionicTabsDelegate', '$timeout',
    function( $scope, Utils, $state, $localStorage, Popup, $stateParams, idTorneioKeyUsuario, PopupEditarJogoMata, $ionicPopup, CordovaNetwork, $ionicModal, $ionicPopover, PopupFactoryAddEditor, $ionicTabsDelegate, $timeout ) {
      var keyUsuario = "";
      var gamertag = "";
      if ( $localStorage.account ) {
        $scope.logado = true;
        gamertag = $localStorage.account.gamertag;
        $scope.gamertag = gamertag;
      } else {
        $scope.logado = false;
        $scope.gamertag = "Anonimo";
        gamertag = $scope.gamertag;
      }
      var idTorneio = idTorneioKeyUsuario.substring( idTorneioKeyUsuario.indexOf( "&" ) + 1 );
      var keyUsariosinProcesar = idTorneioKeyUsuario.substring( 0, idTorneioKeyUsuario.indexOf( "&" ) );
      var gtKeyEspacio = String( keyUsariosinProcesar );
      var gtSemKeyEspacio = String( gtKeyEspacio.replace( /\s/g, '%20' ) );
      var keyUsuario = gtSemKeyEspacio;
      var games = "";
      var nomeTorneio = "";
      var dataTorneio = "";
      $scope.chaveAcesso = idTorneio;
      var listaAdmin = [];
      var participantes = 0;
      var torneio4 = [];
      var novaDataFimUtc = new Date();
      var dataFormatada = Date.UTC( novaDataFimUtc.getFullYear(), novaDataFimUtc.getMonth() + 1, novaDataFimUtc.getDate(), novaDataFimUtc.getMinutes(), novaDataFimUtc.getSeconds(), 0 );
      var selecionIdaVolta = false;
      var CriterioDesempate = false;
      var cargadoCriterioDesempate = "";
      var mataIdaeVolta = false;
      var resultado1 = 0;
      var resultado2 = 0;
      $scope.campeao = false;
      $scope.confronto1SemiFinalizadoIda = false;
      $scope.confronto1SemiFinalizadoVolta = false;
      $scope.confronto2SemiFinalizadoIda = false;
      $scope.confronto2SemiFinalizadoVolta = false;
      $scope.confrontoIdaFinal = false;
      $scope.confrontoVoltaFinal = false;
      $scope.semiFinalizada = false;
      $scope.idaFinalFinalizada = false;
      $scope.voltaFinalFinalizada = false;
      var refTorneio = firebase.database().ref( 'desafio/torneios/matamata/' + keyUsuario + '/' + idTorneio );
      $scope.carregarDados = function() {
        Utils.show();
        listaAdmin = [];
        refTorneio.once( "value" ).then( function( snapshot ) {
          //saber si es administrador
          var admnis = snapshot.val().configuracao.admnis;
          if ( $scope.logado ) {
            for ( var obj in admnis ) {
              listaAdmin.push( {
                "gt": admnis[ obj ].gamertag,
                "key": admnis[ obj ].key,
                "keynodo": obj
              } )
            }
            for ( var i = 0; i < listaAdmin.length; i++ ) {
              if ( listaAdmin[ i ].key === $localStorage.keyUser ) {
                if ( listaAdmin[ i ].keynodo == "principal" ) {
                  $scope.eCriadorSuper = true;
                }
                $scope.eCriador = true;
                $scope.dimensionColumnaC1ida = 80;
                $scope.dimensionColumnaC1Volta = 80;
                $scope.dimensionColumnaC2ida = 80;
                $scope.dimensionColumnaC2Volta = 80;
                $scope.dimensionColumnaIdaFinal = 80;
                $scope.dimensionColumnaIdaVolta = 80;
                break;
              } else {
                $scope.dimensionColumnaC1ida = 100;
                $scope.dimensionColumnaC1Volta = 100;
                $scope.dimensionColumnaC2ida = 100;
                $scope.dimensionColumnaC2Volta = 100;
                $scope.dimensionColumnaIdaFinal = 100;
                $scope.dimensionColumnaIdaVolta = 100;
                $scope.eCriador = false;
                $scope.eCriadorSuper = false;
              }
            }
          }
          $scope.$apply( function() {
            participantes = snapshot.val().configuracao.participantes;
            $scope.participantes = participantes;
            nomeTorneio = snapshot.val().configuracao.nome;
            $scope.nomeTorneio = nomeTorneio;
            dataTorneio = snapshot.val().configuracao.data;
            cargadoCriterioDesempate = snapshot.val().configuracao.golsForaCasa;
            $scope.jogosSemi = snapshot.val().jogos.semifinal;
            $scope.jogoFinal = snapshot.val().jogos.final;
            if ( snapshot.val().configuracao.iniciado == false ) {
              $scope.noInscritos = true;
              $timeout( function() {
                $ionicTabsDelegate.select( 0, false );
              }, 50 );
            } else {
              if ( snapshot.val().jogos.final.confronto.volta == undefined ) {
                mataIdaeVolta = false;
                $scope.eIdaVolta = false;
              } else {
                mataIdaeVolta = true;
                $scope.eIdaVolta = true;
              }
              $scope.noInscritos = false;
              if ( snapshot.val().jogos.quartas == undefined ) {
                $scope.quartas = false;
                console.log( "Q", snapshot.val().jogos.quartas );
              } else {
                $scope.quartas = true;
                $timeout( function() {
                  $ionicTabsDelegate.select( 0, false );
                }, 50 );
              }
              if ( snapshot.val().jogos.semifinal == undefined ) {
                $scope.semifinal = false;
                console.log( "S", );
              } else {
                $scope.semifinal = true;
                $timeout( function() {
                  $ionicTabsDelegate.select( 0, false );
                }, 50 );
                var golsCasaJ1C1 = snapshot.val().jogos.semifinal.confronto1.ida.golsJ1;
                var golsForaJ2C1 = snapshot.val().jogos.semifinal.confronto1.ida.golsJ2;
                var golsCasaJ2C1 = snapshot.val().jogos.semifinal.confronto1.volta.golsJ2;
                var golsForaJ1C1 = snapshot.val().jogos.semifinal.confronto1.volta.golsJ1;
                var golsCasaJ1C2 = snapshot.val().jogos.semifinal.confronto2.ida.golsJ1;
                var golsForaJ2C2 = snapshot.val().jogos.semifinal.confronto2.ida.golsJ2;
                var golsCasaJ2C2 = snapshot.val().jogos.semifinal.confronto2.volta.golsJ2;
                var golsForaJ1C2 = snapshot.val().jogos.semifinal.confronto2.volta.golsJ1;
                // Ida 4
                var totalGolsJ1C1ida = golsCasaJ1C1 + golsForaJ2C1;
                var totalGolsJ2C1volta = golsCasaJ2C1 + golsForaJ1C1;
                if ( totalGolsJ1C1ida == totalGolsJ2C1volta ) {
                  if ( golsCasaJ1C1 == golsForaJ2C1 && golsCasaJ2C1 == golsForaJ1C1 ) $scope.empateJogosC1 = true;
                } else {
                  $scope.empateJogosC1 = false;
                }
                // determinar se vejos o btn editar do jogo 1 e 2 ida
                if ( $scope.eCriadorSuper == true || $scope.eCriador == true ) {
                  if ( golsForaJ1C1 != "x" ) {
                    $scope.confronto1SemiFinalizadoIda = true;
                    $scope.dimensionColumnaC1ida = 100;
                  }
                  if ( golsForaJ2C2 != "x" ) {
                    $scope.confronto2SemiFinalizadoIda = true;
                    $scope.dimensionColumnaC2ida = 100;
                  }
                }
                // Volta 4
                var totalGolsJ1C2ida = golsCasaJ1C2 + golsForaJ2C2;
                var totalGolsJ2C2volta = golsCasaJ2C2 + golsForaJ1C2;
                if ( totalGolsJ1C2ida == totalGolsJ2C2volta ) {
                  if ( golsCasaJ1C2 == golsForaJ2C2 && golsCasaJ2C2 == golsForaJ1C2 ) $scope.empateJogosC2 = true;
                } else {
                  $scope.empateJogosC2 = false;
                }
                verificarConclusaoSemininalQuatro();
              }
              if ( snapshot.val().jogos.final.confronto.jogador1 == "x" ) {
                $scope.final = false;
                console.log( "F", snapshot.val().jogos.final );
              } else {
                if ( snapshot.val().jogos.final.confronto.ida.golsJ1 != 'x' ) {
                  $scope.confronto1SemiFinalizadoVolta = true;
                  $scope.dimensionColumnaC1Volta = 100;
                  $scope.confronto2SemiFinalizadoVolta = true;
                  $scope.dimensionColumnaC2Volta = 100;
                }
                $timeout( function() {
                  $ionicTabsDelegate.select( 1, false );
                }, 50 );
                $scope.final = true;
                console.log( "final ", snapshot.val().jogos.final.confronto.volta.golsJ1 );
                if ( snapshot.val().jogos.final.confronto.volta.golsJ1 == "x" ) {
                  $scope.finalizaMata = true;
                } else {
                  $scope.dimensionColumnaIdaFinal = 100;
                  $scope.finalizaMata = false;
                }
              }
              if ( snapshot.val().jogos.final.confronto.matamata == "finalizado" ) {
                $scope.dimensionColumnaIdaVolta = 100;
                $scope.campeao = true;
                $scope.finalizaMata = true;
                $timeout( function() {
                  $ionicTabsDelegate.select( 2, false );
                }, 50 );
              }
            }
            Utils.hide();
          } );
        } );
        //
      };
      //add Participantes
      var num = 0;
      $scope.inputs = [ {
        value: null
      } ];
      $scope.selecionIdaVolta = function( selecion ) {
        console.log( "esta e a sel " + selecion );
        if ( selecion == "S" ) {
          selecionIdaVolta = true;
        } else {
          selecionIdaVolta = false;
        }
      }
      $scope.selecionCriterioDesempate = function( selecion ) {
        console.log( "esta e a sel " + selecion );
        if ( selecion == "S" ) {
          CriterioDesempate = true;
        } else {
          CriterioDesempate = false;
        }
      }
      $scope.addInput = function() {
        num = num + 1;
        if ( num < participantes ) {
          $scope.inputs.push( {
            value: null
          } );
        } else {
          var alertPopup = $ionicPopup.alert( {
            template: '<p align="center"><i class="icon ion-alert-circled laranja tamanhoIcon"></i></p><p align="center"><strong>{{"NUMMAXPARTICIPANTESMATA" | translate}}</strong></p>',
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
          console.log( "part" + participantes );
          switch ( participantes ) {
            case 4:
              num = 3;
              break;
            case 8:
              num = 7;
              break;
            case 16:
              num = 15;
              break;
          }
        }
        console.log( num );
      }
      $scope.removeInput = function( index ) {
        $scope.inputs.splice( index, 1 );
        if ( num > 0 ) {
          num = num - 1;
          console.log( "Num menos " + num );
        }
      }
      //--------------------------------------------------------------- EnviarDatos
      $scope.enviarDatos = function() {
        var dato = $scope.inputs;
        var verficarPar = dato.length % 2;
        if ( verficarPar == 0 ) {
          var nuevoArray = [];
          for ( var i = 0; i < dato.length; i++ ) {
            nuevoArray.push( dato[ i ].value );
            if ( dato[ i ].value === "" ) {
              $scope.hayVazios = true;
              break;
            } else {
              $scope.hayVazios = false;
            }
            if ( dato[ i ].value === null ) {
              $scope.hayVazios = true;
              break;
            } else {
              $scope.hayVazios = false;
            }
          }
          var sorted_arr = nuevoArray.slice().sort();
          var results = [];
          for ( var i = 0; i < nuevoArray.length - 1; i++ ) {
            if ( sorted_arr[ i + 1 ] == sorted_arr[ i ] ) {
              results.push( sorted_arr[ i ] );
            }
          }
          if ( results.length > 0 ) {
            var alertPopup = $ionicPopup.alert( {
              template: '<p align="center"><i class="icon ion-alert-circled laranja tamanhoIcon"></i></p><p align="center"><strong>{{"NOMESREPETIDOS" | translate}}</strong></p>',
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
            var gamesQtd = $scope.inputs.length;
            if ( !$scope.hayVazios ) {
              if ( gamesQtd > 3 ) {
                for ( var i = 0; i < gamesQtd; i++ ) {
                  console.log( dato[ i ].value );
                  if ( dato[ i ].value !== undefined ) {
                    if ( i == gamesQtd - 1 ) gerarConfrontos(); //procesarDatos();
                  } else {
                    var alertPopup = $ionicPopup.alert( {
                      template: '<p align="center"><i class="icon ion-alert-circled laranja tamanhoIcon"></i></p><p align="center"><strong>{{"CAMPOSPREENCHIDOS" | translate}}</strong></p>',
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
                    break;
                  }
                }
              } else {
                var alertPopup = $ionicPopup.alert( {
                  template: '<p align="center"><i class="icon ion-alert-circled laranja tamanhoIcon"></i></p><p align="center"><strong>{{"NUMEROMININO" | translate}}</strong></p>',
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
              }
            } else {
              var alertPopup = $ionicPopup.alert( {
                template: '<p align="center"><i class="icon ion-alert-circled laranja tamanhoIcon"></i></p><p align="center"><strong>{{"CAMPOSPREENCHIDOS" | translate}}</strong></p>',
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
            }
          }
        } else {
          var alertPopup = $ionicPopup.alert( {
            template: '<p align="center"><i class="icon ion-alert-circled laranja tamanhoIcon"></i></p><p align="center"><strong>{{"PARTICIPANTESPAR" | translate}}</strong></p>',
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
        }
      }
      //---------------------------------------------------------------------GerarConfrontos
      function gerarConfrontos() {
        if ( participantes == 4 ) {
          console.log( "es 4 el numero de partiipantes", $scope.inputs[ 0 ].value );
          var lista = [ 0, 1, 2, 3 ];
          var nuevaLista = lista.sort( function() {
            return Math.random() - 0.5
          } );
          if ( !selecionIdaVolta ) {
            // jogos de Ida 
            torneio4 = {
              semifinal: {
                confronto1: {
                  jogador1: $scope.inputs[ nuevaLista[ 0 ] ].value,
                  jogador2: $scope.inputs[ nuevaLista[ 1 ] ].value,
                  jogoextra: "x",
                  vencedor: "x",
                  ida: {
                    golsJ1: "x",
                    golsJ2: "x",
                    resultado: "x",
                    vencedor: "x"
                  }
                },
                confronto2: {
                  jogador1: $scope.inputs[ nuevaLista[ 2 ] ].value,
                  jogador2: $scope.inputs[ nuevaLista[ 3 ] ].value,
                  jogoextra: "x",
                  vencedor: "x",
                  ida: {
                    golsJ1: "x",
                    golsJ2: "x",
                    resultado: "x",
                    vencedor: "x"
                  }
                }
              },
              final: {
                confronto: {
                  jogador1: "x",
                  jogador2: "x",
                  jogoextra: "x",
                  vencedor: "x",
                  ida: {
                    golsJ1: "x",
                    golsJ2: "x",
                    vencedor: "x"
                  }
                }
              }
            }
          } else {
            // jogos de Ida e Volta
            torneio4 = {
              semifinal: {
                confronto1: {
                  jogador1: $scope.inputs[ nuevaLista[ 0 ] ].value,
                  jogador2: $scope.inputs[ nuevaLista[ 1 ] ].value,
                  jogoextra: "x",
                  vencedor: "x",
                  ida: {
                    golsJ1: "x",
                    golsJ2: "x",
                    resultado: "x",
                    vencedor: "x"
                  },
                  volta: {
                    golsJ1: "x",
                    golsJ2: "x",
                    resultado: "x",
                    vencedor: "x"
                  }
                },
                confronto2: {
                  jogador1: $scope.inputs[ nuevaLista[ 2 ] ].value,
                  jogador2: $scope.inputs[ nuevaLista[ 3 ] ].value,
                  jogoextra: "x",
                  vencedor: "x",
                  ida: {
                    golsJ1: "x",
                    golsJ2: "x",
                    resultado: "x",
                    vencedor: "x"
                  },
                  volta: {
                    golsJ1: "x",
                    golsJ2: "x",
                    resultado: "x",
                    vencedor: "x"
                  }
                }
              },
              final: {
                confronto: {
                  jogador1: "x",
                  jogador2: "x",
                  jogoextra: "x",
                  vencedor: "x",
                  ida: {
                    golsJ1: "x",
                    golsJ2: "x",
                    vencedor: "x"
                  },
                  volta: {
                    golsJ1: "x",
                    golsJ2: "x",
                    vencedor: "x"
                  }
                }
              }
            }
          }
          console.log( "enviar", torneio4 );
          $scope.enviarTorneio();
        }
        if ( participantes == 8 ) {
          console.log( "es 8 el numero de partiipantes" );
        }
      }
      $scope.enviarTorneio = function() {
        firebase.database().ref( 'desafio/torneios/matamata/' + keyUsuario + '/' + idTorneio ).update( {
          jogos: torneio4
        } ).then( function( response ) {
          console.log( "enviado" );
          firebase.database().ref( 'desafio/torneios/matamata/' + keyUsuario + '/' + idTorneio + '/configuracao' ).update( {
            iniciado: true,
            golsForaCasa: CriterioDesempate
          } ).then( function( response ) {
            console.log( "enviado actualizado" );
            //$scope.carregarDados();
            //$state.go( 'app.torneiosCopa' );
            var alertPopup = $ionicPopup.alert( {
              template: '<p align="center"><i class="icon ion-happy verde tamanhoIcon"></i></p><p align="center"><strong>O mata-mata foi criado!</strong></p>',
              buttons: [ {
                text: '<b>Ok</b>',
                type: 'button-balanced',
                onTap: function( e ) {
                  $state.go( 'app.torneiosCopa' );
                }
              } ]
            } );
            alertPopup.then( function( res ) {
              if ( res ) {
                console.log( "fechado" );
              }
            } );
          } );
        } );
      }
      $scope.editarJogo = function( momento, Eidavolta, confronto, jogador1, jogador2 ) {
        console.log( momento, Eidavolta, confronto, jogador1, jogador2 );
        $scope.jogador1 = jogador1;
        $scope.jogador2 = jogador2;
        var myPopup = PopupEditarJogoMata.getPopup( $scope );
        // An elaborate, custom popup
        $scope.data = {}
        myPopup.then( function( res ) {
          console.log( "res ", res );
          if ( res == undefined ) {} else {
            resultado1 = res.local;
            resultado2 = res.visitante;
            enviarDatosJogos();
            console.log( momento, Eidavolta, confronto, resultado1, resultado2 );
          }
        } );

        function enviarDatosJogos() {
          var resultadoJogo = "";
          var vencedorJogo = "";
          if ( resultado1 == resultado2 ) {
            resultadoJogo = "empate";
            vencedorJogo = "x"
          } else {
            if ( Eidavolta == "ida" ) {
              if ( resultado1 > resultado2 ) {
                vencedorJogo = "jogador1";
              } else {
                vencedorJogo = "jogador2";
              }
            } else {
              if ( resultado1 < resultado2 ) {
                vencedorJogo = "jogador1";
              } else {
                vencedorJogo = "jogador2";
              }
            }
          }
          if ( Eidavolta == 'ida' ) {
            var datosDetalhe = {
              golsJ1: resultado1,
              golsJ2: resultado2,
              vencedor: vencedorJogo
            }
          } else {
            var datosDetalhe = {
              golsJ1: resultado2,
              golsJ2: resultado1,
              vencedor: vencedorJogo
            }
          }
          if ( $scope.eCriador ) {
            Utils.show();
            console.log( keyUsuario, idTorneio, momento, confronto );
            if ( Eidavolta == "ida" ) {
              firebase.database().ref( 'desafio/torneios/matamata/' + keyUsuario + '/' + idTorneio + '/jogos/' + momento + '/' + confronto ).update( {
                ida: datosDetalhe
              } ).then( function( response ) {
                console.log( "respuesta recebida" );
                Utils.hide();
                $scope.carregarDados();
              } );
            } else {
              firebase.database().ref( 'desafio/torneios/matamata/' + keyUsuario + '/' + idTorneio + '/jogos/' + momento + '/' + confronto ).update( {
                volta: datosDetalhe
              } ).then( function( response ) {
                console.log( "respuesta recebida, actualizando..." );
                // recuperar resultado do jogo de ida
                var golsJ1ida = $scope.jogosSemi[ confronto ].ida.golsJ1;
                var golsJ2ida = $scope.jogosSemi[ confronto ].ida.golsJ2;
                var golsTotalJ1 = golsJ1ida + resultado2;
                var golsTotalJ2 = golsJ2ida + resultado1;
                var vencedorDefinitivo = "";
                if ( !cargadoCriterioDesempate ) {
                  if ( golsTotalJ2 == golsTotalJ1 ) {
                    vencedorDefinitivo = "x";
                  } else {
                    if ( golsTotalJ2 > golsTotalJ1 ) {
                      vencedorDefinitivo = jogador1;
                    } else {
                      vencedorDefinitivo = jogador2;
                    }
                  }
                } else {
                  var golsJ1Casa = golsJ1ida;
                  var golsJ2Fora = golsJ2ida;
                  var golsJ1Fora = resultado2;
                  var golsJ2Casa = resultado1;
                  if ( golsTotalJ2 == golsTotalJ1 ) {
                    if ( golsJ1Fora > golsJ2Fora ) {
                      vencedorDefinitivo = jogador2;
                    } else {
                      vencedorDefinitivo = jogador1;
                    }
                  } else if ( golsTotalJ2 > golsTotalJ1 ) {
                    vencedorDefinitivo = jogador1;
                  } else {
                    vencedorDefinitivo = jogador2;
                  }
                }
                firebase.database().ref( 'desafio/torneios/matamata/' + keyUsuario + '/' + idTorneio + '/jogos/' + momento + '/' + confronto ).update( {
                  jogoextra: "x",
                  vencedor: vencedorDefinitivo
                } ).then( function( response ) {
                  console.log( "carregando" );
                  Utils.hide();
                  $scope.carregarDados();
                } );
              } );
            }
          }
        } // enviarDatosJogos
      }
      $scope.editarJogoFinal = function( momento, Eidavolta, confronto, jogador1, jogador2 ) {
        console.log( momento, Eidavolta, confronto, jogador1, jogador2 );
        $scope.jogador1 = jogador1;
        $scope.jogador2 = jogador2;
        var myPopup = PopupEditarJogoMata.getPopup( $scope );
        // An elaborate, custom popup
        $scope.data = {}
        myPopup.then( function( res ) {
          console.log( "res ", res );
          if ( res == undefined ) {} else {
            resultado1 = res.local;
            resultado2 = res.visitante;
            enviarDatosJogosFinal();
            console.log( momento, Eidavolta, confronto, resultado1, resultado2 );
          }
        } );

        function enviarDatosJogosFinal() {
          var vencedor = "";
          var vencedorJogo = ""
          if ( resultado1 == resultado2 ) {
            resultadoJogo = "empate";
            vencedorJogo = "x"
          } else {
            if ( Eidavolta == "ida" ) {
              if ( resultado1 > resultado2 ) {
                vencedorJogo = "jogador1";
              } else {
                vencedorJogo = "jogador2";
              }
            } else {
              if ( resultado1 < resultado2 ) {
                vencedorJogo = "jogador1";
              } else {
                vencedorJogo = "jogador2";
              }
            }
          }
          if ( Eidavolta == 'ida' ) {
            var datosDetalhe = {
              golsJ1: resultado1,
              golsJ2: resultado2,
              vencedor: vencedorJogo
            }
          } else {
            var datosDetalhe = {
              golsJ1: resultado2,
              golsJ2: resultado1,
              vencedor: vencedorJogo
            }
          }
          if ( $scope.eCriador ) {
            Utils.show();
            console.log( keyUsuario, idTorneio, momento, confronto );
            if ( Eidavolta == "ida" ) {
              firebase.database().ref( 'desafio/torneios/matamata/' + keyUsuario + '/' + idTorneio + '/jogos/final/confronto' ).update( {
                ida: datosDetalhe
              } ).then( function( response ) {
                console.log( "respuesta recebida" );
                Utils.hide();
                $scope.carregarDados();
              } );
            } else {
              firebase.database().ref( 'desafio/torneios/matamata/' + keyUsuario + '/' + idTorneio + '/jogos/final/confronto' ).update( {
                volta: datosDetalhe
              } ).then( function( response ) {
                console.log( "respuesta recebida" );
                var confronto = "confronto";
                //Determinar vencedor
                var golsJ1ida = $scope.jogoFinal[ confronto ].ida.golsJ1;
                var golsJ2ida = $scope.jogoFinal[ confronto ].ida.golsJ2;
                var golsTotalJ1 = golsJ1ida + resultado2;
                var golsTotalJ2 = golsJ2ida + resultado1;
                var vencedorDefinitivo = "";
                if ( !cargadoCriterioDesempate ) {
                  if ( golsTotalJ2 == golsTotalJ1 ) {
                    vencedorDefinitivo = "x";
                  } else {
                    if ( golsTotalJ2 > golsTotalJ1 ) {
                      vencedorDefinitivo = jogador1;
                    } else {
                      vencedorDefinitivo = jogador2;
                    }
                  }
                } else {
                  var golsJ1Casa = golsJ1ida;
                  var golsJ2Fora = golsJ2ida;
                  var golsJ1Fora = resultado2;
                  var golsJ2Casa = resultado1;
                  if ( golsTotalJ2 == golsTotalJ1 ) {
                    if ( golsJ1Fora > golsJ2Fora ) {
                      vencedorDefinitivo = jogador2;
                    } else {
                      vencedorDefinitivo = jogador1;
                    }
                  } else if ( golsTotalJ2 > golsTotalJ1 ) {
                    vencedorDefinitivo = jogador1;
                  } else {
                    vencedorDefinitivo = jogador2;
                  }
                }
                firebase.database().ref( 'desafio/torneios/matamata/' + keyUsuario + '/' + idTorneio + '/jogos/final/confronto' ).update( {
                  jogoextra: "x",
                  vencedor: vencedorDefinitivo
                } ).then( function( response ) {
                  console.log( "carregando" );
                  Utils.hide();
                  $scope.carregarDados();
                } );
              } );
            }
          }
        } //enviar Datos Jogos Final
      } // editar jogo fianl
      $scope.finalizarMataMata = function() {
        Utils.show();
        firebase.database().ref( 'desafio/torneios/matamata/' + keyUsuario + '/' + idTorneio + '/jogos/final/confronto' ).update( {
          matamata: "finalizado"
        } ).then( function( response ) {
          Utils.hide();
          $scope.carregarDados();
        } )
      }

      function verificarConclusaoSemininalQuatro() {
        var conf1 = "confronto1";
        var conf2 = "confronto2";
        if ( mataIdaeVolta == true ) {
          if ( $scope.jogosSemi[ conf1 ].vencedor != 'x' && $scope.jogosSemi[ conf2 ].vencedor != 'x' ) {
            console.log( "Desbloquea Final Ida e Volta" );
            $scope.desbloqueaFinal = true;
            firebase.database().ref( 'desafio/torneios/matamata/' + keyUsuario + '/' + idTorneio + '/jogos/final/confronto' ).update( {
              jogador1: $scope.jogosSemi[ conf1 ].vencedor,
              jogador2: $scope.jogosSemi[ conf2 ].vencedor
            } ).then( function( response ) {
              console.log( "Final Liberada y organizada" )
            } );
          } else {
            $scope.desbloqueaFinal = false;
            console.log( "NAO Desbloquea Final de Ida e Volta" );
          }
        } else {
          if ( $scope.jogosSemi[ conf1 ].vencedor != 'x' ) {
            console.log( "Desbloquea Final só Ida" );
            $scope.desbloqueaFinal = true;
          } else {
            $scope.desbloqueaFinal = false;
            console.log( "NAO Desbloquea Final só Ida" );
          }
        }
      }

      function getRandomArbitrary( min, max ) {
        return Math.floor( Math.random() * ( max - min ) + min );
      }

      function substituirVazios( valor, novo, stg ) {
        var cadena = valor;
        var str = String( stg );
        var total = 30;
        var novaCadena = "";
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
    } // functionCtrl
  ] ); //ctrl
  torneioMataMata.factory( "PopupEditarJogoMata", function( $ionicPopup ) {
    var cancel = false;

    function getPopup( scope ) {
      return $ionicPopup.show( {
        //template: '<p align="center"><i class="icon ion-ribbon-b verdeBold  tamanhoIcon"></i></p>' + '<p align="center"><strong>{{"CRIARNOVO" | translate}}</strong></p>' + '<input type="text" placeholder="{{"NOMEGAMERTAG"| translate}}" ng-model="data.nome">',
        templateUrl: 'popup-editarjogo.html',
        scope: scope,
        buttons: [ {
          text: 'Cancel',
          type: 'button-stable',
          onTap: function( e ) {
            cancel = true
          }
        }, {
          text: '<b>OK</b>',
          type: 'button-balanced',
          onTap: function( e ) {
            console.log( e );
            if ( !scope.data ) {
              //don't allow the user to close unless he enters wifi password
              e.preventDefault();
            } else {
              return scope.data;
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
  torneioMataMata.factory( "PopupFactoryAddEditor", function( $ionicPopup ) {
    var cancelEdit = false;

    function getPopupEdit( scope ) {
      return $ionicPopup.show( {
        //template: '<p align="center"><i class="icon ion-ribbon-b verdeBold  tamanhoIcon"></i></p>' + '<p align="center"><strong>{{"CRIARNOVO" | translate}}</strong></p>' + '<input type="text" placeholder="{{"NOMEGAMERTAG"| translate}}" ng-model="data.nome">',
        templateUrl: 'popup-buscarEditor.html',
        scope: scope,
        buttons: [ {
          text: 'Cancel',
          type: 'button-stable',
          onTap: function( e ) {
            cancelEdit = true
          }
        }, {
          text: '<b>OK</b>',
          type: 'button-balanced',
          onTap: function( e ) {
            console.log( e, "e ok" );
            if ( !scope.data ) {
              //don't allow the user to close unless he enters wifi password
              e.preventDefault();
            } else {
              return scope.data;
            }
          }
        }, ]
      } )
    }
    if ( cancelEdit == false ) {
      return {
        getPopupEdit: getPopupEdit
      };
    }
  } );
} )();