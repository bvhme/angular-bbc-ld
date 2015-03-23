'use strict';

/**
 * @ngdoc overview
 * @name angularBbcLdApp
 * @description
 * # angularBbcLdApp
 *
 * Main module of the application.
 */
angular
  .module('angularBbcLdApp', [
    'ngAnimate',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'hljs',
    'bbcld'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      // .when('/', {
      //   templateUrl: 'views/main.html',
      //   controller: 'MainCtrl'
      // })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/tests', {
        templateUrl: 'views/tests.html',
        controller: 'TestsCtrl'
      })
      .when('/juicertriplestore', {
        templateUrl: 'views/juicertriplestore.html',
        controller: 'JuicertriplestoreCtrl'
      })
      .when('/juicer', {
        templateUrl: 'views/juicer.html',
        controller: 'JuicerCtrl'
      })
      .otherwise({
        redirectTo: '/tests'
      });
  });
