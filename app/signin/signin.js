'use strict';

angular.module('myApp.signin', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('signin', {
            templateUrl: 'signin/signin.html',
            controller: 'SigninController',
            access: {restricted: true}
        });
    }])

    .controller('SigninController', ['$scope', '$http', '$location', 'AuthService',
        '$httpParamSerializer', '$rootScope',
        function ($scope, $http, $location, AuthService, $httpParamSerializer, $rootScope) {
            $scope.user = {};
            $rootScope.userLoggedIn = false;
            $scope.signin = function () {
                $scope.error = false;
                $http({
                    method: 'POST',
                    url: 'http://178.62.31.229/AuthenticateUser/',
                    data: $httpParamSerializer($scope.user),
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).then(function createSuccess(response) {
                    if (response.status === 200) {
                        $rootScope.userLogged = true;
                        // console.log(response);
                        $location.path('/');
                        $scope.signInForm = {};
                    }
                    else {
                        $scope.error = true;
                        console.log(response);
                        $scope.errorMessage = "Invalid username and/or password";
                        $scope.signInForm = {};
                    }
                });
                    //
                    // }).catch( function errorCallback(response) {
                    //
                    // });
                
                // AuthService.login($scope.user.username, $scope.user.password)
                //     .then(function () {
                //         $location.path('/');
                //         $scope.disabled = false;
                //         $scope.signInForm = {};
                //     })
                //     .catch(function () {
                //         $scope.error = true;
                //         $scope.errorMessage = "Invalid username and/or password";
                //         $scope.disabled = false;
                //         $scope.signInForm = {};
                //     });
                // $http({
                //     method: 'POST',
                //     url: 'http://127.0.0.1:5000/SignIn',
                //     data: {username: $scope.username, password: $scope.password},
                //     headers: {'Content-Type': 'application/json'}
                // }).then(function createSuccess(response) {
                //     console.log(response.data)
                // });
            };

            $scope.getUser = function () {
                $scope.error = false;
                $http({
                    method: 'POST',
                    url: 'http://178.62.31.229/getUser/',
                    data: $httpParamSerializer($scope.user),
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).then(function createSuccess(response) {
                    if (response.data.username === $scope.user.username && response.data.password === $scope.user.password) {
                        $rootScope.userLogged = true;
                        $rootScope.user_id = response.data.id;
                        $scope.signInForm = {};
                    }
                    else {
                        $scope.error = true;
                        $rootScope.user_id = response.data.id;
                        $scope.errorMessage = "Invalid username and/or password";
                        $scope.signInForm = {};
                    }
                });
            };

            function isLoggedIn() {
                if($rootScope.userLogged === true) {
                    return true;
                } else {
                    return false;
                }
            }
            // $scope.$on('$locationChangeStart', function(event, next, current) {
            //     AuthService.getUserStatus()
            //         .then(function () {
            //             if (next.access.restricted && !AuthService.isLoggedIn()) {
            //                 $location.path('/signin');
            //                 $route.reload();
            //             }
            //         });
            // });
        }
        ]);