( function() {
  'use strict';
  var temporadasRankingJogos = angular.module( 'App.CtrlTorneiosTodosDetalhes', [] );
  temporadasRankingJogos.controller( 'CtrlTorneiosTodosDetalhes', [ '$scope', 'Utils', '$state', '$localStorage', 'Popup', '$stateParams', 'idTorneio',
    function( $scope, Utils, $state, $localStorage, Popup, $stateParams, idTorneio ) {
      var keyUsuario = $localStorage.keyUser;
      var ranking = [];
      var rankingSend = [];
      var rodadas = [];
      var games = "";
      var gamesRound = []
      var rodadasQtd = 0;
      var rodadasJogos = 0;
      var refTorneio = firebase.database().ref( 'desafio/torneios/todosxtodos/' + keyUsuario + '/' + idTorneio );
      $scope.carregarDados = function() {
        refTorneio.once( "value" ).then( function( snapshot ) {
          $scope.$apply( function() {
            games = snapshot.val().ranking;
            var snap = snapshot.val().configuracao.participantes;
            console.log( "snap", snap );
            if ( snap != undefined ) {
              $scope.noInscritos = false;
              if ( snap % 2 ) {
                console.log( "es impar" );
              } else {
                rodadasQtd = snap - 1;
                rodadasJogos = snap / 2;
                $scope.rodadasQtdJogos = rodadasJogos;
              }
              for ( var key in games ) {
                ranking.push( {
                  "gamer": games[ key ].gamer,
                  "jogos": games[ key ].jogos,
                  "pontos": games[ key ].pontos,
                  "vitoria": games[ key ].vitoria,
                  "empate": games[ key ].empate,
                  "derrota": games[ key ].derrota,
                  "golsPro": games[ key ].golsPro,
                  "golsContra": games[ key ].golsContra
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
                  console.log( "a ", rod[ key ] );
                  var int = i + 1;
                  if ( key == "rodada" + int ) {
                    var rondaD = rod[ key ];
                    for ( var obj in rondaD ) {
                      console.log( "b ", rondaD[ obj ] );
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
          } );
        } );
      }
      $scope.toggleGroup = function( group ) {
        group.show = !group.show;
      };
      $scope.isGroupShown = function( group ) {
        return group.show;
      };

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
      $scope.enviarDatos = function() {
        var dato = $scope.inputs;
        var gamesQtd = $scope.inputs.length;
        for ( var i = 0; i < gamesQtd; i++ ) {
          gamesRound.push( dato[ i ].value );
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
          console.log( rankingSend );
          if ( i == gamesQtd - 1 ) procesarDatos();
        }
      }

      function procesarDatos() {
        var res = RoundRobin2( gamesRound.length );
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
            console.log( jogosRondas );
          }
        }
        firebase.database().ref( 'desafio/torneios/todosxtodos/' + keyUsuario + "/" + idTorneio ).update( {
          "configuracao/participantes": gamesRound.length,
          rodadas: jogosRondas,
          ranking: rankingSend
        } ).then( function( response ) {
          console.log( "se actualizó" );
          /*
          firebase.database().ref( 'desafio/torneios/todosxtodos/' + keyUsuario + "/" + idTorneio + "/configuracao" ).update( {
            participantes: gamesRound.length
          } ).then( function( response ) {
            
            console.log( "se envió rodadas" );
          } );
          */
        } );
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
      }
      //-----------------------------------
      /*
  RoundRobin eine Klasse um in einer Liga Spieltage zu erzeugen.
  Der Algorithmus der Berechnung folgt in etwa dem, der auf dieser Seite beschrieben wird: http://www-i1.informatik.rwth-aachen.de/~algorithmus/algo36.php
  
  @author  J. Str�big
  @version  1.0.0
  @date  12:21 21.10.2011
*/
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
      //--------------------------- Outro
      function RoundRobin2( t ) {
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
    }
  ] ); //ctrl
} )();