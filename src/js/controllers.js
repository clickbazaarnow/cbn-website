var cbnApp = angular.module('cbn', []);

cbnApp.controller('registrationCtrl', function($scope, $http) {
	$scope.init = function(mode) {
		if (mode == 'edit') {
			$http.get('/user/1234').
			success(function(data, status, headers, config) {
				if(status == 200) {
					$scope.name = data.name;
					$scope.email = data.email;
					$scope.mobile = data.mobile;
				}
			});
		}
	}
});