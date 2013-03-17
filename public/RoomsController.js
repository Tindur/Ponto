app.controller( 'RoomsController', ['$resource', '$scope', 'RoomsModel',  function ($resource, $scope, RoomsModel) {
	$scope.rooms = RoomsModel.getAll();
	$scope.username = now.name;

	$scope.createRoom = function () {
		now.postRoom($scope.roomName, $scope.roomTopic);
	};

	now.receiveRoom = function(theRoom) {
		$scope.$apply(function () {
			$scope.rooms.push(theRoom);
		});
	};
}]);