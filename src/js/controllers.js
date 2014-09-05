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

var EMAIL_REGEX = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
cbnApp.directive('validateEmail', function() {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$parsers.unshift(function(viewValue) {
		if (EMAIL_REGEX.test(viewValue)) {
          // it is valid
          ctrl.$setValidity('email', true);
          return viewValue;
        } else {
          // it is invalid, return undefined (no model update)
          ctrl.$setValidity('email', false);
          return undefined;
        }
      });
    }
  };
});