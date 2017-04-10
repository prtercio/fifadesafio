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
    '$rootScope',
    '$ionicHistory',
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
      $ionicPopup,
      $rootScope,
      $ionicHistory
  ){

      // si foi enviado:
      $scope.idioma = localStorage.getItem("lang");
      
      $scope.conquistas = JSON.parse(localStorage.getItem('conquistas')) || '[]';

      var arrayConquistas = [];
      var arrayConquistasDerrota = [];
      var arrayConquistasEmpate = [];

      var id = idJogo.substring(0, idJogo.indexOf("|"));
      var keyUsuario = idJogo.substring(idJogo.indexOf("|") + 1);
      //console.log(id, keyUsuario);
      var idJogo = id;
      var itemList=[];

      console.log(" id: "+id);

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

     var resultUltimo = 0;
     var resultPenultimo = 0;
     var resultAntepenultimo = 0;

     var statusUltimo = 0;
     var statusPenultimo = 0;
     var statusAntepenultimo = 0;

     var placarUltimo = 0;
     var placarPenultimo = 0;
     var placarAntepenultimo = 0;

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

     // RECUPERAR TRES ÚLITMOS JOGOS
      var refJ = firebase.database().ref('desafio/desafios/temporadas/oficial/'+idTorneio+'/inscritos/'+keyUsuario);
      refJ.once("value").then(function(snapshot) {        
        $scope.infoJogo = snapshot.val();
        if($scope.infoJogo.jogados != 0){
          resultUltimo= $scope.infoJogo.placarUltimo;
          statusUltimo =  resultUltimo.substring(0, resultUltimo.indexOf("|"));  
          placarUltimo = resultUltimo.substring(resultUltimo.indexOf("|")+1);         

          if($scope.infoJogo.placarPenultimo != 0){
            resultPenultimo = $scope.infoJogo.placarPenultimo;
            statusPenultimo =  resultPenultimo.substring(0, resultPenultimo.indexOf("|"));  
            placarPenultimo = resultPenultimo.substring(resultPenultimo.indexOf("|")+1);
          }

          if($scope.infoJogo.placarAntepenultimo != 0){
            resultAntepenultimo= $scope.infoJogo.placarAntepenultimo;
            statusPenultimo =  resultAntepenultimo.substring(0, resultAntepenultimo.indexOf("|"));  
            placarAntepenultimo = resultAntepenultimo.substring(resultAntepenultimo.indexOf("|")+1);
          }

          $scope.jogados =  $scope.infoJogo.jogados; 
          jogados = $scope.jogados;
          sequenciaVitoria = $scope.infoJogo.sequenciaVitoria;
          invencibilidade = $scope.infoJogo.invencibilidade;
          anteriorVitoria = $scope.infoJogo.vitoria;
          anteriorDerrota = $scope.infoJogo.derrota;
          anteriorEmpate = $scope.infoJogo.empate;
          
          antGolsPro = $scope.infoJogo.golsPro;
          antGolsContra = $scope.infoJogo.golsContra;

          antPontos = $scope.infoJogo.pontos;
        }
      });



     function definirResultado(resultado){
      if($scope.idioma == "pt"){
        if(resultado == "Vitoria"){
          $scope.placarFinal = "Vitória";
        } else if(resultado == "Derrota"){
          $scope.placarFinal = "Derrota";
        } else {
          $scope.placarFinal = "Empate";
        }
      } else if($scope.idioma == "es"){
        if(resultado == "Vitoria"){
          $scope.placarFinal = "Victoria";
        } else if(resultado == "Derrota"){
          $scope.placarFinal = "Derrota";
        } else {
          $scope.placarFinal = "Empate";
        }
      } else {
        if(resultado == "Vitoria"){
          $scope.placarFinal = "Victory";
        } else if(resultado == "Derrota"){
          $scope.placarFinal = "Defeat";
        } else {
          $scope.placarFinal = "Draw";
        }
      }
     }

      console.log("conq "+conquistas);
      //Vitória armazenando as conquistas e os pontos dentro de arrayConquistas
      for(var key in conquistas){
        //-------------------------------------------------------------------------- PORTUGUES
        if($scope.idioma == "pt"){
          //vitoria
          var vit = conquistas[key].vitoria.pt;
          for(var c in vit){
            arrayConquistas.push([vit[c].titulo, vit[c].pontos]); 
          }
          //derrota
          var der = conquistas[key].derrota.pt;
          for(var d in der){
            arrayConquistasDerrota.push([der[d].titulo, der[d].pontos]); 
          }
          
          //empate
          var emp = conquistas[key].empate.pt;
          for(var e in emp){
            arrayConquistasEmpate.push([emp[e].titulo, emp[e].pontos]); 
          }
         
        //-------------------------------------------------------------------------- ESPAÑOL
        } else if($scope.idioma == "es"){
          var vit = conquistas[key].vitoria.es;    
          for(var c in vit){
            arrayConquistas.push([vit[c].titulo, vit[c].pontos]);  
          }
          //derrota
          var der = conquistas[key].derrota.es;
          for(var d in der){
            arrayConquistasDerrota.push([der[d].titulo, der[d].pontos]); 
          }
          //empate
          var emp = conquistas[key].empate.es;
          for(var e in emp){
            arrayConquistasEmpate.push([emp[e].titulo, emp[e].pontos]); 
          }
        //-------------------------------------------------------------------------- INGLES
        } else {
          var vit = conquistas[key].vitoria.en;
          for(var c in vit){
            arrayConquistas.push([vit[c].titulo, vit[c].pontos]);   
          }
          //derrota
          var der = conquistas[key].derrota.en;
          for(var d in der){
            arrayConquistasDerrota.push([der[d].titulo, der[d].pontos]); 
          }
          //empate
          var emp = conquistas[key].empate.en;
          for(var e in emp){
            arrayConquistasEmpate.push([emp[e].titulo, emp[e].pontos]); 
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
          golsPro = Number(antGolsPro) + Number(resultado1);
          golsContra = Number(antGolsContra) + Number(resultado2);
        if(resultado1 > resultado2 ){
          var resultadoFinal = "Vitoria"; 
          seVitoria = 1; 
          listarConquistaVitoria(resultado1, resultado2); 
          definirResultado(resultadoFinal);
  
          console.log(golsPro, golsContra);

        } else if(resultado1 < resultado2){
          var resultadoFinal = "Derrota";
          seDerrota = 1; 
          listaConquistasDerrota(resultado1, resultado2);
          definirResultado(resultadoFinal);           
        } else {
          var resultadoFinal = "Empate";
          seEmpate = 1; 
          listaConquistasEmpate(resultado1, resultado2);
          definirResultado(resultadoFinal); 
        } 

      // -----------------------------------------------------------------------------------------------------  Jogo Visitante 
      } 

      else if(ganhador == 'B'){
          golsPro = Number(antGolsPro) + Number(resultado2);
          golsContra = Number(antGolsContra) + Number(resultado1);  
         if(resultado1 < resultado2){
          var resultadoFinal = "Vitoria"
          seVitoria = 1; 
          listarConquistaVitoria(resultado2, resultado1); 
          definirResultado(resultadoFinal); 
  
        } else if(resultado1 > resultado2){
          var resultadoFinal = "Derrota";
          seDerrota = 1; 
          listaConquistasDerrota(resultado2, resultado1);
          definirResultado(resultadoFinal);
          
        } else {
          var resultadoFinal = "Empate";
          seEmpate = 1; 
          listaConquistasEmpate(resultado2, resultado1);
          definirResultado(resultadoFinal);
 
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

        var formatVitoria = 0;
      
        formatVitoria = res1+"-"+res2;
       
        //if(juego == 'A'){
          //--Vitória
          itemList.push([arrayConquistas[0][0], arrayConquistas[0][1]]);
          totalPontos = totalPontos + arrayConquistas[0][1];


          // si o oponente nao fez gol
          if(res2 == 0){
            //--Vitoria sem sofrer gols            
            if(res1 == 1){
              itemList.push([arrayConquistas[1][0], arrayConquistas[1][1]]);
              totalPontos = totalPontos + arrayConquistas[2][1];
            } else if(res1 == 2){
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

          // Doble, triple, cuáduple vitoria
          if(statusUltimo != 0){
            console.log("doble statusUltimo ");
            var somarIguais = 0;
            if(statusUltimo == "v" ){
              console.log("doble statusUltimo V ");
               if(placarUltimo == formatVitoria){
                 console.log("doble placar ",formatVitoria, placarUltimo);
                  somarIguais = 1;
               }
               if(placarUltimo == formatVitoria && placarPenultimo == formatVitoria){
                somarIguais = 2;
                console.log("triple placar ",formatVitoria, placarUltimo, placarPenultimo);
               }
               if(placarUltimo == formatVitoria && placarPenultimo == formatVitoria && placarAntepenultimo == formatVitoria){  
                somarIguais = 3;
                console.log("cuadruplo placar ",formatVitoria, placarUltimo, placarPenultimo, placarAntepenultimo);
               }
                switch(somarIguais){
                  case 1:
                    itemList.push([arrayConquistas[13][0], arrayConquistas[13][1]]);
                    totalPontos = totalPontos + arrayConquistas[13][1];
                    break;
                  case 2:
                    itemList.push([arrayConquistas[14][0], arrayConquistas[14][1]]);
                    totalPontos = totalPontos + arrayConquistas[14][1];
                    break;
                  case 3:
                    itemList.push([arrayConquistas[15][0], arrayConquistas[15][1]]);
                    totalPontos = totalPontos + arrayConquistas[15][1];
                     break;
                  default:
                  console.log("nao há repetidos");
                }
            }
          }

          // Sequencia de vitoria
          if(sequenciaVitoria > 1){
            var sequencia = sequenciaVitoria + 1;
            if(sequencia == 3){
              itemList.push([arrayConquistas[16][0], arrayConquistas[16][1]]);
              totalPontos = totalPontos + arrayConquistas[16][1];
            } else if(sequencia == 4){
              itemList.push([arrayConquistas[17][0], arrayConquistas[17][1]]);
              totalPontos = totalPontos + arrayConquistas[17][1];
            } else if(sequencia == 5){
              itemList.push([arrayConquistas[18][0], arrayConquistas[18][1]]);
              totalPontos = totalPontos + arrayConquistas[18][1];
            } else if(sequencia == 6){
              itemList.push([arrayConquistas[19][0], arrayConquistas[19][1]]);
              totalPontos = totalPontos + arrayConquistas[19][1];
            } else {
              itemList.push([arrayConquistas[20][0], arrayConquistas[20][1]]);
              totalPontos = totalPontos + arrayConquistas[20][1];
            }
          }

          //Invencibilidad
          if(invencibilidade > 1){
            var sequencia = invencibilidade + 1;
            if(sequencia == 3){
              itemList.push([arrayConquistas[21][0], arrayConquistas[21][1]]);
              totalPontos = totalPontos + arrayConquistas[21][1];
            } else if(sequencia == 4){
              itemList.push([arrayConquistas[22][0], arrayConquistas[22][1]]);
              totalPontos = totalPontos + arrayConquistas[22][1];
            } else if(sequencia == 5){
              itemList.push([arrayConquistas[23][0], arrayConquistas[23][1]]);
              totalPontos = totalPontos + arrayConquistas[24][1];
            } else if(sequencia == 6){
              itemList.push([arrayConquistas[24][0], arrayConquistas[24][1]]);
              totalPontos = totalPontos + arrayConquistas[24][1];
            } else{
              itemList.push([arrayConquistas[25][0], arrayConquistas[25][1]]);
              totalPontos = totalPontos + arrayConquistas[25][1];
            }
          }

     }

     function listaConquistasEmpate(res1, res2){
      console.log("Empate "+res1, res2);
        if(res1 == 1){
          itemList.push([arrayConquistasEmpate[0][0], arrayConquistasEmpate[0][1]]);
          totalPontos = totalPontos + arrayConquistasEmpate[0][1];
        } else if(res1 == 2){
          itemList.push([arrayConquistasEmpate[0][0], arrayConquistasEmpate[0][1]]);
          totalPontos = totalPontos + arrayConquistasEmpate[0][1];
        } else if(res1 == 3){
          itemList.push([arrayConquistasEmpate[1][0], arrayConquistasEmpate[1][1]]);
          totalPontos = totalPontos + arrayConquistasEmpate[1][1];
        } else if(res1 == 4){
          itemList.push([arrayConquistasEmpate[2][0], arrayConquistasEmpate[2][1]]);
          totalPontos = totalPontos + arrayConquistasEmpate[2][1];
        } else {
          itemList.push([arrayConquistasEmpate[3][0], arrayConquistasEmpate[3][1]]);
          totalPontos = totalPontos + arrayConquistasEmpate[3][1];
        }
     }

     function listaConquistasDerrota (res1, res2){
      var diferencaDerrota = res2 - res1;
      console.log("DIF ",diferencaDerrota);
        if(diferencaDerrota == 1){
          if(res1 == 2){
            console.log("DIF 2 ",arrayConquistasDerrota[0][0], arrayConquistasDerrota[0][1]);
             itemList.push([arrayConquistasDerrota[0][0], arrayConquistasDerrota[0][1]]);
             totalPontos = totalPontos + arrayConquistasDerrota[0][1];
          } else if(res1 == 3){
            itemList.push([arrayConquistasDerrota[1][0], arrayConquistasDerrota[1][1]]);
             totalPontos = totalPontos + arrayConquistasDerrota[1][1];
          } else {
            itemList.push([arrayConquistasDerrota[2][0], arrayConquistasDerrota[2][1]]);
             totalPontos = totalPontos + arrayConquistasDerrota[2][1];
          }
        } else{
          itemList.push(["Derrota", 0]);
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


    // Enviar resposta
    $scope.enviarResultado = function (){
      Utils.message(Popup.loading_a, Popup.loading);
      var zerarSequenciaVitoria;
      var zerarInvencibilidade;
      var novoResultado;
      if(seVitoria == 0){
        zerarSequenciaVitoria = 0;
      } else {
        zerarSequenciaVitoria = sequenciaVitoria +1;
        if(resultado1 > resultado2){
          novoResultado = "v|"+resultado1+"-"+resultado2;
        } else {
          novoResultado = "v|"+resultado2+"-"+resultado1;
        }
      }

      if(seDerrota == 1){
        zerarInvencibilidade = 0;
        if(resultado1 > resultado2){
          novoResultado = "d|"+resultado1+"-"+resultado2;
        } else {
          novoResultado = "d|"+resultado2+"-"+resultado1;
        }
      } else {
        zerarInvencibilidade = invencibilidade + 1;
      }

      if(seEmpate == 1){
        if(resultado1 > resultado2){
          novoResultado = "e|"+resultado1+"-"+resultado2;
        } else {
          novoResultado = "e|"+resultado2+"-"+resultado1;
        }
      }

      var conquistasEnviar = [];
        for(var i =0; i < itemList.length; i++){
          //console.log(itemList[i][0]+":"+itemList[i][1]);
          conquistasEnviar.push(itemList[i][0]+":"+itemList[i][1]);
        }

      console.log(resultPenultimo, "ultimos :"+resultUltimo, 
        "novoResultado: ",novoResultado,
        "penultimo: "+resultUltimo, 
        "antepenultimo: "+resultPenultimo,  
        "resultado 1 "+resultado1, 
        "resultado 2 "+resultado2, 
        "jogados: ",jogados+1, 
        "vitoria: ",anteriorVitoria+seVitoria, 
        "Derrota: ",anteriorDerrota+seDerrota,
        "empate: ",anteriorEmpate+seEmpate,
        "invencibilidade ",zerarInvencibilidade, 
        "sequenciaVitoria ", zerarSequenciaVitoria,
        "itemList ", itemList);

      console.log("iniciando update resumo");
      firebase.database().ref().child('desafio/desafios/temporadas/oficial/'+idTorneio+'/inscritos/'+keyUsuario).update({
            vitoria:anteriorVitoria+seVitoria,
            pontos:antPontos + totalPontos,
            jogados:jogados+1,
            derrota:anteriorDerrota+seDerrota,
            empate:anteriorEmpate+seEmpate,
            sequenciaVitoria:zerarSequenciaVitoria,
            invencibilidade:zerarInvencibilidade,
            placarUltimo:novoResultado,
            placarPenultimo:resultUltimo,
            placarAntepenultimo:resultPenultimo,
            golsPro:golsPro,
            golsContra:golsContra
        }).then(function(response) {
          Utils.message(Popup.loading_b, Popup.loading);
            console.log("response1: "+response); 
            console.log("iniciando update jogo");
            firebase.database().ref().child('desafio/desafios/temporadas/oficial/'+idTorneio+'/inscritos/'+keyUsuario+'/jogos/'+$scope.chat).update({                  
              estado:"Terminado",
              pontos:totalPontos,
              conquistas:conquistasEnviar,
              placar:novoResultado
            }).then(function(response) {
              Utils.message(Popup.loading_a, Popup.loading);
              console.log("response2: "+response);
              console.log("iniciando update siguiente jogo");
              var somaJogo = Number(id) + 1;
              var siguienteJogo = "jogo" + somaJogo;
              firebase.database().ref().child('desafio/desafios/temporadas/oficial/'+idTorneio+'/inscritos/'+keyUsuario+'/jogos/'+siguienteJogo).update({                  
                bloqueado:false
              }).then(function(response) {

                console.log("response3: "+response);
                console.log("final update siguiente jogo");    
                var backCount = 1;                                
                $rootScope.$ionicGoBack = function(backCount) {
                    $ionicHistory.goBack(backCount);
                };
                Utils.message(Popup.loading_b, Popup.loading).then(function() {
                    $rootScope.$ionicGoBack();
                  })
                
              });
            });
        }); 
    }  

  }]); //ctrl
})();

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
permanencia
subir
Titulo
---------------------------------
6 Divisao
permanencia 10
pontos subir /6 
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



*/