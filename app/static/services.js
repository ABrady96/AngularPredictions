angular.module('myApp').factory('AuthService',
    ['$q', '$timeout', '$http', '$httpParamSerializer',
        function ($q, $timeout, $http, $httpParamSerializer) {
            // create user variable
            var user = null;
            // return available functions for use in controllers
            return ({
                isLoggedIn: isLoggedIn,
                login: login,
                logout: logout,
                register: register
            });

            function isLoggedIn() {
                if(user) {
                    return true;
                } else {
                    return false;
                }
            }
            function login(username, password) {
                // create a new instance of deferred
                var deferred = $q.defer();
                $http({
                    method: 'POST',
                    url: 'http://178.62.31.229/AuthenticateUser/',
                    data: $httpParamSerializer({username: username, password: password}),
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).then(function createSuccess(response, data, status) {
                    if(status === 200 && data.result){
                        user = true;
                        deferred.resolve();
                    } else {
                        console.log(data);
                        user = false;
                        deferred.reject();
                    }
                    // $window.location.href('/')
                }, function errorCallback(data) {
                    user = false;
                    deferred.reject();
                });
                // // send a post request to the server
                // $http.post('http://127.0.0.1:5000/AuthenticateUser/', $httpParamSerializer({username: username, password: password}))
                // // handle success
                //     .success(function (data, status) {
                //
                //     })
                //     // handle error
                //     .error(function (data) {
                //         user = false;
                //         deferred.reject();
                //     });
                // return promise object
                return deferred.promise;
            }
            function logout() {
                // create a new instance of deferred
                var deferred = $q.defer();
                // send a get request to the server
                $http.get('http://178.62.31.229/logout/')
                // handle success
                    .success(function (data) {
                        user = false;
                        deferred.resolve();
                    })
                    // handle error
                    .error(function (data) {
                        user = false;
                        deferred.reject();
                    });
                // return promise object
                return deferred.promise;
            }
            function register(username, email, password) {
                // create a new instance of deferred
                var deferred = $q.defer();
                // send a post request to the server
                $http.post('http://178.62.31.229/Register/', {username: username, email: email, password: password})
                // handle success
                    .success(function (data, status) {
                        if(status === 200 && data.result){
                            deferred.resolve();
                        } else {
                            deferred.reject();
                        }
                    })
                    // handle error
                    .error(function (data) {
                        deferred.reject();
                    });
                // return promise object
                return deferred.promise;
            }

        }

]);