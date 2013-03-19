app.controller( 'RoomsController', ['$resource', '$scope', '$location', 'RoomsModel',  function ($resource, $scope, $location ,RoomsModel) {
	
	if (socket.username !== '') {
		socket.emit('leave room', {
			user: socket.username
		});
		$scope.rooms = RoomsModel.getAll();
		$scope.username = socket.username;
		$scope.kickmessage = '';

		$scope.createRoom = function () {
			if($scope.roomName !== "" && $scope.roomTopic !== "") {
				socket.emit('create room', { 
					roomName: $scope.roomName, 
					roomTopic: $scope.roomTopic 
				});
				$scope.roomName = "";
				$scope.roomTopic = "";
			}
		};

		socket.on('receive room', function(theRoom) {
			$scope.$apply(function () {
				$scope.rooms.push(theRoom);
			});
		});
	}
	else {
		$location.path('/login');
	}
}]);