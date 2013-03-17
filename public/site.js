
var app = angular.module('PontoApp', ['ngResource']);

app.config(function($routeProvider, $locationProvider) {
	$locationProvider.html5Mode(true);
	$routeProvider.
	 	when ('/rooms/:id', { 
	 		templateUrl: '/templates/room.html',
	 	 	controller: 'RoomController',
	 	 	params: 1
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
	 	otherwise ( { redirectTo: '/'});
});

// now.ready(function(){
//     // "Hello World!" will print on server
//     now.login('Bjarki');
// });