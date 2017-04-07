(function(){
  'use strict';

  var temporadasJogo = angular.module('App.CtrlTempTorneioJogo', []);

  temporadasJogo.controller('CtrlTempTorneioJogo', [
    '$scope',
    'Utils',
    '$state', 
    '$localStorage', 
    'Popup', 
    '$stateParams', 
    '$window', 
    'idJogo', 
    'dataService',
    '$ionicLoading',
    '$http',
    '$ionicPopup',
    function(
      $scope,
      Utils,
      $state, 
      $localStorage, 
      Popup, 
      $stateParams, 
      $window, 
      idJogo, 
      dataService,
      $ionicLoading,
      $http,
      $ionicPopup
  ){

      // si foi enviado:
      $scope.idioma = localStorage.getItem("lang");
      
      $scope.conquistas = JSON.parse(localStorage.getItem('conquistas')) || '[]';

      var arrayConquistas = [];

      var id = idJogo.substring(0, idJogo.indexOf("|"));
      var keyUsuario = idJogo.substring(idJogo.indexOf("|") + 1);
      //console.log(id, keyUsuario);
      var idJogo = id;
      var itemList=[];

      $scope.verPontos = false;
      $scope.chat = "jogo"+idJogo; 
      $scope.jogo = idJogo;
      $scope.jogoNome = "Jogo "+idJogo;
      var idTorneio = dataService.get();
      $scope.verDatos = true;

      var conquistas = $scope.conquistas;
      var totalPontos = 0;    
     

     var usuarios = [];
     var idUsuario;
     var ganhador;
     var time1;
     var time2;
     var resultado1;
     var resultado2;
     $scope.btnDisabled = false;
     $scope.verBtn = true;
     $scope.placar = "";
     var gamerSeleccionado;
     var conquistaSelecionadas = [];

     $scope.verPlacarFinal = false;
     console.log($localStorage.account.idXbox);

      console.log("conq "+conquistas);
      //Vitória armazenando as conquistas e os pontos dentro de arrayConquistas
      for(var key in conquistas){
        if($scope.idioma == "pt"){
          var vit = conquistas[key].vitoria.pt;
          for(var c in vit){
            arrayConquistas.push([vit[c].titulo, vit[c].pontos]); 
          }
        } else if($scope.idioma == "es"){
          var vit = conquistas[key].vitoria.es;    
          for(var c in vit){
            arrayConquistas.push([vit[c].titulo, vit[c].pontos]);  
          }
        } else {
          var vit = conquistas[key].vitoria.en;
          for(var c in vit){
            arrayConquistas.push([vit[c].titulo, vit[c].pontos]);   
          }
        }
      }
    
      var refjogos = firebase.database().ref('desafio/desafios/temporadas/oficial/'+idTorneio+'/inscritos/'+keyUsuario+'/jogos/'+$scope.chat);
      refjogos.once("value").then(function(snapshot) {
        
        $scope.estadoJogo = snapshot.val();
        $scope.estado = $scope.estadoJogo.estado;
          $scope.detalheJogo = snapshot.val();  

      });

      // si nao foi enviado
      
      if(firebase.auth().currentUser) {
          $scope.loggedIn = true;
          console.log("logado");
      } else {
          $scope.loggedIn = false;
           var alertPopup = $ionicPopup.alert({
              title: 'Opps!',
              template: 'Para enviar este resultado vc deve está logado.'
            });

            alertPopup.then(function(res) {
                if(res){

                }
            });
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

    $scope.submit = function(resultado){
      console.log(resultado);
      $scope.recuperarJogo(resultado.local, resultado.visitante);
      $scope.verPlacarFinal = false;
    }
   

    $scope.blisterPackTemplates = usuarios;

     $scope.changedValue=function(item){
      console.log(item.idXbox);
      idUsuario = item.idXbox;
      gamerSeleccionado = item.gamertag;
      $scope.btnDisabled = false;
     }

     $scope.jogoSelecionado = function(valor){
      console.log("Resutaldo "+valor);
      $scope.verBtn = false;
      ganhador = valor;
      itemList = [];
      totalPontos = 0;
      $scope.totalPontos = totalPontos;

     
      // ----------------------------------------------------------------------------------------------------- JOGO Local
      if(ganhador == 'A'){
        if(resultado1 > resultado2 ){
          $scope.placarFinal = "Vitoria";  
          listarConquistaVitoria(resultado1, resultado2);     

        } else if(resultado1 < resultado2){
          $scope.placarFinal = "Derrota";
          itemList.push(["Derrota", 0]);
        } else {
          $scope.placarFinal = "Empate";
        } 

      // -----------------------------------------------------------------------------------------------------  Jogo Visitante 
      } 

      else if(ganhador == 'B'){
         if(resultado1 < resultado2){
          console.log("Vc ganhou o jogo. "+$scope.placar);
          $scope.placarFinal = "Vitoria"
          listarConquistaVitoria(resultado2, resultado1);     
        } else if(resultado1 > resultado2){
          console.log("Vc perdeu o jogo. "+$scope.placar);
          $scope.placarFinal = "Derrota";
          itemList.push(["Derrota", 0]);
        } else {
          console.log("Vc empatou o jogo. "+$scope.placar);
          $scope.placarFinal = "Empate";
        }  
      } else {
        ganhador = false;
      }    
      
      $scope.items = itemList;
      $scope.totalPontos = totalPontos;
      $scope.verPlacarFinal = true;
     }

     function listarConquistaVitoria(res1, res2){
        console.log("Conquistas: ", arrayConquistas);
        //vitoria
        var subtrairResultado = res1 - res2;
        //if(juego == 'A'){
          //--Vitória
          itemList.push([arrayConquistas[0][0], arrayConquistas[0][1]]);
          totalPontos = totalPontos + arrayConquistas[0][1];
          // si o oponente nao fez gol
          if(res2 == 0){
            //--Vitoria sem sofrer gols
            itemList.push([arrayConquistas[1][0], arrayConquistas[1][1]]);
            totalPontos = totalPontos + arrayConquistas[2][1];
            if(res1 == 2){
              //--Vitoria 2 a 0
              itemList.push([arrayConquistas[2][0], arrayConquistas[2][1]]);
              totalPontos = totalPontos + arrayConquistas[3][1];
            }else if(res1 == 3){  
              //--Vitoria 3 a 0
              itemList.push([arrayConquistas[3][0], arrayConquistas[3][1]]);
              totalPontos = totalPontos + arrayConquistas[3][1];
            }else if(res1 == 4){
              //--Vitoria 4 a 0
              itemList.push([arrayConquistas[4][0], arrayConquistas[4][1]]);
              totalPontos = totalPontos + arrayConquistas[4][1];
            } else if(res1 == 5){
              //--Vitoria 5 a 0
              itemList.push([arrayConquistas[5][0], arrayConquistas[5][1]]);
              totalPontos = totalPontos + arrayConquistas[5][1];
            } else {
              //--Vitoria 6 a 0 ou +
              itemList.push([arrayConquistas[6][0], arrayConquistas[6][1]]);
              totalPontos = totalPontos + arrayConquistas[6][1];
            }
          } else {
            if(res1 == 7 && res2 == 1){
              //--Vitoria 7 a 1
              itemList.push([arrayConquistas[7][0], arrayConquistas[7][1]]);
              totalPontos = totalPontos + arrayConquistas[7][1];
            }
            // vitoria con diferenca de 2, 3, 4, 5 ou mais gols
            if(res1 - res2 == 2){
              itemList.push([arrayConquistas[8][0], arrayConquistas[8][1]]);
              totalPontos = totalPontos + arrayConquistas[8][1];
            } else if (res1 - res2 == 3){
              itemList.push([arrayConquistas[9][0], arrayConquistas[9][1]]);
              totalPontos = totalPontos + arrayConquistas[9][1];
            } else if (res1 - res2 == 4){
              itemList.push([arrayConquistas[10][0], arrayConquistas[10][1]]);
              totalPontos = totalPontos + arrayConquistas[10][1];
            } else if (res1 - res2 == 5){
              itemList.push([arrayConquistas[11][0], arrayConquistas[11][1]]);
              totalPontos = totalPontos + arrayConquistas[11][1];
            } else if (subtrairResultado > 6 || subtrairResultado == 6){
              console.log(" subtrairResultado: "+subtrairResultado);
              if(res1 != 7){
                 console.log(" subtrairResultado2: "+subtrairResultado);
                itemList.push([arrayConquistas[12][0], arrayConquistas[12][1]]);
                totalPontos = totalPontos + arrayConquistas[12][1];
                console.log("Pontos 12 ", arrayConquistas[12][0], arrayConquistas[12][1]);
              }     
            } else {

            }            
          }     
     }



     // -----------------------------------------------------------------  Recuperar Resultado
     var urlLocal = 'js/BD/presenceEjemplo.json';

     $scope.recuperarJogo = function(res1, res2){
      $scope.status = false;
      $scope.lista = false;

      $ionicLoading.show().then(function(){
                //console.log("Loading Jogos");
             });
      $scope.placar = "";
      $scope.semFifa = "";
      $scope.respuesta = "";
      var richPresence = false;
    

        $http({
          //url: 'https://xboxapi.com/v2/'+idUsuario+'/presence',
          //url: 'https://xboxapi.com/v2/2535419577962363/presence', //Menino
          url:urlLocal,
           //url: 'https://xboxapi.com/v2/2533274961032793/presence', fah cesar 
           //url: 'https://xboxapi.com/v2/2533275001163369/presence',
          method: 'GET',
          headers: {
                      'Access-Control-Allow-Origin': '*',                
                      'X-AUTH': '5056c2081205740a2d765ebe3ff5807dd4178a87', //Benbaodan
                      'Accept-Language':'en-US',
                      'Content-Type':'application/json'
                    }
          }).then(function(resp) { 
                    $scope.respuesta = resp.data;
                   console.log("RichPresence: "+richPresence, $scope.respuesta);  
                   var totalOnline = resp.data.devices[0].titles.length;
                   console.log(" Total online "+totalOnline)         ;
                  if(resp.data.state === "Online"){
                    $ionicLoading.hide();
                    if(resp.data.devices[0].titles.length == 1){
                        $scope.semFifa = "Please goto Fifa 1.";
                        richPresence = false;                 
                    } else if(resp.data.devices[0].titles.length == 2){
                      console.log("Title length 2 "+resp.data.devices[0].titles.length);
                       if(resp.data.devices[0].titles[1].id === 69094388){   

                          richPresence  = resp.data.devices[0].titles[1].activity.richPresence;
                          console.log("5 "+richPresence);
                          if(richPresence == "FIFA 17 Seasons (In Menus)"){
                            var alertPopup = $ionicPopup.alert({
                               title: 'Opps!',
                               template: "<p align='center'><strong>Status:</strong> Menú.</p>"
                             });

                             alertPopup.then(function(res) {
                               console.log('cerrar');
                                richPresence = false;
                                $scope.status = false;
                             });
                          } else {
                            $scope.status = true;
                            $scope.semFifa = "Status: "+richPresence; 
                          }                                 
                      } else {
                         $scope.semFifa = "Status: "+richPresence; 
               
                         $ionicLoading.hide();
                         var alertPopup = $ionicPopup.alert({
                           title: 'Opps!',
                           template: "<p align='center'><strong>"+gamerSeleccionado+"</strong> no está no Fifa! 1</p>"
                         });

                         alertPopup.then(function(res) {
                           console.log('cerrar');
                            richPresence = false;
                            $scope.status = false;
                         });
                      }
                    } else{
                      if(resp.data.devices[0].titles[1].id === 69094388){ 
                      console.log("Title length 3 "+resp.data.devices[0].titles.length);               
                          richPresence  = resp.data.devices[0].titles[1].activity.richPresence;
                          $scope.status = true;
                          $scope.semFifa = "Status: "+richPresence; 

                      } else {
                        $scope.timeCasa = false;
                         $scope.semFifa = "Status: "+richPresence;
                        richPresence = false;
                        console.log("Please goto Fifa 2.");
                        var alertPopup = $ionicPopup.alert({
                           title: 'Opps!',
                           template: "<p align='center'><strong>"+gamerSeleccionado+"</strong> no está no Fifa! 2</p>"
                         });

                         alertPopup.then(function(res) {
                           console.log('cerrar');
                            richPresence = false;
                            $scope.status = false;
                         });
                      }
                    } 
                    

                    if(richPresence != false){
                     var fifaMenu = 'FIFA 17 Temporadas (en los menús)';
                       if(fifaMenu === richPresence){
                          $scope.placar = "No se mostrará el resultado";
                          $scope.status = true;
                       } else {
                         var idFifa = 69094388;
                         $scope.lista = true;
                         $scope.status = false;
                       
                       //console.log("Resp2: "+resp.data.devices[0].titles[0].activity.richPresence);               
                       
                       // Original var resultado = richPresence;
                       var resultado = "Jugando FIFA 17 FUT Draft Online "+res1+"-"+res2+" FUT - FUT, 2.\u00ba t."
                       var separador = ","; // un espacio en blanco
                       var limite    = 1;
                       //var resposta = resultado.split(separador);
                       //console.log(resposta[27], resposta[29]) ;
                       
                       var ini = parseInt(resultado.indexOf("-"))-1;
                       var fin = parseInt(resultado.indexOf("-"))+1;
                       var parcial = resultado.substr(ini, fin);
                       var final = parcial.split(separador);

                       var corta = parcial.indexOf(" ");
                       var placar = parcial.substr(0,corta);
                       var arrayResultado = placar.split("");
                       console.log(parseInt(arrayResultado[0]) + parseInt(arrayResultado[2]));
                       console.log("------");
                       var recortarTime = String(final.slice(0, -1));
                       var sep = "";
                       var array = "";
                       array = recortarTime.split(sep);
                       console.log("--"+ array); 

                       if(array[6] == undefined){
                          time1 = array[4]+array[5]
                       } else {
                          time1 = array[4]+array[5]+array[6];
                       }

                        if(array[12] == undefined){
                          time2 = array[10]+array[11];
                        } else {
                          time2 = array[10]+array[11]+array[12];
                        }
                         
                         resultado1 = array[0];
                         
                         resultado2 = array[2];
                       if(resultado1 != undefined){

                       $scope.placar = time1+" "+resultado1+" X "+resultado2+" "+time2;
                         $scope.casa = time1+" "+resultado1;
                         $scope.fora = time2+" "+resultado2;
                         $scope.timeCasa = time1;
                         $scope.timeVisitante = time2;
                         $scope.resCasa = resultado1;
                         $scope.resVisitante = resultado2;
                         console.log("Placar "+$scope.placar);
                        } else {
                           $scope.placar = "Vc está no Menú";
                        }

                      }
                    }

                 

                  } else {
                    console.log("Off");
                      $ionicLoading.hide();
                       var alertPopup = $ionicPopup.alert({
                       title: 'Opps!',
                       template: "<p align='center'><strong>"+gamerSeleccionado+"</strong> está offline!</p>"
                     });

                     alertPopup.then(function(res) {
                       console.log('cerrar');
                     });
                  }

            

        }, function(err) {
                 console.log("Error2 "+err.data);
                 $scope.error = err.data;
                 $ionicLoading.hide();
        });

       

    } // function

   

  }]); //ctrl
})();

/*
6 Divisao
16 pontos subir / 19 pontos campeao



*/