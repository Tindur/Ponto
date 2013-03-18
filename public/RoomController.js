app.controller( 'RoomController', ['$resource', '$scope', '$routeParams', 'RoomsModel',  function ($resource, $scope, $routeParams, RoomsModel) {
	$scope.room = {};
	$scope.room.users = [];

	now.ready(function(){
		now.joinRoom($routeParams.id);
	});	
	$scope.room = RoomsModel.getSingle({roomId: $routeParams.id});
	console.log('room controller');

	now.receiveUser = function(theUser) {
		$scope.$apply( function() {
			console.log(theUser, 'theUser');
			$scope.room.users.push(theUser);
			console.log('after push ');
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