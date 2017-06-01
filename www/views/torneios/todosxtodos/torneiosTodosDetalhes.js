( function() {
  'use strict';
  var temporadasRankingJogos = angular.module( 'App.CtrlTorneiosTodosDetalhes', [] );
  temporadasRankingJogos.controller( 'CtrlTorneiosTodosDetalhes', [ '$scope', 'Utils', '$state', '$localStorage', 'Popup', '$stateParams', 'idTorneioKeyUsuario', 'PopupFactoryRanking', '$ionicPopup', 'CordovaNetwork',
    function( $scope, Utils, $state, $localStorage, Popup, $stateParams, idTorneioKeyUsuario, PopupFactoryRanking, $ionicPopup, CordovaNetwork ) {
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
      var ranking = [];
      var rankingSend = [];
      var rodadas = [];
      var games = "";
      var gamesRound = []
      var rodadasQtd = 0;
      var rodadasJogos = 0;
      var nomeTorneio = "";
      var dataTorneio = "";
      $scope.chaveAcesso = idTorneio;
      saberSiEadmin();

      function saberSiEadmin() {
        if ( keyUsuario.indexOf( "%20" ) == -1 ) {
          if ( String( keyUsuario ) === String( gamertag ) ) {
            $scope.eCriador = true;
            $scope.dimensionColumna = 80;
            return true;
          } else {
            $scope.dimensionColumna = 100;
            $scope.eCriador = false;
            return false;
          }
        } else {
          if ( String( substituirVazios( keyUsuario, " ", "%20" ) ) === String( gamertag ) ) {
            $scope.eCriador = true;
            $scope.dimensionColumna = 80;
            return true;
          } else {
            $scope.dimensionColumna = 100;
            $scope.eCriador = false;
            return false;
          }
        }
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
      var refTorneio = firebase.database().ref( 'desafio/torneios/todosxtodos/' + keyUsuario + '/' + idTorneio );
      $scope.carregarDados = function() {
        Utils.show();
        ranking = [];
        refTorneio.once( "value" ).then( function( snapshot ) {
          $scope.$apply( function() {
            games = snapshot.val().ranking;
            var snap = snapshot.val().configuracao.participantes;
            nomeTorneio = snapshot.val().configuracao.nome;
            $scope.nomeTorneio = nomeTorneio;
            dataTorneio = snapshot.val().configuracao.data;
            if ( snap > 0 ) {
              $scope.noInscritos = false;
              if ( snap % 2 ) {
                console.log( "es impar" );
              } else {
                rodadasQtd = snap - 1;
                rodadasJogos = snap / 2;
                $scope.rodadasQtdJogos = rodadasJogos;
              }
              for ( var key in games ) {
                $scope.gamertagCompartir = key;
                ranking.push( {
                  "gamer": games[ key ].gamer,
                  "jogos": games[ key ].jogos,
                  "pontos": games[ key ].pontos,
                  "vitoria": games[ key ].vitoria,
                  "empate": games[ key ].empate,
                  "derrota": games[ key ].derrota,
                  "golsPro": games[ key ].golsPro,
                  "golsContra": games[ key ].golsContra,
                  "keyRanking": key
                } );
              }
              $scope.torneio = ranking;
              $scope.rodadas = snapshot.val().rodadas;
              var rod = snapshot.val().rodadas;
              $scope.groups = [];
              for ( var i = 0; i < rodadasQtd; i++ ) {
                $scope.groups[ i ] = {
                  rodada: i + 1,
                  items: [],
                  show: false
                };
                for ( var key in rod ) {
                  var int = i + 1;
                  if ( key == "rodada" + int ) {
                    var rondaD = rod[ key ];
                    for ( var obj in rondaD ) {
                      for ( var j = 1; j < rodadasJogos; j++ ) {
                        $scope.groups[ i ].items.push( {
                          "jogo": customResultado( String( rondaD[ obj ].jogo ) ),
                          "idTorneio": key,
                          "idRodada": obj
                        } );
                        break;
                      }
                    }
                  }
                }
              }
            } else {
              $scope.noInscritos = true;
            }
            Utils.hide();
          } );
        } );
      }
      $scope.verChaveAcesso = function() {
        var alertPopup = $ionicPopup.alert( {
          template: '<p align="center"><i class="icon ion-key verdeBalanced tamanhoIcon"></i></p>' + '<p align="center"><strong>{{"ESTAECHAVEACESSO" | translate}}</strong></p><div class="row"><div class="col col-80"><h3 class="vermelho" align="center">' + $scope.chaveAcesso + '</h3></div>' + '<div class="col col-20"><button class="button button-small button-balanced icon ion-social-whatsapp-outline whatsapp"></button></div></div>',
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
      $scope.toggleGroup = function( group ) {
        group.show = !group.show;
      };
      $scope.isGroupShown = function( group ) {
        return group.show;
      };
      $scope.editarJogo = function( rodada, jogo, keyRodada, idRodada ) {
        $scope.rodadaAtual = rodada;
        var oponente1 = jogo.substring( 0, jogo.indexOf( "x" ) - 1 );
        var oponente2 = jogo.substring( jogo.indexOf( "x" ) + 2 );
        $scope.oponente1 = oponente1;
        $scope.oponente2 = oponente2;
        var resultado1 = 0;
        var resultado2 = 0;
        var novoKeyRanking1 = "";
        var novoKeyRanking2 = "";
        for ( var i = 0; i < ranking.length; i++ ) {
          if ( ranking[ i ].gamer == oponente1 ) {
            novoKeyRanking1 = ranking[ i ].keyRanking
          }
          if ( ranking[ i ].gamer == oponente2 ) {
            novoKeyRanking2 = ranking[ i ].keyRanking
          }
        }
        $scope.data = {}
        var myPopup = PopupFactoryRanking.getPopup( $scope );
        // An elaborate, custom popup
        myPopup.then( function( res ) {
          console.log( 'res', res );
          if ( res == undefined ) {} else {
            resultado1 = res.local;
            resultado2 = res.visitante;
            enviarDatosJogos();
          }
        } );

        function enviarDatosJogos() {
          if ( saberSiEadmin() ) {
            Utils.show();
            var linkRodada = "desafio/torneios/todosxtodos/" + keyUsuario + "/" + idTorneio + "/rodadas/" + keyRodada + "/" + idRodada;
            var linkRanking = "desafio/torneios/todosxtodos/" + keyUsuario + "/" + idTorneio + "/ranking/";
            var resultadoFinal = oponente1 + ">" + resultado1 + "@" + resultado2 + "<" + oponente2;
            var arrayOp1 = {};
            var arrayOp2 = {};
            if ( resultado1 > resultado2 ) {
              for ( var i = 0; i < ranking.length; i++ ) {
                if ( ranking[ i ].gamer == oponente1 ) {
                  arrayOp1 = {
                    "gamer": ranking[ i ].gamer,
                    "jogos": ranking[ i ].jogos + 1,
                    "pontos": ranking[ i ].pontos + 3,
                    "vitoria": ranking[ i ].vitoria + 1,
                    "empate": ranking[ i ].empate,
                    "derrota": ranking[ i ].derrota,
                    "golsPro": ranking[ i ].golsPro + resultado1,
                    "golsContra": ranking[ i ].golsContra + resultado2
                  }
                }
                if ( ranking[ i ].gamer == oponente2 ) {
                  arrayOp2 = {
                    "gamer": ranking[ i ].gamer,
                    "jogos": ranking[ i ].jogos + 1,
                    "pontos": ranking[ i ].pontos,
                    "vitoria": ranking[ i ].vitoria,
                    "empate": ranking[ i ].empate,
                    "derrota": ranking[ i ].derrota + 1,
                    "golsPro": ranking[ i ].golsPro + resultado2,
                    "golsContra": ranking[ i ].golsContra + resultado1
                  }
                }
              }
            } else if ( resultado2 > resultado1 ) {
              for ( var i = 0; i < ranking.length; i++ ) {
                if ( ranking[ i ].gamer == oponente1 ) {
                  arrayOp1 = {
                    "gamer": ranking[ i ].gamer,
                    "jogos": ranking[ i ].jogos + 1,
                    "pontos": ranking[ i ].pontos,
                    "vitoria": ranking[ i ].vitoria,
                    "empate": ranking[ i ].empate,
                    "derrota": ranking[ i ].derrota + 1,
                    "golsPro": ranking[ i ].golsPro + resultado1,
                    "golsContra": ranking[ i ].golsContra + resultado2
                  }
                }
                if ( ranking[ i ].gamer == oponente2 ) {
                  arrayOp2 = {
                    "gamer": ranking[ i ].gamer,
                    "jogos": ranking[ i ].jogos + 1,
                    "pontos": ranking[ i ].pontos + 3,
                    "vitoria": ranking[ i ].vitoria + 1,
                    "empate": ranking[ i ].empate,
                    "derrota": ranking[ i ].derrota,
                    "golsPro": ranking[ i ].golsPro + resultado2,
                    "golsContra": ranking[ i ].golsContra + resultado1
                  }
                }
              }
            } else {
              for ( var i = 0; i < ranking.length; i++ ) {
                if ( ranking[ i ].gamer == oponente1 ) {
                  arrayOp1 = {
                    "gamer": ranking[ i ].gamer,
                    "jogos": ranking[ i ].jogos + 1,
                    "pontos": ranking[ i ].pontos + 1,
                    "vitoria": ranking[ i ].vitoria,
                    "empate": ranking[ i ].empate + 1,
                    "derrota": ranking[ i ].derrota,
                    "golsPro": ranking[ i ].golsPro + resultado1,
                    "golsContra": ranking[ i ].golsContra + resultado2
                  }
                }
                if ( ranking[ i ].gamer == oponente2 ) {
                  arrayOp2 = {
                    "gamer": ranking[ i ].gamer,
                    "jogos": ranking[ i ].jogos + 1,
                    "pontos": ranking[ i ].pontos + 1,
                    "vitoria": ranking[ i ].vitoria,
                    "empate": ranking[ i ].empate + 1,
                    "derrota": ranking[ i ].derrota,
                    "golsPro": ranking[ i ].golsPro + resultado2,
                    "golsContra": ranking[ i ].golsContra + resultado1
                  }
                }
              }
            }
            firebase.database().ref( linkRodada ).update( {
              jogo: resultadoFinal
            } ).then( function( response ) {
              console.log( "rodada atualizada" );
              firebase.database().ref( linkRanking + "/" + novoKeyRanking1 ).update( arrayOp1 ).then( function( response ) {
                console.log( "ranking1 atualizado" );
              } ).then( function( response ) {
                firebase.database().ref( linkRanking + "/" + novoKeyRanking2 ).update( arrayOp2 ).then( function( response ) {
                  console.log( "ranking1 atualizado" );
                } ).then( function( response ) {
                  console.log( "actualizar tela" );
                  Utils.hide();
                  $scope.carregarDados();
                } );
              } );
            } );
          }
        }
        //firebase.database().ref( 'desafio/torneios/todosxtodos/' + keyUsuario + '/' + idTorneio );
      }

      function customResultado( dato ) {
        if ( dato != "undefined" ) {
          var datoDecodificado = "";
          var oponente1 = "";
          var oponente2 = "";
          var result = dato;
          if ( dato.indexOf( "$" ) == -1 ) {
            oponente1 = result.substring( 0, result.indexOf( ">" ) );
            oponente2 = result.substring( result.indexOf( "<" ) + 1 );
            var oponente1Res = result.substring( result.indexOf( ">" ) + 1, result.indexOf( "@" ) );
            var oponente2Res = result.substring( result.indexOf( "@" ) + 1, result.indexOf( "<" ) );
            datoDecodificado = oponente1 + " " + oponente1Res + " x " + oponente2Res + " " + oponente2;
          } else {
            oponente1 = result.substring( 0, result.indexOf( "$" ) );
            oponente2 = result.substring( result.indexOf( "$" ) + 1 );
            datoDecodificado = oponente1 + " x " + oponente2;
          }
          return datoDecodificado;
        }
      }
      $scope.inputs = [ {
        value: null
      } ];
      $scope.addInput = function() {
        $scope.inputs.push( {
          value: null
        } );
      }
      $scope.removeInput = function( index ) {
        $scope.inputs.splice( index, 1 );
      }

      function verificarDuplicado( array ) {
        return array.slice();
      };
      $scope.enviarDatos = function() {
        var dato = $scope.inputs;
        console.log( dato );
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
                gamesRound.push( dato[ i ].value );
                if ( dato[ i ].value !== undefined ) {
                  rankingSend.push( {
                    "derrota": 0,
                    "empate": 0,
                    "gamer": dato[ i ].value,
                    "golsContra": 0,
                    "golsPro": 0,
                    "historio": "",
                    "jogos": 0,
                    "pontos": 0,
                    "vitoria": 0
                  } );
                  if ( i == gamesQtd - 1 ) procesarDatos();
                } else {
                  console.log( "Todos los campos deve ser preenchidos" );
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
              console.log( "Adicione pelo menos 4 participantes" );
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
      }
      /*
      $( document ).ready( function() {
        $( "#button" ).click( function() {
          html2canvas( $( "#testdiv" ), {
            onrendered: function( canvas ) {
              // canvas is the final rendered <canvas> element
              var myImage = canvas.toDataURL( "image/jpg" );
              window.open( myImage );
            }
          } );
        } );
      } );
      */
      $scope.capturarTela = function() {
        console.log( "click captra" );
        html2canvas( document.body, {
          onrendered: function( canvas ) {
            document.body.appendChild( canvas );
            var img = canvas.toDataURL( "image/png" )
            //window.open( img );
            var link = "http://fifadesafio.herokuapp.com";
            var textoKey = "Key: " + $scope.chaveAcesso;
            var textoGt = "Gt: " + $scope.gamertag;
            var img = img;
            console.log( textoKey, textoGt );
            var message = "Acesse: " + encodeURIComponent( link ) + " - " + encodeURIComponent( textoGt ) + " - " + encodeURIComponent( textoKey ) + encodeURIComponent( img );
            var whatsapp_url = "whatsapp://send?text=" + message;
            window.location.href = whatsapp_url;
          }
        } );
      }

      function procesarDatos() {
        var res = RoundRobinFinal( gamesRound.length );
        var ret = [];
        var jogosRondas = {};
        for ( var i = 0; i < res.length; i++ ) {
          var time1 = res[ i ].a - 1;
          var time2 = res[ i ].b - 1;
          if ( gamesRound[ time1 ] != "undefined" || gamesRound[ time2 ] != "undefined" ) {
            //ret.push( res[ i ].r + ": " + gamesRound[ time1 ] + "$" + gamesRound[ time2 ] );
            var rondas = "rodada" + Number( res[ i ].r );
            if ( !jogosRondas[ rondas ] ) jogosRondas[ rondas ] = [];
            jogosRondas[ rondas ].push( {
              "jogo": gamesRound[ time1 ] + "$" + gamesRound[ time2 ]
            } );
          }
        }
        if ( saberSiEadmin() ) {
          firebase.database().ref( 'desafio/torneios/todosxtodos/' + keyUsuario + "/" + idTorneio ).update( {
            "configuracao/participantes": gamesRound.length,
            rodadas: jogosRondas,
            ranking: rankingSend
          } ).then( function( response ) {
            console.log( "se actualizó" );
            $scope.carregarDados();
            /*
            firebase.database().ref( 'desafio/torneios/todosxtodos/' + keyUsuario + "/" + idTorneio + "/configuracao" ).update( {
              participantes: gamesRound.length
            } ).then( function( response ) {
              
              console.log( "se envió rodadas" );
            } );
            */
          } );
        }
      }
      $scope.atualizarRanking = function() {
        $scope.carregarDados();
      }
      //--------------------------- Outro
      function RoundRobinFinal( t ) {
        var e = [],
          p = +t + ( t % 2 ),
          a = new Array( p - 1 ),
          l = a.length,
          pos, i, r, pos2;
        for ( var x = p; x--; ) {
          a[ x ] = ( x + 1 )
        }
        p ^ t && ( a[ p - 1 ] = "%" );
        for ( var r = 1; r < l + 1; r++ ) {
          e.push( {
            r: r,
            a: a[ 0 ],
            b: a[ l - ( r - 1 ) ]
          } );
          for ( var i = 2; i < ( p / 2 ) + 1; i++ ) {
            pos = ( i + ( r - 2 ) ) >= l ? ( ( l - ( i + ( r - 2 ) ) ) ) * -1 : ( i + ( r - 2 ) );
            pos2 = ( pos - ( r - 2 ) ) - r;
            pos2 > 0 && ( pos2 = ( l - pos2 ) * -1 );
            pos2 < ( l * -1 ) && ( pos2 += l );
            e.push( {
              r: r,
              a: a[ ( l + pos2 ) ],
              b: a[ ( l - pos ) ]
            } )
          }
        }
        return e;
      }
      $( document ).ready( function() {
        var isMobile = {
          Android: function() {
            return navigator.userAgent.match( /Android/i );
          },
          BlackBerry: function() {
            return navigator.userAgent.match( /BlackBerry/i );
          },
          iOS: function() {
            return navigator.userAgent.match( /iPhone|iPad|iPod/i );
          },
          Opera: function() {
            return navigator.userAgent.match( /Opera Mini/i );
          },
          Windows: function() {
            return navigator.userAgent.match( /IEMobile/i );
          },
          any: function() {
            return ( isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows() );
          }
        };
        $( document ).on( "click", '.whatsapp', function() {
          if ( isMobile.any() ) {
            /*
            var text = $( this ).attr( "data-text" );
            var url = $( this ).attr( "data-link" );
            */
            var link = "http://fifadesafio.herokuapp.com";
            var textoKey = "Key: " + $scope.chaveAcesso;
            var textoGt = "Gt: " + $scope.gamertag;
            console.log( textoKey, textoGt );
            var message = "Acesse: " + encodeURIComponent( link ) + " - " + encodeURIComponent( textoGt ) + " - " + encodeURIComponent( textoKey );
            var whatsapp_url = "whatsapp://send?text=" + message;
            window.location.href = whatsapp_url;
          } else {
            var texto = $( 'p.mi_parrafo' ).data();
            var textoKey = "Key: " + texto.chave + "-" + $scope.chaveAcesso;
            var textoGt = "Gt: " + texto.gamertag + "-" + $scope.gamertag;
            console.log( textoKey, textoGt );
            console.log( "No Celular" );
          }
        } );
      } );
    }
  ] ); //ctrl
  temporadasRankingJogos.factory( "PopupFactoryRanking", function( $ionicPopup ) {
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
} )();
/*
var jogadores = [];
for ( var i = 0; i < dato.length; i++ ) {
  jogadores.push( dato[ i ].value );
}
// var jogadores = [ "Pedro", "Juan", "Mario", "Jose" ];
var quantidadeTimes = jogadores.length;
var quantidadeRondas = quantidadeTimes - 1;
var rondas = 0;
var todasRondas = [];
var league = new RoundRobin( quantidadeTimes );
var txt = '';
$scope.jogosRondas = {};
league.onstart = function() {
  txt = 'Spielpaarungen für ' + this.teams() + ' Teams - ';
};
league.onround_start = function( e ) {
  txt += 'Runde ' + e.round + ': ';
  rondas = e.round;
};
league.onround = function( e ) {
  txt += '[ ' + e.pair + ']';
  var pair = e.pair;
  console.log( "---", pair );
  var numTime1 = Number( pair[ 0 ] );
  var numTime2 = Number( pair[ 1 ] );
  var timeA = jogadores[ numTime1 - 1 ];
  var timeB = jogadores[ numTime2 - 1 ];
  if ( !$scope.jogosRondas[ rondas ] ) $scope.jogosRondas[ rondas ] = [];
  $scope.jogosRondas[ rondas ].push( {
    "ronda": rondas,
    "timeA": timeA,
    "timeB": timeB,
    "resultadoA": "X",
    "resultadoB": "X"
  } );
  //todasRondas.push({"jogo":e.pair});
  console.log( e.pair );
};
league.onround_end = function( e ) {
  txt += ' - ';
};
league.onend = function( e ) {
  console.log( txt );
  console.log( $scope.jogosRondas );
};
league.calc();
league.out();
*/
//-----------------------------------
/*
  RoundRobin eine Klasse um in einer Liga Spieltage zu erzeugen.
  Der Algorithmus der Berechnung folgt in etwa dem, der auf dieser Seite beschrieben wird: http://www-i1.informatik.rwth-aachen.de/~algorithmus/algo36.php
  
  @author  J. Str�big
  @version  1.0.0
  @date  12:21 21.10.2011

      function RoundRobin( teams ) {
        if ( !teams ) throw new TypeError( 'Parameter must be greater than zero' );
        this.fireEvent = function( name, evt ) {
          if ( this[ 'on' + name ] ) {
            evt.name = name;
            return this[ 'on' + name ]( evt );
          }
        };
        this.addEventListener = function( name, f ) {
          this[ 'on' + name ] = function( e ) {
            return f.call( this, e );
          };
        };
        var num = parseInt( teams / 2 ),
          ghost_team = 0,
          result, max;
        if ( teams % 2 ) {
          ++num;
          ghost_team = 1;
        }
        var max = num * 2;
        /**
         * Berechnung der Spielepaarungen
         * 
         * @private
         * @param Runde
         * @param Teams (Array)
         * 
         * @return Array
         */
/*
        function get_round( r, t ) {
          var tmp = [],
            t1, t2;
          if ( t[ 0 ] == ghost_team ) tmp.push( max );
          else tmp.push( !( r % 2 ) ? [ max, t[ 0 ] ] : [ t[ 0 ], max ] );
          for ( var j = 1; j < num; j++ ) {
            t1 = t[ j ];
            t2 = t[ max - j - 1 ];
            var rev = !( j % 2 );
            if ( t1 == ghost_team ) tmp.push( t2 );
            else if ( t2 == ghost_team ) tmp.push( t1 );
            else tmp.push( rev ? [ t2, t1 ] : [ t1, t2 ] );
          }
          return tmp;
        }
        this.teams = function() {
          return max;
        };
        this.rounds = function() {
          return parseInt( teams - 1 + .5 );
        };
        this.calc = function() {
          var t = [];
          for ( var i = 1; i < max; i++ ) t.push( i );
          result = [];
          for ( var i = 1; i <= this.rounds(); i++ ) {
            result.push( get_round( i, t ) );
            t.push( t.shift() );
          }
          return result;
        };
        this.out = function() {
          var t = '';
          this.fireEvent( 'start', {} );
          for ( var i = 0; i < result.length; i++ ) {
            var r = i + 1;
            this.fireEvent( 'round_start', {
              round: r
            } );
            for ( var j = 0; j < result[ i ].length; j++ ) {
              this.fireEvent( 'round', {
                round: r,
                pair: result[ i ][ j ]
              } );
            }
            this.fireEvent( 'round_end', {
              round: r
            } );
          }
          this.fireEvent( 'end', {} );
          return t;
        };
      }
      */