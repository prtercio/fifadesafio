$http({
        //url: 'https://xboxapi.com/v2/'+idUsuario+'/presence',
        //url: 'https://xboxapi.com/v2/2535419577962363/presence', //Menino
        url:urlLocal,
         //url: 'https://xboxapi.com/v2/2533274961032793/presence', fah cesar 
         //url: 'https://xboxapi.com/v2/2533275001163369/presence',
         //BenbaodanJr
                //url:'https://xboxapi.com/v2/2535428583930750/presence', 
         method: 'GET',
         headers: {
          'Access-Control-Allow-Origin': '*',                
                    'X-AUTH': '5056c2081205740a2d765ebe3ff5807dd4178a87', //BenbaodanJr
                    'Accept-Language':'en-US',
                    'Content-Type':'application/json, text/plain, */*'
                  }
                }).then(function(resp) {
                  
                  
                  $scope.respuesta = resp.data;
                  console.log("0 RichPresence: "+richPresence, $scope.respuesta);  
                  //var totalOnline = resp.data.devices[0].titles.length;
                  if(resp.data.state === "Online"){                      

                    $scope.status = false;
                    $scope.lista = false;
                    $scope.verButtonAdicionar = false;
                    $scope.verIonRadioJogos = true; 


                    if(resp.data.devices[0].titles.length == 1){
                      $scope.semFifa = "Please goto Fifa 1.";
                      richPresence = false;                 
                    } else if(resp.data.devices[0].titles.length == 2){
                      console.log("Title length 2 "+resp.data.devices[0].titles.length);

                      if(resp.data.devices[0].titles[1].id === 69094388){   

                        richPresence  = resp.data.devices[0].titles[1].activity.richPresence;                            
                        
                        $scope.status = true;
                        $scope.semFifa = "Status: "+richPresence; 
                        
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
                   } else {
                    if(resp.data.devices[0].titles[1].id === 69094388){ 
                      console.log("Title length 3 "+resp.data.devices[0].titles.length);               
                      richPresence  = resp.data.devices[0].titles[1].activity.richPresence;
                      console.log("1 richPresence", richPresence);
                      if(encontrarMenu(richPresence) == true){
                        $scope.status = true;
                        $scope.semFifa = "Status: "+richPresence;

                      } else {
                       $ionicLoading.hide();
                       var alertPopup = $ionicPopup.alert({
                        title: 'Opps!',
                        template: "<p align='center' class='vermelho padding'>{{'RECUPERARCOMMENU' | translate}}</p>"
                      });

                       alertPopup.then(function(res) {
                        console.log('cerrar');
                      });
                       $scope.timeCasa = false;
                       richPresence = false;
                       $scope.status = false;
                       
                     }
                   } else {
                    $scope.timeCasa = false;
                    $scope.semFifa = "Status: "+richPresence;
                    console.log("2 richPresence", richPresence);
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
                  console.log("3 richPresence", richPresence);
                  var fifaMenu = 'FIFA 17 Temporadas (en los menús)';
                  if(fifaMenu === richPresence){
                    $scope.placar = "No se mostrará el resultado";
                    $scope.status = true;
                  } else {
                   var idFifa = 69094388;
                   $scope.lista = true;
                   $scope.status = false;
                   
                     //console.log("Resp2: "+resp.data.devices[0].titles[0].activity.richPresence);               
                     //if(lentLocal == 1 && lenVisitante == 1){}
                     resultadoFifa = richPresence;
                     console.log("4 richPresence", richPresence);
                     //console.log("richPresence "+richPresence);
                     //resultadoFifa = resp.data.devices[0].titles[0].activity.richPresence;
                     atribuirValores(resultadoFifa);

                   }
                 }                 

               } else {
                console.log("Off");
                $ionicLoading.hide();
                var alertPopup = $ionicPopup.alert({
                 title: 'Opps!',
                 template: "<p align='center'><strong>"+gamerSeleccionado+"</strong> {{'ESTAOFF' | translate}}</p><br><p align='center' class='vermelho padding'>{{'OJOGORECUPERADO' | translate}}</p>"
               });

                alertPopup.then(function(res) {
                 console.log('cerrar');
               });
              }

              

            });

