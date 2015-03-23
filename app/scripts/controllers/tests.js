'use strict';

/**
 * @ngdoc function
 * @name angularBbcLdApp.controller:TestsCtrl
 * @description
 * # TestsCtrl
 * Controller of the angularBbcLdApp
 */
angular.module('angularBbcLdApp')
    .controller('TestsCtrl', ['$scope', 'juicer', 'juicerTriplestore', 'things', '$log',
        function($scope, juicer, juicerTriplestore, things, $log) {
            $scope.responses = [];
            $scope.success = [];
            $scope.failure = [];
            var success = function(data) {
                $log.info(data);
                $scope.success.push(data);
            };
            var fail = function(data) {
                $log.error(data);
                $scope.failure.push(data);
            };

            $scope.executeTests = function() {
                juicer.getSources('sun').then(success, fail);
                juicer.getArticles({
                    'query': 'Sun'
                }).then(success, fail);

                juicer.getArticle('18eb7370e4272dbfc410aea215d1e31bbcb24c1a').then(success, fail);
                juicer.getArticleByUrl('http://m.ewn.co.za/2015/03/22/Tunisian-president-says-third-suspect-in-museum-attack-on-the-run').then(success, fail);

                // These will fail because of CORS
                // things.getById('e68c5b82-50e8-47d8-953c-bf61a2de0a85').then(success, fail);
                // things.getByUri('http://www.bbc.co.uk/things/e68c5b82-50e8-47d8-953c-bf61a2de0a85').then(success, fail);

                juicerTriplestore.getThing({
                    uri: 'http://dbpedia.org/resource/Barack_Obama',
                    limit: 5,
                }).then(success, fail);
                juicerTriplestore.findThingsMultiHop({
                    joinPredicate: 'http://purl.org/dc/terms/subject',
                    joinObject: 'http://dbpedia.org/resource/Category:United_Kingdom_Independence_Party_politicians',
                    limit: 200
                }).then(success, fail);
                juicerTriplestore.findCreativeWorks({
                    tag: ['http://dbpedia.org/resource/David_Cameron', 'http://dbpedia.org/resource/Nigel_Farage'],
                    createdBy: 'http://www.bbc.co.uk/things/2dec7d16-385c-40b9-8d3f-bfb32a9181fd%23id',
                    tagOperation: 'and',
                    limit: 5,
                    offset: 0
                }).then(success, fail);
                juicerTriplestore.findCreativeWorksMultiHop({
                    aboutTagType: 'http://dbpedia.org/ontology/Person',
                    aboutTagPredicate: 'http://dbpedia.org/ontology/party',
                    aboutTagObject: 'http://dbpedia.org/resource/Conservative_Party_(UK)',
                    limit: 5,
                    afterDate: '2000-01-01'
                }).then(success, fail);
                juicerTriplestore.findCreativeWorksGeospatial({
                    point: '53.38,-1.47',
                    radius: '15km',
                    limit: 5
                }).then(success, fail);
                juicerTriplestore.findCreativeWorksGeoMultiHop({
                    aboutTagType: 'http://dbpedia.org/ontology/Person',
                    aboutTagPredicate: 'http://dbpedia.org/ontology/team',
                    aboutTagObject: 'http://dbpedia.org/resource/Manchester_United_F.C.',
                    point: '53.38,-1.47',
                    radius: '15km',
                    limit: 5
                }).then(success, fail);
                juicerTriplestore.findTaggedThingsMultiHop({
                    query: 'dav',
                    joinPredicate: 'http://dbpedia.org/ontology/party',
                    joinObject: 'http://dbpedia.org/resource/Conservative_Party_(UK)',
                    limit: 10
                }).then(success, fail);
                juicerTriplestore.findThingsOccurrencesMultiHop({
                    type: 'http://dbpedia.org/ontology/Person',
                    joinPredicate: 'http://purl.org/dc/terms/subject',
                    joinObject: 'http://dbpedia.org/resource/Category:Conservative_Party_(UK)_MPs',
                    limit: 10
                }).then(success, fail);
                juicerTriplestore.findThingsCoOccurrencesMultiHop({
                    type: 'http://dbpedia.org/ontology/Person',
                    joinPredicate: 'http://dbpedia.org/ontology/party',
                    joinObject: 'http://dbpedia.org/resource/Labour_Party_(UK)',
                    uri: 'http://dbpedia.org/resource/Len_McCluskey',
                    afterDate: '2015-01-01'
                }).then(success, fail);
            };

            $scope.executeTests();
        }
    ]);