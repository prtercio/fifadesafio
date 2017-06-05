( function() {
  'use strict';
  var temporadasRankingJogosChampions = angular.module( 'App.CtrlTemporadasRankingJogosDetalheChampions', [ 'App.CtrlImageDirectiva' ] );
  temporadasRankingJogosChampions.controller( 'CtrlTemporadasRankingJogosDetalheChampions', [ '$scope', 'Utils', '$state', '$localStorage', 'Popup', '$stateParams', '$window', 'idJogoDetalhe', '$ionicNavBarDelegate', 'dataService',
    function( $scope, Utils, $state, $localStorage, Popup, $stateParams, $window, idJogoDetalhe, $ionicNavBarDelegate, dataService ) {
      $ionicNavBarDelegate.showBackButton( true );
      $scope.spinnerClass = 'background-spinner';
      var semana = idJogoDetalhe.substring( 0, idJogoDetalhe.indexOf( "&" ) );
      var id = idJogoDetalhe.substring( idJogoDetalhe.indexOf( "&" ) + 1, idJogoDetalhe.indexOf( "|" ) );
      var keyUsuario = idJogoDetalhe.substring( idJogoDetalhe.indexOf( "|" ) + 1 );
      console.log( id, keyUsuario, semana );
      var idJogo = id;
      var itemList = [];
      $scope.suma = 0;
      var jogosDisputados = 0;
      var pontosSomados = 0;
      var data;
      var key = keyUsuario;
      $scope.verPontos = false;
      $scope.chat = "jogo" + idJogo;
      $scope.jogoNome = "Jogo " + idJogo;
      var datosDataService = dataService.get();
      var arrayJogo = [];
      //$scope.$apply( function() {
      var novosDados = dataService.get().semanas;
      console.log( novosDados );
      for ( var key in novosDados ) {
        if ( key === semana ) {
          for ( var obj in novosDados[ key ] ) {
            if ( obj === $scope.chat ) {
              console.log( novosDados[ key ][ obj ] );
              arrayJogo.push( {
                "img": novosDados[ key ][ obj ].img,
                "jogo": novosDados[ key ][ obj ].jogo,
                "placar": novosDados[ key ][ obj ].placar,
                "status": novosDados[ key ][ obj ].status,
                "pontos": novosDados[ key ][ obj ].pontos,
                "conquistas": novosDados[ key ][ obj ].conquistas,
                "estado": novosDados[ key ][ obj ].estado
              } );
              mostrarDatos();
            }
          }
        }
      }

      function mostrarDatos() {
        console.log( arrayJogo[ 0 ] );
        $scope.detalheJogo = arrayJogo[ 0 ];
      }
      //$scope.detalheJogo = snapshot.val();
      //console.log( snapshot.val() );
      //} );
      /*

      var refjogos = firebase.database().ref( 'desafio/desafios/temporadas/oficial/' + datosDataService.idTorneio + '/inscritos/' + keyUsuario + '/jogos/' + semana + '/' + $scope.chat );
      refjogos.once( "value" ).then( function( snapshot ) {
        $scope.$apply( function() {
          $scope.detalheJogo = snapshot.val();
          console.log( snapshot.val() );
        } );
      } );
      */
    }
  ] ); //ctrl
  /*
  temporadasRankingJogosUT.directive( 'imgWithLoading', function() {
    return {
      restrict: 'E',
      template: '<div/>',
      transclude: false,
      replace: true,
      scope: {
        imgSrc: '@'
      },
      link: function( scope, element, attrs ) {
        console.log( 'imgWithLoading init: source="' + scope.imgSrc + '"' );
        setHeight();
        var img = angular.element( new Image() );
        var unbind1 = img.on( 'load', function( evt ) {
          console.log( 'image loaded: ' + img.attr( 'src' ) );
          stopLoadingCSS();
        } );
        var unbind2 = img.on( 'error', function( evt ) {
          console.log( 'imgWithLoading error Loading ' + scope.imgSrc );
          element.removeClass( attrs.spinnerClass );
        } );
        //only define src here, after binding events
        //notice src is retrieve from attrs because scope.imgSrc may be undefined yet
        img.attr( 'src', attrs.imgSrc );
        startLoadingCSS();
        element.append( img );
        element.addClass( 'imgWithLoading' );
        //watch for changes
        var unbind3 = scope.$watch( 'imgSrc', function( newVal, oldVal ) {
          if ( newVal === img.attr( 'src' ) ) return;
          startLoadingCSS();
          setHeight();
          img.attr( 'src', newVal );
          console.log( 'imgWithLoading: imgSrc mudou: ' + newVal );
          console.log( 'imgWithLoading: imgSrc antigo: ' + oldVal );
        } );
        scope.$on( 'destroy', function() {
          console.log( 'imgWithLoading: unbinding...' );
          unbind1();
          unbind2();
          unbind3();
        } );
        // ------- LOCAL FUNCTIONS --------------------------------
        function startLoadingCSS() {
          img.css( {
            visibility: 'hidden'
          } );
          element.addClass( attrs.spinnerClass );
        }

        function stopLoadingCSS() {
          img.css( {
            visibility: 'visible'
          } );
          element.removeClass( attrs.spinnerClass );
        }

        function setHeight() {
          var w = element.prop( 'offsetWidth' );
          var h = attrs.heightMultiplier * w;
          if ( w && h ) {
            element.css( 'height', h + 'px' );
            //if (!scope.$$phase) scope.$apply();
            console.log( 'imgWithLoading: [width x height] set to [' + w + ' x ' + h + ']' );
          } else {
            console.log( 'imgWithLoading: height NOT set' );
          }
        }
      }
    };
  } );
  */
} )();