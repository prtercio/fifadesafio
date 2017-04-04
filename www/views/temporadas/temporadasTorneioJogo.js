(function(){
  'use strict';

  var temporadasJogo = angular.module('App.CtrlTempTorneioJogo', []);

  temporadasJogo.controller('CtrlTempTorneioJogo', [
    '$scope',
    'idJogo',
    '$http',
    '$ionicLoading',
    '$ionicPopup',
    function(
      $scope,
      idJogo,
      $http,
      $ionicLoading,
      $ionicPopup
  ){
      var idioma = window.localStorage.getItem('lang');

      if(idioma == "es"){
        $scope.idioma = 1;        
      } else {
        $scope.idioma = 0;
      }

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

    var listauser = firebase.database().ref('fifadare/users');
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
      if(ganhador == 'A'){
        if(resultado1 > resultado2){
          console.log("Vc ganhou o jogo. "+$scope.placar);
          $scope.placarFinal = "Vitoria";
        } else if(resultado1 < resultado2){
          console.log("Vc perdeu o jogo. "+$scope.placar);
          $scope.placarFinal = "Derrota";
        } else {
          console.log("Vc empatou o jogo. "+$scope.placar);
          $scope.placarFinal = "Empate";
        }  
      } else if(ganhador == 'B'){
         if(resultado1 < resultado2){
          console.log("Vc ganhou o jogo. "+$scope.placar);
          $scope.placarFinal = "Vitoria"
        } else if(resultado1 > resultado2){
          console.log("Vc perdeu o jogo. "+$scope.placar);
          $scope.placarFinal = "Derrota";
        } else {
          console.log("Vc empatou o jogo. "+$scope.placar);
          $scope.placarFinal = "Empate";
        }  
      } else {
        ganhador = false;
      }

      if(ganhador != false){
         
      }
     }

      var urlLocal = 'js/BD/presenceJonathan.json';

     $scope.recuperarJogo = function(){
      $scope.status = false;
      $scope.lista = false;

      $ionicLoading.show().then(function(){
                //console.log("Loading Jogos");
             });
      $scope.placar = "";
      $scope.semFifa = "";
      $scope.respuesta = "";
      var richPresence = false;

      var idioma;
      if(window.localStorage.getItem("lang") === "pt"){
        idioma = "pt-BR";
      } else {
        idioma = "es-ES";
      }

        $http({
          //url: 'https://xboxapi.com/v2/'+idUsuario+'/presence',
          url: 'https://xboxapi.com/v2/2535419577962363/presence', //Menino
           //url: 'https://xboxapi.com/v2/2533274961032793/presence', fah cesar 
           //url: 'https://xboxapi.com/v2/2533275001163369/presence',
          method: 'GET',
          headers: {
                      'Access-Control-Allow-Origin': '*',                
                      'X-AUTH': '5056c2081205740a2d765ebe3ff5807dd4178a87', //Benbaodan
                      //'X-AUTH' : '5056c2081205740a2d765ebe3ff5807dd4178a87', // BenbaodanJr
                      //'X-Authorization':idXbl,
                      //'Access-Control-Allow-Methods': 'GET',
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
                       
                       var resultado = richPresence;
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