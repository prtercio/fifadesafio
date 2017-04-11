(function(){
    'use strict';

  var fil = angular.module('App.FiltroStatus',[]);

  fil.filter('filtroStatus', function() {
    return function(input) {
      var resul;

      var dato = input;
      var status = input;
      
      var idioma = localStorage.getItem("lang");

      if (!input) {
        if(idioma == "es"){
          resul = "Próximo...";
        } else if(idioma == "pt"){
          resul = "Próximo...";
        } else {
          resul = "Next...";
        }
        return resul;
      } else {

        if(status == "v"){
          if(idioma == "es"){
            resul = "Victoria";
          } else if(idioma == "pt"){
            resul = "Vitória";
          } else {
            resul = "Win";
          }
        } else if(status == "d"){
          if(idioma == "es"){
            resul = "Derrota";
          } else if(idioma == "pt"){
            resul = "Derrota";
          } else {
            resul = "Defead";
          }
        } else {
          if(idioma == "es"){
            resul = "Empate";
          } else if(idioma == "pt"){
            resul = "Empate";
          } else {
            resul = "Draw";       }
        }
      }     
    
      return resul;
    };
  });
 

})();