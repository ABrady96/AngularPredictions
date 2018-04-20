'use strict';

angular.module('myApp.signup', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/signup', {
            templateUrl: 'signup/signup.html',
            controller: 'postCtrl'
        });
    }])

    .controller('postCtrl', ["$scope", '$http', '$httpParamSerializer', '$rootScope',
        function ($scope, $http, $httpParamSerializer, $rootScope) {
            $scope.user = {};
            $scope.submitForm = function () {
                $scope.data = {username: $scope.username, email: $scope.email, password: $scope.password};
                $http({
                    method: 'POST',
                    url: 'http://178.62.31.229/Register/',
                    data: $httpParamSerializer($scope.user),
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).then(function createSuccess(response) {
                    console.log(response.data);
                    $rootScope.userLoggedIn = true;
                }, function errorCallback(response) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                });
            }
        }]);
