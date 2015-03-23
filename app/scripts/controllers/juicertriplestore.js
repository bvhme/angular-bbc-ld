'use strict';

/**
 * @ngdoc function
 * @name angularBbcLdApp.controller:JuicertriplestoreCtrl
 * @description
 * # JuicertriplestoreCtrl
 * Controller of the angularBbcLdApp
 */
angular.module('angularBbcLdApp')
    .controller('JuicertriplestoreCtrl', ['juicerTriplestore', '$scope',
        function(juicerTriplestore, $scope) {

            var success = function(data) {
                $scope.response = '{ "status": "loading" }';
                $scope.responseStatus = data.status;
                $scope.response = JSON.stringify(data.data, null, 4);
            };
            var failure = success;

            $scope.getThingQuery = {
                uri: 'http://dbpedia.org/resource/Barack_Obama',
                limit: 5,
            };
            $scope.findThingsMultiHopQuery = {
                joinPredicate: 'http://purl.org/dc/terms/subject',
                joinObject: 'http://dbpedia.org/resource/Category:United_Kingdom_Independence_Party_politicians',
                limit: 200
            };
            $scope.findCreativeWorksQuery = {
                    tag: ['http://dbpedia.org/resource/David_Cameron', 'http://dbpedia.org/resource/Nigel_Farage'],
                    createdBy: 'http://www.bbc.co.uk/things/2dec7d16-385c-40b9-8d3f-bfb32a9181fd%23id',
                    tagOperation: 'and',
                    limit: 5,
                    offset: 0
                };
            $scope.findCreativeWorksMultiHopQuery = {
                aboutTagType: 'http://dbpedia.org/ontology/Person',
                aboutTagPredicate: 'http://dbpedia.org/ontology/party',
                aboutTagObject: 'http://dbpedia.org/resource/Conservative_Party_(UK)',
                limit: 5,
                afterDate: '2000-01-01'
            };
            $scope.findCreativeWorksGeospatialQuery = {
                point: '53.38,-1.47',
                radius: '15km',
                limit: 5
            };
            $scope.findCreativeWorksGeoMultiHopQuery = {
                aboutTagType: 'http://dbpedia.org/ontology/Person',
                aboutTagPredicate: 'http://dbpedia.org/ontology/team',
                aboutTagObject: 'http://dbpedia.org/resource/Manchester_United_F.C.',
                point: '53.38,-1.47',
                radius: '15km',
                limit: 5
            };
            $scope.findTaggedThingsMultiHopQuery = {
                query: 'dav',
                joinPredicate: 'http://dbpedia.org/ontology/party',
                joinObject: 'http://dbpedia.org/resource/Conservative_Party_(UK)',
                limit: 10
            };
            $scope.findThingsOccurrencesMultiHopQuery = {
                type: 'http://dbpedia.org/ontology/Person',
                joinPredicate: 'http://purl.org/dc/terms/subject',
                joinObject: 'http://dbpedia.org/resource/Category:Conservative_Party_(UK)_MPs',
                limit: 10
            };
            $scope.findThingsCoOccurrencesMultiHopQuery = {
                type: 'http://dbpedia.org/ontology/Person',
                joinPredicate: 'http://dbpedia.org/ontology/party',
                joinObject: 'http://dbpedia.org/resource/Labour_Party_(UK)',
                uri: 'http://dbpedia.org/resource/Len_McCluskey',
                afterDate: '2015-01-01'
            };






            $scope.action = {
                getThing: function(params) {
                	$scope.response = '{ "status": "getting data from the server" }';
                    juicerTriplestore.getThing(params).then(success, failure);
                },
                findThingsMultiHop: function(params) {
                	$scope.response = '{ "status": "getting data from the server" }';
                    juicerTriplestore.findThingsMultiHop(params).then(success, failure);
                },
                findCreativeWorks: function(params) {
                	$scope.response = '{ "status": "getting data from the server" }';
                    juicerTriplestore.findCreativeWorks(params).then(success, failure);
                },
                findCreativeWorksMultiHop: function(params) {
                	$scope.response = '{ "status": "getting data from the server" }';
                    juicerTriplestore.findCreativeWorksMultiHop(params).then(success, failure);
                },
                findCreativeWorksGeospatial: function(params) {
                	$scope.response = '{ "status": "getting data from the server" }';
                    juicerTriplestore.findCreativeWorksGeospatial(params).then(success, failure);
                },
                findCreativeWorksGeoMultiHop: function(params) {
                	$scope.response = '{ "status": "getting data from the server" }';
                    juicerTriplestore.findCreativeWorksGeoMultiHop(params).then(success, failure);
                },
                findTaggedThingsMultiHop: function(params) {
                	$scope.response = '{ "status": "getting data from the server" }';
                    juicerTriplestore.findTaggedThingsMultiHop(params).then(success, failure);
                },
                findThingsOccurrencesMultiHop: function(params) {
                	$scope.response = '{ "status": "getting data from the server" }';
                    juicerTriplestore.findThingsOccurrencesMultiHop(params).then(success, failure);
                },
                findThingsCoOccurrencesMultiHop: function(params) {
                	$scope.response = '{ "status": "getting data from the server" }';
                    juicerTriplestore.findThingsCoOccurrencesMultiHop(params).then(success, failure);
                }
            };

            $scope.queryType = 'getThing';
            $scope.response = '{ "status": "no query done yet" }';
        }
    ]);