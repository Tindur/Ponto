app.controller( 'LoginController', ['$resource', '$scope', '$routeParams', '$location', '$http', 'UsersModel', function ($resource, $scope, $routeParams, $location, $http, UsersModel) {
	$scope.error = "";
	if (typeof(now.name) === 'undefined') {
		console.log('no user!');
		$scope.login = function () {
			if (typeof($scope.username) === 'undefined') {
				$scope.error = 'Please enter username';
				return;
			}
			// console.log($scope.username);
			// console.log('Gonna log in (client): ', username);
			// var response = [];
			// var loggedIn = UsersModel.login({username: $scope.username});
			var url = '/login/' + $scope.username;
			$http({method: 'POST', url: url}).
				success(function (data, status, headers, config) {
					if (data.error === true) {
						$scope.error = 'Username taken, please choose anotherone';
						return;
					}
					else {
						$location.path('/rooms');
						now.name = $scope.username;
						$scope.name = $scope.username;
					}
				}).
				error(function (data, status, headers, config) {
					console.log(data);					
				})
			// console.log('back from login', typeof(loggedIn));
			// console.log(loggedIn, 'error');
			// if (loggedIn.error === true) {
			// 	$scope.error = 'Username taken, please choose anotherone';
			// 	return;
			// }
			// now.name = loggedIn.username;
			// console.log(now.name);
			// $scope.name = loggedIn.username;
			// //Lets redirect to /rooms
			
		}
	}
	else {
		console.log('we have a user!: ', now.name);
		$location.path('/rooms');
	}
}]);