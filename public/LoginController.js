app.controller( 'LoginController', ['$resource', '$scope', '$routeParams', '$location', 'UsersModel', function ($resource, $scope, $routeParams, $location, UsersModel) {
	if (typeof(now.name) === 'undefined') {
		console.log('no user!');
		$scope.login = function () {
			// console.log($scope.username);
			// console.log('Gonna log in (client): ', username);
			var loggedIn = UsersModel.login({username: $scope.username});
			now.name = loggedIn.username;
			console.log(now.name);
			$scope.name = loggedIn.username;
			//Lets redirect to /rooms
			$location.path('/rooms');
		}
	}
	else {
		console.log('we have a user!: ', now.name);
		$location.path('/rooms');
	}
}]);