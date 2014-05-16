'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
  .controller('ImageCtrl', ['$scope','$http', function($scope,$http) {
    var request = {'searchString' : 'apple'};
    $http.get('/api/images', request).success(function(response) {
      $scope.images = response;
      console.log('done loading images')
    });
  }])
  .controller('MyCtrl2', ['$scope', function($scope) {

  }]);
