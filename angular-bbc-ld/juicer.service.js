'use strict';
/**
 * @ngdoc service
 * @name bbcld.juicer
 * @description
 * # juicer
 * Module to do API calls to the Juicer
 */
angular.module('bbcld')
    .service('juicer', ['$http', '$q', '$log', 'juicersettings', 'sha1',
        function($http, $q, $log, juicersettings, sha1) {
            // AngularJS will instantiate a singleton by calling 'new' on this 
            // function, so 'this' object will be returned
            var factory = this;

            // Check if the required setup has been done, and if not, throw a fit! Ehm, I mean error.
            if (!juicersettings.host) {
                $log.error('There is no Host specified for the Juicer, thus API calls will be futile.');
                return null;
            }
            if (!juicersettings.apikey) {
                $log.error('There is no API Key specified for the Juicer, thus API calls will be futile.');
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

            function isUrl(value) {
            	// Check if a value is a valid URL, and if so, return true
                var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
                return regexp.test(value);
            }

            var buildURLParams = function(params) {
            	// Build the Url params to concat to the URL in order to get the right results
                params = makeSureIsObject(params);

                // Add the API key to the parameters object
                params.apikey = juicersettings.apikey;

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
                var getUrl = juicersettings.host + endpoint + paramsString;

                // Do the actual request and resolve or reject the promise 
                // when done
                $http({
                    method: 'GET',
                    url: getUrl,
                    headers: {
                        'Accept': 'application/json'
                    }
                })
                    .then(deferred.resolve, deferred.reject);

                // Return the promise to the calling object
                return deferred.promise;
            };

            // The specific API calls and shorthands
            // Get articles
            factory.getArticles = function(params) {
                // Correct dates to the correct format if they are a Date() object
                params.afterDate = dateToString(params.afterDate);
                params.beforeDate = dateToString(params.beforeDate);

                // Map the inputs for the function to the parameters taken by 
                // the API
                var paramsMap = {
                    'q': params.query,
                    // keywords to search for. Searches in title, description
                    // and body of the article.
                    'sources[]': params.sources,
                    // scopes the results to certain sources. Multiple products
                    // can be specified by adding multiple sources[] values.
                    // The parameter is a number that correspond to a source id.
                    'facets[]': params.facets,
                    // filter the results by facets. The facets parameter is a
                    // URL-Encoded resource from dbpedia. Multiple facets can
                    // be specified by adding multiple facets[] keys and
                    // values. The parameter is a string and it refers to a
                    // dbpedia resource.
                    'size': params.size,
                    // number of results to be returned. The parameter is
                    // a number.
                    'offset': params.offset,
                    // number of results to skip. It can be used with size
                    // for pagination. The parameter is a number.
                    'published_after': params.publishedAfter,
                    // fetch articles published after a date. The date format
                    // is in UTC. Ex: 2015-02-02T00:00:00.000Z.
                    'published_before': params.publishedBefore,
                    // fetch articles published before a date. The date format
                    // is in UTC. Ex: 2015-02-02T00:00:00.000Z.
                    'recent_first': params.recentFirst,
                    // Sort results by date (with most recent first) instead
                    // of by relevance to keywords. The parameter can be either yes or empty.
                    'like-text': params.likeText,
                    // Return a list of articles with a text similar to the
                    // parameter. The like-text parameter is a string.
                    'like-ids[]': params.likeIds
                    // Return a list of articles similar to other articles.
                    // The parameter is a string (internal id).
                };

                // Request the JSON and return the promise it returns
                return factory.getJSON('articles', paramsMap);
            };
            factory.getArticle = function(article) {
            	// If the article is a URL, get it by URL, else get it by ID
                if (isUrl(article)) {
                    return factory.getArticleByUrl(article);
                }
                return factory.getArticleById(article);
            };
            factory.getArticleById = function(articleId) {
            	// Get the article directly from the endpoint by passing the ID
                return factory.getJSON('articles/' + articleId);
            };
            factory.getArticleByUrl = function(articleUrl) {
            	// The Juicer ID of every article is derived from a SHA1 hash,
            	// So if we pass the URL to a SHA generator, we will probs get
            	// a valid Juicer ID
                var hash = sha1.hash(articleUrl);
                return factory.getJSON('articles/' + hash);
            };
            factory.getSources = function(query) {
            	// Gets the available sources from the API
                var paramsMap = {
                    'name': query
                    // Keyword to search for. It searches in name of the source.
                };
                return factory.getJSON('sources', paramsMap);
            };

            return this;
        }
    ]);