app.factory( 'RoomsModel', ['$resource', function($resource ) {
	var Rooms = $resource(
			'/rooms/:roomId',
			{ roomId: '@roomId' },
			{
				getAll: { method: 'GET', isArray: true },
				getSingle: {method: 'GET'},
				createRoom: {method: 'POST'},
			}
	);
	return Rooms;
}]);

