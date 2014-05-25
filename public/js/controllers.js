'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
  .controller('ImageCtrl', ['$scope','$http', function($scope,$http) {
    var request = {'from' : 'date', 'to': 'date'};
    $http.get('/api/images', request).success(function(response) {
      $scope.images = response;
      console.log('done loading images')
    });
  }])
  .controller('ImageDetail', ['$scope','$http', function($scope,$http,image) {

  }]);
