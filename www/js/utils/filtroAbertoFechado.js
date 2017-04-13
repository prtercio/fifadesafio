(function(){
    'use strict';

  var filaf = angular.module('App.FiltroAbertoFechado',[]);

  filaf.filter('filtroAbertoFechado', function() {
    return function(input) {
      var resul;

      var dato = input;
      var status = input;      
      var idioma = localStorage.getItem("lang");

      if (!input) {        
        return input;
      } else {
        if(idioma == "es"){
          if(input == "Aberto"){
            resul = "Abierto";
          } else {
            resul = "Cerrado"
          }          
        } else if(idioma == "pt"){
           if(input == "Aberto"){
            resul = input;
          } else {
            resul = input;
          }    

        } else {
           if(input == "Aberto"){
            resul = "Open"
          } else {
            resul = "Closed"
          }    
        }      
      }      
      return resul;
    };
  });
 

})();