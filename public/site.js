
var app = angular.module('PontoApp', ['ngResource', 'ui']);


app.config(function($routeProvider, $locationProvider) {
	//$locationProvider.html5Mode(true);
	$routeProvider.
	 	when ('/rooms/:id', { 
	 		templateUrl: '/templates/room.html',
	 	 	controller: 'RoomController'
	 	}).
	 	when ('/rooms', {
	 		templateUrl: '/templates/rooms.html',
	 		controller: 'RoomsController'
	 	}).
	 	when ('/', {
	 		redirectTo: '/login'
	 	}).
	 	when ('/login', {
	 		templateUrl: '/templates/login.html',
	 		controller: 'LoginController'
	 	}).
	 	otherwise ( { redirectTo: '/error'});
});




// now.ready(function(){
//     // "Hello World!" will print on server
//     now.login('Bjarki');
// });