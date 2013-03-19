app.controller( 'RoomController', ['$resource', '$scope', '$routeParams', '$location', 'RoomsModel',  function ($resource, $scope, $routeParams, $location, RoomsModel) {
	
	if (socket.username !== '') {
		$scope.room = {};

		socket.emit('join room', {roomId: $routeParams.id});
		$scope.room = RoomsModel.getSingle({roomId: $routeParams.id});

		socket.on('receive user', function(theUser) {
			$scope.$apply( function() {
				$scope.room.users.push(theUser);
				var newUserJoinedMsg = {};
				newUserJoinedMsg.date = theUser.joined;
				newUserJoinedMsg.user = '+';
				newUserJoinedMsg.msg = theUser.name + ' has entered!';
				$scope.room.messages.push(newUserJoinedMsg);
			});
		});


		$scope.sendMessage = function () {
			if($scope.messagetext !== "")  {
				var msg = $scope.messagetext.split(' ');
				var command = msg[0];
				switch(command) {
					case '/kick':
						var adminCheck = $scope.room.admin === socket.username;
						if (adminCheck) {
							if (typeof(msg[1]) !== 'undefined'){
								socket.emit('kick user', {
									user: msg[1],
									roomId: $routeParams.id 
								});
							}
						}
						else {
							var message = {
								msg: 'You are not admin!',
								date: new Date(),
								user: '!'
							};
							$scope.room.messages.push(message);
						}
						break;
					default: // probably a message!
						socket.emit('post message', {
							msg: $scope.messagetext,
							roomId: $routeParams.id
						});
				}
				$scope.messagetext = "";
			}
		};

		socket.on('receive message', function(message) {
			$scope.$apply(function () {
				$scope.room.messages.push(message);
			});
		});

		socket.on('kick user client', function(user) {
			$scope.room.users.splice($scope.room.users.indexOf(user.user),1);
		});

		socket.on('user left', function(user) {
			var date = new Date();
			var newUserLeftMsg = {};
			newUserLeftMsg.date = date;
			newUserLeftMsg.user = '-';
			newUserLeftMsg.msg = user.user + ' has left us!';
			$scope.$apply(function () {
				$scope.room.messages.push(newUserLeftMsg);
				$scope.room.users.splice($scope.room.users.indexOf(user.user),1);
			});
		});

		socket.on('move user', function(user) {
			alert('You\'ve been kicked, friendo. Now go and think what you could have done better!');
			$location.path('/rooms');
		});
	}
	else {
		$location.path('/login');
	}
}]);