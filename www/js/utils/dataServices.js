var service = angular.module('App.dataServices',[]);

service.factory('dataService', function($rootScope, $window, $http, $q){
	 var savedData = {}
	 function set(data) {
	   savedData = data;
	 }
	 function get() {
	  return savedData;
	 }

	 return {
	  set: set,
	  get: get
	 }
});