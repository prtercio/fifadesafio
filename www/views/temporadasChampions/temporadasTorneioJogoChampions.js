( function() {
    'use strict';
    var temporadasJogo = angular.module( 'App.CtrlTempTorneioJogoChampions', [] );
    temporadasJogo.controller( 'CtrlTempTorneioJogoChampions', [ '$scope', 'Utils', '$state', '$localStorage', 'Popup', '$stateParams', '$window', 'idJogo', 'dataService', '$ionicLoading', '$http', '$ionicPopup', '$rootScope', '$ionicHistory', '$timeout',
        function( $scope, Utils, $state, $localStorage, Popup, $stateParams, $window, idJogo, dataService, $ionicLoading, $http, $ionicPopup, $rootScope, $ionicHistory, $timeout ) {
            // si foi enviado:
            $scope.idioma = localStorage.getItem( "lang" );
            $scope.conquistas = JSON.parse( localStorage.getItem( 'conquistas' ) ) || '[]';
            var urlLocal = 'js/BD/presenceEjemplo.json';
            var arrayConquistas = [];
            var arrayConquistasDerrota = [];
            var arrayConquistasEmpate = [];
            var id = idJogo.substring( 0, idJogo.indexOf( "|" ) );
            var keyUsuario = idJogo.substring( idJogo.indexOf( "|" ) + 1 );
            //console.log(id, keyUsuario);
            var idJogo = id;
            var itemList = [];
            $scope.verPontos = false;
            $scope.selecionarImagen = false;
            $scope.verEnviar = false;
            $scope.chat = "jogo" + idJogo;
            $scope.jogo = idJogo;
            $scope.jogoNome = "Jogo " + idJogo;
            var idTorneio = String( dataService.get().idTorneio );
            var temporadaInicial = String( dataService.get().temporadaInicial );
            $scope.verDatos = true;
            // variaveis para reiniciar
            var conquistas = $scope.conquistas;
            var totalPontos = 0;
            var usuarios = [];
            var idUsuario = $localStorage.account.idXbox;
            var ganhador;
            var time1;
            var time2;
            var resultado1;
            var resultado2;
            $scope.btnDisabled = false;
            $scope.verButtonAdicionar = true;
            //$scope.verBtn = true;
            $scope.placar = "";
            $scope.penaltisResultado = false;
            $scope.penaltisResultadoSeleccionado = false;
            var gamerSeleccionado = $localStorage.account.gamertag;
            var conquistaSelecionadas = [];
            $scope.verPlacarFinal = false;
            var resultUltimo = "";
            var resultPenultimo = "";
            var resultAntepenultimo = "";
            var statusUltimo = "";
            var statusPenultimo = "";
            var statusAntepenultimo = "";
            var placarUltimo = "";
            var placarPenultimo = "";
            var placarAntepenultimo = "";
            var sequenciaVitoria = 0;
            var invencibilidade = 0;
            var jogados = 0;
            var anteriorVitoria = 0;
            var anteriorDerrota = 0;
            var anteriorEmpate = 0;
            var seVitoria = 0;
            var seDerrota = 0;
            var seEmpate = 0;
            var antGolsPro = 0;
            var antGolsContra = 0;
            var golsPro = 0;
            var golsContra = 0;
            var antPontos = 0;
            var pontoAtual = 0;
            // variaveis para longitud do resultado
            var lentLocal = 0;
            var lenVisitante = 0;
            var onlineManual = "Online";
            var temporadaAtual = 0;
            var temporadaNova = 0;
            var temporadaAtualVitoria = 0;
            var temporadaAtualEmpate = 0;
            var temporadaAtualDerrota = 0;
            var novaTemporadaAtualVitoria = 0;
            var novaTemporadaAtualEmpate = 0;
            var novaTemporadaAtualDerrota = 0;
            var atualizarNumerosTemporadas = false;
            var novosPontosVitoria = 0;
            var novosPontosEmpate = 0;
            var estatusDesafio = "";
            var imageSelecionada = "";
            $scope.datosIniciais = function() {
                //$ionicHistory.goBack();  
                $state.go( $state.current, {}, {
                    reload: true,
                    historyroot: true
                } );
            }
            Utils.show();
            var ref = firebase.database().ref( 'desafio/desafios/temporadasChampions/oficial/' + idTorneio + '/configuracao' );
            ref.once( "value" ).then( function( snapshot ) {
                estatusDesafio = snapshot.val().estatus;
                if ( estatusDesafio == "Fechado" ) {
                    var alertPopup = $ionicPopup.alert( {
                        title: 'Opps!',
                        template: '<p align="center"><i class="icon ion-alert-circled laranja tamanhoIcon"></i></p><p align="center"><strong>{{"DESAFIOTERMINADO" | translate}}</strong></p>',
                        buttons: [ {
                            text: '<b>Ok</b>',
                            type: 'button-balanced',
                            onTap: function( e ) {
                                var backCount = 1;
                                $rootScope.$ionicGoBack = function( backCount ) {
                                    $ionicHistory.goBack( backCount );
                                };
                                $rootScope.$ionicGoBack();
                            }
                        } ]
                    } );
                    alertPopup.then( function( res ) {
                        if ( res ) {
                            console.log( "fechado" );
                        }
                    } );
                }
                Utils.hide();
            } );
            // RECUPERAR TRES ÚLITMOS JOGOS
            var refJ = firebase.database().ref( 'desafio/desafios/temporadasChampions/oficial/' + idTorneio + '/inscritos/' + keyUsuario );
            refJ.once( "value" ).then( function( snapshot ) {
                $scope.infoJogo = snapshot.val();
                if ( $scope.infoJogo.jogados != 0 ) {
                    resultUltimo = String( $scope.infoJogo.placarUltimo );
                    statusUltimo = resultUltimo.substring( 0, resultUltimo.indexOf( "|" ) );
                    placarUltimo = resultUltimo.substring( resultUltimo.indexOf( "|" ) + 1 );
                    if ( $scope.infoJogo.placarPenultimo != 0 ) {
                        resultPenultimo = String( $scope.infoJogo.placarPenultimo );
                        statusPenultimo = resultPenultimo.substring( 0, resultPenultimo.indexOf( "|" ) );
                        placarPenultimo = resultPenultimo.substring( resultPenultimo.indexOf( "|" ) + 1 );
                    }
                    if ( $scope.infoJogo.placarAntepenultimo != 0 ) {
                        resultAntepenultimo = String( $scope.infoJogo.placarAntepenultimo );
                        statusAntepenultimo = resultAntepenultimo.substring( 0, resultAntepenultimo.indexOf( "|" ) );
                        placarAntepenultimo = resultAntepenultimo.substring( resultAntepenultimo.indexOf( "|" ) + 1 );
                    }
                    $scope.jogados = $scope.infoJogo.jogados;
                    jogados = $scope.jogados;
                    sequenciaVitoria = Number( $scope.infoJogo.sequenciaVitoria );
                    invencibilidade = Number( $scope.infoJogo.invencibilidade );
                    anteriorVitoria = $scope.infoJogo.vitoria;
                    anteriorDerrota = $scope.infoJogo.derrota;
                    anteriorEmpate = $scope.infoJogo.empate;
                    antGolsPro = Number( $scope.infoJogo.golsPro );
                    antGolsContra = Number( $scope.infoJogo.golsContra );
                    antPontos = $scope.infoJogo.pontos;
                }
                temporadaAtual = $scope.infoJogo.temporadaAtual;
                temporadaAtualVitoria = $scope.infoJogo.temporadaAtualVitoria;
                temporadaAtualEmpate = $scope.infoJogo.temporadaAtualEmpate;
                temporadaAtualDerrota = $scope.infoJogo.temporadaAtualDerrota;
                temporadaNova = temporadaAtual;
                //console.log("TEMPACTUAL---- "+temporadaNova);
            } );
            console.log( "conq " + conquistas );
            //Vitória armazenando as conquistas e os pontos dentro de arrayConquistas
            for ( var key in conquistas ) {
                //-------------------------------------------------------------------------- PORTUGUES
                if ( $scope.idioma == "pt" ) {
                    //vitoria
                    var vit = conquistas[ key ].vitoria.pt;
                    for ( var c in vit ) {
                        arrayConquistas.push( [ vit[ c ].titulo, vit[ c ].pontos ] );
                    }
                    //derrota
                    var der = conquistas[ key ].derrota.pt;
                    for ( var d in der ) {
                        arrayConquistasDerrota.push( [ der[ d ].titulo, der[ d ].pontos ] );
                    }
                    //empate
                    var emp = conquistas[ key ].empate.pt;
                    for ( var e in emp ) {
                        arrayConquistasEmpate.push( [ emp[ e ].titulo, emp[ e ].pontos ] );
                    }
                    //-------------------------------------------------------------------------- ESPAÑOL
                } else if ( $scope.idioma == "es" ) {
                    var vit = conquistas[ key ].vitoria.es;
                    for ( var c in vit ) {
                        arrayConquistas.push( [ vit[ c ].titulo, vit[ c ].pontos ] );
                    }
                    //derrota
                    var der = conquistas[ key ].derrota.es;
                    for ( var d in der ) {
                        arrayConquistasDerrota.push( [ der[ d ].titulo, der[ d ].pontos ] );
                    }
                    //empate
                    var emp = conquistas[ key ].empate.es;
                    for ( var e in emp ) {
                        arrayConquistasEmpate.push( [ emp[ e ].titulo, emp[ e ].pontos ] );
                    }
                    //-------------------------------------------------------------------------- INGLES
                } else {
                    var vit = conquistas[ key ].vitoria.en;
                    for ( var c in vit ) {
                        arrayConquistas.push( [ vit[ c ].titulo, vit[ c ].pontos ] );
                    }
                    //derrota
                    var der = conquistas[ key ].derrota.en;
                    for ( var d in der ) {
                        arrayConquistasDerrota.push( [ der[ d ].titulo, der[ d ].pontos ] );
                    }
                    //empate
                    var emp = conquistas[ key ].empate.en;
                    for ( var e in emp ) {
                        arrayConquistasEmpate.push( [ emp[ e ].titulo, emp[ e ].pontos ] );
                    }
                }
            }
            var refjogos = firebase.database().ref( 'desafio/desafios/temporadasChampions/oficial/' + idTorneio + '/inscritos/' + keyUsuario + '/jogos/' + $scope.chat );
            refjogos.once( "value" ).then( function( snapshot ) {
                $scope.estadoJogo = snapshot.val();
                $scope.estado = $scope.estadoJogo.estado;
                $scope.$apply( function() {
                    $scope.detalheJogo = snapshot.val();
                } );
            } );
            // si nao foi enviado
            if ( firebase.auth().currentUser ) {
                $scope.loggedIn = true;
                //console.log("logado");
            } else {
                $scope.loggedIn = false;
                var alertPopup = $ionicPopup.alert( {
                    title: 'Opps!',
                    template: 'Para enviar este resultado vc deve está logado.'
                } );
                alertPopup.then( function( res ) {
                    if ( res ) {}
                } );
            }
            /*
    var listauser = firebase.database().ref('fifadesafio/users');
      listauser.orderByChild('pontos').once("value").then(function(snapshot) {
        $scope.$apply(function(){
            snapshot.forEach(function(minisnapshot) {
                 $ionicLoading.hide().then(function(){
                    //console.log("Loading Hide");
                  });               

                 usuarios.push({
                  "gamertag":minisnapshot.val().gamertag, 
                  "ImagenGt":minisnapshot.val().imagenGt,
                  "idXbox":minisnapshot.val().idXbox

                })
            });
         });      
    });  
    */
            $scope.submit = function( resultado ) {
                if ( estatusDesafio != "Fechado" ) {
                    $scope.verButtonAdicionar = false;
                    $scope.verIonRadioJogos = true;
                    var resultadoLocal = resultado.local;
                    var resultadoVisitante = resultado.visitante;
                    if ( resultado.local == undefined ) {
                        resultadoLocal = 0;
                    }
                    if ( resultado.visitante == undefined ) {
                        resultadoVisitante = 0;
                    }
                    var r1 = String( resultado.local );
                    var r2 = String( resultado.visitante );
                    var splitRes1 = r1.split( "" );
                    var splitRes2 = r2.split( "" );
                    if ( splitRes1.length == 2 ) {
                        lentLocal = 2;
                    } else {
                        lentLocal == 1;
                    }
                    if ( splitRes2.length == 2 ) {
                        lenVisitante = 2;
                    } else {
                        lenVisitante == 1;
                    }
                    onlineManual = "Manual";
                    $scope.recuperarJogo( resultadoLocal, resultadoVisitante );
                    $scope.verPlacarFinal = false;
                } else {
                    var alertPopup = $ionicPopup.alert( {
                        title: 'Opps!',
                        template: '<p align="center"><i class="icon ion-alert-circled laranja tamanhoIcon"></i></p><p align="center"><strong>{{"DESAFIOTERMINADO" | translate}}</strong></p>',
                        buttons: [ {
                            text: '<b>Ok</b>',
                            type: 'button-balanced',
                            onTap: function( e ) {
                                var backCount = 1;
                                $rootScope.$ionicGoBack = function( backCount ) {
                                    $ionicHistory.goBack( backCount );
                                };
                                $rootScope.$ionicGoBack();
                            }
                        } ]
                    } );
                    alertPopup.then( function( res ) {
                        if ( res ) {
                            console.log( "fechado" );
                        }
                    } );
                }
            }
            $scope.identificarPlacar = function( dato ) {
                console.log( dato );
            }
            $scope.blisterPackTemplates = usuarios;
            $scope.changedValue = function( item ) {
                console.log( item.idXbox );
                //idUsuario = item.idXbox;
                //gamerSeleccionado = item.gamertag;
                $scope.btnDisabled = false;
            }
            $scope.jogoSelecionado = function( valor ) {
                $scope.selecionarImagen = true
                $scope.verButtonAdicionar = false;
                novaTemporadaAtualVitoria = 0;
                novaTemporadaAtualEmpate = 0;
                novaTemporadaAtualDerrota = 0;
                novosPontosVitoria = 0;
                novosPontosEmpate = 0;
                //$scope.verBtn = false;
                ganhador = valor;
                itemList = [];
                totalPontos = 0;
                //$scope.totalPontos = totalPontos;
                // ----------------------------------------------------------------------------------------------------- JOGO Local
                if ( ganhador == 'A' ) {
                    golsPro = Number( antGolsPro ) + Number( resultado1 );
                    golsContra = Number( antGolsContra ) + Number( resultado2 );
                    if ( resultado1 > resultado2 ) {
                        $scope.penaltisResultadoSeleccionado = true;
                        novosPontosVitoria = 3;
                        var resultadoFinal = "Vitoria";
                        $scope.placarFinal = "v";
                        seEmpate = 0;
                        seDerrota = 0;
                        seVitoria = 1;
                        listarConquistaVitoria( resultado1, resultado2 );
                        console.log( golsPro, golsContra );
                        placarInverso( resultado1, resultado2, "v" );
                        if ( atualizarNumerosTemporadas == true ) {
                            novaTemporadaAtualVitoria = 0;
                            novaTemporadaAtualEmpate = 0;
                            novaTemporadaAtualDerrota = 0;
                            console.log( "novaTemporadaAtualDerrota " + novaTemporadaAtualDerrota );
                        } else {
                            novaTemporadaAtualVitoria = temporadaAtualVitoria + 1;
                            novaTemporadaAtualDerrota = temporadaAtualDerrota;
                            novaTemporadaAtualEmpate = temporadaAtualEmpate;
                        }
                        $scope.totalPontos = totalPontos;
                    } else if ( resultado1 < resultado2 ) {
                        $scope.penaltisResultadoSeleccionado = true;
                        var resultadoFinal = "Derrota";
                        $scope.placarFinal = "d";
                        seEmpate = 0;
                        seDerrota = 1;
                        seVitoria = 0;
                        listaConquistasDerrota( resultado1, resultado2 );
                        placarInverso( resultado1, resultado2, "d" );
                        if ( atualizarNumerosTemporadas == true ) {
                            novaTemporadaAtualVitoria = 0;
                            novaTemporadaAtualEmpate = 0;
                            novaTemporadaAtualDerrota = 0;
                        } else {
                            novaTemporadaAtualVitoria = temporadaAtualVitoria;
                            novaTemporadaAtualDerrota = temporadaAtualDerrota + 1;
                            novaTemporadaAtualEmpate = temporadaAtualEmpate;
                        }
                    } else {
                        $scope.penaltisResultado = true;
                        novosPontosEmpate = 1;
                        var resultadoFinal = "Empate";
                        $scope.placarFinal = "e";
                        seEmpate = 1;
                        seDerrota = 0;
                        seVitoria = 0;
                        listaConquistasEmpate( resultado1, resultado2 );
                        if ( atualizarNumerosTemporadas == true ) {
                            novaTemporadaAtualVitoria = 0;
                            novaTemporadaAtualEmpate = 0;
                            novaTemporadaAtualDerrota = 0;
                        } else {
                            novaTemporadaAtualVitoria = temporadaAtualVitoria;
                            novaTemporadaAtualDerrota = temporadaAtualDerrota;
                            novaTemporadaAtualEmpate = temporadaAtualEmpate + 1;
                        }
                    }
                    // -----------------------------------------------------------------------------------------------------  Jogo Visitante 
                } else if ( ganhador == 'B' ) {
                    golsPro = Number( antGolsPro ) + Number( resultado2 );
                    golsContra = Number( antGolsContra ) + Number( resultado1 );
                    if ( resultado1 < resultado2 ) {
                        $scope.penaltisResultadoSeleccionado = true;
                        novosPontosVitoria = 3;
                        var resultadoFinal = "Vitoria";
                        $scope.placarFinal = "v";
                        seEmpate = 0;
                        seDerrota = 0;
                        seVitoria = 1;
                        listarConquistaVitoria( resultado2, resultado1 );
                        placarInverso( resultado2, resultado1, "v" );
                        if ( atualizarNumerosTemporadas == true ) {
                            novaTemporadaAtualVitoria = 0;
                            novaTemporadaAtualEmpate = 0;
                            novaTemporadaAtualDerrota = 0;
                        } else {
                            novaTemporadaAtualVitoria = temporadaAtualVitoria + 1;
                            novaTemporadaAtualDerrota = temporadaAtualDerrota;
                            novaTemporadaAtualEmpate = temporadaAtualEmpate;
                        }
                    } else if ( resultado1 > resultado2 ) {
                        $scope.penaltisResultadoSeleccionado = true;
                        var resultadoFinal = "Derrota";
                        $scope.placarFinal = "d";
                        seEmpate = 0;
                        seDerrota = 1;
                        seVitoria = 0;
                        listaConquistasDerrota( resultado2, resultado1 );
                        placarInverso( resultado2, resultado1, "d" );
                        if ( atualizarNumerosTemporadas == true ) {
                            novaTemporadaAtualVitoria = 0;
                            novaTemporadaAtualEmpate = 0;
                            novaTemporadaAtualDerrota = 0;
                        } else {
                            novaTemporadaAtualVitoria = temporadaAtualVitoria;
                            novaTemporadaAtualDerrota = temporadaAtualDerrota + 1;
                            novaTemporadaAtualEmpate = temporadaAtualEmpate;
                        }
                    } else {
                        $scope.penaltisResultado = true;
                        novosPontosEmpate = 1;
                        var resultadoFinal = "Empate";
                        $scope.placarFinal = "e";
                        seEmpate = 1;
                        seDerrota = 0;
                        seVitoria = 0;
                        listaConquistasEmpate( resultado2, resultado1 );
                        if ( atualizarNumerosTemporadas == true ) {
                            novaTemporadaAtualVitoria = 0;
                            novaTemporadaAtualEmpate = 0;
                            novaTemporadaAtualDerrota = 0;
                        } else {
                            novaTemporadaAtualVitoria = temporadaAtualVitoria;
                            novaTemporadaAtualDerrota = temporadaAtualDerrota;
                            novaTemporadaAtualEmpate = temporadaAtualEmpate + 1;
                        }
                    }
                }
                $scope.items = itemList;
                $scope.verPlacarFinal = true;
                $scope.totalPontos = totalPontos;
                console.log( "totalPontos", $scope.totalPontos, "Update", atualizarNumerosTemporadas, "tempAtual", temporadaNova, "TV", novaTemporadaAtualVitoria, "TE", novaTemporadaAtualEmpate, "TD", novaTemporadaAtualDerrota );
            }
            $scope.showSelectValue = function( mySelect ) {
                $scope.penaltisResultadoSeleccionado = true;
                console.log( mySelect, arrayConquistasEmpate );
                var item = itemList[ itemList.length - 1 ][ 0 ];
                if ( item == arrayConquistasEmpate[ 10 ][ 0 ] ) {
                    removeInput( itemList, itemList.indexOf( item ) );
                    totalPontos = totalPontos - arrayConquistasEmpate[ 10 ][ 1 ];
                    addEmpVitChampions( mySelect );
                    $scope.totalPontos = totalPontos;
                } else if ( item == arrayConquistasEmpate[ 11 ][ 0 ] ) {
                    removeInput( itemList, itemList.indexOf( item ) );
                    totalPontos = totalPontos - arrayConquistasEmpate[ 11 ][ 1 ]
                    addEmpVitChampions( mySelect );
                    $scope.totalPontos = totalPontos;
                } else {
                    addEmpVitChampions( mySelect );
                    $scope.totalPontos = totalPontos;
                }
            }

            function addEmpVitChampions( bool ) {
                if ( bool == "true" ) {
                    itemList.push( [ arrayConquistasEmpate[ 10 ][ 0 ], arrayConquistasEmpate[ 10 ][ 1 ] ] );
                    totalPontos = totalPontos + arrayConquistasEmpate[ 10 ][ 1 ];
                    console.log( "1", bool, itemList );
                } else {
                    itemList.push( [ arrayConquistasEmpate[ 11 ][ 0 ], arrayConquistasEmpate[ 11 ][ 1 ] ] );
                    totalPontos = totalPontos + arrayConquistasEmpate[ 11 ][ 1 ];
                    console.log( "2", bool, itemList );
                }
            }

            function removeInput( arr, index ) {
                arr.splice( index, 1 );
            }
            $( document ).on( 'change', '#file', function( event ) {
                imageSelecionada = event.target.files[ 0 ];
                $scope.$apply( function() {
                    $scope.verEnviar = true;
                } );
                console.log( "mudado" );
            } );
            $scope.upoadFile = function() {
                $ionicLoading.show( {
                    template: 'Enviando Foto 1...'
                } ).then( function() {
                    //console.log("Enviando Foto 1");
                } );
                var filename = imageSelecionada.name;
                var storageRef = firebase.storage().ref( '/desafio/temporadasChampions/imagensJogos/' + idTorneio + '/' + filename );
                var uploadTask = storageRef.put( imageSelecionada );
                uploadTask.on( 'state_changed', function( snapshot ) {
                    var progress = ( snapshot.bytesTransferred / snapshot.totalBytes ) * 100;
                    //console.log(progress);
                    if ( progress === 100 ) {
                        //console.log("Primeira imagen enviada com sucesso "+ imageSelecionada2);
                        $ionicLoading.hide().then( function() {
                            //console.log("Foto 1 enviada");
                        } );
                    }
                }, function( error ) {
                    // Handle unsuccessful uploads
                }, function() {
                    var downloadURL = uploadTask.snapshot.downloadURL;
                    //console.log(downloadURL);
                    $ionicLoading.show( {
                        template: 'Update data...'
                    } ).then( function() {
                        //console.log("Actualizando Datos Foto 1");
                    } );
                    firebase.database().ref().child( 'desafio/desafios/temporadasChampions/oficial/' + idTorneio + '/inscritos/' + keyUsuario + '/jogos/' + $scope.chat ).update( {
                        img: downloadURL
                    } ).then( function( response ) {
                        $ionicLoading.hide().then( function() {} );
                        $scope.enviarResultado();
                    } );
                } );
            } // upload
            function listarConquistaVitoria( res1, res2 ) {
                //console.log("atual: "+temporadaNova);
                $scope.totalPontos = 0;
                //vitoria
                var subtrairResultado = res1 - res2;
                var formatVitoria = 0;
                formatVitoria = res1 + "-" + res2;
                //if(juego == 'A'){
                //--Vitória
                itemList.push( [ arrayConquistas[ 0 ][ 0 ], arrayConquistas[ 0 ][ 1 ] ] );
                totalPontos = totalPontos + arrayConquistas[ 0 ][ 1 ];
                // si o oponente nao fez gol
                if ( res2 == 0 ) {
                    //--Vitoria sem sofrer gols            
                    if ( res1 == 1 ) {
                        itemList.push( [ arrayConquistas[ 1 ][ 0 ], arrayConquistas[ 1 ][ 1 ] ] );
                        totalPontos = totalPontos + arrayConquistas[ 1 ][ 1 ];
                    } else if ( res1 == 2 ) {
                        //--Vitoria 2 a 0
                        itemList.push( [ arrayConquistas[ 2 ][ 0 ], arrayConquistas[ 2 ][ 1 ] ] );
                        totalPontos = totalPontos + arrayConquistas[ 2 ][ 1 ];
                    } else if ( res1 == 3 ) {
                        //--Vitoria 3 a 0
                        itemList.push( [ arrayConquistas[ 3 ][ 0 ], arrayConquistas[ 3 ][ 1 ] ] );
                        totalPontos = totalPontos + arrayConquistas[ 3 ][ 1 ];
                    } else if ( res1 == 4 ) {
                        //--Vitoria 4 a 0
                        itemList.push( [ arrayConquistas[ 4 ][ 0 ], arrayConquistas[ 4 ][ 1 ] ] );
                        totalPontos = totalPontos + arrayConquistas[ 4 ][ 1 ];
                    } else if ( res1 == 5 ) {
                        //--Vitoria 5 a 0
                        itemList.push( [ arrayConquistas[ 5 ][ 0 ], arrayConquistas[ 5 ][ 1 ] ] );
                        totalPontos = totalPontos + arrayConquistas[ 5 ][ 1 ];
                    } else {
                        //--Vitoria 6 a 0 ou +
                        itemList.push( [ arrayConquistas[ 6 ][ 0 ], arrayConquistas[ 6 ][ 1 ] ] );
                        totalPontos = totalPontos + arrayConquistas[ 6 ][ 1 ];
                    }
                } else {
                    if ( res1 == 7 && res2 == 1 ) {
                        //--Vitoria 7 a 1
                        itemList.push( [ arrayConquistas[ 7 ][ 0 ], arrayConquistas[ 7 ][ 1 ] ] );
                        totalPontos = totalPontos + arrayConquistas[ 7 ][ 1 ];
                    }
                    // vitoria con diferenca de 2, 3, 4, 5 ou mais gols
                    if ( res1 - res2 == 2 ) {
                        itemList.push( [ arrayConquistas[ 8 ][ 0 ], arrayConquistas[ 8 ][ 1 ] ] );
                        totalPontos = totalPontos + arrayConquistas[ 8 ][ 1 ];
                    } else if ( res1 - res2 == 3 ) {
                        itemList.push( [ arrayConquistas[ 9 ][ 0 ], arrayConquistas[ 9 ][ 1 ] ] );
                        totalPontos = totalPontos + arrayConquistas[ 9 ][ 1 ];
                    } else if ( res1 - res2 == 4 ) {
                        itemList.push( [ arrayConquistas[ 10 ][ 0 ], arrayConquistas[ 10 ][ 1 ] ] );
                        totalPontos = totalPontos + arrayConquistas[ 10 ][ 1 ];
                    } else if ( res1 - res2 == 5 ) {
                        itemList.push( [ arrayConquistas[ 11 ][ 0 ], arrayConquistas[ 11 ][ 1 ] ] );
                        totalPontos = totalPontos + arrayConquistas[ 11 ][ 1 ];
                    } else if ( subtrairResultado > 6 || subtrairResultado == 6 ) {
                        //console.log(" subtrairResultado: "+subtrairResultado);
                        if ( res1 != 7 ) {
                            console.log( " subtrairResultado2: " + subtrairResultado );
                            itemList.push( [ arrayConquistas[ 12 ][ 0 ], arrayConquistas[ 12 ][ 1 ] ] );
                            totalPontos = totalPontos + arrayConquistas[ 12 ][ 1 ];
                            console.log( "Pontos 12 ", arrayConquistas[ 12 ][ 0 ], arrayConquistas[ 12 ][ 1 ] );
                        }
                    } else {}
                }
                // Doble, triple, cuáduple vitoria
                if ( statusUltimo != 0 ) {
                    var somarIguais = 0;
                    if ( statusUltimo == "v" ) {
                        if ( placarUltimo == formatVitoria ) {
                            somarIguais = 1;
                        }
                        if ( statusPenultimo == "v" && somarIguais == 1 ) {
                            if ( placarUltimo == formatVitoria && placarPenultimo == formatVitoria ) {
                                somarIguais = 2;
                            }
                        }
                        if ( statusAntepenultimo == "v" && somarIguais == 2 ) {
                            //console.log("entrou em v y 2", formatVitoria, placarAntepenultimo);
                            if ( placarUltimo == formatVitoria && placarPenultimo == formatVitoria && placarAntepenultimo == formatVitoria ) {
                                somarIguais = 3;
                            }
                        }
                        switch ( somarIguais ) {
                            case 1:
                                itemList.push( [ arrayConquistas[ 13 ][ 0 ], arrayConquistas[ 13 ][ 1 ] ] );
                                totalPontos = totalPontos + arrayConquistas[ 13 ][ 1 ];
                                break;
                            case 2:
                                itemList.push( [ arrayConquistas[ 14 ][ 0 ], arrayConquistas[ 14 ][ 1 ] ] );
                                totalPontos = totalPontos + arrayConquistas[ 14 ][ 1 ];
                                //console.log("mmm1 "+arrayConquistas[14][0], "antepenultimo:", placarAntepenultimo, "atual: ", formatVitoria);
                                break;
                            case 3:
                                itemList.push( [ arrayConquistas[ 15 ][ 0 ], arrayConquistas[ 15 ][ 1 ] ] );
                                totalPontos = totalPontos + arrayConquistas[ 15 ][ 1 ];
                                //console.log("mmm2 "+arrayConquistas[15][0]);
                                break;
                            default:
                                console.log( "nao há repetidos" );
                        }
                    }
                }
                // Sequencia de vitoria
                if ( sequenciaVitoria > 1 ) {
                    var sequencia = sequenciaVitoria + 1;
                    if ( sequencia == 3 ) {
                        itemList.push( [ arrayConquistas[ 16 ][ 0 ], arrayConquistas[ 16 ][ 1 ] ] );
                        totalPontos = totalPontos + arrayConquistas[ 16 ][ 1 ];
                    } else if ( sequencia == 4 ) {
                        itemList.push( [ arrayConquistas[ 17 ][ 0 ], arrayConquistas[ 17 ][ 1 ] ] );
                        totalPontos = totalPontos + arrayConquistas[ 17 ][ 1 ];
                    } else if ( sequencia == 5 ) {
                        itemList.push( [ arrayConquistas[ 18 ][ 0 ], arrayConquistas[ 18 ][ 1 ] ] );
                        totalPontos = totalPontos + arrayConquistas[ 18 ][ 1 ];
                    } else if ( sequencia == 6 ) {
                        itemList.push( [ arrayConquistas[ 19 ][ 0 ], arrayConquistas[ 19 ][ 1 ] ] );
                        totalPontos = totalPontos + arrayConquistas[ 19 ][ 1 ];
                    } else {
                        itemList.push( [ arrayConquistas[ 20 ][ 0 ], arrayConquistas[ 20 ][ 1 ] ] );
                        totalPontos = totalPontos + arrayConquistas[ 20 ][ 1 ];
                    }
                }
                //Invencibilidad
                if ( invencibilidade > 1 ) {
                    var sequencia = invencibilidade + 1;
                    if ( sequencia == 3 ) {
                        itemList.push( [ arrayConquistas[ 21 ][ 0 ], arrayConquistas[ 21 ][ 1 ] ] );
                        totalPontos = totalPontos + arrayConquistas[ 21 ][ 1 ];
                    } else if ( sequencia == 4 ) {
                        itemList.push( [ arrayConquistas[ 22 ][ 0 ], arrayConquistas[ 22 ][ 1 ] ] );
                        totalPontos = totalPontos + arrayConquistas[ 22 ][ 1 ];
                    } else if ( sequencia == 5 ) {
                        itemList.push( [ arrayConquistas[ 23 ][ 0 ], arrayConquistas[ 23 ][ 1 ] ] );
                        totalPontos = totalPontos + arrayConquistas[ 23 ][ 1 ];
                    } else if ( sequencia == 6 ) {
                        itemList.push( [ arrayConquistas[ 24 ][ 0 ], arrayConquistas[ 24 ][ 1 ] ] );
                        totalPontos = totalPontos + arrayConquistas[ 24 ][ 1 ];
                    } else {
                        itemList.push( [ arrayConquistas[ 25 ][ 0 ], arrayConquistas[ 25 ][ 1 ] ] );
                        totalPontos = totalPontos + arrayConquistas[ 25 ][ 1 ];
                    }
                }
            }

            function listaConquistasEmpate( res1, res2 ) {
                //console.log("Empate "+res1, res2);
                if ( res1 == 1 || res1 == 0 ) {
                    itemList.push( [ arrayConquistasEmpate[ 0 ][ 0 ], arrayConquistasEmpate[ 0 ][ 1 ] ] );
                    totalPontos = totalPontos + arrayConquistasEmpate[ 0 ][ 1 ];
                } else if ( res1 == 2 ) {
                    itemList.push( [ arrayConquistasEmpate[ 0 ][ 0 ], arrayConquistasEmpate[ 0 ][ 1 ] ] );
                    totalPontos = totalPontos + arrayConquistasEmpate[ 0 ][ 1 ];
                } else if ( res1 == 3 ) {
                    itemList.push( [ arrayConquistasEmpate[ 1 ][ 0 ], arrayConquistasEmpate[ 1 ][ 1 ] ] );
                    totalPontos = totalPontos + arrayConquistasEmpate[ 1 ][ 1 ];
                } else if ( res1 == 4 ) {
                    itemList.push( [ arrayConquistasEmpate[ 2 ][ 0 ], arrayConquistasEmpate[ 2 ][ 1 ] ] );
                    totalPontos = totalPontos + arrayConquistasEmpate[ 2 ][ 1 ];
                } else {
                    itemList.push( [ arrayConquistasEmpate[ 3 ][ 0 ], arrayConquistasEmpate[ 3 ][ 1 ] ] );
                    totalPontos = totalPontos + arrayConquistasEmpate[ 3 ][ 1 ];
                }
                //Invencibilidad
                if ( invencibilidade > 1 ) {
                    var sequencia = invencibilidade + 1;
                    if ( sequencia == 3 ) {
                        itemList.push( [ arrayConquistas[ 21 ][ 0 ], arrayConquistas[ 21 ][ 1 ] ] );
                        totalPontos = totalPontos + arrayConquistas[ 21 ][ 1 ];
                    } else if ( sequencia == 4 ) {
                        itemList.push( [ arrayConquistas[ 22 ][ 0 ], arrayConquistas[ 22 ][ 1 ] ] );
                        totalPontos = totalPontos + arrayConquistas[ 22 ][ 1 ];
                    } else if ( sequencia == 5 ) {
                        itemList.push( [ arrayConquistas[ 23 ][ 0 ], arrayConquistas[ 23 ][ 1 ] ] );
                        totalPontos = totalPontos + arrayConquistas[ 23 ][ 1 ];
                    } else if ( sequencia == 6 ) {
                        itemList.push( [ arrayConquistas[ 24 ][ 0 ], arrayConquistas[ 24 ][ 1 ] ] );
                        totalPontos = totalPontos + arrayConquistas[ 24 ][ 1 ];
                    } else {
                        itemList.push( [ arrayConquistas[ 25 ][ 0 ], arrayConquistas[ 25 ][ 1 ] ] );
                        totalPontos = totalPontos + arrayConquistas[ 25 ][ 1 ];
                    }
                }
                var pontosGols = Number( res1 ) * 25;
                if ( res1 > 0 ) {
                    itemList.push( [ arrayConquistasDerrota[ 4 ][ 0 ], arrayConquistasDerrota[ 4 ][ 1 ] ] );
                    totalPontos = totalPontos + pontosGols;
                }
            }

            function listaConquistasDerrota( res1, res2 ) {
                var diferencaDerrota = res2 - res1;
                var pontosGols = Number( res1 ) * 25;
                if ( diferencaDerrota == 1 ) {
                    if ( res1 == 0 || res1 == 1 ) {
                        itemList.push( [ "Derrota", 0 ] );
                    } else if ( res1 == 2 ) {
                        itemList.push( [ arrayConquistasDerrota[ 0 ][ 0 ], arrayConquistasDerrota[ 0 ][ 1 ] ] );
                        totalPontos = totalPontos + arrayConquistasDerrota[ 0 ][ 1 ];
                    } else if ( res1 == 3 ) {
                        itemList.push( [ arrayConquistasDerrota[ 1 ][ 0 ], arrayConquistasDerrota[ 1 ][ 1 ] ] );
                        totalPontos = totalPontos + arrayConquistasDerrota[ 1 ][ 1 ];
                    } else {
                        itemList.push( [ arrayConquistasDerrota[ 2 ][ 0 ], arrayConquistasDerrota[ 2 ][ 1 ] ] );
                        totalPontos = totalPontos + arrayConquistasDerrota[ 2 ][ 1 ];
                    }
                } else {
                    itemList.push( [ "Derrota", 0 ] );
                }
                if ( res1 > 0 ) {
                    itemList.push( [ arrayConquistasDerrota[ 4 ][ 0 ], arrayConquistasDerrota[ 4 ][ 1 ] ] );
                    totalPontos = totalPontos + pontosGols;
                }
            }
            // ponto placar inverso Vitória ou derrota
            function placarInverso( res1, res2, reslActual ) {
                var placaArray = placarUltimo.split( "" );
                //console.log("leng arrayUltimo ", placaArray.length);
                if ( placaArray.length == 3 ) {
                    for ( var i = 0; i < placaArray.length; i++ ) {
                        if ( statusUltimo == "d" && reslActual == "v" ) {
                            if ( placaArray[ 0 ] == res1 && placaArray[ 2 ] == res2 ) {
                                itemList.push( [ arrayConquistas[ 26 ][ 0 ], arrayConquistas[ 26 ][ 1 ] ] );
                                totalPontos = totalPontos + arrayConquistas[ 26 ][ 1 ];
                                break;
                            }
                        }
                        if ( statusUltimo == "v" && reslActual == "d" ) {
                            if ( placaArray[ 0 ] == res2 && placaArray[ 2 ] == res1 ) {
                                itemList.push( [ arrayConquistasDerrota[ 3 ][ 0 ], arrayConquistasDerrota[ 3 ][ 1 ] ] );
                                totalPontos = totalPontos + arrayConquistasDerrota[ 3 ][ 1 ];
                                break;
                            }
                        }
                    }
                } else if ( placaArray == 4 ) {
                    for ( var i = 0; i < placaArray.length; i++ ) {
                        if ( statusUltimo == "d" && reslActual == "v" ) {
                            var valor = parseInt( placaArray[ 0 ] + placaArray[ 1 ] );
                            //console.log("inverso V4", valor, res1);
                            if ( valor == res1 && placaArray[ 3 ] == res2 ) {
                                itemList.push( [ arrayConquistas[ 26 ][ 0 ], arrayConquistas[ 26 ][ 1 ] ] );
                                totalPontos = totalPontos + arrayConquistas[ 26 ][ 1 ];
                                break;
                            }
                        }
                        if ( statusUltimo == "v" && reslActual == "d" ) {
                            var valor = parseInt( placaArray[ 0 ] + placaArray[ 1 ] );
                            //console.log("inverso D4 ", valor, res1);
                            if ( valor == res1 && placaArray[ 3 ] == res2 ) {
                                itemList.push( [ arrayConquistasDerrota[ 3 ][ 0 ], arrayConquistasDerrota[ 3 ][ 1 ] ] );
                                totalPontos = totalPontos + arrayConquistasDerrota[ 3 ][ 1 ];
                                break;
                            }
                        }
                    }
                } else {
                    for ( var i = 0; i < placaArray.length; i++ ) {
                        if ( statusUltimo == "d" && reslActual == "v" ) {
                            var valor1 = parseInt( placaArray[ 0 ] + placaArray[ 1 ] );
                            var valor2 = parseInt( placaArray[ 3 ] + placaArray[ 4 ] );
                            //console.log("inverso V5", valor1, res1,  "   ", valor2, res2);
                            if ( valor1 == res1 && valor2 == res2 ) {
                                itemList.push( [ arrayConquistas[ 26 ][ 0 ], arrayConquistas[ 26 ][ 1 ] ] );
                                totalPontos = totalPontos + arrayConquistas[ 26 ][ 1 ];
                                break;
                            }
                        }
                        if ( statusUltimo == "v" && reslActual == "d" ) {
                            var valor1 = parseInt( placaArray[ 0 ] + placaArray[ 1 ] );
                            var valor2 = parseInt( placaArray[ 3 ] + placaArray[ 4 ] );
                            //console.log("inverso D5 ", valor1, res1,  "   ", valor2, res2);
                            if ( valor1 == res2 && valor2 == res1 ) {
                                itemList.push( [ arrayConquistasDerrota[ 3 ][ 0 ], arrayConquistasDerrota[ 3 ][ 1 ] ] );
                                totalPontos = totalPontos + arrayConquistasDerrota[ 3 ][ 1 ];
                                break;
                            }
                        }
                    }
                }
            }
            // -----------------------------------------------------------------  Recuperar Resultado
            $scope.recuperarJogo = function( res1, res2 ) {
                $ionicLoading.show().then( function() {} );
                $scope.placar = "";
                $scope.semFifa = "";
                $scope.respuesta = "";
                var richPresence = false;
                var resultadoFifa = "";
                $scope.placar = "";
                console.log( "OnlineManual Cambio", onlineManual );
                //_________________________________________________________Si busca Online
                if ( onlineManual === "Online" ) {
                    $timeout( function() {
                        $ionicLoading.hide();
                    }, 20000 );
                    var urlOnline = 'https://xboxapi.com/v2/' + idUsuario + '/presence';
                    console.log( "urlOnline", urlOnline );
                    $http( {
                        url: urlOnline,
                        //url: 'https://xboxapi.com/v2/2535419577962363/presence', //Menino
                        //url: urlLocal,
                        //url: 'https://xboxapi.com/v2/2533274961032793/presence', fah cesar 
                        //url: 'https://xboxapi.com/v2/2533275001163369/presence',
                        //BenbaodanJr
                        //url:'https://xboxapi.com/v2/2535428583930750/presence', 
                        method: 'GET',
                        headers: {
                            'Access-Control-Allow-Origin': '*',
                            'X-AUTH': '5056c2081205740a2d765ebe3ff5807dd4178a87', //BenbaodanJr
                            'Accept-Language': 'en-US',
                            'Content-Type': 'application/json, text/plain, */*'
                        }
                    } ).then( function( resp ) {
                        $scope.respuesta = resp.data;
                        console.log( "0 RichPresence: " + richPresence, $scope.respuesta );
                        //var totalOnline = resp.data.devices[0].titles.length;
                        if ( resp.data.state === "Online" ) {
                            if ( resp.data.devices[ 0 ].titles.length == 1 ) {
                                $scope.semFifa = "Please goto Fifa 1.";
                                richPresence = false;
                            } else if ( resp.data.devices[ 0 ].titles.length == 2 ) {
                                console.log( "Title length 2 " + resp.data.devices[ 0 ].titles.length );
                                if ( resp.data.devices[ 0 ].titles[ 1 ].id === 69094388 ) {
                                    //atribuirValores(resultadoFifa);
                                    $scope.lista = false;
                                    $scope.verButtonAdicionar = false;
                                    $scope.verIonRadioJogos = true;
                                    $ionicLoading.hide();
                                    richPresence = resp.data.devices[ 0 ].titles[ 1 ].activity.richPresence;
                                    $scope.status = true;
                                    $scope.semFifa = "Status: " + richPresence;
                                } else {
                                    $scope.semFifa = "Status: " + richPresence;
                                    $ionicLoading.hide();
                                    var alertPopup = $ionicPopup.alert( {
                                        title: 'Opps!',
                                        template: "<p align='center'><strong>" + gamerSeleccionado + "</strong> {{'NAOFIFA' | translate}}</p>"
                                    } );
                                    alertPopup.then( function( res ) {
                                        console.log( 'cerrar' );
                                        richPresence = false;
                                        $scope.status = false;
                                    } );
                                }
                            } else {
                                if ( resp.data.devices[ 0 ].titles[ 1 ].id === 69094388 ) {
                                    $scope.lista = false;
                                    $scope.verButtonAdicionar = false;
                                    $scope.verIonRadioJogos = true;
                                    $ionicLoading.hide();
                                    console.log( "Title length 3 " + resp.data.devices[ 0 ].titles.length );
                                    richPresence = resp.data.devices[ 0 ].titles[ 1 ].activity.richPresence;
                                    console.log( "1 richPresence", richPresence );
                                } else {
                                    $scope.timeCasa = false;
                                    $scope.semFifa = "Status: " + richPresence;
                                    console.log( "2 richPresence", richPresence );
                                    richPresence = false;
                                    console.log( "Please goto Fifa 2." );
                                    var alertPopup = $ionicPopup.alert( {
                                        title: 'Opps!',
                                        template: "<p align='center'><strong>" + gamerSeleccionado + "</strong>  {{'NAOFIFA' | translate}}</p>"
                                    } );
                                    alertPopup.then( function( res ) {
                                        console.log( 'cerrar' );
                                        richPresence = false;
                                        $scope.status = false;
                                    } );
                                }
                            }
                            if ( richPresence != false ) {
                                if ( encontrarMenu( richPresence ) == false ) {
                                    $scope.semFifa = "Status: " + richPresence;
                                    var idFifa = 69094388;
                                    $scope.lista = true;
                                    $scope.status = false;
                                    resultadoFifa = richPresence;
                                    atribuirValores( resultadoFifa );
                                } else {
                                    $ionicLoading.hide();
                                    var alertPopup = $ionicPopup.alert( {
                                        title: 'Opps!',
                                        template: "<p align='center' class='vermelho padding'>{{'RECUPERARCOMMENU' | translate}}</p>"
                                    } );
                                    alertPopup.then( function( res ) {
                                        console.log( 'cerrar' );
                                    } );
                                    $scope.status = false;
                                    $scope.timeCasa = false;
                                    richPresence = false;
                                    $scope.status = false;
                                    $scope.btnDisabled = false;
                                    $scope.verButtonAdicionar = true;
                                }
                                console.log( "3 richPresence", richPresence );
                            }
                        } else {
                            console.log( "Off" );
                            $ionicLoading.hide();
                            var alertPopup = $ionicPopup.alert( {
                                title: 'Opps!',
                                template: "<p align='center'><strong>" + gamerSeleccionado + "</strong> {{'ESTAOFF' | translate}}</p><br><p align='center' class='vermelho padding'>{{'OJOGORECUPERADO' | translate}}</p>"
                            } );
                            alertPopup.then( function( res ) {
                                console.log( 'cerrar' );
                            } );
                        }
                    } );
                    //_________________________________________________________si buscar Offline 
                } else {
                    $ionicLoading.hide();
                    var resultadoFifa2 = "Jugando FIFA 17 FUT Draft Online " + res1 + "-" + res2 + " MAN - VIS, 2.\u00ba t.";
                    console.log( "Resultado Fifa", resultadoFifa2 );
                    var idFifa = 69094388;
                    $scope.lista = true;
                    $scope.status = true;
                    atribuirValores( resultadoFifa2 );
                }

                function encontrarMenu( richPresence ) {
                    var verificarMenu = encontrarPalabra( richPresence, "Menus" );
                    if ( verificarMenu == false ) {
                        return false;
                    } else {
                        return true;
                    }
                }

                function encontrarPalabra( texto, palabra ) {
                    var dato = String( texto );
                    var n = dato.indexOf( palabra );
                    if ( n > -1 ) {
                        return true;
                    } else {
                        return false;
                    }
                }

                function atribuirValores( resultadoRecuperado ) {
                    var separador = ","; // un espacio en blanco
                    var limite = 1;
                    //var resposta = resultado.split(separador);
                    //console.log(resposta[27], resposta[29]) ;
                    var ini;
                    var fin;
                    var r1DosNumeros;
                    var r2DosNumeros;
                    //console.log(lentLocal, lenVisitante, "ññññññ", lentLocal, lenVisitante);
                    if ( lentLocal < 2 && lenVisitante < 2 ) {
                        r1DosNumeros = false;
                        r2DosNumeros = false;
                        ini = parseInt( resultadoRecuperado.indexOf( "-" ) ) - 1;
                        fin = parseInt( resultadoRecuperado.indexOf( "-" ) ) + 1;
                    } else if ( lentLocal == 2 && lenVisitante < 2 ) {
                        r1DosNumeros = true;
                        r2DosNumeros = false;
                        ini = parseInt( resultadoRecuperado.indexOf( "-" ) ) - 2;
                        fin = parseInt( resultadoRecuperado.indexOf( "-" ) ) + 1;
                    } else if ( lentLocal < 2 && lenVisitante == 2 ) {
                        r1DosNumeros = false;
                        r2DosNumeros = true;
                        ini = parseInt( resultadoRecuperado.indexOf( "-" ) ) - 1;
                        fin = parseInt( resultadoRecuperado.indexOf( "-" ) ) + 1;
                    } else if ( lentLocal == 2 && lenVisitante == 2 ) {
                        r1DosNumeros = true;
                        r2DosNumeros = true;
                        ini = parseInt( resultadoFifa.indexOf( "-" ) ) - 2;
                        fin = parseInt( resultadoFifa.indexOf( "-" ) ) + 1;
                    }
                    var parcial = resultadoRecuperado.substr( ini, fin );
                    var final = parcial.split( separador );
                    console.log( "final", final );
                    var corta = parcial.indexOf( " " );
                    var placar = parcial.substr( 0, corta );
                    var arrayResultado = placar.split( "" );
                    var recortarTime = String( final.slice( 0, -1 ) );
                    var sep = "";
                    var array = "";
                    array = recortarTime.split( sep );
                    // recuperar nome do time1 e time2 e resultados, si os resultado1 é de 1 dígito
                    if ( r1DosNumeros == false && r2DosNumeros == false ) {
                        if ( array[ 6 ] == undefined ) {
                            time1 = array[ 4 ] + array[ 5 ]
                        } else {
                            time1 = array[ 4 ] + array[ 5 ] + array[ 6 ];
                        }
                        if ( array[ 12 ] == undefined ) {
                            time2 = array[ 10 ] + array[ 11 ];
                        } else {
                            time2 = array[ 10 ] + array[ 11 ] + array[ 12 ];
                        }
                        //resultados
                        resultado1 = array[ 0 ]
                        resultado2 = array[ 2 ];
                    }
                    // recuperar nome do time1 e time2 e resultados,dependendo si o resultado1 é de 1 ou 2 dígitos e o 2 é de 1 dígitos
                    if ( r1DosNumeros == true && r2DosNumeros == false ) {
                        if ( array[ 7 ] == undefined ) {
                            time1 = array[ 5 ] + array[ 6 ]
                        } else {
                            time1 = array[ 5 ] + array[ 6 ] + array[ 7 ];
                        }
                        if ( array[ 13 ] == undefined ) {
                            time2 = array[ 11 ] + array[ 12 ];
                        } else {
                            time2 = array[ 11 ] + array[ 12 ] + array[ 13 ];
                        }
                        //resultados
                        resultado1 = array[ 0 ] + array[ 1 ];
                        resultado2 = array[ 3 ];
                    }
                    // recuperar nome do time1 e time2 e resultados,dependendo si o resultado2 é de 1 ou 2 dígitos e o 1 é de 1 dígitos
                    if ( r1DosNumeros == false && r2DosNumeros == true ) {
                        if ( array[ 7 ] == undefined ) {
                            time1 = array[ 5 ] + array[ 6 ]
                        } else {
                            time1 = array[ 5 ] + array[ 6 ] + array[ 7 ];
                        }
                        if ( array[ 13 ] == undefined ) {
                            time2 = array[ 11 ] + array[ 12 ];
                        } else {
                            time2 = array[ 11 ] + array[ 12 ] + array[ 13 ];
                        }
                        resultado1 = array[ 0 ];
                        resultado2 = array[ 2 ] + array[ 3 ];
                    }
                    // recuperar nome do time1 e time2 e resultados,si os resultados sao de 2 dígitos
                    if ( r1DosNumeros == true && r2DosNumeros == true ) {
                        if ( array[ 8 ] == undefined ) {
                            time1 = array[ 7 ] + array[ 6 ]
                        } else {
                            time1 = array[ 6 ] + array[ 7 ] + array[ 8 ];
                        }
                        if ( array[ 14 ] == undefined ) {
                            time2 = array[ 12 ] + array[ 13 ];
                        } else {
                            time2 = array[ 12 ] + array[ 13 ] + array[ 14 ];
                        }
                        resultado1 = array[ 0 ] + array[ 1 ];
                        resultado2 = array[ 3 ] + array[ 4 ];
                    }
                    if ( resultado1 != undefined ) {
                        $scope.placar = time1 + " " + resultado1 + " X " + resultado2 + " " + time2;
                        $scope.casa = time1 + " " + resultado1;
                        $scope.fora = time2 + " " + resultado2;
                        $scope.timeCasa = time1;
                        $scope.timeVisitante = time2;
                        $scope.resCasa = resultado1;
                        $scope.resVisitante = resultado2;
                    } else {
                        $scope.placar = "Vc está no Menú";
                    }
                }
            } // function
            // Enviar resposta
            $scope.enviarResultado = function() {
                Utils.show();
                var ref = firebase.database().ref( 'desafio/desafios/temporadasChampions/oficial/' + idTorneio + '/configuracao' );
                ref.once( "value" ).then( function( snapshot ) {
                    estatusDesafio = snapshot.val().estatus;
                    if ( estatusDesafio == "Fechado" ) {
                        var alertPopup = $ionicPopup.alert( {
                            title: 'Opps!',
                            template: '<p align="center"><i class="icon ion-alert-circled laranja tamanhoIcon"></i></p><p align="center"><strong>{{"DESAFIOTERMINADO" | translate}}</strong></p>',
                            buttons: [ {
                                text: '<b>Ok</b>',
                                type: 'button-balanced',
                                onTap: function( e ) {
                                    var backCount = 1;
                                    $rootScope.$ionicGoBack = function( backCount ) {
                                        $ionicHistory.goBack( backCount );
                                    };
                                    $rootScope.$ionicGoBack();
                                }
                            } ]
                        } );
                        alertPopup.then( function( res ) {
                            if ( res ) {
                                console.log( "fechado" );
                            }
                        } );
                    } else {
                        enviarResultadoFinal();
                    }
                    Utils.hide();
                } );
            }

            function enviarResultadoFinal() {
                Utils.message( Popup.loading_a, Popup.loading );
                var zerarSequenciaVitoria = 0;
                var zerarInvencibilidade = 0;
                var novoResultado;
                var placarEnviar;
                var statusEnviar;
                if ( seVitoria == 0 ) {
                    zerarSequenciaVitoria = 0;
                } else {
                    statusEnviar = "v";
                    zerarSequenciaVitoria = parseInt( sequenciaVitoria ) + 1;
                    if ( resultado1 > resultado2 ) {
                        placarEnviar = resultado1 + "-" + resultado2;
                        novoResultado = "v|" + resultado1 + "-" + resultado2;
                    } else {
                        placarEnviar = resultado2 + "-" + resultado1;
                        novoResultado = "v|" + resultado2 + "-" + resultado1;
                    }
                }
                if ( seDerrota == 1 ) {
                    statusEnviar = "d";
                    zerarInvencibilidade = 0;
                    zerarSequenciaVitoria = 0;
                    if ( resultado1 > resultado2 ) {
                        placarEnviar = resultado1 + "-" + resultado2;
                        novoResultado = "d|" + resultado1 + "-" + resultado2;
                    } else {
                        placarEnviar = resultado2 + "-" + resultado1;
                        novoResultado = "d|" + resultado2 + "-" + resultado1;
                    }
                } else {
                    zerarInvencibilidade = parseInt( invencibilidade ) + 1;
                }
                if ( seEmpate == 1 ) {
                    statusEnviar = "e";
                    if ( resultado1 > resultado2 ) {
                        placarEnviar = resultado1 + "-" + resultado2;
                        novoResultado = "e|" + resultado1 + "-" + resultado2;
                    } else {
                        placarEnviar = resultado2 + "-" + resultado1;
                        novoResultado = "e|" + resultado2 + "-" + resultado1;
                    }
                }
                var conquistasEnviar = [];
                for ( var i = 0; i < itemList.length; i++ ) {
                    //console.log(itemList[i][0]+":"+itemList[i][1]);
                    conquistasEnviar.push( itemList[ i ][ 0 ] + ":" + itemList[ i ][ 1 ] );
                }
                firebase.database().ref().child( 'desafio/desafios/temporadasChampions/oficial/' + idTorneio + '/inscritos/' + keyUsuario ).update( {
                    vitoria: anteriorVitoria + seVitoria,
                    pontos: antPontos + totalPontos,
                    jogados: jogados + 1,
                    derrota: anteriorDerrota + seDerrota,
                    empate: anteriorEmpate + seEmpate,
                    sequenciaVitoria: zerarSequenciaVitoria,
                    invencibilidade: zerarInvencibilidade,
                    placarUltimo: novoResultado,
                    placarPenultimo: resultUltimo,
                    placarAntepenultimo: resultPenultimo,
                    golsPro: golsPro,
                    golsContra: golsContra,
                    temporadaAtual: temporadaNova,
                    temporadaAtualVitoria: novaTemporadaAtualVitoria,
                    temporadaAtualDerrota: novaTemporadaAtualDerrota,
                    temporadaAtualEmpate: novaTemporadaAtualEmpate
                } ).then( function( response ) {
                    Utils.message( Popup.loading_b, Popup.loading );
                    console.log( "iniciando update jogo" );
                    firebase.database().ref().child( 'desafio/desafios/temporadasChampions/oficial/' + idTorneio + '/inscritos/' + keyUsuario + '/jogos/' + $scope.chat ).update( {
                        estado: "Terminado",
                        pontos: totalPontos,
                        conquistas: conquistasEnviar,
                        placar: placarEnviar,
                        status: statusEnviar
                    } ).then( function( response ) {
                        Utils.message( Popup.loading_a, Popup.loading );
                        console.log( "iniciando update siguiente jogo" );
                        var somaJogo = Number( id ) + 1;
                        var siguienteJogo = "jogo" + somaJogo;
                        firebase.database().ref().child( 'desafio/desafios/temporadasChampions/oficial/' + idTorneio + '/inscritos/' + keyUsuario + '/jogos/' + siguienteJogo ).update( {
                            bloqueado: false
                        } ).then( function( response ) {
                            console.log( "final update siguiente jogo" );
                            var backCount = 1;
                            $rootScope.$ionicGoBack = function( backCount ) {
                                $ionicHistory.goBack( backCount );
                            };
                            Utils.message( Popup.loading_b, Popup.loading ).then( function() {
                                $rootScope.$ionicGoBack();
                            } )
                        } );
                    } );
                } );
            }
        }
    ] ); //ctrl
} )();
/*
Divisao
Permanencia
Titulo

Divisao 10
subir 9
Titulo 12
---------------------------------
Divisao 9
permanencia 6
subir 10
Titulo 13
---------------------------------
Divisao 8
permanencia 8 pts
subir 12 pts
Titulo 15 pts
---------------------------------
Divisao 7
permanencia 8
subir 14
Titulo 17
------------------------------------------------------
6 Divisao
permanencia 10
pontos subir 16 
 pontos campeao 19
---------------------------------
Divisao 5
Permanencia 10 
subir 16
Titulo 19
---------------------------------
Divisao 4
Permanencia 10
subir 16
Titulo 19
---------------------------------
Divisao 3
Permanencia 
subir 
Titulo 
---------------------------------
Divisao 2
Permanencia 
subir 
Titulo
---------------------------------
Divisao 1
Permanencia 
subir 
Titulo

*/