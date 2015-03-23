'use strict';
/**
 * @ngdoc service
 * @name bbcld.juicer3
 * @description
 * # Juicer Triplestore
 * Module to do API calls to the Juicer Triplestore
 */
angular.module('bbcld')
    .service('juicer3', ['$http', '$q', '$log', 'juicer3settings',
        function($http, $q, $log, juicer3settings) {
            // AngularJS will instantiate a singleton by calling 'new' on this 
            // function, so 'this' object will be returned
            var factory = this;

            // Check if the required setup has been done, and if not, throw a fit! Ehm, I mean error.
            if (!juicer3settings.host) {
                $log.error('There is no Host specified for the juicer3, thus API calls will be futile.');
                return null;
            }
            if (!juicer3settings.apikey) {
                $log.error('There is no API Key specified for the juicer3, thus API calls will be futile.');
                return null;
            }

            var makeSureIsObject = function(value) {
                // Check if the value is an object, if not, 
                // return an empty object
                if (typeof value !== 'object' || value === null) {
                    // $log.error(value + ' is not an object, returning an empty object');
                    return {};
                }
                return value;
            };

            var dateToString = function(date) {
                // Check if what is passed in is a date object, if so make 
                // a string out of it, if it is already a string pass it on
                if (Object.prototype.toString.call(date) === '[object Date]') {
                    return date.toISOString();
                }
                if (typeof date === 'number') {
                    var string = new Date(date).toISOString();
                    return string;
                }
                return date;
            };

            var buildURLParams = function(params) {
                // Build the Url params to concat to the URL in order to get the right results
                params = makeSureIsObject(params);

                // Add the API key to the parameters object
                params.apikey = juicer3settings.apikey;

                // Start the string of
                var paramsString = '?';

                // Loop through every key,
                for (var key in params) {
                    var value = params[key];

                    // Only do something with it if it has a value
                    if (value !== null && value !== undefined) {
                        if (typeof value === 'string') {
                            // If it is a string, make an array and put it in the 0th position
                            var valueString = value;
                            value = [];
                            value[0] = valueString;
                        }
                        for (var i = value.length - 1; i >= 0; i--) {
                            // Render every element from the array onto the string
                            paramsString += '&' + key + '=' + encodeURIComponent(value[i]);
                        }
                    }
                }

                return paramsString;
            };

            // Get JSON function prepares the request, calls $http, and 
            // creates a promise to be fulfilled
            factory.getJSON = function(endpoint, params) {
                // Create the promise
                var deferred = $q.defer();

                // Create the URL out of the different bits needed
                var paramsString = buildURLParams(params);
                var getUrl = juicer3settings.host + endpoint + paramsString;

                // Do the actual request and resolve or reject the promise 
                // when done
                $http({
                    method: 'GET',
                    url: getUrl,
                    headers: {
                        'Accept': 'application/ld+json'
                    }
                })
                    .then(deferred.resolve, deferred.reject);

                // Return the promise to the calling object
                return deferred.promise;
            };

            // The specific API calls and shorthands

            factory.getThing = function(params) {
                // Gets a Thing from the knowledge base, and the most recent creative works tagged with it.
                var paramsMap = {
                    'uri': params.uri, // The URI of the thing to retrieve
                    'limit': params.limit, // integer - max number of creative works to return
                    'createdBy': params.createdBy // URI - optional filter associated creative works by the NewsService (source) they were createdBy
                };

                return factory.getJSON('things', paramsMap);
            };
            factory.findThingsMultiHop = function(params) {
                // Finds things in the knowledge base. Useful for building typeahead fields to find things. Use a multihop join to find things via some relationship in the wider DBpedia knowledge graph.
                // Typical use-case is for type-ahead find widgets

                var paramsMap = {
                    'q': params.query, // string - optional a full text search term
                    'limit': params.limit, // integer - max num of suggestions to return
                    'type': params.type, // optional URI defining the ontology class to filter things on - multiple types can be specified
                    'join-predicate': params.joinPredicate, // optional predicate URI from DBpedia ontology that concepts found will be joined with
                    'join-object': params.joinObject // optional thing URI from DBpedia ontology that concepts found will be joined with via the join-predicate
                };

                return factory.getJSON('things', paramsMap);
            };
            factory.findCreativeWorks = function(params) {
                // A semantic search for creative work using tagged concepts

                // Correct dates to the correct format if they are a Date() object
                params.afterDate = dateToString(params.afterDate);
                params.beforeDate = dateToString(params.beforeDate);

                var paramsMap = {
                    'tag': params.tag, // URI of a concept - multiple tag parameters can be used
                    'tagop': params.tagOperation, // {and | or | fingerprint} The operations to apply to the supplied tags. Default is 'and'. 'fingerprint' returns creative works best matching the set of tags supplied. (Warning fingerprint search is not fast!)
                    'before': params.beforeDate, // optional date in YYYY-MM-DD format defining the date before which articles were published
                    'after': params.afterDate, // optional date in YYYY-MM-DD format defining the date after which articles were published
                    'createdBy': params.createdBy, // optionally filter by NewsService (source) using cwork:createdBy URIs
                    'limit': params.limit, // integer - max number of articles to return, default 10
                    'offset': params.offset // integer - offset to start results from to allow for paging / infinite scroll
                };

                return factory.getJSON('creative-works', paramsMap);
            };
            factory.findCreativeWorksMultiHop = function(params) {
                // A multi-hop semantic search for creative work via the graph of tagged concepts
                // The DBpedia ontology is used extensively as abacking knowledge graph. All classes and predicates from this ontollogy are exposed. See: http://dbpedia.org/ontology

                // Correct dates to the correct format if they are a Date() object
                params.afterDate = dateToString(params.afterDate);
                params.beforeDate = dateToString(params.beforeDate);

                var paramsMap = {
                    'about-tag-type': params.aboutTagType, // Ontology class URI, find creative works by the type (class) of thing they are tagged with, eg http://dbpedia.org/ontology/Person
                    'about-tag-predicate': params.aboutTagPredicate, // Ontology predicate URI - find creative works tagged with concepts that have wider associations with this predicate. eg http://dbpedia.org/ontology/party</li>
                    'about-tag-object': params.aboutTagObject, // Concept URI - find creative works tagged with concepts that have wider associations where the about-tag-predicate is associated with this object/concept. eg http://dbpedia.org/resource/ConservativeParty(UK)
                    'tag': params.tag, // URI of a concept - multiple tag parameters can be used
                    'tagop': params.tagOperation, // {and | or | fingerprint} The operations to apply to the supplied tags. Default is 'and'. 'fingerprint' returns creative works best matching the set of tags supplied. (Warning fingerprint search is not fast!)
                    'before': params.beforeDate, // optional date in YYYY-MM-DD format defining the date before which articles were published
                    'after': params.afterDate, // optional date in YYYY-MM-DD format defining the date after which articles were published
                    'createdBy': params.createdBy, // optionally filter by NewsService (source) using cwork:createdBy URIs
                    'limit': params.limit, // integer - max number of articles to return, default 10
                    'offset': params.offset // integer - offset to start results from to allow for paging / infinite scroll                    
                };

                return factory.getJSON('creative-works', paramsMap);
            };
            factory.findCreativeWorksGeospatial = function(params) {
                // A geospatial semantic search for creative work. Finds creative works tagged with places with a radius of a supplied latitude and longitude.

                // Correct dates to the correct format if they are a Date() object
                params.afterDate = dateToString(params.afterDate);
                params.beforeDate = dateToString(params.beforeDate);

                var paramsMap = {
                    'point': params.point, // {lat,long}, eg: 51.5,-1.0
                    'radius': params.radius, // {Nmi|km}, eg 10mi , 20km
                    'tag': params.tag, // URI of a concept - multiple tag parameters can be used
                    'tagop': params.tagop, // {and | or | fingerprint} The operations to apply to the supplied tags. Default is 'and'. 'fingerprint' returns creative works best matching the set of tags supplied. (Warning fingerprint search is not fast!)
                    'before': params.beforeDate, // optional date in YYYY-MM-DD format defining the date before which articles were published
                    'after': params.afterDate, // optional date in YYYY-MM-DD format defining the date after which articles were published
                    'createdBy': params.createdBy, // optionally filter by NewsService (source) using cwork:createdBy URIs
                    'limit': params.limit, // integer - max number of articles to return, default 10
                    'offset': params.offset // integer - offset to start results from to allow for paging / infinite scroll                    
                };

                return factory.getJSON('creative-works', paramsMap);
            };
            factory.findCreativeWorksGeoMultiHop = function(params) {
                // Combining geospatial with graph search.
                // A geospatial multi-hop semantic search for creative work via the graph of tagged concepts within a radius of some location.

                // Correct dates to the correct format if they are a Date() object
                params.afterDate = dateToString(params.afterDate);
                params.beforeDate = dateToString(params.beforeDate);

                var paramsMap = {
                    'point': params.point, // {lat,long}, eg: 51.5,-1.0
                    'radius': params.radius, // {Nmi|km}, eg 10mi , 20km
                    'about-tag-type': params.aboutTagType, // Ontology class URI, find creative works by the type (class) of thing they are tagged with, eg http://dbpedia.org/ontology/Person
                    'about-tag-predicate': params.aboutTagPredicate, // Ontology predicate URI - find creative works tagged with concepts that have wider associations with this predicate. eg http://dbpedia.org/ontology/party</li>
                    'about-tag-object': params.aboutTagObject, // Concept URI - find creative works tagged with concepts that have wider associations where the about-tag-predicate is associated with this object/concept. eg http://dbpedia.org/resource/ConservativeParty(UK)
                    'tag': params.tag, // URI of a concept - multiple tag parameters can be used
                    'tagop': params.tagOperation, // {and | or | fingerprint} The operations to apply to the supplied tags. Default is 'and'. 'fingerprint' returns creative works best matching the set of tags supplied. (Warning fingerprint search is not fast!)
                    'before': params.beforeDate, // optional date in YYYY-MM-DD format defining the date before which articles were published
                    'after': params.afterDate, // optional date in YYYY-MM-DD format defining the date after which articles were published
                    'createdBy': params.createdBy, // optionally filter by NewsService (source) using cwork:createdBy URIs
                    'limit': params.limit, // integer - max number of articles to return, default 10
                    'offset': params.offset // integer - offset to start results from to allow for paging / infinite scroll                    
                };

                return factory.getJSON('creative-works', paramsMap);
            };
            factory.findTaggedThingsMultiHop = function(params) {
                // Finds things in the knowledge base using a full text search term. Useful for building type ahead fields to find things. Returns only things that have been tagged on creative works. Use a multihop join to find concepts via some relationship in the wider DBpedia knowledge graph.
                // Typical use-case is for type-ahead find widgets
                var paramsMap = {
                    'q': params.q, // string - optional -a full text search term
                    'limit': params.limit, // integer - max num of suggested things to return
                    'type': params.type, // optional URI defining the ontology class to filter things on - multiple types can be specified
                    'join-predicate': params.joinPredicate, // optional predicate URI from DBpedia ontology that things found will be joined with
                    'join-object': params.joinObject // optional concept URI from DBpedia ontology that concepts found will be joined with via the join-predicate
                };

                return factory.getJSON('things/tagged', paramsMap);
            };
            factory.findThingOccurrencesMultiHop = function(params) {
                // Finds most frequently tagged things in the knowledge base.

                // Correct dates to the correct format if they are a Date() object
                params.afterDate = dateToString(params.afterDate);
                params.beforeDate = dateToString(params.beforeDate);

                var paramsMap = {
                    'limit': params.limit, // integer - max num of things to return
                    'type': params.type, // optional/multiple URI defining the ontology class to filter things on
                    'before': params.beforeDate, // date in YYYY-MM-DD format defining the date before which tag frequencies should be calculated
                    'after': params.afterDate, // date in YYYY-MM-DD format defining the date after which tag frequencies should be calculated
                    'join-predicate': params.joinPredicate, // optional predicate URI from DBpedia ontology that things found will be joined with
                    'join-object': params.joinObject // optional thing URI from DBpedia ontology that things found will be joined with via the join-predicate

                };

                return factory.getJSON('things/occurrences', paramsMap);
            };
            factory.findThingCoOccurrencesMultiHop = function(params) {
                // Finds most frequently tagged things in the knowledge base, co-occurring with a supplied thing

                // Correct dates to the correct format if they are a Date() object
                params.afterDate = dateToString(params.afterDate);
                params.beforeDate = dateToString(params.beforeDate);

                var paramsMap = {
                    'uri': params.uri, // URI of a thing to find co-occurrences with
                    'limit': params.limit, // integer - max num of things to return
                    'type': params.type, // optional/multiple URI defining the ontology class to filter things on
                    'before': params.beforeDate, // date in YYYY-MM-DD format defining the date before which tag frequencies should be calculated
                    'after': params.afterDate, // date in YYYY-MM-DD format defining the date after which tag frequencies should be calculated
                    'join-predicate': params.joinPredicate, // optional predicate URI from DBpedia ontology that things found will be joined with
                    'join-object': params.joinObject // optional thing URI from DBpedia ontology that things found will be joined with via the join-predicate

                };

                return factory.getJSON('things/co-occurrences', paramsMap);
            };


            return this;
        }
    ]);