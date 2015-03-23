'use strict';

/**
 * @ngdoc function
 * @name angularBbcLdApp.controller:ThingsCtrl
 * @description
 * # ThingsCtrl
 * Controller of the angularBbcLdApp
 */
angular.module('angularBbcLdApp')
  .controller('ThingsCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
