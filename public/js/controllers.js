'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
  .controller('ImageCtrl', ['$scope','$http','$location', function($scope,$http,$location) {
    $scope.presets = [
      {name: 'Last 2 Hrs', mode:'realtime', range:[moment().subtract('hours', 2),moment()]},
      {name: 'Today', mode:'realtime', range:[moment().startOf('day'),moment().endOf('day')]},
      {name: 'Yesterday', mode:'static', range:[moment().startOf('day').subtract('days', 1), moment().endOf('day').subtract('days', 1)]},
      {name: 'Last 3 Days', mode:'static', range:[moment().startOf('day').subtract('days', 2),moment().endOf('day')]},
      {name: 'Last 2 Weeks', mode:'static', range:[moment().startOf('day').subtract('days', 14),moment().endOf('day')]}
    ];
    //Setup defaults
  	$scope.preset=$scope.presets[0];
  	$scope.from=$scope.presets[0].range[0].toDate();
  	$scope.to=$scope.presets[0].range[1].toDate();


    $scope.refresh = function(){
      var request = {
        'from' : moment($scope.from).valueOf(),
        'to': moment($scope.to).valueOf()
      };
      $http.get('/api/images_metadata', {params: request}).success(function(response) {
        $scope.imagesmeta = response;
        console.log('done loading images meta')
      });
    };

    $scope.setPeriod = function(){
  		$scope.from=$scope.preset.range[0].toDate();
  		$scope.to=$scope.preset.range[1].toDate();
  		console.log('preset change');
  	};

    $scope.go = function ( path ) {
      $location.path( path );
      console.log('going to '+path);
    };

    $scope.refresh();
  }])
  .controller('ImageDetail', ['$scope','$http','$routeParams', function($scope,$http,$routeParams) {

      $http.get('/api/images/'+$routeParams._id).success(function(response) {
        $scope.image = response;
        console.log('done loading image')
      });


  }]);
