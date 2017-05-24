( function() {
    'use strict';
    var copas = angular.module( 'App.CtrlCopas', [] );
    copas.controller( 'CtrlCopas', [ '$scope', '$timeout',
        function( $scope, $timeout ) {
            $scope.items = [];
            for ( var i = 0; i <= 5; i++ ) {
                var tmp = [ {
                    desc: 'The Ramones',
                    image: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcSulfJcjBhxxW2NBBn9KbE3B4BSeh0R7mQ38wUi_zpJlQrMoDWh_qFcMelE_tjtAERUPTc'
                }, {
                    desc: 'The Beatles',
                    image: 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTGpH07f9zeucoOs_stZyIFtBncU-Z8TDYmJgoFnlnxYmXjJEaitmxZNDkNvYnCzwWTySM'
                }, {
                    desc: 'Pink Floyd',
                    image: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcT-FbU5dD_Wz472srRIvoZAhyGTEytx9HWGusbhYgSc2h0N6AqqRrDwzApmyxZoIlyxDcU'
                }, {
                    desc: 'The Rolling Stones',
                    image: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcT6uwPPBnHfAAUcSzxr3iq9ou1CZ4f_Zc2O76i5A4IyoymIVwjOMXwUFTGSrVGcdGT9vQY'
                }, {
                    desc: 'The Jimi Hendrix Experience',
                    image: 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRA3jz0uhVypONAKWUve80Q6HASvuvZiohl4Sru5ZihkAsjWiaGjocfxd0aC3H7EeFk5-I'
                }, {
                    desc: 'Van Halen',
                    image: 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRIslVN9cJJ6YuV0y7JihAyA63JDhXGhkCVxHIRE-IoaF-rpefjIXO5osA24QvN9iCptC8'
                } ];
            };
            $scope.prova = function() {
                console.log( "clickando" );
            }
            var images = [ {
                img: "../img/copa.png",
                idTorneio: "-KeBBks76AzFloDfkS",
                fechaFinal: ""
            }, {
                img: "http://lorempixel.com/output/sports-h-c-120-180-2.jpg",
                idTorneio: "-KeBBks76AzFloDfk1",
                fechaFinal: ""
            }, {
                img: "http://lorempixel.com/output/sports-h-c-120-180-3.jpg",
                idTorneio: "-KeBBks76AzFloDfk2",
                fechaFinal: ""
            }, {
                img: "http://lorempixel.com/output/sports-h-c-120-180-8.jpg",
                idTorneio: "-KeBBks76AzFloDfk3",
                fechaFinal: ""
            }, {
                img: "http://lorempixel.com/output/sports-h-c-120-180-1.jpg",
                idTorneio: "-KeBBks76AzFloDfk4",
                fechaFinal: ""
            }, {
                img: "http://lorempixel.com/output/sports-h-c-120-180-9.jpg",
                idTorneio: "-KeBBks76AzFloDfk5",
                fechaFinal: ""
            } ];
            $scope.items = $scope.items.concat( images );
            var vm = this;
            vm.options = {
                unselectOthers: false
            };
            // Carousel Options
            vm.carouselOptions1 = {
                carouselId: 'carousel-1',
                align: 'left',
                selectFirst: true,
                centerOnSelect: true
            };
            vm.carouselOptions6 = {
                carouselId: 'carousel-6',
                align: 'left',
                selectFirst: true,
                centerOnSelect: false,
                template: 'views/copas/demo-3.html',
                pullRefresh: {
                    active: true,
                    callBack: pullRefresh
                }
            };
            vm.onSelectCarousel = onSelectCarousel;
            vm.addItemsCarousel = addItemsCarousel;
            activate();

            function activate() {
                // Mock data for carousel
                vm.carouselData1 = createArray( 20 );
                vm.carouselData2 = createArray( 5 );
                vm.carouselData3 = createArray( 3 );
                vm.carouselData4 = createArray( 6 );
                vm.carouselData5 = createArray( 3 );
                vm.carouselData6 = createArray( 6, true );
                vm.carouselData7 = createArray( 3, true );

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
                            imgId = Math.floor( Math.random() * 10000 );
                            //model.src = 'http://lorempixel.com/120/80/?' + imgId
                            model.src = images[ i ].img;
                            model.idTorneio = images[ i ].idTorneio;
                        }
                        arr.push( model );
                    }
                    //console.log( "arr", arr );
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
            // Example add 4 elements to carousel 7
            function addItemsCarousel( total ) {
                var i, model
                var oldLength = vm.carouselData7.length;
                for ( i = 0; i < total; i++ ) {
                    model = getModelImageItem( oldLength + i );
                    vm.carouselData7.push( model );
                }
                // Tell carousel 6 that its array has been updated
                $scope.$broadcast( 'a-carousel.arrayupdated', 'carousel-7' );
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
        }
    ] ); //ctrl
} )();
/*
http://lorempixel.com/output/sports-h-c-120-180-6.jpg
http://lorempixel.com/output/sports-h-c-120-180-2.jpg
http://lorempixel.com/output/sports-h-c-120-180-3.jpg
http://lorempixel.com/output/sports-h-c-120-180-8.jpg
http://lorempixel.com/output/sports-h-c-120-180-1.jpg
http://lorempixel.com/output/sports-h-c-120-180-9.jpg
*/