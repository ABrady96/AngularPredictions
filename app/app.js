
// Declare app level module which depends on views, and components
var myApp = angular.module('myApp', [
  'ngRoute',
  'myApp.leagues',
  'myApp.table',
  'myApp.signin',
  'myApp.signup',
  'myApp.version'
]);

myApp.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.when('/', {
    templateUrl: 'table/table.html',
      access: {restricted: true}
  }).when('/register', {
    templateUrl: 'signup/signup.html',
      controller: 'postCtrl',
      access: {restricted: true}
  }).when('/signin', {
    templateUrl: 'signin/signin.html',
      controller: 'SigninController',
      access: {restricted: true}
  }).when('/logout', {
          controller: 'logoutController',
      access: {restricted: true}
  }).otherwise({redirectTo: '/leagues'});
}])

// myApp.run(function ($rootScope, $location, $route, AuthService) {
//     $rootScope.$on('$routeChangeStart', function(event, next, current) {
//         AuthService.getUserStatus()
//             .then(function () {
//                 if (!AuthService.isLoggedIn()) {
//                 }
//             });
//     });
// });