app.controller( 'LoginController', ['$resource', '$scope', '$routeParams', '$location', '$http', function ($resource, $scope, $routeParams, $location, $http) {
	$scope.error = "";
	if (socket.username === '') {
		$scope.login = function () {
			if (typeof($scope.username) === 'undefined') {
				$scope.error = 'Please enter username';
				return;
			}
			var url = '/login/' + $scope.username;
			$http({method: 'POST', url: url}).
				success(function (data, status, headers, config) {
					if (data.error === true) {
						$scope.error = 'Username taken, please choose anotherone';
						return;
					}
					else {
						$location.path('/rooms');
						socket.username = $scope.username;
						$scope.name = $scope.username;
					}
				}).
				error(function (data, status, headers, config) {
					console.log(data);					
				});
			socket.emit('set username', {username: $scope.username});
		};
	}
	else {
		$location.path('/rooms');
	}
}]);