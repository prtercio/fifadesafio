( function() {
    'use strict';
    var copas = angular.module( 'App.CtrlCopas', [] );
    copas.controller( 'CtrlCopas', [ '$scope', '$timeout', 'Utils',
        function( $scope, $timeout, Utils ) {
            $scope.items = [];
            var idioma = window.localStorage.getItem( 'lang' );
            var images = [];
            cargarTemporadas();

            function cargarTemporadas() {
                //var totalDesafios = window.localStorage.getItem( "totalFotosTemporadas" );
                Utils.show();
                var ref = firebase.database().ref( 'desafio/desafios/temporadas/oficial' );
                ref.once( "value" ).then( function( snapshot ) {
                    $scope.$apply( function() {
                        images = [];
                        $scope.items = [];
                        $scope.temporadas = snapshot.val();
                        var numSnap = snapshot.numChildren();
                        var totalDesafios = 0;
                        snapshot.forEach( function( minisnapshot ) {
                            totalDesafios++;
                            console.log( totalDesafios );
                            $scope.status = minisnapshot.val().configuracao.estatus;
                            $scope.temporadaInicial = minisnapshot.val().configuracao.temporada;
                            var temporada = minisnapshot.val().configuracao.temporada;
                            if ( idioma == "es" ) {
                                images.push( {
                                    img: minisnapshot.val().img_es,
                                    desc: "Copa 10ma Divisao",
                                    url: minisnapshot.key
                                } );
                                // images carousel
                            } else if ( idioma == "pt" ) {
                                images.push( {
                                    img: minisnapshot.val().img_pt,
                                    desc: "Copa 10ma Divisao",
                                    url: minisnapshot.key
                                } );
                            }
                        } );
                        $scope.items = $scope.items.concat( images );
                    } );
                    Utils.hide();
                } );
            }
        }
    ] ); //ctrl
} )();