'use strict';

/**
 * @ngdoc function
 * @name angularBbcLdApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the angularBbcLdApp
 */
angular.module('angularBbcLdApp')
  .controller('MainCtrl', ['$scope', 'juicer', 'things', '$log', function ($scope, juicer, things, $log) {
    .controller('MainCtrl', ['$scope', 'juicer', 'juicer3', 'things', '$log',
        function($scope, juicer, juicer3, things, $log) {
            $scope.responses = [];
            var success = function(data) {
                $log.info(data);
                $scope.responses.push(data);
            };
            var fail = function(data) {
                $log.error(data);
                $scope.responses.push(data);
            };
            juicer.getSources('sun').then(success, fail);
            juicer.getArticles({
                'query': 'Sun'
            }).then(success, fail);
            juicer.getArticle('18eb7370e4272dbfc410aea215d1e31bbcb24c1a').then(success, fail);
            juicer.getArticleByUrl('http://m.ewn.co.za/2015/03/22/Tunisian-president-says-third-suspect-in-museum-attack-on-the-run').then(success, fail);
            things.getById('e68c5b82-50e8-47d8-953c-bf61a2de0a85').then(success, fail);
            things.getByUri('http://www.bbc.co.uk/things/e68c5b82-50e8-47d8-953c-bf61a2de0a85').then(success, fail);
        }
    ]);