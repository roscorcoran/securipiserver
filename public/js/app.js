'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'ngRoute',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/images', {templateUrl: '../public/partials/images.html', controller: 'ImageCtrl'});
  $routeProvider.when('/images/:_id', {templateUrl: '../public/partials/imagedetail.html', controller: 'ImageDetail'});
  $routeProvider.when('/view2', {templateUrl: '../public/partials/partial2.html', controller: 'MyCtrl2'});
  $routeProvider.otherwise({redirectTo: '/images'});
}]);
