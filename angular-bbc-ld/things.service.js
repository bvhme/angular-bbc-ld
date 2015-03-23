'use strict';
/**
 * @ngdoc service
 * @name bbcld.things
 * @description
 * # things
 * Module to do API calls to the BBC Things API
 */
angular.module('bbcld')
    .service('things', ['$log', '$q', '$http',
        function($log, $q, $http) {
            // AngularJS will instantiate a singleton by calling "new" on this function
            var factory = this;

            $log.error('BBC Things does not support CORS, so using this in the Browser will not work.');

            // Get JSON function prepares the request, calls $http, and 
            // creates a promise to be fulfilled
            factory.getJSON = function(uri) {
                // Create the promise
                var deferred = $q.defer();

                // Do the actual request and resolve or reject the promise 
                // when done
                $http({
                    method: 'GET',
                    url: uri + '.json'
                })
                    .then(deferred.resolve, deferred.reject);

                // Return the promise to the calling object
                return deferred.promise;
            };

            factory.getById = function(id) {
                var uri = 'http://www.bbc.co.uk/things/' + id;
                return factory.getJSON(uri);
            };
            factory.getByUri = function(uri) {
                return factory.getJSON(uri);
            };

            return factory;
        }
    ]);
