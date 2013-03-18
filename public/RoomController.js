app.controller( 'RoomController', ['$resource', '$scope', '$routeParams', 'RoomsModel',  function ($resource, $scope, $routeParams, RoomsModel) {
	$scope.room = RoomsModel.getSingle({roomId: $routeParams.id});
	now.joinRoom($routeParams.id);

	now.receiveUser = function(theUser) {
		$scope.$apply( function() {
			$scope.room.users.push(theUser);
			var newUserJoinedMsg = {};
			newUserJoinedMsg.date = theUser.joined;
			newUserJoinedMsg.user = '+';
			newUserJoinedMsg.msg = theUser.name + ' has entered!';
			$scope.room.messages.push(newUserJoinedMsg);
		})
	}

	$scope.sendMessage = function () {
		if($scope.messagetext !== "")  {
			now.postMessage($scope.messagetext, $routeParams.id);
			$scope.messagetext = "";
		}
	};

	now.receiveMessage = function(theMessage) {
		$scope.$apply(function () {
			$scope.room.messages.push(theMessage);
		});
	};

	function enterKeyPress(e) {
		if (e.keyCode == 13) {
			console.log('enterKeyPress');
			$scope.sendMessage();
		}
	}	
}]);