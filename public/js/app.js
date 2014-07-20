'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'ngRoute',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers',
  'ui.bootstrap'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/images', {templateUrl: '../public/partials/images.html', controller: 'ImageCtrl'});
  $routeProvider.when('/images/:_id', {templateUrl: '../public/partials/imagedetail.html', controller: 'ImageDetail'});
  $routeProvider.when('/dashboard', {templateUrl: '../public/partials/dashboard.html', controller: 'DashCtrl'});
  $routeProvider.otherwise({redirectTo: '/images'});
}]);
