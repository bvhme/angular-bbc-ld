'use strict';

/**
 * @ngdoc function
 * @name angularBbcLdApp.controller:juicerCtrl
 * @description
 * # juicerCtrl
 * Controller of the angularBbcLdApp
 */
angular.module('angularBbcLdApp')
	.controller('JuicerCtrl', ['juicer', '$scope',
		function(juicer, $scope) {

			var success = function(data) {
				$scope.response = '{ "status": "loading" }';
				$scope.responseStatus = data.status;
				$scope.responseUrl = data.config.url;
				$scope.response = JSON.stringify(data.data, null, 4);
			};
			var failure = success;

			$scope.getArticlesQuery = {
					'query': 'Sun'
				};
			$scope.getSourcesQuery = 'Sun';
			$scope.getArticleQuery = '18eb7370e4272dbfc410aea215d1e31bbcb24c1a';
			$scope.getArticleByIdQuery = '18eb7370e4272dbfc410aea215d1e31bbcb24c1a';
			$scope.getArticleByUrlQuery = 'http://m.ewn.co.za/2015/03/22/Tunisian-president-says-third-suspect-in-museum-attack-on-the-run';

			$scope.action = {
				getArticles: function(params) {
					$scope.response = '{ "status": "getting data from the server" }';
					juicer.getArticles(params).then(success, failure);
				},
				getArticle: function(params) {
					$scope.response = '{ "status": "getting data from the server" }';
					juicer.getArticle(params).then(success, failure);
				},
				getSources: function(params) {
					$scope.response = '{ "status": "getting data from the server" }';
					juicer.getSources(params).then(success, failure);
				},
				getArticleById: function(params) {
					$scope.response = '{ "status": "getting data from the server" }';
					juicer.getArticleById(params).then(success, failure);
				},
				getArticleByUrl: function(params) {
					$scope.response = '{ "status": "getting data from the server" }';
					juicer.getArticleByUrl(params).then(success, failure);
				}
			};

			$scope.queryType = 'getArticles';
			$scope.response = '{ "status": "no query done yet" }';
		}
	]);
