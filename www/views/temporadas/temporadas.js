( function() {
  'use strict';
  var temporadas = angular.module( 'App.CtrlTemporadas', [] );
  temporadas.controller( 'CtrlTemporadas', [ '$scope', 'Utils', '$timeout',
    function( $scope, Utils, $timeout ) {
      var idioma = window.localStorage.getItem( 'lang' );
      $scope.idioma = idioma;
      console.log( idioma );
      var vm = this;
      vm.options = {
        unselectOthers: false
      };
      // Carousel Options
      vm.carouselOptions6 = {
        carouselId: 'carousel-6',
        align: 'left',
        selectFirst: true,
        centerOnSelect: false,
        template: 'views/copas/demo-3.html'
      };
      vm.onSelectCarousel = onSelectCarousel;
      var temporada = "";
      var temp = "";
      var imageTemp = "";
      var images = JSON.parse( localStorage.getItem( 'temporadas' ) ) || '[]';
      var images2 = [ {
        img: "../img/copa.png",
        idTorneio: "-KeBBks76AzFloDfkS"
      }, {
        img: "http://lorempixel.com/output/sports-h-c-120-180-2.jpg",
        idTorneio: "-KeBBks76AzFloDfk1"
      } ];
      var totalDesafios = 0;
      cargarTemporadas();

      function cargarTemporadas() {
        totalDesafios = window.localStorage.getItem( "totalFotosTemporadas" );
        Utils.show();
        var ref = firebase.database().ref( 'desafio/desafios/temporadas/oficial' );
        ref.once( "value" ).then( function( snapshot ) {
          $scope.$apply( function() {
            $scope.temporadas = snapshot.val();
            var numSnap = snapshot.numChildren();
            snapshot.forEach( function( minisnapshot ) {
              //totalDesafios++;
              $scope.status = minisnapshot.val().configuracao.estatus;
              $scope.temporadaInicial = minisnapshot.val().configuracao.temporada;
              var temporada = minisnapshot.val().configuracao.temporada;
              if ( idioma == "es" ) {
                images.push( {
                  img: minisnapshot.val().img_es,
                  idTorneio: minisnapshot.key
                } );
                console.log( "aqui" );
                // images carousel
              } else if ( idioma == "pt" ) {
                images.push( {
                  img: minisnapshot.val().img_pt,
                  idTorneio: minisnapshot.key
                } );
              }
            } );
          } );
          Utils.hide();
        } );
        activate();
      }

      function activate() {
        // Mock data for carousel
        vm.carouselData6 = createArray( totalDesafios, true );

        function createArray( total, randomImg ) {
          randomImg = typeof randomImg === 'undefined' ? false : randomImg;
          var i, model, imgId, arr = [];
          for ( i = 0; i < total; i++ ) {
            model = {
              id: i,
              display: 'item ' + i
            };
            if ( i === 2 || i === 13 ) {
              model.display = 'longer ' + model.display;
            }
            if ( randomImg ) {
              //imgId = Math.floor( Math.random() * 10000 );
              //model.src = 'http://lorempixel.com/120/80/?' + imgId
              model.src = images[ i ].img;
              model.idTorneio = images[ i ].idTorneio;
            }
            arr.push( model );
          }
          console.log( "arr", arr );
          return arr;
        }
      }

      function onSelectCarousel( item ) {
        // console.log('Carousel item selected:', item);
        vm.itemSelected = item;
        // unselect all carousel with id that contains string except one
        if ( vm.options.unselectOthers ) {
          $scope.$broadcast( 'a-carousel.desactivateItem', {
            idContains: 'carousel-',
            except: item.carouselId
          } )
        }
      }
      // Pull refresgh method for carousel 6
      function pullRefresh() {
        $timeout( function() {
          var i, model, total = 5;
          var oldLength = vm.carouselData6.length;
          for ( i = 0; i < total; i++ ) {
            model = getModelImageItem( oldLength + i );
            vm.carouselData6.push( model );
          }
          $scope.$broadcast( 'a-carousel.arrayupdated', 'carousel-6' );
          $scope.$broadcast( 'a-carousel.pullrefresh.done' );
        }, 2500 );
      }

      function getModelImageItem( id ) {
        var imgId = Math.floor( Math.random() * 10000 );
        return {
          id: id,
          src: 'http://lorempixel.com/120/80/?' + imgId
        }
      }
      $scope.prova = function() {
        console.log( "clickando" );
      }
      $scope.atualizarTemporadas = function() {
        console.log( "1 atualizando temporadas" );
        //temporadas
        Utils.show();
        var imgs = [];
        var totalFotos = 0;
        var ref = firebase.database().ref( 'desafio/desafios/temporadas/oficial' );
        ref.once( "value" ).then( function( snapshot ) {
          $scope.$apply( function() {
            snapshot.forEach( function( minisnapshot ) {
              if ( idioma == "es" ) {
                imgs.push( {
                  img: minisnapshot.val().img_es,
                  idTorneio: minisnapshot.key
                } );
                totalFotos++;
                localStorage.setItem( 'temporadas', JSON.stringify( imgs ) );
                window.localStorage.setItem( "totalFotosTemporadas", totalFotos );
                // images carousel
              } else if ( idioma == "pt" ) {
                imgs.push( {
                  img: minisnapshot.val().img_pt,
                  idTorneio: minisnapshot.key
                } );
                totalFotos++;
                localStorage.setItem( 'temporadas', JSON.stringify( imgs ) );
                window.localStorage.setItem( "totalFotosTemporadas", totalFotos );
              }
            } );
          } );
          Utils.hide();
          window.reload();
        } );
      }
    }
  ] ); //ctrl
} )();