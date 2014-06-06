'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
  .controller('ImageCtrl', ['$scope','$http', function($scope,$http) {
    $scope.presets = [
      {name: 'Last 2 Hrs', mode:'realtime', range:[moment().subtract('hours', 2),moment()]},
      {name: 'Today', mode:'realtime', range:[moment().startOf('day'),moment().endOf('day')]},
      {name: 'Yesterday', mode:'static', range:[moment().startOf('day').subtract('days', 1), moment().endOf('day').subtract('days', 1)]},
      {name: 'Last 3 Days', mode:'static', range:[moment().startOf('day').subtract('days', 2),moment().endOf('day')]}
    ];
    //Setup defaults
  	$scope.preset=$scope.presets[0];
  	$scope.from=$scope.presets[0].range[0].toDate();
  	$scope.to=$scope.presets[0].range[1].toDate();

    console.log('From-To');
    var from = moment($scope.from).valueOf();
    var to = moment($scope.to).valueOf();

    var request = {'from' : from, 'to': to};
    $http.get('/api/images', {params: request}).success(function(response) {
      $scope.images = response;
      console.log('done loading images')
    });

  }])
  .controller('ImageDetail', ['$scope','$http', function($scope,$http,image) {

  }]);
