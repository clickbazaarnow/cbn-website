var cbnApp = angular.module('cbn', []);
cbnApp.factory('authInterceptor', function ($rootScope, $q, $window) {
  return {
    request: function (config) {
      config.headers = config.headers || {};
      if ($window.sessionStorage.token) {
        config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
      }
      return config;
    },
    response: function (response) {
      if (response.status === 401) {
        // handle the case where the user is not authenticated
      }
      return response || $q.when(response);
    }
  };
});

cbnApp.config(function ($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
});

cbnApp.controller('registrationCtrl', function($scope, $http, $window) {
    $scope.init = function(mode) {
        console.log("user name : " + $window.sessionStorage.name);
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

    $scope.createAccount = function() {
        var custInfo = {};
        custInfo.name = $scope.name;
        custInfo.username = $scope.username;
        custInfo.mobile = $scope.mobile;
        custInfo.password = $scope.password;
        custInfo.addressLine1 = $scope.addressLine1;
        custInfo.addressLine2 = $scope.addressLine2;
        custInfo.city = $scope.city;
        custInfo.state = $scope.state;
        custInfo.zipcode = $scope.zipcode;
        $http({
            url:'/customer',
            method:"POST",
            data:custInfo,
            headers: {'Content-Type': 'application/json'}
        }).success(function(data, status, headers, config) {
            console.log("POST status is " + status);
            console.log("data is " + JSON.stringify(data));
        }).error(function(data, status, headers, config) {
            console.log("POST status is " + status);
        });
    }
});

cbnApp.controller('loginCtrl', function($scope, $http, $location, $window) {
    $scope.login = function() {
        var loginInfo = {};
        loginInfo.username = $scope.username;
        loginInfo.password = $scope.password
        console.log("authenticating the user : " + JSON.stringify(loginInfo));
        $http({
            url:'/login',
            method:"POST",
            data:loginInfo,
            headers: {'Content-Type': 'application/json'}
        }).success(function(data, status, headers, config) {
            console.log("POST status is " + status);
            console.log("data is " + JSON.stringify(data));
            $window.sessionStorage.token = data.token;
            $window.sessionStorage.cbnUser = data.username;
            $window.location.href = '/render?name=main';
        }).error(function(data, status, headers, config) {
            console.log("POST status is " + status);
            console.log("data is " + JSON.stringify(data));
            delete $window.sessionStorage.token;
        });
    }
});
cbnApp.controller('layoutCtrl', function($scope, $window) {
    $scope.init = function() {
        $scope.shouldsignin = true;
        if($window.sessionStorage.cbnUser) {
            $scope.isUsername = true;
            $scope.shouldsignin = false;
            $scope.username = "Hello, " + $window.sessionStorage.cbnUser
        }
    }
    $scope.accountLink = function() {
        if(!$window.sessionStorage.cbnUser || $window.sessionStorage.cbnUser == 0) {
            $window.location.href = '/render?name=login';
        } else {
            //TODO redirect to Customer account page
        }
    }
    $scope.signout = function() {
        console.log("signout is called");
        $window.sessionStorage.token = "";
        $window.sessionStorage.cbnUser = "";
        $scope.shouldsignin = true;
        $scope.isUsername = false;

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