app.factory( 'UsersModel', ['$resource', function($resource ) {
	var Users = $resource(
			'/login/:username',
			{username: '@username'},
			{
				login: {method: 'POST'},
			}
	);
	return Users;
}]);