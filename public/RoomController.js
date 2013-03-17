app.controller( 'RoomController', ['$resource', '$scope', '$routeParams', 'RoomsModel',  function ($resource, $scope, $routeParams, RoomsModel) {
	$scope.room = RoomsModel.getSingle({roomId: $routeParams.id});

	$scope.sendMessage = function () {
		now.postMessage($scope.messagetext, $routeParams.id);
	};

	now.receiveMessage = function(theMessage) {
		$scope.$apply(function () {
			$scope.room.messages.push(theMessage);
		});
	};
}]);