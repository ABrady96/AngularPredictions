
'use strict';

angular.module('myApp.table', ['ngRoute', 'ui.bootstrap', 'ngTable'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/table', {
            templateUrl: 'table/table.html',
            controller: 'TableController',
            access: {restricted: true}
        });
    }])

    .controller('TableController', [ '$scope', '$http', '$routeParams',
        function($scope, $http, $routeParams) {
            $scope.leagueCaption = '';
            $scope.standings = [];

            var leagueId = $routeParams.leagueId;
            console.log(leagueId);

            $http({
                method : "GET",
                url : "http://api.football-data.org/v1/soccerseasons/" + leagueId + "/leagueTable",
                headers: {
                    'X-Auth-Token': '50f1e7e15f1941e98e3e56c2db1f8163'
                }
            }).then(function mySuccess(response) {
                $scope.leagueCaption = response.data.leagueCaption;
                $scope.standings = response.data.standing;
            }, function myError(response) {
                $scope.errorMsg = response.statusText;
            });
    }])

    .controller('FixtureController', [ '$scope', '$http', '$routeParams',
        function($scope, $http, $routeParams) {
            $scope.fixtures = [];

            var leagueId = $routeParams.leagueId;
            console.log(leagueId + " from fixtures");

            $http({
                method : "GET",
                url : "http://api.football-data.org/v1/competitions/" + leagueId + "/fixtures?matchday=1",
                headers: {
                    'X-Auth-Token': '50f1e7e15f1941e98e3e56c2db1f8163'
                }
            }).then(function mySuccess(response) {
                $scope.fixtures = response.data.fixtures;
            }, function myError(response) {
                $scope.errorMsg = response.statusText;
            });
        }])

    .controller('PlayerController', [ '$scope', '$http', '$routeParams', '$rootScope', '$uibModal',
        'NgTableParams', 'AuthService', '$httpParamSerializer',
        function ($scope, $http, $routeParams, $rootScope, $uibModal, NgTableParams, AuthService, $httpParamSerializer) {
            // $scope.filteredPlayers = []
            //     ,$scope.currentPage = 1
            //     ,$scope.numPerPage = 10
            //     ,$scope.maxSize = 5;
            // $scope.settings = {
            //     currentPage: 0,
            //     offset: 0,
            //     pageLimit: 15,
            //     pageLimits: ['10', '50', '100']
            // };
            var self = this;
            $scope.init = function () {
                
            };
            $scope.names = ["Emil", "Tobias", "Linus"];
            $scope.positions = [{id: "", title: ""}, {id: 'Goalkeeper', title: 'Goalkeeper'}, {
                id: 'Defender',
                title: 'Defender'
            },
                {id: 'Midfielder', title: 'Midfielder'}, {id: 'Forward', title: 'Forward'}];
            $scope.team_names = [{id: "", title: ""}, {id: 'Arsenal', title: 'Arsenal'}, {
                id: 'Bournmouth',
                title: 'Bournmouth'
            },
                {id: 'Brighton', title: 'Brighton'}, {id: 'Burnley', title: 'Burnley'}, {
                    id: 'Chelsea',
                    title: 'Chelsea'
                },
                {id: 'Crystal Palace', title: 'Crystal Palace'}, {id: 'Everton', title: 'Everton'}, {
                    id: 'Huddersfield',
                    title: 'Huddersfield'
                }
                , {id: 'Leicester', title: 'Leicester'}, {id: 'Liverpool', title: 'Liverpool'}, {
                    id: 'Manchester City',
                    title: 'Man City'
                }
                , {id: 'Manchester United', title: 'Man United'}, {id: 'Newcastle', title: 'Newcastle'}
                , {id: 'Southampton', title: 'Southampton'}, {id: 'Stoke', title: 'Stoke'}
                , {id: 'Swansea', title: 'Swansea'}, {id: 'Tottenham Hotspur', title: 'Spurs'}
                , {id: 'Watford', title: 'Watford'}, {id: 'West Brom', title: 'West Brom'}
                , {id: 'West Ham', title: 'West Ham'}];
            $scope.players = [];
            $rootScope.all_players = [];
            $scope.selectedPlayers = [];
            $scope.animationsEnabled = true;
            $scope.config = {
                itemsPerPage: 5,
                fillLastPage: true
            };
            $scope.getPlayers = function () {
                $http({
                    method: 'GET',
                    url: 'http://178.62.31.229/get_player_details',
                    headers: {'Content-Type': 'application/json'}
                }).then(function successCallback(response) {
                    // Store response data
                    $scope.players = response.data;
                    $scope.data = response.data;
                    $scope.setPageInfo();
                });
            };
            $scope.setPageInfo = function () {

                $scope.tableParams = new NgTableParams({}, {
                    dataset: $scope.data
                });
            };
            $scope.getPlayers();
            // this.tableParams = new NgTableParams({
            //     dataset: $scope.players
            // });
            $scope.clearTeam = function () {
                $scope.selectedPlayers = [];
            };
            $scope.AddPlayer = function (key) {
                $scope.selectedPlayers.push(key);
                console.log(key);
                $rootScope.all_players = $scope.selectedPlayers
            };
            $scope.RemovePlayer = function ($index) {
                $scope.selectedPlayers.splice($index, 1);
                $rootScope.all_players = $scope.selectedPlayers
            };
            $scope.getPredictions = function () {
                $rootScope.predictions = [];
				$rootScope.total = 0;
                angular.forEach($scope.selectedPlayers, function (value, key) {
                    $http({
                        method: 'GET',
                        url: 'http://178.62.31.229/preds/' + value.player_id,
                        headers: {'Content-Type': 'application/json'}
                    }).then(function successCallback(response) {
                        // Store response data
                        $rootScope.predictions.push(response.data);
						$rootScope.total = $rootScope.total + response.data.predicted;
						$rootScope.total.toFixed(2);
                        console.log(response)
                    });
                });
            };
	    $scope.getPastPredictions = function () {
                $scope.past_predictions = [];
                angular.forEach($scope.selectedPlayers, function (value, key) {
                    $http({
                        method: 'GET',
                        url: 'http://178.62.31.229/past_preds/' + value.player_id,
                        headers: {'Content-Type': 'application/json'}
                    }).then(function successCallback(response) {
                        // Store response data
                        $scope.past_predictions.push(response.data);
                        console.log(response)
                    });
                });
            };
            $scope.openInfo = function (size, e, player) {
                var modalInstance = $uibModal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: 'modal/playerModal.html',
                    controller: 'ModalInstanceController',
                    size: size,
                    resolve: {
                        Player: function () {
                            return player;
                        }
                    }
                });
                modalInstance.then(function () {
                    console.log('gowan son');
                });
                e.stopPropagation();
            };
            $scope.openPredInfo = function (size, e, prediction) {
                var modalInstance = $uibModal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: 'modal/playerPredModal.html',
                    controller: 'PredModalInstanceController',
                    size: size,
                    resolve: {
                        Prediction: function () {
                            return prediction;
                        }
                    }
                });
                modalInstance.then(function () {
                    console.log('gowan son');
                });
                e.stopPropagation();
            };
            var user = null;
            $scope.getUserStatus = function () {
                return $http.get('http://178.62.31.229/status/')
                // handle success
                    .success(function (data) {
                        if(data.status === true){
                            console.log(data);
                            $scope.user = true;
                            user = true;
                        } else {
                            console.log(data);
                            user = false;
                        }
                    })
                    // handle error
                    .error(function (data) {
                        user = false;
                    });
            }
            $scope.saveTeam = function () {
                $scope.current_user = $rootScope.user_id;
                angular.forEach($scope.selectedPlayers, function (value, key) {
                    $http({
                        method: 'POST',
                        url: 'http://178.62.31.229/saveTeam/',
                        data: $httpParamSerializer({tid:1, pid:value.player_id, uid:$scope.current_user}),
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).then(function createSuccess(response) {
                        console.log(value);
                        console.log(response.data);
                    }, function errorCallback(response) {
                        console.log($httpParamSerializer({tid:1, pid:value.player_id, uid:$scope.current_user}))
                        console.log(value);
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    });
                });
            }
            $scope.loadTeam = function () {
                $scope.current_user = $rootScope.user_id;
                $http({
                        method: 'POST',
                        url: 'http://178.62.31.229/loadTeam/',
                        data: $httpParamSerializer({tid:1, uid:$scope.current_user}),
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).then(function createSuccess(response) {
                        console.log(response.data);
                        
                        angular.forEach(response.data, function (value, key) {
                             $http({
                                    method: 'GET',
                                    url: 'http://178.62.31.229/get_single_player/' + value.pid,
                                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                            }).then(function createSuccess(response) {
                                $scope.selectedPlayers.push(response.data)
                            }, function errorCallback(response) {
                                console.log($httpParamSerializer({tid:1, pid:value.player_id, uid:$scope.current_user}))
                                console.log(value);
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    }); 
                        })

                    }, function errorCallback(response) {
                        console.log($httpParamSerializer({tid:1, uid:$scope.current_user}))
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    });
            }


        }])
        .controller('ModalInstanceController', ['$scope', '$uibModalInstance', 'Player',
                    function ($scope, $uibModalInstance, Player) {
                        $scope.cancel = function () {
                            $uibModalInstance.dismiss('cancel');
                        };
                        $scope.playerInfo = Player;
        }])

        .controller('PredModalInstanceController', ['$scope', '$uibModalInstance', '$http', '$rootScope', 'Prediction',
                    function ($scope, $uibModalInstance, $http, $rootScope, Prediction) {
                        $scope.cancel = function () {
                            $uibModalInstance.dismiss('cancel');
                        };
                        $scope.playerInfo = Prediction;
			$scope.play = "";
			$scope.past_predictions = [];
			$http({
                        method: 'GET',
                        url: 'http://178.62.31.229/past_preds/' + $scope.playerInfo.player_id,
                        headers: {'Content-Type': 'application/json'}
                    }).then(function successCallback(response) {
                        // Store response data
                        $scope.past_predictions = response.data;
                    })
			$http({
                                    method: 'GET',
                                    url: 'http://178.62.31.229/get_single_player/' + $scope.playerInfo.player_id,
                                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                            }).then(function createSuccess(response) {
                                $scope.play = response.data
				console.log($scope.play);
                            }, function errorCallback(response) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    }); 
        }]);
