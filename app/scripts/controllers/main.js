'use strict';

/**
 * @ngdoc function
 * @name angularBbcLdApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the angularBbcLdApp
 */
angular.module('angularBbcLdApp')
    .controller('MainCtrl', ['$scope', 'juicer', 'juicerTriplestore', 'things', '$log',
        function($scope, juicer, juicerTriplestore, things, $log) {
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
                joinObject: 'http://dbpedia.org/resource/Category:United_Kingdom_Independence_Party_politicians',
                limit: 200
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
        }
    ]);