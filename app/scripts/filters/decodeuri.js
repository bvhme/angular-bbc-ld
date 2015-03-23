'use strict';

/**
 * @ngdoc filter
 * @name angularBbcLdApp.filter:decodeURI
 * @function
 * @description
 * # decodeURI
 * Filter in the angularBbcLdApp.
 */
angular.module('angularBbcLdApp')
  .filter('decodeURI', function () {
    return function (input) {
      return decodeURIComponent(input);
    };
  });
