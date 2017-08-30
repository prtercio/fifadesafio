var menu = angular.module( 'App.Menu', [] );
menu.controller( 'MenuCtrl', function( $scope, $localStorage ) {
	$scope.email = $localStorage.account.email;
} );