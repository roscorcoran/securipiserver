'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
  .controller('ImageCtrl', ['$scope','$http','$location','$modal', function($scope,$http,$location,$modal) {
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
        response.sort(function(a, b) {
          a = new Date(a.uploadDate);
          b = new Date(b.uploadDate);
          return a>b ? -1 : a<b ? 1 : 0;
        });
        $scope.imagesMeta = response;
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
    $scope.remove = function (imageMeta, index) {
      console.log(JSON.stringify(imageMeta));
      $http.delete('/api/images/'+imageMeta.metadata.main_id+'/'+imageMeta._id).success(function(response) {
        //console.log(JSON.stringify(response));
        if(response=='deleted'){
          console.log('removing:',imageMeta._id,' @ ',index);
          $scope.imagesMeta.splice(index, 1);
        }
      });
    };
    $scope.star = function (imageMeta, index) {
      console.log(JSON.stringify(imageMeta));
      $http.put('/api/images/'+imageMeta.metadata.main_id+'/'+imageMeta._id).success(function(response) {
        //console.log(JSON.stringify(response));
        if(response=='starred'){
          console.log('starring:',imageMeta._id,' @ ',index);
          $scope.imagesMeta[index].starred=true;
        }
      });
    };
    $scope.view = function (imageMeta) {
      //'/images/'+imageMeta._id
      var modalInstance = $modal.open({
        templateUrl: 'myModalContent.html',
        controller: 'ModalInstanceCtrl',
        size: 'lg',
        resolve: {
          imageMeta: function () {
            return imageMeta;
          }
        }
      });

      modalInstance.result.then(function () {

      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });
      console.log('View: ',imageMeta.metadata.main_id);
    };


    $scope.refresh();
  }])
  .controller('ModalInstanceCtrl', ['$scope','$http','$modalInstance','imageMeta', function($scope,$http,$modalInstance, imageMeta) {
    $scope.imageMeta=imageMeta;
    console.log(imageMeta);
    $scope.ok = function () {
      $modalInstance.close();
    };
    $scope.close = function () {
      $modalInstance.dismiss('close');
    };
    $scope.remove = function (imageMeta, index) {
      console.log(JSON.stringify(imageMeta));
      $http.delete('/api/images/'+imageMeta.metadata.main_id+'/'+imageMeta._id).success(function(response) {
        //console.log(JSON.stringify(response));
        if(response=='deleted'){
          console.log('removing:',imageMeta._id,' @ ',index);
          $scope.close();
        }
      });
    };
  }]);
